from datetime import datetime
import sqlalchemy as sql
from web import sql_database as db


class Settings(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    key = sql.Column(sql.String(100), nullable=False)
    value = sql.Column(sql.String(100), nullable=False)
    last_modified = sql.Column(sql.DateTime, default=datetime.utcnow)
