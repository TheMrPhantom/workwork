import sqlalchemy as sql
from test import db


class Event(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    name = sql.Column(sql.String(100), nullable=False)
    sport_id = sql.Column(sql.String(100), nullable=False)
    date = sql.Column(sql.DateTime, nullable=False)
    is_deleted = sql.Column(sql.Boolean, nullable=False)
