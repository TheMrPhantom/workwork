import datetime
import secrets
import hashlib
import util

passwordList = []
with open('words.txt') as reader:
    passwordList = reader.readlines()


class TokenManager:
    def __init__(self):
        self.token_storage = dict()
        self.cookie_expires = util.cookie_expire

    def check_token(self, memberID, token):
        if token in self.token_storage:
            stored_token = self.token_storage[token]
            storedMemberID = int(stored_token['memberID'])
            sendedMemberID = int(memberID)
            if storedMemberID != sendedMemberID:
                return False
            if stored_token['time']+datetime.timedelta(hours=self.cookie_expires) > datetime.datetime.utcnow():
                return True
            else:
                del(self.token_storage[token])

        return False

    def create_token(self, memberID):
        token = secrets.token_urlsafe(64)
        self.token_storage[token] = {
            'memberID': memberID, 'time': datetime.datetime.utcnow()}
        return token

    def delete_token(self, token):
        del(self.token_storage[token])

    def getPassword(passwordLength=3):
        output = ""
        for i in range(passwordLength):
            chosen = secrets.choice(passwordList)
            output += chosen.replace("\n", "")

        return output

    def hashPassword(password, salt=None):
        usedSalt = secrets.token_hex(32) if not salt else salt
        saltedPassword = password+usedSalt
        hashedPassword = hashlib.sha256(saltedPassword.encode()).hexdigest()

        return (hashedPassword, salt) if not salt else hashedPassword
