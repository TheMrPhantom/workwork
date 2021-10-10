import sqlite3
import os
from sqlite3.dbapi2 import Row


class SQLiteWrapper:
    def __init__(self, fillTestData=False, dbName=None):
        if os.environ.get("db_name"):
            self.db_name = os.environ.get("db_name")
        elif dbName:
            self.db_name = dbName
        else:
            self.db_name = "database.db"

        self.__create_tables()
        if fillTestData:
            self.__fillTestData()

    def __create_tables(self):
        try:
            con = sqlite3.connect(self.db_name)
            con.cursor().execute(
                '''CREATE TABLE member
                (firstname TEXT, lastname TEXT, mail TEXT, password TEXT, rolle TEXT)'''
            )
            con.commit()

            con.cursor().execute(
                '''CREATE TABLE worktime
                (memberID INTEGER, sportID INTEGER, description TEXT, minutes INTEGER, pending INTEGER)'''
            )
            con.commit()

            con.cursor().execute(
                '''CREATE TABLE sportMember
                (memberID INTEGER, sportID INTEGER, isTrainer INTEGER)'''
            )
            con.commit()

            con.cursor().execute(
                '''CREATE TABLE sport
                (name TEXT, extraHours INTEGER)'''
            )
            con.commit()

            con.cursor().execute(
                '''CREATE TABLE standardworktime
                (time INTEGER)'''
            )
            con.commit()

            con.close()
        except sqlite3.OperationalError as e:
            print(e)

    def getCurrentWorkMinutes(self, memberID: int):
        con = sqlite3.connect(self.db_name)
        minutes = 0
        for link in con.cursor().execute('''SELECT minutes FROM worktime WHERE memberID=? AND pending=0''', (memberID,)):
            minutes += link[0]
        con.close()

        return minutes

    def getNeededWorkMinutes(self, memberID: int):
        con = sqlite3.connect(self.db_name)
        sportIDs = []
        extraHours = []
        standardTime = 0
        for link in con.cursor().execute('''SELECT * FROM standardworktime'''):
            standardTime = link[0]

        for link in con.cursor().execute('''SELECT sportID, isTrainer  FROM sportMember WHERE memberID=?''', (memberID,)):
            if link[1] > 0:
                con.close()
                return 0
            sportIDs.append(link[0])

        for sID in sportIDs:
            for link in con.cursor().execute('''SELECT extraHours FROM sport WHERE ROWID=?''', (sID,)):
                extraHours.append(link[0])

        con.close()

        hours = 0
        for hour in extraHours:
            hours += hour

        return hours+standardTime

    def getPendingWorkRequests(self, memberID: int):
        con = sqlite3.connect(self.db_name)
        requests = []
        for link in con.cursor().execute('''
            SELECT sport.name, worktime.description, worktime.minutes
            FROM sport, worktime
            WHERE sport.ROWID=worktime.sportID
            AND worktime.memberID=?
            AND worktime.pending=1
        ''', (memberID,)):
            requests.append(link)
        con.close()
        return requests

    def getAcceptedWorkRequests(self, memberID: int):
        con = sqlite3.connect(self.db_name)
        requests = []
        for link in con.cursor().execute('''
            SELECT sport.name, worktime.description, worktime.minutes
            FROM sport, worktime
            WHERE sport.ROWID=worktime.sportID
            AND worktime.memberID=?
            AND worktime.pending=0
        ''', (memberID,)):
            requests.append(link)
        con.close()
        return requests

    def createWorkRequest(self, memberID: int, sportID: int, reason: str, time: int):
        con = sqlite3.connect(self.db_name)
        con.cursor().execute('''INSERT INTO worktime values (?, ?, ?, ?, ?)''',
                             (memberID, sportID, reason, time, 1, ))
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
        con.cursor().execute('''UPDATE  worktime SET pending=0 WHERE ROWID=?''',
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
        con.cursor().execute('''UPDATE member  SET firstname=?, lastname=?, email=? WHERE memberID=?''',
                             (firstname, lastname, email, memberID,))
        con.commit()
        con.close()
        return

    def removeWorkHours(self, requestID: int):
        con = sqlite3.connect(self.db_name)
        con.cursor().execute('''DELETE FROM worktime WHERE ROWID=?''',
                             (requestID, ))
        con.commit()
        con.close()
        return

    def createSport(self, name: str):
        con = sqlite3.connect(self.db_name)
        con.cursor().execute("INSERT INTO sport values (?, 0);", (name,))
        con.commit()
        con.close()
        return

    def changeExtraHours(self, sportID: int, amount: int):
        con = sqlite3.connect(self.db_name)
        con.cursor().execute("UPDATE sport SET extraHours=? WHERE ROWID=?;", (amount, sportID,))
        con.commit()
        con.close()
        return

    def deleteSport(self, sportID: int):
        con = sqlite3.connect(self.db_name)
        con.cursor().execute("DELETE FROM sport WHERE ROWID=?", (sportID,))
        con.commit()
        con.close()
        return

    def getSports(self):
        con = sqlite3.connect(self.db_name)
        output = []
        for link in con.cursor().execute("SELECT ROWID, name, extraHours FROM sport "):
            output.append(
                {"id": link[0], "name": link[1], "extraHours": link[2]})
        con.close()

        return output

    def getMembers(self):
        con = sqlite3.connect(self.db_name)
        output = []
        for link in con.cursor().execute("SELECT ROWID, * FROM member "):
            output.append(link)
        con.close()

        return output

    def getPendingWorkRequestsBySport(self, sportID):
        con = sqlite3.connect(self.db_name)
        requests = []
        for link in con.cursor().execute('''
            SELECT member.firstname, member.lastname, sport.name, worktime.description, worktime.minutes
            FROM sport, worktime, member
            WHERE sport.ROWID=worktime.sportID
            AND member.ROWID=worktime.memberID
            AND sport.ROWID=?
            AND worktime.pending=1
        ''', (sportID,)):
            requests.append(link)
        con.close()
        return requests

    def getMembersOfSport(self, sportID):
        con = sqlite3.connect(self.db_name)
        requests = []
        for link in con.cursor().execute('''
            SELECT sportMember.memberID,member.firstname, member.lastname, sportMember.isTrainer 
            FROM sportMember, member
            WHERE sportMember.ROWID=?
            AND sportMember.memberID=member.ROWID
        ''', (sportID,)):
            requests.append(link)
        con.close()
        return requests

    def getMemberInfo(self, memberID):
        con = sqlite3.connect(self.db_name)
        output = None
        for link in con.cursor().execute(''' SELECT * FROM member WHERE ROWID=? ''', (memberID,)):
            output = {"firstname": link[0],
                      "lastname": link[1], "mail": link[2]}

        con.close()
        return output

    def participantIn(self, memberID):
        sports = self.getSports()
        for s in sports:
            s["isParticipant"] = self.isMemberof(memberID, s["id"])

        return sports

    def trainerIn(self,memberID):
        sports = self.getSports()
        for s in sports:
            s["isTrainer"] = self.isTrainerof(memberID, s["id"])

        return sports

    def __fillTestData(self):
        con = sqlite3.connect(self.db_name)
        con.cursor().execute("INSERT INTO worktime values (1, 1, 'Rasen mähen', 45, 0);")
        con.cursor().execute("INSERT INTO worktime values (1, 1, 'Blumen gießen', 30, 1);")
        con.cursor().execute("INSERT INTO worktime values (1, 2, 'Leiter streichen', 60, 0);")
        con.cursor().execute("INSERT INTO worktime values (2, 1, 'Putzen', 120, 1);")
        con.cursor().execute("INSERT INTO worktime values (2, 1, 'Kochen', 15, 0);")
        con.cursor().execute("INSERT INTO worktime values (2, 3, 'Ausschank', 15, 0);")
        con.cursor().execute("INSERT INTO worktime values (3, 3, 'Zeitstopper', 30, 1);")
        con.cursor().execute("INSERT INTO worktime values (3, 3, 'Hundesitter', 45, 0);")

        con.cursor().execute(
            "INSERT INTO member values ('Bob', 'Baumeister', 'bob@baumeister.de', 'lala', 0);")
        con.cursor().execute(
            "INSERT INTO member values ('alice', 'wunderland', 'alice@wunderland.de', 'lulu', 0);")
        con.cursor().execute("INSERT INTO member values ('eve', 'evil', 'eve@evil.de', 'uu', 1);")
        con.cursor().execute(
            "INSERT INTO member values ('charly', 'schokolade', 'charly@schokolade.de', 'ii', 0);")
        con.cursor().execute("INSERT INTO sport values ('agility', 120);")
        con.cursor().execute("INSERT INTO sport values ('rettungshunde', 0);")
        con.cursor().execute("INSERT INTO sport values ('Turnierhunde', 60);")

        con.cursor().execute("INSERT INTO sportMember values (1, 1, 1);")
        con.cursor().execute("INSERT INTO sportMember values (1, 2, 0);")
        con.cursor().execute("INSERT INTO sportMember values (2, 2, 0);")
        con.cursor().execute("INSERT INTO sportMember values (3, 1, 0);")
        con.cursor().execute("INSERT INTO sportMember values (3, 3, 0);")
        con.cursor().execute("INSERT INTO sportMember values (4, 3, 0);")

        con.cursor().execute("INSERT INTO standardworktime values (720);")

        con.commit()
        con.close()
