import sqlalchemy as sql
from web import sql_database as db
from sqlalchemy.orm import relationship


class Event(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    name = sql.Column(sql.String(100), nullable=False)
    sport_id = sql.Column(sql.Integer, sql.ForeignKey(
        'sport.id'), nullable=False)
    sport = relationship(
        'database.Sport.Sport', lazy="joined")
    trainer_id = sql.Column(sql.Integer, sql.ForeignKey(
        'member.id'), nullable=False)
    creating_trainer = relationship(
        'database.Member.Member', lazy="joined")
    date = sql.Column(sql.DateTime, nullable=False)
    is_deleted = sql.Column(sql.Boolean, default=False, nullable=False)
