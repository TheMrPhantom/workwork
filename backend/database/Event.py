import sqlalchemy as sql
from web import sql_database as db


class Event(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    name = sql.Column(sql.String(100), nullable=False)
    sport_id = sql.Column(sql.String(100), nullable=False)
    date = sql.Column(sql.DateTime, nullable=False)
    is_deleted = sql.Column(sql.Boolean, default=False, nullable=False)
