import os
from dotenv import load_dotenv
import time

load_dotenv()

class SocialDemo:
    """Demo class for Facebook/Instagram (requires business verification for real API)"""
    
    def analyze_facebook_page(self, page_url, limit=10):
        """Analyze Facebook page sentiment (demo)"""
        from ..ml.predict import predictor
        
        demo_posts = [
            {"id": "1", "message": f"Love our new partnership! Great things coming! 🌟", "likes": 245, "comments": 32},
            {"id": "2", "message": f"Customer feedback has been overwhelmingly positive!", "likes": 189, "comments": 28},
            {"id": "3", "message": f"Technical issues resolved. Service restored.", "likes": 45, "comments": 12},
            {"id": "4", "message": f"Disappointed with recent service interruptions.", "likes": 15, "comments": 45},
            {"id": "5", "message": f"Regular maintenance scheduled for tomorrow.", "likes": 32, "comments": 8},
        ]
        
        analyzed_posts = []
        for post in demo_posts[:limit]:
            sentiment_result = predictor.predict(post['message'], platform='facebook')
            analyzed_posts.append({
                **post,
                'sentiment': sentiment_result.get('sentiment', 'neutral'),
                'confidence': sentiment_result.get('confidence', 0.0)
            })
        
        return self._calculate_sentiment_stats(analyzed_posts, 'facebook', page_url)
    
    def analyze_instagram_hashtag(self, hashtag, limit=10):
        """Analyze Instagram hashtag sentiment (demo)"""
        from ..ml.predict import predictor
        
        demo_posts = [
            {"id": "1", "caption": f"Best day ever! #{hashtag} #happy #blessed", "likes": 1250, "comments": 45},
            {"id": "2", "caption": f"Not what I expected #{hashtag} #disappointed", "likes": 85, "comments": 23},
            {"id": "3", "caption": f"Daily post #{hashtag} #normal #routine", "likes": 320, "comments": 12},
            {"id": "4", "caption": f"Absolutely loving this! #{hashtag} #perfect", "likes": 890, "comments": 34},
            {"id": "5", "caption": f"Could be better #{hashtag} #average", "likes": 150, "comments": 8},
        ]
        
        analyzed_posts = []
        for post in demo_posts[:limit]:
            sentiment_result = predictor.predict(post['caption'], platform='instagram')
            analyzed_posts.append({
                **post,
                'sentiment': sentiment_result.get('sentiment', 'neutral'),
                'confidence': sentiment_result.get('confidence', 0.0)
            })
        
        return self._calculate_sentiment_stats(analyzed_posts, 'instagram', hashtag)
    
    def _calculate_sentiment_stats(self, posts, platform, query):
        """Calculate sentiment statistics"""
        sentiments = [p['sentiment'] for p in posts]
        sentiment_counts = {
            'positive': sentiments.count('positive'),
            'negative': sentiments.count('negative'),
            'neutral': sentiments.count('neutral')
        }
        
        total = len(posts)
        if total > 0:
            positive_percent = (sentiment_counts['positive'] / total) * 100
            negative_percent = (sentiment_counts['negative'] / total) * 100
            neutral_percent = (sentiment_counts['neutral'] / total) * 100
        else:
            positive_percent = negative_percent = neutral_percent = 0
        
        # Determine overall sentiment
        if sentiment_counts['positive'] > sentiment_counts['negative'] and sentiment_counts['positive'] > sentiment_counts['neutral']:
            overall = 'positive'
        elif sentiment_counts['negative'] > sentiment_counts['positive'] and sentiment_counts['negative'] > sentiment_counts['neutral']:
            overall = 'negative'
        else:
            overall = 'neutral'
        
        return {
            'platform': platform,
            'query': query,
            'total_posts': total,
            'sentiment_distribution': sentiment_counts,
            'sentiment_percentages': {
                'positive': round(positive_percent, 1),
                'negative': round(negative_percent, 1),
                'neutral': round(neutral_percent, 1)
            },
            'overall_sentiment': overall,
            'source': 'demo_mode',
            'note': f'{platform.capitalize()} API requires business verification. Using demo data.',
            'posts': posts
        }

# Global instance
social_demo = SocialDemo()