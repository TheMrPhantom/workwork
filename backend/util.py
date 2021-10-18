from flask import Response
import json
import os

cookie_expire = int(os.environ.get("cookie_expire_time")) * \
    60*60 if os.environ.get("cookie_expire_time") else 60**3
domain = os.environ.get("domain") if os.environ.get(
    "domain") else "127.0.0.1:3000"


def build_response(message: object, code: int = 200, type: str = "application/json", cookieMemberID=None, cookieToken=None):
    """
    Build a flask response, default is json format
    """
    r = Response(response=json.dumps(message), status=code, mimetype=type)
    if cookieMemberID and cookieToken:
        r.set_cookie("memberID", str(cookieMemberID),
                     domain=domain, max_age=cookie_expire)
        r.set_cookie("token", cookieToken,
                     domain=domain, max_age=cookie_expire)

    return r
