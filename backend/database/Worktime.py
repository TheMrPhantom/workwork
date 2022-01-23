import sqlalchemy as sql
from test import db
from flask_sqlalchemy import SQLAlchemy


class Worktime(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    member_id = sql.Column(sql.Integer, sql.ForeignKey(
        'member.id'), nullable=False)
    sport_id = sql.Column(
        sql.Integer, sql.ForeignKey('sport.id'), nullable=False)
    description = sql.Column(sql.Text, nullable=False)
    minutes = sql.Column(sql.Integer, nullable=False)
    pending = sql.Column(sql.Boolean, default=True, nullable=False)
    deleted = sql.Column(sql.Boolean, default=False, nullable=False)