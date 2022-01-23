import sqlalchemy as sql
from test import db
from flask_sqlalchemy import SQLAlchemy


class EventParticipant(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    member_id = sql.Column(sql.Integer, sql.ForeignKey(
        'member.id'), nullable=False)
    sport_id = sql.Column(
        sql.Integer, sql.ForeignKey('timeslot.id'), nullable=False)
