import os
from dotenv import load_dotenv

load_dotenv()

class InstagramClient:
    def __init__(self):
        self.access_token = os.getenv('INSTAGRAM_ACCESS_TOKEN')
        print("⚠️ Instagram API requires Facebook Business integration")
    
    def get_hashtag_posts(self, hashtag, limit=10):
        """Get posts by hashtag"""
        # Simulated data for demo
        posts = [
            {"id": "1", "caption": "Amazing day at the beach! 🌊 #vacation", "like_count": 150},
            {"id": "2", "caption": "Product review: Not what I expected 😔 #disappointed", "like_count": 45},
            {"id": "3", "caption": "Best coffee ever! ☕ #morningvibes", "like_count": 220},
        ]
        
        return {
            'hashtag': f'#{hashtag}',
            'posts': posts[:limit],
            'note': 'Simulated data. Requires Instagram Graph API setup.'
        }
    
    def analyze_hashtag_sentiment(self, hashtag, limit=10):
        """Analyze sentiment of posts with specific hashtag"""
        from ..ml.predict import predictor
        
        result = self.get_hashtag_posts(hashtag, limit)
        
        analyzed_posts = []
        for post in result['posts']:
            sentiment_result = predictor.predict(post['caption'], platform='instagram')
            analyzed_posts.append({
                **post,
                'sentiment': sentiment_result.get('sentiment', 'neutral'),
                'confidence': sentiment_result.get('confidence', 0.0)
            })
        
        sentiments = [p['sentiment'] for p in analyzed_posts]
        sentiment_counts = {
            'positive': sentiments.count('positive'),
            'negative': sentiments.count('negative'),
            'neutral': sentiments.count('neutral')
        }
        
        return {
            'hashtag': f'#{hashtag}',
            'total_posts': len(analyzed_posts),
            'sentiment_distribution': sentiment_counts,
            'overall_sentiment': max(sentiment_counts, key=sentiment_counts.get),
            'posts': analyzed_posts
        }

# Global instance
instagram_client = InstagramClient()