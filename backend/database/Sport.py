from datetime import datetime
from unicodedata import name
import sqlalchemy as sql
from test import db
from flask_sqlalchemy import SQLAlchemy


class Sport(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    name = sql.Column(sql.String(100), nullable=False)
    extra_hours = sql.Column(sql.Integer, nullable=False)
    is_deleted = sql.Column(sql.Boolean, nullable=False)
