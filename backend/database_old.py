import sqlite3
import os
from authenticator import TokenManager
import util
from datetime import datetime


class SQLiteWrapper:
    def __init__(self, fillTestData=False, dbName=None):
        if os.environ.get("db_name"):
            self.db_name = os.environ.get("db_name")
        elif dbName:
            self.db_name = dbName
        else:
            self.db_name = "database.db"
        self.standardSportName = os.environ.get(
            "standard_sport_name") if os.environ.get("standard_sport_name") else "Allgemein"
        self.__create_tables()
        self.__initialize_database()

        if fillTestData:
            self.__fillTestData()

    def __initialize_database(self):
        con = sqlite3.connect(self.db_name)
        isinitialized = False

        for link in con.cursor().execute('''SELECT * FROM member'''):
            isinitialized = True

        if not isinitialized:
            hashedPassword, salt = TokenManager.hashPassword(util.admin_pw)
            con.cursor().execute(
                "INSERT INTO member values ('admin', 'admin', 'admin@localhost', ?, 1, 0, ?, 0);", (hashedPassword, salt,))
            con.cursor().execute(
                "INSERT INTO sport values (?, 0, 0);", (self.standardSportName,))
            con.cursor().execute("INSERT INTO standardworktime values (720);")
            con.commit()
        con.close()

    def __create_tables(self):
        try:
            con = sqlite3.connect(self.db_name)
            con.cursor().execute(
                '''CREATE TABLE member
                (firstname TEXT, lastname TEXT, mail TEXT, password TEXT, rolle TEXT, deleted INTEGER, salt TEXT, extraHours INTEGER)'''
            )
            con.commit()

            con.cursor().execute(
                '''CREATE TABLE worktime
                (memberID INTEGER, sportID INTEGER, description TEXT, minutes INTEGER, pending INTEGER, deleted INTEGER)'''
            )
            con.commit()

            con.cursor().execute(
                '''CREATE TABLE sportMember
                (memberID INTEGER, sportID INTEGER, isTrainer INTEGER)'''
            )
            con.commit()

            con.cursor().execute(
                '''CREATE TABLE sport
                (name TEXT, extraHours INTEGER, deleted INTEGER)'''
            )
            con.commit()

            con.cursor().execute(
                '''CREATE TABLE standardworktime
                (time INTEGER)'''
            )
            con.commit()

            con.cursor().execute(
                '''CREATE TABLE event
                (name TEXT, sportID INTEGER, date TEXT, deleted INTEGER)'''
            )
            con.commit()

            con.cursor().execute(
                '''CREATE TABLE timeslot
                (eventID INTEGER, name TEXT, helper INTEGER, start TEXT, end TEXT)'''
            )
            con.commit()

            con.cursor().execute(
                '''CREATE TABLE eventParticipant
                (memberID INTEGER, timeslotID INTEGER)'''
            )
            con.commit()

            con.close()
        except sqlite3.OperationalError as e:
            print(e)

    def getCurrentWorkMinutes(self, memberID: int):
        con = sqlite3.connect(self.db_name)
        work = {}
        for link in con.cursor().execute('''SELECT SUM(minutes), sportID FROM worktime WHERE memberID=? AND pending=0 AND deleted=0 GROUP BY sportID''', (memberID,)):
            work[link[1]] = {'minutes': link[0], 'sportID': link[1]}
        con.close()

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
        con = sqlite3.connect(self.db_name)
        output = 0
        for link in con.cursor().execute('''SELECT extraHours FROM member WHERE ROWID=?''', (memberID,)):
            output = link[0]
        return output

    def getSportsOfMember(self, memberID):
        '''
        [{id:x, name:x, extraHours:x}]
        '''
        sports = self.getSports()
        output = []
        for s in sports:
            if self.isMemberof(memberID, s['id']):
                output.append(s)
        return output

    def getNeededWorkMinutes(self, memberID: int):
        con = sqlite3.connect(self.db_name)
        sportIDs = []
        standardTime = self.getStandardWorkTime(memberID)
        noHoursOutput = [{'name': 'Standard', 'hours': 0}]
        if self.isExecutive(memberID) == 1:
            return noHoursOutput

        for link in con.cursor().execute('''SELECT sportID, isTrainer  FROM sportMember WHERE memberID=?''', (memberID,)):
            if link[1] > 0:
                con.close()
                return noHoursOutput
            sportIDs.append(link[0])

        neededWorkIDs = {}
        for sID in sportIDs:
            for link in con.cursor().execute('''SELECT extraHours FROM sport WHERE ROWID=? AND deleted=0''', (sID,)):
                if link[0] > 0:
                    neededWorkIDs[sID] = link[0]
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
        con.close()

        return neededWorkNames

    def getStandardWorkTime(self, memberID=None):
        con = sqlite3.connect(self.db_name)
        for link in con.cursor().execute('''SELECT * FROM standardworktime'''):
            standardTime = link[0]
        con.close()
        extraHoursOfUser = self.getExtraHoursOfUser(memberID)
        if memberID is not None:
            return standardTime if extraHoursOfUser == 0 else extraHoursOfUser
        else:
            return standardTime

    def setStandardWorkTime(self, worktime):
        con = sqlite3.connect(self.db_name)
        con.cursor().execute('''UPDATE standardworktime SET time=?''',
                             (worktime, ))
        con.commit()
        con.close()

    def getPendingWorkRequests(self, memberID: int):
        con = sqlite3.connect(self.db_name)
        requests = []
        for link in con.cursor().execute('''
            SELECT sport.name, worktime.description, worktime.minutes,worktime.ROWID
            FROM sport, worktime
            WHERE sport.ROWID=worktime.sportID
            AND worktime.memberID=?
            AND worktime.pending=1
            AND sport.deleted=0
            AND worktime.deleted=0
        ''', (memberID,)):
            requests.append(link)
        con.close()
        return requests

    def getAcceptedWorkRequests(self, memberID: int):
        con = sqlite3.connect(self.db_name)
        requests = []
        for link in con.cursor().execute('''
            SELECT sport.name, worktime.description, worktime.minutes, worktime.ROWID
            FROM sport, worktime
            WHERE sport.ROWID=worktime.sportID
            AND worktime.memberID=?
            AND worktime.pending=0
            AND worktime.deleted=0
            AND sport.deleted=0
        ''', (memberID,)):
            requests.append(link)
        con.close()
        return requests

    def createWorkRequest(self, memberID: int, sportID: int, reason: str, time: int):
        con = sqlite3.connect(self.db_name)
        con.cursor().execute('''INSERT INTO worktime values (?, ?, ?, ?, ?, ?)''',
                             (memberID, sportID, reason, time, 1, 0,))
        con.commit()
        con.close()

    def isTrainerof(self, memberID: int, sportID: int):
        con = sqlite3.connect(self.db_name)
        isTrainer = False
        for link in con.cursor().execute(''' SELECT isTrainer FROM sportMember WHERE memberID=? AND sportID=?''', (memberID, sportID,)):
            isTrainer = link[0] == 1

        con.close()
        return isTrainer

    def isMemberof(self, memberID: int, sportID: int):
        con = sqlite3.connect(self.db_name)
        isMember = False
        for link in con.cursor().execute(''' SELECT isTrainer FROM sportMember WHERE memberID=? AND sportID=?''', (memberID, sportID,)):
            isMember = True
        con.close()
        return isMember

    def isTrainer(self, memberID: int):
        con = sqlite3.connect(self.db_name)
        isTrainer = False
        for link in con.cursor().execute(''' SELECT isTrainer FROM sportMember WHERE memberID=? ''', (memberID,)):
            isTrainer |= link[0] == 1

        con.close()
        return isTrainer

    def acceptWorkRequest(self, requestID: int):
        con = sqlite3.connect(self.db_name)
        con.cursor().execute('''UPDATE worktime SET pending=0 WHERE ROWID=? AND deleted=0''',
                             (requestID, ))
        con.commit()
        con.close()
        return

    def denyWorkRequest(self, requestID: int):
        self.removeWorkHours(requestID)
        return

    def makeSportParticipant(self, memberID: int, sportID: int):
        con = sqlite3.connect(self.db_name)
        con.cursor().execute("INSERT INTO sportMember values (?, ?, 0);", (memberID, sportID,))
        con.commit()
        con.close()
        return

    def setSportTrainer(self, memberID: int, sportID: int, isTrainer: bool):
        con = sqlite3.connect(self.db_name)
        con.cursor().execute('''UPDATE sportMember SET isTrainer=? WHERE memberID=? AND sportID=?''',
                             (isTrainer, memberID, sportID,))
        con.commit()
        con.close()
        return

    def updateMemberInfo(self, memberID: int, firstname: str, lastname: str, email: str):
        con = sqlite3.connect(self.db_name)
        con.cursor().execute('''UPDATE member SET firstname=?, lastname=?, email=? WHERE memberID=? AND deleted=0''',
                             (firstname, lastname, email, memberID,))
        con.commit()
        con.close()
        return

    def removeWorkHours(self, requestID: int):
        con = sqlite3.connect(self.db_name)
        con.cursor().execute('''UPDATE worktime SET deleted=1 WHERE ROWID=?''',
                             (requestID, ))
        con.commit()
        con.close()
        return

    def createSport(self, name: str):
        con = sqlite3.connect(self.db_name)
        con.cursor().execute("INSERT INTO sport values (?, 0, 0);", (name,))
        con.commit()
        con.close()
        return

    def changeExtraHours(self, sportID: int, amount: int):
        con = sqlite3.connect(self.db_name)
        con.cursor().execute(
            "UPDATE sport SET extraHours=? WHERE ROWID=? AND deleted=0;", (amount, sportID,))
        con.commit()
        con.close()
        return

    def getSports(self):
        '''
        {id:x, name:x, extraHours:x}
        '''
        con = sqlite3.connect(self.db_name)
        output = []
        for link in con.cursor().execute("SELECT ROWID, name, extraHours FROM sport WHERE deleted=0"):
            output.append(
                {"id": link[0], "name": link[1], "extraHours": link[2]})
        con.close()

        return output

    def getSportName(self, id):
        '''
        returns name
        '''
        con = sqlite3.connect(self.db_name)
        output = None
        for link in con.cursor().execute("SELECT name FROM sport WHERE deleted=0 AND ROWID=?", (id,)):
            output = link[0]
        con.close()

        return output

    def removeSport(self, sportID):
        con = sqlite3.connect(self.db_name)
        con.cursor().execute("UPDATE sport SET deleted=1 WHERE ROWID=?;", (sportID,))
        con.commit()
        con.close()

    def addSport(self, name, extraHours):
        con = sqlite3.connect(self.db_name)
        con.cursor().execute("INSERT INTO sport values (?, ?, 0);", (name, extraHours))
        con.commit()
        con.close()

    def getMembers(self):
        con = sqlite3.connect(self.db_name)
        output = []
        for link in con.cursor().execute("SELECT ROWID, * FROM member WHERE deleted=0"):
            if link[0] == 1:  # skip admin user
                continue
            output.append(link)
        con.close()

        return output

    def getPendingWorkRequestsBySport(self, sportID):
        con = sqlite3.connect(self.db_name)
        requests = []
        for link in con.cursor().execute('''
            SELECT member.firstname, member.lastname, sport.name, worktime.description, worktime.minutes, worktime.ROWID
            FROM sport, worktime, member
            WHERE sport.ROWID=worktime.sportID
            AND member.ROWID=worktime.memberID
            AND sport.ROWID=?
            AND worktime.pending=1
            AND sport.deleted=0
            AND worktime.deleted=0
            AND member.deleted=0
        ''', (sportID,)):
            requests.append(link)
        con.close()
        return requests

    def getMembersOfSport(self, sportID):
        """
        [[memberID,firstname,lastname,isTrainer,memberID,mail],...]
        """
        con = sqlite3.connect(self.db_name)
        requests = []
        for link in con.cursor().execute('''
            SELECT sportMember.memberID,member.firstname, member.lastname, sportMember.isTrainer , member.ROWID, member.mail
            FROM sportMember, member
            WHERE sportMember.sportid=?
            AND sportMember.memberID=member.ROWID
            AND member.deleted=0
        ''', (sportID,)):
            if link[4] == 1:  # skip admin user
                continue
            requests.append(link)
        con.close()
        return requests

    def getMemberInfo(self, memberID):
        """
        {firstname,lastname,mail,id}
        """
        con = sqlite3.connect(self.db_name)
        output = None
        for link in con.cursor().execute(''' SELECT * FROM member WHERE ROWID=? AND deleted=0''', (memberID,)):
            output = {"firstname": link[0],
                      "lastname": link[1], "mail": link[2], "memberID": memberID}

        con.close()
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
        con = sqlite3.connect(self.db_name)
        output = None
        salt = ""

        for link in con.cursor().execute(''' SELECT salt FROM member WHERE mail=? AND deleted=0''', (username,)):
            salt = link[0]

        hashedPassword = TokenManager.hashPassword(password, salt)

        for link in con.cursor().execute(''' SELECT ROWID,rolle FROM member WHERE mail=? AND password=? AND deleted=0''', (username, hashedPassword,)):
            output = {"memberID": link[0], "rights": link[1], }

        con.close()
        return output

    def isExecutive(self, memberID):
        con = sqlite3.connect(self.db_name)
        output = 0
        for link in con.cursor().execute(''' SELECT rolle FROM member WHERE ROWID=? AND deleted=0''', (memberID,)):
            output = link[0]

        con.close()
        return int(output)

    def changeParticipation(self, memberID, sportID, isParticipating):
        isAlreadyParticipant = self.isMemberof(memberID, sportID)
        if isAlreadyParticipant == isParticipating:
            return
        con = sqlite3.connect(self.db_name)

        if isParticipating:
            con.cursor().execute("INSERT INTO sportMember values (?, ?, 0);", (memberID, sportID,))
        else:
            con.cursor().execute(
                "DELETE FROM sportMember WHERE memberID=? AND sportID=?;", (memberID, sportID))

        con.commit()
        con.close()

    def changeTrainer(self, memberID, sportID, isTrainer):
        isAlreadyTrainer = self.isTrainerof(memberID, sportID)
        isMember = self.isMemberof(memberID, sportID)

        if isAlreadyTrainer == isTrainer:
            return

        # Make not member not trainer -> trainer has to be member -> start state not possible
        assert not (not isTrainer and not isMember)

        con = sqlite3.connect(self.db_name)

        if isMember:
            if isTrainer:
                # Make Trainer
                con.cursor().execute(
                    "UPDATE sportMember SET isTrainer=1 WHERE memberID=? AND sportID =?;", (memberID, sportID,))
            else:
                # Remove Trainer
                con.cursor().execute(
                    "UPDATE sportMember SET isTrainer=0 WHERE memberID=? AND sportID =?;", (memberID, sportID,))
        else:
            if isTrainer:
                # Make Trainer
                # Make Member
                self.makeSportParticipant(memberID, sportID)
                con.cursor().execute(
                    "UPDATE sportMember SET isTrainer=1 WHERE memberID=? AND sportID =?;", (memberID, sportID,))

        con.commit()
        con.close()

    def changePassword(self, memberID, password):
        con = sqlite3.connect(self.db_name)
        usedPW, usedSalt = TokenManager.hashPassword(password)
        con.cursor().execute("UPDATE member SET password=?,salt=? WHERE ROWID=?;",
                             (usedPW, usedSalt, memberID,))
        con.commit()
        con.close()

    def changeFirstname(self, memberID, name):
        con = sqlite3.connect(self.db_name)
        con.cursor().execute("UPDATE member SET firstname=? WHERE ROWID=?;", (name, memberID,))
        con.commit()
        con.close()

    def changeLastname(self, memberID, name):
        con = sqlite3.connect(self.db_name)
        con.cursor().execute("UPDATE member SET lastname=? WHERE ROWID=?;", (name, memberID,))
        con.commit()
        con.close()

    def changeMail(self, memberID, email):
        con = sqlite3.connect(self.db_name)
        con.cursor().execute("UPDATE member SET mail=? WHERE ROWID=?;", (email, memberID,))
        con.commit()
        con.close()

    def changeMemberWorkHours(self, memberID, minutes):
        con = sqlite3.connect(self.db_name)
        con.cursor().execute("UPDATE member SET extraHours=? WHERE ROWID=?;", (minutes, memberID,))
        con.commit()
        con.close()

    def addWorkRequest(self, memberID, sportID, description, minutes):
        con = sqlite3.connect(self.db_name)
        con.cursor().execute("INSERT INTO worktime values (?, ?, ?, ?, 1, 0);",
                             (memberID, sportID, description, minutes,))
        con.commit()
        con.close()

    def addMember(self, firstName, lastname, email, password):
        if firstName == "admin":  # cant spawn admin user
            return
        con = sqlite3.connect(self.db_name)
        usedPW = password
        if not password:
            usedPW = TokenManager.getPassword()

        hashedPassword, salt = TokenManager.hashPassword(usedPW)

        con.cursor().execute(
            "INSERT INTO member values (?, ?, ?, ?, 0, 0, ?, 0);", (firstName, lastname, email, hashedPassword, salt))
        con.commit()

        memberID = -1

        for link in con.cursor().execute(''' SELECT ROWID FROM member WHERE mail=? AND deleted=0''', (email,)):
            memberID = link[0]

        con.close()
        if not password:
            return memberID, usedPW

    def deleteMember(self, memberID):
        if memberID == 1:  # make admin undeletable
            return
        con = sqlite3.connect(self.db_name)
        con.cursor().execute("UPDATE member SET deleted=1 WHERE ROWID=?;", (memberID,))
        con.commit()
        con.close()

    def setExecutive(self, memberID, isExecutive):
        if memberID == 1:  # make admin unchangable
            return
        con = sqlite3.connect(self.db_name)
        toBeSet = 1 if isExecutive else 0
        con.cursor().execute("UPDATE member SET rolle=? WHERE ROWID=?;", (toBeSet, memberID,))
        con.commit()
        con.close()

    def checkMailExists(self, mail):
        con = sqlite3.connect(self.db_name)
        mail_exists = False
        for link in con.cursor().execute(''' SELECT mail FROM member WHERE mail=? AND deleted=0''', (mail,)):
            mail_exists = True
        con.close()
        return mail_exists

    def addEvent(self, name, sportID, date):
        if(self.getEvent(name) is not None):
            return None

        con = sqlite3.connect(self.db_name)
        con.cursor().execute("INSERT INTO event values (?, ?, ?, 0);", (name, sportID, date))
        con.commit()
        con.close()

        return self.getEvent(name)

    def getEvent(self, name):
        con = sqlite3.connect(self.db_name)
        output = None
        for link in con.cursor().execute(''' SELECT ROWID, name FROM event WHERE name=? AND deleted=0''', (name,)):
            output = link
        con.close()
        return output

    def getEvents(self):
        con = sqlite3.connect(self.db_name)
        output = []
        for link in con.cursor().execute(''' SELECT ROWID, * FROM event WHERE deleted=0'''):
            output.append(link)
        con.close()
        return output

    def addTimeslot(self, eventID, name, helper, start, end):
        con = sqlite3.connect(self.db_name)
        con.cursor().execute("INSERT INTO timeslot values (?, ?, ?, ?, ?);",
                             (eventID, name, helper, start, end))
        con.commit()
        con.close()

    def getTimeslots(self, eventID):
        con = sqlite3.connect(self.db_name)
        output = []
        for link in con.cursor().execute(''' SELECT ROWID,* FROM timeslot WHERE eventID=?''', (eventID,)):
            output.append({"timeslotID": link[0], "eventID": link[1],
                           "name": link[2], "helper": link[3], "start": link[4], "end": link[5]})
        con.close()
        return output

    def addTimeslotParticipant(self, memberID, timeslotID):
        if not self.isTimeslotParticipant(memberID, timeslotID):
            con = sqlite3.connect(self.db_name)
            con.cursor().execute('''INSERT INTO eventParticipant values (?, ?)''',
                                 (memberID, timeslotID,))
            con.commit()
            con.close()

    def removeTimeslotParticipant(self, memberID, timeslotID):
        if self.isTimeslotParticipant(memberID, timeslotID):
            con = sqlite3.connect(self.db_name)
            con.cursor().execute('''DELETE FROM eventParticipant WHERE memberID=? AND timeslotID=?;''',
                                 (memberID, timeslotID,))
            con.commit()
            con.close()

    def isTimeslotParticipant(self, memberID, timeslotID):
        con = sqlite3.connect(self.db_name)
        output = False
        for link in con.cursor().execute(''' SELECT ROWID FROM eventParticipant WHERE memberID=? AND timeslotID=?''', (memberID, timeslotID,)):
            output = True
        con.close()

        return output

    def deleteEvent(self, eventID: int):
        con = sqlite3.connect(self.db_name)
        con.cursor().execute('''UPDATE event SET deleted=1 WHERE ROWID=?''',
                             (eventID, ))
        con.commit()
        con.close()
        return

    def getTimeslotParticipants(self, timeslotID):
        con = sqlite3.connect(self.db_name)
        output = []
        for link in con.cursor().execute(''' SELECT memberID FROM eventParticipant WHERE timeslotID=?''', (timeslotID,)):
            output.append(self.getMemberInfo(link[0]))
        con.close()

        return output

    def getTimeslot(self, timeslotID):
        con = sqlite3.connect(self.db_name)
        output = None
        for link in con.cursor().execute(''' SELECT ROWID, * FROM timeslot WHERE ROWID=?''', (timeslotID,)):
            output = link

        con.close()
        print(output)
        return output

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

    def getMembersList(self,members):
        output = []
        for m in members:
            currentWork = self.getCurrentWorkMinutes(m[0])
            maxWork = self.getNeededWorkMinutes(m[0])
            isTrainer = self.isTrainer(m[0])
            output.append({"id": m[0], "firstname": m[1],
                        "lastname": m[2], "email": m[3], "currentWork": currentWork, "maxWork": maxWork, "isTrainer": isTrainer, "isExecutive": int(m[5]) == 1})
        return output

    def __fillTestData(self):
        con = sqlite3.connect(self.db_name)
        con.cursor().execute("INSERT INTO worktime values (1, 1, 'Rasen mähen', 45, 0, 0);")
        con.cursor().execute("INSERT INTO worktime values (1, 1, 'Blumen gießen', 30, 1, 0);")
        con.cursor().execute("INSERT INTO worktime values (1, 2, 'Leiter streichen', 60, 0, 0);")
        con.cursor().execute("INSERT INTO worktime values (2, 1, 'Putzen', 120, 1, 0);")
        con.cursor().execute("INSERT INTO worktime values (2, 1, 'Kochen', 15, 0, 0);")
        con.cursor().execute("INSERT INTO worktime values (2, 3, 'Ausschank', 15, 0, 0);")
        con.cursor().execute("INSERT INTO worktime values (3, 3, 'Zeitstopper', 30, 1, 0);")
        con.cursor().execute("INSERT INTO worktime values (3, 3, 'Hundesitter', 45, 0, 0);")

        con.cursor().execute(
            "INSERT INTO member values ('Bob', 'Baumeister', 'bob@baumeister.de', 'lala', 0, 0);")
        con.cursor().execute(
            "INSERT INTO member values ('alice', 'wunderland', 'alice@wunderland.de', 'lulu', 0, 0);")
        con.cursor().execute(
            "INSERT INTO member values ('eve', 'evil', 'eve@evil.de', 'uu', 1, 0);")
        con.cursor().execute(
            "INSERT INTO member values ('charly', 'schokolade', 'charly@schokolade.de', 'ii', 0, 0);")
        con.cursor().execute("INSERT INTO sport values ('agility', 120, 0);")
        con.cursor().execute("INSERT INTO sport values ('rettungshunde', 0, 0);")
        con.cursor().execute("INSERT INTO sport values ('Turnierhunde', 60, 0);")

        con.cursor().execute("INSERT INTO sportMember values (1, 1, 1);")
        con.cursor().execute("INSERT INTO sportMember values (1, 2, 0);")
        con.cursor().execute("INSERT INTO sportMember values (2, 2, 0);")
        con.cursor().execute("INSERT INTO sportMember values (3, 1, 0);")
        con.cursor().execute("INSERT INTO sportMember values (3, 3, 0);")
        con.cursor().execute("INSERT INTO sportMember values (4, 3, 0);")

        con.cursor().execute("INSERT INTO standardworktime values (720);")

        con.commit()
        con.close()