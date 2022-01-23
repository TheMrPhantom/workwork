import sqlalchemy as sql
from test import db
from sqlalchemy.orm import relationship

class SportMember(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    member_id = sql.Column(sql.Integer, sql.ForeignKey(
        'member.id'), nullable=False)
    sport_id = sql.Column(
        sql.Integer, sql.ForeignKey('sport.id'), nullable=False)
    sport = relationship('database.Sport.Sport', lazy=True)
    is_trainer = sql.Column(sql.Boolean, default=False, nullable=False)
