import sqlalchemy
from authenticator import TokenManager
import util
from datetime import datetime
import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from database.Models import *


class Queries:
    def __init__(self, db):
        # if os.environ.get("db_name"):
        #     # = os.environ.get("db_name")
        #     app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
        # elif dbName:
        #     # = dbName
        #     app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
        # else:
        #     # = "database.db"
        #     app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
        self.db: sqlalchemy = db
        self.session = self.db.session
        # self.standardSportName = os.environ.get(
        #    "standard_sport_name") if os.environ.get("standard_sport_name") else "Allgemein"

        # if fillTestData:
        #    self.__fillTestData()

    def getCurrentWorkMinutes(self, memberID: int):
        query = self.session.query(func.sum(Worktime.minutes).label("minutes"), Worktime.sport_id).filter_by(
            member_id=memberID, pending=True, is_deleted=False).group_by(Worktime.sport_id)
        work = {}
        for q in query:
            work[q.sport_id] = {'minutes': q.minutes, 'sportID': q.sport_id}

        sports = self.getSportsOfMember(memberID)
        sportDict = {}

        standardWorkTime = self.getStandardWorkTime(memberID)

        currentTimePerID = {'Standard': standardWorkTime}

        for s in sports:
            sportDict[s['id']] = s['extraHours']
            if s['extraHours'] > 0:
                currentTimePerID[s['id']] = s['extraHours']

        for w in work:
            workDict = work[w]
            if workDict['sportID'] not in sportDict:
                currentTimePerID['Standard'] = max(
                    0, currentTimePerID['Standard']-workDict['minutes'])
            elif sportDict[workDict['sportID']] == 0:
                currentTimePerID['Standard'] = max(
                    0, currentTimePerID['Standard']-workDict['minutes'])
            else:
                dif = currentTimePerID[workDict['sportID']]-workDict['minutes']
                if dif >= 0:
                    currentTimePerID[workDict['sportID']
                                     ] = currentTimePerID[workDict['sportID']]-workDict['minutes']
                else:
                    currentTimePerID[workDict['sportID']] = 0
                    currentTimePerID['Standard'] = max(
                        0, currentTimePerID['Standard']-abs(dif))

        output = [{'name': 'Standard', 'hours': round(
            (standardWorkTime - currentTimePerID['Standard'])/60, 2)}]

        for s in sports:
            if s['extraHours'] > 0:
                output.append({'name': s['name'], 'hours': round(
                    (s['extraHours']-currentTimePerID[s['id']])/60, 2)})

        return output

    def getExtraHoursOfUser(self, memberID):
        return self.session.query(Member).filter_by(id=memberID).first().extra_hours

    def getSportsOfMember(self, memberID):
        '''
        [{id:x, name:x, extraHours:x}]
        '''
        sports = self.session.query(Member).filter_by(
            id=memberID).first().sport

        output = []
        for s in sports:
            output.append({"id": s.id, "name": s.name,
                           "extraHours": s.extra_hours})
        return output

    def getNeededWorkMinutes(self, memberID: int):

        sportIDs = []
        standardTime = self.getStandardWorkTime(memberID)
        noHoursOutput = [{'name': 'Standard', 'hours': 0}]
        if self.isExecutive(memberID) == 1:
            return noHoursOutput

        query = self.session.query(SportMember).filter_by(
            member_id=memberID).all()

        for q in query:
            if q.is_trainer > 0:
                return noHoursOutput
            sportIDs.append(q.sport_id)

        neededWorkIDs = {}
        for sID in sportIDs:
            extra_hours = self.session.query(Sport).with_entities(
                Sport.extra_hours).filter_by(id=sID, is_deleted=False)
            for hours in extra_hours:
                if hours > 0:
                    neededWorkIDs[sID] = hours
        neededWorkNames = []

        neededWorkNames.append(
            {'name': 'Standard', 'hours': round(standardTime/60, 2)})

        sports = self.getSports()
        for nwID in neededWorkIDs:
            id = nwID
            for s in sports:
                if s["id"] == id:
                    neededWorkNames.append(
                        {'name': s["name"], 'hours': round(neededWorkIDs[nwID]/60, 2)})

        return neededWorkNames

    def getStandardWorkTime(self, memberID=None):

        standardTime = self.session.query(Settings).filter_by(
            key="standardworktime").first().value

        extraHoursOfUser = self.getExtraHoursOfUser(memberID)
        if memberID is not None:
            return standardTime if extraHoursOfUser == 0 else extraHoursOfUser
        else:
            return standardTime

    def setStandardWorkTime(self, worktime):
        self.session.query(Settings).filter_by(
            key="standardworktime").first().value = worktime
        self.session.commit()

    def getPendingWorkRequests(self, memberID: int):
        requests = []
        req = self.session.query(Worktime).filter(
            Worktime.member_id == memberID, Worktime.pending, not Worktime.is_deleted, not Sport.is_deleted).all()
        for r in req:
            requests.append((r.sport.name, r.description, r.minutes, r.id))

        return requests

    def getAcceptedWorkRequests(self, memberID: int):
        requests = []
        req = self.session.query(Worktime).filter(
            Worktime.member_id == memberID, not Worktime.pending, not Worktime.is_deleted, not Sport.is_deleted).all()
        for r in req:
            requests.append((r.sport.name, r.description, r.minutes, r.id))

        return requests

    def createWorkRequest(self, memberID: int, sportID: int, reason: str, time: int):
        wr = Worktime(member_id=memberID, sport_id=sportID,
                      description=reason, minutes=time)
        self.session.add(wr)
        self.session.commit()

    def isTrainerof(self, memberID: int, sportID: int):
        return self.session.query(SportMember).with_entities(SportMember.is_trainer).filter_by(member_id=memberID, sport_id=sportID)

    def isMemberof(self, memberID: int, sportID: int):
        return self.session.query(SportMember).filter_by(member_id=memberID, sport_id=sportID) != None

    def isTrainer(self, memberID: int):

        isTrainer = False

        isTrainerOfSport = self.session.query(SportMember).with_entities(
            SportMember.is_trainer).filter_by(member_id=memberID)
        for t in isTrainerOfSport:
            isTrainer |= t

        return isTrainer

    def acceptWorkRequest(self, requestID: int):
        self.session.query(Worktime).filter_by(
            id=requestID, is_deleted=False).first().pending = False
        self.session.commit()

    def denyWorkRequest(self, requestID: int):
        self.removeWorkHours(requestID)
        return

    def makeSportParticipant(self, memberID: int, sportID: int):
        self.session.add(SportMember(member_id=memberID, sport_id=sportID))
        self.session.commit()

    def setSportTrainer(self, memberID: int, sportID: int, isTrainer: bool):
        self.session.query(SportMember).filter_by(
            member_id=memberID, sport_id=sportID).first().is_trainer = isTrainer
        self.session.commit()
        return

    def updateMemberInfo(self, memberID: int, firstname: str, lastname: str, email: str):
        member = self.session.query(Member).filter_by(
            member_id=memberID, is_deleted=False).first()
        member.firstname = firstname
        member.lastname = lastname
        member.mail = email
        member.last_modified = datetime.utcnow()
        self.session.commit()

        return

    def removeWorkHours(self, requestID: int):
        self.session.query(Worktime).get(requestID).is_deleted = True
        self.session.commit()

        return

    def addSport(self, name, extraHours=-1):
        if extraHours != -1:
            self.session.add(Sport(name=name, extra_hours=extraHours))
        else:
            self.session.add(Sport(name=name))
        self.session.commit()

    def changeExtraHours(self, sportID: int, amount: int):
        self.session.query(Sport).filter_by(
            id=sportID, is_deleted=False).first().extra_hours = amount
        self.session.commit()

        return

    def getSports(self):
        '''
        {id:x, name:x, extraHours:x}
        '''
        sports = self.session.query(Sport).filter_by(is_deleted=False)
        output = []
        for s in sports:
            output.append(
                {"id": s.id, "name": s.name, "extraHours": s.extra_hours})

        return output

    def getSportName(self, id):
        '''
        returns name
        '''

        return self.session.query(Sport).filter_by(id=id, is_deleted=False).first().name

    def removeSport(self, sportID):
        self.session.query(Sport).filter_by(
            id=sportID, is_deleted=False).first().is_deleted = True
        self.session.commit()

    def getMembers(self):
        members = self.session.query(Member).filter_by(is_deleted=False).all()
        output = []
        for m in members[1:]:
            # Skipping admin user
            output.append((m.id, m.firstname, m.lastname,
                           m.mail, m.role, m.extra_hours))

        return output

    def getPendingWorkRequestsBySport(self, sportID):
        query = self.session.query(Member).filter(Sport.id == sportID, Worktime.pending,
                                                  not Sport.is_deleted, not Worktime.is_deleted, not Member.is_deleted).all()

        requests = []

        for q in query:
            requests.append((q.firstname, q.lastname, q.sport.name,
                             q.worktime.description, q.worktime.minutes, q.worktime.id))

        return requests

    def getMembersOfSport(self, sportID):
        """
        [[memberID,firstname,lastname,mail,isTrainer],...]
        """
        requests = []
        query = self.session.query(Member).filter(
            SportMember.sport_id == sportID, not Member.is_deleted)
        for q in query:
            if q.id == 1:
                continue
            requests.append((q.id, q.firstname, q.lastname,
                             q.mail, q.sport.is_trainer))
        return requests

    def getMemberInfo(self, memberID):
        """
        {firstname,lastname,mail,id}
        """
        member = self.session.query(Member).filter_by(
            member_id=memberID, is_deleted=False).first()

        output = {"firstname": member.firstname,
                  "lastname": member.lastname, "mail": member.mail, "memberID": member.id}

        return output

    def participantIn(self, memberID):
        sports = self.getSports()
        for s in sports:
            s["isParticipant"] = self.isMemberof(memberID, s["id"])

        return sports

    def trainerIn(self, memberID):
        sports = self.getSports()
        for s in sports:
            s["isTrainer"] = self.isTrainerof(memberID, s["id"])

        return sports

    def checkPassword(self, username, password):

        member = self.session.query(Member).filter_by(
            mail=username, is_deleted=False).first()

        hashedPassword = TokenManager.hashPassword(password, member.salt)

        if member.password == hashedPassword:
            return {"memberID": member.id, "rights": member.role}
        else:
            return None

    def isExecutive(self, memberID):
        return self.session.query(Member).filter_by(member_id=memberID, is_deleted=False).first().role

    def changeParticipation(self, memberID, sportID, isParticipating):
        isAlreadyParticipant = self.isMemberof(memberID, sportID)
        if isAlreadyParticipant == isParticipating:
            return

        if isParticipating:
            self.session.add(SportMember(member_id=memberID, sport_id=sportID))

        else:
            to_delete = self.session.query(SportMember).filter_by(
                member_id=memberID, sport_id=sportID).first()
            self.session.delete(to_delete)

        self.session.commit()

    def changeTrainer(self, memberID, sportID, isTrainer):
        isAlreadyTrainer = self.isTrainerof(memberID, sportID)
        isMember = self.isMemberof(memberID, sportID)

        if isAlreadyTrainer == isTrainer:
            return

        # Make not member not trainer -> trainer has to be member -> start state not possible
        assert not (not isTrainer and not isMember)

        if isMember:
            self.session.query(SportMember).filter_by(
                member_id=memberID, sport_id=sportID).first().is_trainer = isTrainer
        else:
            if isTrainer:
                # Make Trainer
                # Make Member
                self.makeSportParticipant(memberID, sportID)
                self.session.query(SportMember).filter_by(
                    member_id=memberID, sport_id=sportID).first().is_trainer = True

        self.session.commit()

    def changePassword(self, memberID, password):
        member = self.session.query(Member).filter_by(
            member_id=memberID).first()
        usedPW, usedSalt = TokenManager.hashPassword(password)
        member.password = usedPW
        member.salt = usedSalt
        self.session.commit()

    def changeFirstname(self, memberID, name):
        member = self.session.query(Member).filter_by(
            member_id=memberID, is_deleted=False).first()
        member.firstname = name
        member.last_modified = datetime.utcnow()
        self.session.commit()

    def changeLastname(self, memberID, name):
        member = self.session.query(Member).filter_by(
            member_id=memberID, is_deleted=False).first()
        member.lastname = name
        member.last_modified = datetime.utcnow()
        self.session.commit()

    def changeMail(self, memberID, email):
        member = self.session.query(Member).filter_by(
            member_id=memberID, is_deleted=False).first()
        member.mail = email
        member.last_modified = datetime.utcnow()
        self.session.commit()

    def changeMemberWorkHours(self, memberID, minutes):
        self.session.query(Member).filter_by(
            id=memberID, is_deleted=False).first().extra_hours = minutes
        self.session.commit()

    def addWorkRequest(self, memberID, sportID, description, minutes):
        self.session.add(Worktime(member_id=memberID, sport_id=sportID,
                                  description=description, minutes=minutes))
        self.session.commit()

    def addMember(self, firstname, lastname, email, password):
        if firstname == "admin":  # cant spawn admin user
            return
        usedPW = password
        if not password:
            usedPW = TokenManager.getPassword()

        hashedPassword, salt = TokenManager.hashPassword(usedPW)
        self.session.add(Member(firstname=firstname, lastname=lastname,
                                mail=email, password=hashedPassword, salt=salt))

        self.session.commit()

        memberID = -1

        if not password:
            return self.session.query(Member).filter_by(mail=email, is_deleted=False).first().id, usedPW

    def deleteMember(self, memberID):
        if memberID == 1:  # make admin undeletable
            return

        self.session.query(Member).filter_by(
            id=memberID, id_deleted=False).first().deleted = True

    def setExecutive(self, memberID, isExecutive):
        if memberID == 1:  # make admin unchangable
            return

        toBeSet = 1 if isExecutive else 0

        self.session.query(Member).filter_by(
            id=memberID, is_deleted=False).first().role = toBeSet
        self.session.commit()

    def checkMailExists(self, mail):

        return self.session.query(Member).filter_by(mail=mail, is_deleted=False) != None

    def addEvent(self, name, sportID, date):
        if(self.getEvent(name) is not None):
            return None

        self.session.add(Event(name=name, sport_id=sportID, date=date))
        self.session.commit()

        return self.getEvent(name)

    def getEvent(self, name):

        return self.session.query(Event).filter_by(name=name, is_deleted=False).first()

    def getEvents(self):

        return self.session.query(Event).filter_by(is_deleted=False).first()

    def addTimeslot(self, eventID, name, helper, start, end):
        self.session.add(Timeslot(event_id=eventID, name=name,
                                  helper=helper, start=start, end=end))
        self.session.commit()

    def getTimeslots(self, eventID):
        output = []
        slots = self.session.query(Timeslot).filter_by(event_id=eventID)
        for s in slots:
            output.append({"timeslotID": s.id, "eventID": s.event_id,
                           "name": s.name, "helper": s.helper, "start": s.start, "end": s.end})
        return output

    def addTimeslotParticipant(self, memberID, timeslotID):
        if not self.isTimeslotParticipant(memberID, timeslotID):
            self.session.add(EventParticipant(
                member_id=memberID, timeslot_id=timeslotID))
            self.session.commit()

    def removeTimeslotParticipant(self, memberID, timeslotID):
        if self.isTimeslotParticipant(memberID, timeslotID):
            slot = self.session.query(EventParticipant).filter_by(
                member_id=memberID, timeslot_id=timeslotID).first()
            self.session.delete(slot)
            self.session.commit()

    def isTimeslotParticipant(self, memberID, timeslotID):
        return self.session.query(EventParticipant).filter_by(member_id=memberID, timeslot_id=timeslotID).first() != None

    def deleteEvent(self, eventID: int):
        self.session.query(Event).filter_by(
            id=eventID).first().is_deleted = True
        self.session.commit()

    def getTimeslotParticipants(self, timeslotID):
        participants: EventParticipant = self.session.query(EventParticipant).with_entities(
            EventParticipant.member_id).filter_by(timeslot_id=timeslotID).all()

        output = []
        for p in participants:
            output.append(self.getMemberInfo(p.member_id))

        return output

    def getTimeslot(self, timeslotID):

        return self.session.query(Timeslot).filter_by(id=timeslotID).first()

    def createRequestsFromEvents(self):
        expEvents = self.getExpiredEvents()

        for event in expEvents:
            timeslots = self.getTimeslots(event[0])
            for timeslot in timeslots:
                timeslotID = timeslot["timeslotID"]
                participants = self.getTimeslotParticipants(timeslotID)

                start = timeslot["start"]
                end = timeslot["end"]
                startFormated = datetime.strptime(start, '%H:%M')
                endFormated = datetime.strptime(end, '%H:%M')

                minutes = int((endFormated-startFormated).total_seconds()/60)

                for participant in participants:
                    memberID = participant["memberID"]
                    self.createWorkRequest(
                        memberID, event[2], f"{event[1]} ({timeslot['name']})", minutes)

        for event in expEvents:
            self.deleteEvent(event[0])

    def getExpiredEvents(self):
        output = []
        events = self.getEvents()
        for e in events:
            timeString = e[3][:str(e[3]).find("T")]
            timeString += "T23:59:59"
            timeFormated = datetime.strptime(timeString, '%Y-%m-%dT%H:%M:%S')
            now = datetime.now()
            if timeFormated < now:
                output.append(e)
        return output

    def getMembersList(self, members):
        output = []
        for m in members:
            currentWork = self.getCurrentWorkMinutes(m[0])
            maxWork = self.getNeededWorkMinutes(m[0])
            isTrainer = self.isTrainer(m[0])
            output.append({"id": m[0], "firstname": m[1],
                           "lastname": m[2], "email": m[3], "currentWork": currentWork, "maxWork": maxWork, "isTrainer": isTrainer, "isExecutive": int(m[5]) == 1})
        return output
