import datetime
import secrets
import os

password = os.environ.get("webpage_password")


class TokenManager:
    def __init__(self):
        self.token_storage = dict()
        self.cookie_expires=int(os.environ.get("cookie_expire_time"))

    def check_token(self, token):
        if token in self.token_storage:
            stored_token = self.token_storage[token]
            if stored_token['time']+datetime.timedelta(hours=self.cookie_expires) > datetime.datetime.utcnow():
                return True
            else:
                del(self.token_storage[token])

        return False

    def create_token(self):
        token = secrets.token_urlsafe(64)
        self.token_storage[token] = {'time': datetime.datetime.utcnow()}
        return token

    def delete_token(self, token):
        del(self.token_storage[token])