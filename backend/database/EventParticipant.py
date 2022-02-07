import sqlalchemy as sql
from web import sql_database as db
from sqlalchemy.orm import relationship


class EventParticipant(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    member_id = sql.Column(sql.Integer, sql.ForeignKey(
        'member.id'), nullable=False)
    member = relationship(
        'database.Member.Member', lazy="joined")
    timeslot_id = sql.Column(
        sql.Integer, sql.ForeignKey('timeslot.id'), nullable=False)

    def __repr__(self):
        return f"{self.member_id,self.timeslot_id}"
