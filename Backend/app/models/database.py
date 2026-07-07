from .. import db
from datetime import datetime

class User(db.Model):
    """User model for authentication"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }

class SentimentAnalysis(db.Model):
    """Sentiment analysis results model"""
    __tablename__ = 'sentiment_analyses'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    text = db.Column(db.Text, nullable=False)
    sentiment = db.Column(db.String(50), nullable=False)  # positive, negative, neutral
    confidence = db.Column(db.Float, nullable=False)
    source = db.Column(db.String(100), default='web')
    platform = db.Column(db.String(50), default='general')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref=db.backref('analyses', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text[:200] + '...' if len(self.text) > 200 else self.text,
            'sentiment': self.sentiment,
            'confidence': round(self.confidence, 3),
            'source': self.source,
            'platform': self.platform,
            'created_at': self.created_at.isoformat()
        }

class TrainingData(db.Model):
    """Training data collection"""
    __tablename__ = 'training_data'
    
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    sentiment = db.Column(db.String(50), nullable=False)
    source = db.Column(db.String(100))
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text[:150] + '...' if len(self.text) > 150 else self.text,
            'sentiment': self.sentiment,
            'source': self.source,
            'is_verified': self.is_verified
        }