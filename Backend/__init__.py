from flask import Flask
from flask_cors import CORS
import os

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Register blueprints
    from .routes.api import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    return app