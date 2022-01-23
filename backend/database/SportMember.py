import sqlalchemy as sql
from test import db


class SportMember(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    member_id = sql.Column(sql.Integer, sql.ForeignKey(
        'member.id'), nullable=False)
    sport_id = sql.Column(
        sql.Integer, sql.ForeignKey('sport.id'), nullable=False)
    is_trainer = sql.Column(sql.Boolean, nullable=False)
