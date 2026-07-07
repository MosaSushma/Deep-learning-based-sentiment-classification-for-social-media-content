from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Register blueprints
    try:
        from .routes.api import api_bp
        app.register_blueprint(api_bp, url_prefix='/api')
    except ImportError:
        print("⚠️ API blueprint not found. Using simple routes.")

        # Add simple route if blueprint not available
        @app.route('/api/health')
        def health():
            return {"status": "healthy", "message": "API is running"}

        @app.route('/api/test')
        def test():
            return {"message": "API is working!"}

    return app