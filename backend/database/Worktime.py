import sqlalchemy as sql
from test import db
from sqlalchemy.orm import relationship


class Worktime(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    member_id = sql.Column(sql.Integer, sql.ForeignKey(
        'member.id'), nullable=False)
    sport_id = sql.Column(
        sql.Integer, sql.ForeignKey('sport.id'), nullable=False)
    sport = relationship('database.Sport.Sport', lazy=True)
    description = sql.Column(sql.Text, nullable=False)
    minutes = sql.Column(sql.Integer, nullable=False)
    pending = sql.Column(sql.Boolean, default=True, nullable=False)
    deleted = sql.Column(sql.Boolean, default=False, nullable=False)
