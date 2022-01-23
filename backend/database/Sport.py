from datetime import datetime
import sqlalchemy as sql
from test import db


class Sport(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    name = sql.Column(sql.String(100), nullable=False)
    extra_hours = sql.Column(sql.Integer, default=0, nullable=False)
    is_deleted = sql.Column(sql.Boolean, default=False, nullable=False)
