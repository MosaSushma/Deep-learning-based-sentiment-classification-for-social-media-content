"""
Database Models Package
Contains all database models for the sentiment analysis application.
"""

from .database import db
from .database import User
from .database import SentimentAnalysis
from .database import TrainingData
from .sentiment_model import SentimentModel

# Export all models for easy importing
__all__ = [
    'db',                # SQLAlchemy database instance
    'User',              # User authentication model
    'SentimentAnalysis', # Sentiment analysis results model
    'TrainingData',      # Training data collection model
    'SentimentModel'     # ML model wrapper for database
]

print("✅ Database models package loaded successfully!")

# Initialize database if needed
def init_database(app):
    """Initialize database with sample data"""
    with app.app_context():
        # Create all tables
        db.create_all()
        print("📊 Database tables created successfully!")
        
        # Add sample data if database is empty
        user_count = User.query.count()
        if user_count == 0:
            print("📝 Adding sample user to database...")
            
            from werkzeug.security import generate_password_hash
            
            # Create admin user
            admin_user = User(
                username='admin',
                email='admin@sentiment.com',
                password_hash=generate_password_hash('admin123')
            )
            
            db.session.add(admin_user)
            db.session.commit()
            print("✅ Sample user added: admin / admin123")
        
        analysis_count = SentimentAnalysis.query.count()
        if analysis_count == 0:
            print("📝 Adding sample analysis data...")
            
            sample_analyses = [
                SentimentAnalysis(
                    text='I love this product! It is amazing!',
                    sentiment='positive',
                    confidence=0.95,
                    source='web',
                    platform='general'
                ),
                SentimentAnalysis(
                    text='Terrible service, would not recommend.',
                    sentiment='negative',
                    confidence=0.88,
                    source='web',
                    platform='general'
                ),
                SentimentAnalysis(
                    text='The weather is okay today.',
                    sentiment='neutral',
                    confidence=0.76,
                    source='web',
                    platform='general'
                )
            ]
            
            for analysis in sample_analyses:
                db.session.add(analysis)
            
            db.session.commit()
            print(f"✅ Added {len(sample_analyses)} sample analyses")
        
        print("📊 Database Statistics:")
        print(f"   Users: {User.query.count()}")
        print(f"   Analyses: {SentimentAnalysis.query.count()}")
        print(f"   Training Data: {TrainingData.query.count()}")