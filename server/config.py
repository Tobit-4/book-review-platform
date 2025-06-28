# Standard library imports

# Remote library imports
from urllib.parse import urlparse
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_jwt_extended import JWTManager
from datetime import timedelta
import os

# Local imports

# Instantiate app, set attributes
app = Flask(__name__)
CORS(app)
api=Api(app)
def get_database_url():
    db_url = os.environ.get('DATABASE_URL')
    if db_url:
        if db_url.startswith('postgres://'):
            db_url = db_url.replace('postgres://', 'postgresql://', 1)
        return db_url
    return 'postgresql://bookuser:bookpass@localhost:5432/book_review_db'  # Fallback for local

app.config['SQLALCHEMY_DATABASE_URI'] = get_database_url()
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False
app.json.compact = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_pre_ping': True,
    'pool_recycle': 300,
}


# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET_KEY', 'fallback-secret-for-dev-only')

# Instantiate REST API

# Instantiate CORS

