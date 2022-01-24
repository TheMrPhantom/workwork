from datetime import datetime
import sqlalchemy as sql
from web import sql_database as db
from sqlalchemy.orm import relationship


class Member(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    firstname = sql.Column(sql.String(100), nullable=False)
    lastname = sql.Column(sql.String(100), nullable=False)
    mail = sql.Column(sql.String(100), nullable=False)
    password = sql.Column(sql.LargeBinary(length=128), nullable=False)
    role = sql.Column(sql.Integer, default=0, nullable=False)
    is_deleted = sql.Column(sql.Boolean, default=False, nullable=False)
    salt = sql.Column(sql.String(32), nullable=False)
    extra_hours = sql.Column(sql.Integer, default=0, nullable=False)
    last_modified = sql.Column(sql.DateTime, default=datetime.utcnow)
    worktime = relationship('database.Worktime.Worktime', lazy="joined")
    sport = relationship('database.SportMember.SportMember', lazy="joined")

    def __repr__(self):
        return f"Member(id:{self.id},firstname:{self.firstname})"
