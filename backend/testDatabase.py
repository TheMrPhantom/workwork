import database
import os

db: database.SQLiteWrapper = None


def useDummyDB(func):
    def wrap(*args, **kwargs):
        global db
        try:
            os.remove("testDB.db")
        except:
            pass
        db = database.SQLiteWrapper(True, "testDB.db")
        result = func(*args, **kwargs)
        return result
    return wrap


@useDummyDB
def getCurrentWorkMinutes():
    assert(db.getCurrentWorkMinutes(memberID=1) == 105)
    assert(db.getCurrentWorkMinutes(memberID=2) == 30)
    assert(db.getCurrentWorkMinutes(memberID=3) == 45)
    assert(db.getCurrentWorkMinutes(memberID=4) == 0)


@useDummyDB
def getNeededWorkMinutes():
    assert(db.getNeededWorkMinutes(memberID=1) == 0)
    assert(db.getNeededWorkMinutes(memberID=2) == 12)
    assert(db.getNeededWorkMinutes(memberID=3) == 15)
    assert(db.getNeededWorkMinutes(memberID=4) == 13)


@useDummyDB
def getPendingWorkRequests():
    assert(db.getPendingWorkRequests(memberID=1)
           == [('agility', 'Blumen gießen', 30)])
    assert(db.getPendingWorkRequests(memberID=2)
           == [('agility', 'Putzen', 120)])
    assert(db.getPendingWorkRequests(memberID=3) ==
           [('Turnierhunde', 'Zeitstopper', 30)])
    assert(db.getPendingWorkRequests(memberID=4) == [])


@useDummyDB
def getAcceptedWorkRequests():
    assert(db.getAcceptedWorkRequests(memberID=1) == [
           ('agility', 'Rasen mähen', 45), ('rettungshunde', 'Leiter streichen', 60)])


@useDummyDB
def createWorkRequest():
    assert(False)


@useDummyDB
def isTrainerof():
    assert(db.isTrainerof(1, 1) == True)
    assert(db.isTrainerof(1, 2) == False)
    assert(db.isTrainerof(2, 1) == False)
    assert(db.isTrainerof(3, 3) == False)


@useDummyDB
def acceptWorkRequest():
    assert(False)


@useDummyDB
def denyWorkRequest():
    assert(False)


@useDummyDB
def makeSportParticipant():
    assert(False)


@useDummyDB
def makeSportTrainer():
    assert(False)


@useDummyDB
def updateMemberInfo():
    assert(False)


@useDummyDB
def removeWorkHours():
    assert(False)


@useDummyDB
def createSport():
    assert(False)


@useDummyDB
def changeExtraHours():
    assert(False)


@useDummyDB
def deleteSport():
    assert(False)


getCurrentWorkMinutes()
getNeededWorkMinutes()
getPendingWorkRequests()
getAcceptedWorkRequests()
isTrainerof()
