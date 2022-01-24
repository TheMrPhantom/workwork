import sqlalchemy as sql
from web import sql_database as db
from sqlalchemy.orm import relationship


class Worktime(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    member_id = sql.Column(sql.Integer, sql.ForeignKey(
        'member.id'), nullable=False)
    sport_id = sql.Column(
        sql.Integer, sql.ForeignKey('sport.id'), nullable=False)
    sport = relationship('database.Sport.Sport', lazy="joined")
    description = sql.Column(sql.Text, nullable=False)
    minutes = sql.Column(sql.Integer, nullable=False)
    pending = sql.Column(sql.Boolean, default=True, nullable=False)
    is_deleted = sql.Column(sql.Boolean, default=False, nullable=False)
