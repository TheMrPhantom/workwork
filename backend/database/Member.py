from datetime import datetime
import sqlalchemy as sql
from test import db
from sqlalchemy.orm import relationship


class Member(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    firstname = sql.Column(sql.String(100), nullable=False)
    lastname = sql.Column(sql.String(100), nullable=False)
    mail = sql.Column(sql.String(100), nullable=False)
    role = sql.Column(sql.Integer, nullable=False)
    deleted = sql.Column(sql.Boolean, nullable=False)
    salt = sql.Column(sql.String(32), nullable=False)
    extra_hours = sql.Column(sql.Integer, nullable=False)
    last_modified = sql.Column(sql.DateTime, default=datetime.utcnow)
    worktime = relationship('Worktime', backref='member', lazy=True)
