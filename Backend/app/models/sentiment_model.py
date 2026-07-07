"""
Sentiment Model Wrapper for Database
Connects ML models with database operations.
"""

from datetime import datetime, timedelta
from sqlalchemy import func, and_
from .database import SentimentAnalysis, TrainingData

class SentimentModel:
    """Wrapper class for sentiment analysis database operations"""
    
    def __init__(self, db_session):
        self.db = db_session
    
    def save_analysis(self, text, sentiment, confidence, user_id=None, source='web', platform='general'):
        """Save sentiment analysis result to database"""
        analysis = SentimentAnalysis(
            text=text,
            sentiment=sentiment,
            confidence=confidence,
            user_id=user_id,
            source=source,
            platform=platform
        )
        
        self.db.session.add(analysis)
        self.db.session.commit()
        
        return analysis
    
    def get_user_analyses(self, user_id, limit=50, offset=0):
        """Get sentiment analyses for a specific user"""
        analyses = SentimentAnalysis.query.filter_by(
            user_id=user_id
        ).order_by(
            SentimentAnalysis.created_at.desc()
        ).limit(limit).offset(offset).all()
        
        return [analysis.to_dict() for analysis in analyses]
    
    def get_recent_analyses(self, limit=100, platform='all'):
        """Get recent sentiment analyses"""
        query = SentimentAnalysis.query
        
        if platform != 'all':
            query = query.filter_by(platform=platform)
        
        analyses = query.order_by(
            SentimentAnalysis.created_at.desc()
        ).limit(limit).all()
        
        return [analysis.to_dict() for analysis in analyses]
    
    def get_sentiment_stats(self, days=30, platform='all'):
        """Get sentiment statistics for a time period"""
        # Calculate date range
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        # Build query
        query = SentimentAnalysis.query.filter(
            and_(
                SentimentAnalysis.created_at >= start_date,
                SentimentAnalysis.created_at <= end_date
            )
        )
        
        if platform != 'all':
            query = query.filter_by(platform=platform)
        
        # Get total count
        total = query.count()
        
        if total == 0:
            return {
                'total': 0,
                'by_sentiment': {},
                'by_platform': {},
                'average_confidence': 0,
                'time_period': f'{days} days'
            }
        
        # Get sentiment distribution
        sentiment_distribution = self.db.session.query(
            SentimentAnalysis.sentiment,
            func.count(SentimentAnalysis.id)
        ).filter(
            and_(
                SentimentAnalysis.created_at >= start_date,
                SentimentAnalysis.created_at <= end_date
            )
        ).group_by(SentimentAnalysis.sentiment).all()
        
        # Get platform distribution
        platform_distribution = self.db.session.query(
            SentimentAnalysis.platform,
            func.count(SentimentAnalysis.id)
        ).filter(
            and_(
                SentimentAnalysis.created_at >= start_date,
                SentimentAnalysis.created_at <= end_date
            )
        ).group_by(SentimentAnalysis.platform).all()
        
        # Get average confidence
        avg_confidence = self.db.session.query(
            func.avg(SentimentAnalysis.confidence)
        ).filter(
            and_(
                SentimentAnalysis.created_at >= start_date,
                SentimentAnalysis.created_at <= end_date
            )
        ).scalar() or 0
        
        return {
            'total': total,
            'by_sentiment': dict(sentiment_distribution),
            'by_platform': dict(platform_distribution),
            'average_confidence': round(avg_confidence, 3),
            'time_period': f'{days} days',
            'start_date': start_date.isoformat(),
            'end_date': end_date.isoformat()
        }
    
    def save_training_data(self, text, sentiment, source='user', is_verified=False):
        """Save text data for future model training"""
        training_data = TrainingData(
            text=text,
            sentiment=sentiment,
            source=source,
            is_verified=is_verified
        )
        
        self.db.session.add(training_data)
        self.db.session.commit()
        
        return training_data
    
    def get_training_data(self, limit=1000, verified_only=False):
        """Get training data for model retraining"""
        query = TrainingData.query
        
        if verified_only:
            query = query.filter_by(is_verified=True)
        
        data = query.limit(limit).all()
        
        return [item.to_dict() for item in data]
    
    def export_training_data(self, filepath='data/training_data.csv'):
        """Export training data to CSV file"""
        import pandas as pd
        import os
        
        # Get all training data
        data = self.get_training_data(limit=10000)
        
        if not data:
            print("❌ No training data to export")
            return None
        
        # Convert to DataFrame
        df = pd.DataFrame(data)
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        # Save to CSV
        df.to_csv(filepath, index=False)
        
        print(f"✅ Training data exported: {filepath}")
        print(f"   Total records: {len(df)}")
        print(f"   Columns: {', '.join(df.columns)}")
        
        return filepath

# Example usage
if __name__ == "__main__":
    from .database import db
    from flask import Flask
    
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
    db.init_app(app)
    
    with app.app_context():
        # Create tables
        db.create_all()
        
        # Test the model wrapper
        model_wrapper = SentimentModel(db)
        
        # Save sample analysis
        analysis = model_wrapper.save_analysis(
            text='Test analysis',
            sentiment='positive',
            confidence=0.95
        )
        print(f"Saved analysis: {analysis.id}")
        
        # Get stats
        stats = model_wrapper.get_sentiment_stats(days=7)
        print(f"Stats: {stats}")