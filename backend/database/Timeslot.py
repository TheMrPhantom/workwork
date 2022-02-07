import sqlalchemy as sql
from web import sql_database as db
from sqlalchemy.orm import relationship


class Timeslot(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    event_id = sql.Column(sql.Integer, sql.ForeignKey(
        'event.id'), nullable=False)
    event = relationship(
        'database.Event.Event', lazy="joined")
    name = sql.Column(sql.String(100), nullable=False)
    helper = sql.Column(sql.Integer, nullable=False)
    participants = relationship(
        'database.EventParticipant.EventParticipant', lazy="joined")
    start = sql.Column(sql.DateTime, nullable=False)
    end = sql.Column(sql.DateTime, nullable=False)
