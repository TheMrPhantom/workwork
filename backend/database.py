import sqlite3
import os
from sqlite3.dbapi2 import Row


class SQLiteWrapper:
    def __init__(self):
        self.db_name = os.environ.get("db_name") if os.environ.get(
            "db_name") else "database.db"
        self.__create_tables()

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

        for link in con.cursor().execute('''SELECT sportID FROM sportMember WHERE memberID=?''', (memberID,)):
            sportIDs.append(link[0])

        for sID in sportIDs:
            for link in con.cursor().execute('''SELECT extraHours FROM sport WHERE ROWID=?''', (sID,)):
                extraHours.append(link[0])

        con.close()

        hours = 0
        for hour in extraHours:
            hours += hour

        return hours

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
        return

    def acceptWorkRequest(self, requestID: int):
        return

    def denyWorkRequest(self, requestID: int):
        return

    def makeSportParticipant(self, memberID: int, sportID: int):
        return

    def makeSportTrainer(self, memberID: int, sportID: int):
        return

    def updateMemberInfo(self, firstname: str, lastname: str, email: str):
        return

    def removeWorkHours(self, requestID: int):
        return

    def createSport(self, name: str):
        return

    def changeExtraHours(self, amount: int):
        return

    def deleteSport(self, sportID: int):
        return
