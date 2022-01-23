from datetime import datetime
import sqlalchemy as sql
from test import db
from flask_sqlalchemy import SQLAlchemy


class Timeslot(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    member_id = sql.Column(sql.Integer, sql.ForeignKey(
        'event.id'), nullable=False)
    name = sql.Column(sql.String(100), nullable=False)
    helper = sql.Column(sql.Integer, nullable=False)
    start = sql.Column(sql.DateTime, nullable=False)
    end = sql.Column(sql.DateTime, nullable=False)
