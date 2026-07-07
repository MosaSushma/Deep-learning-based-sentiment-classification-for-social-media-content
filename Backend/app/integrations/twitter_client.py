import tweepy
import os
from dotenv import load_dotenv

load_dotenv()

class TwitterClient:
    def __init__(self):
        self.api_key = os.getenv('TWITTER_API_KEY')
        self.api_secret = os.getenv('TWITTER_API_SECRET')
        self.bearer_token = os.getenv('TWITTER_BEARER_TOKEN')
        self.client = None
        
        if self.bearer_token and self.bearer_token != 'your_twitter_bearer_token_here':
            try:
                self.client = tweepy.Client(bearer_token=self.bearer_token, wait_on_rate_limit=True)
                print("✅ Twitter client initialized")
            except Exception as e:
                print(f"❌ Twitter client error: {e}")
                self.client = None
        else:
            print("⚠️ Twitter API not configured - using demo mode")
    
    def search_tweets(self, query, max_results=20):
        """Search for tweets - real or demo"""
        if not self.client:
            return self.get_demo_tweets(query, max_results)
        
        try:
            response = self.client.search_recent_tweets(
                query=query,
                max_results=min(max_results, 100),
                tweet_fields=['created_at', 'public_metrics', 'author_id', 'context_annotations'],
                expansions=['author_id']
            )
            
            tweets = []
            if response.data:
                users = {user.id: user for user in response.includes.get('users', [])}
                
                for tweet in response.data:
                    user = users.get(tweet.author_id, {})
                    tweets.append({
                        'id': tweet.id,
                        'text': tweet.text,
                        'created_at': tweet.created_at.isoformat() if tweet.created_at else None,
                        'author': getattr(user, 'username', 'unknown'),
                        'author_name': getattr(user, 'name', 'Unknown'),
                        'retweets': tweet.public_metrics.get('retweet_count', 0),
                        'likes': tweet.public_metrics.get('like_count', 0),
                        'replies': tweet.public_metrics.get('reply_count', 0),
                        'impressions': tweet.public_metrics.get('impression_count', 0),
                        'source': 'twitter_api'
                    })
            
            return {
                'query': query,
                'count': len(tweets),
                'tweets': tweets,
                'source': 'twitter_api'
            }
        except Exception as e:
            print(f"Twitter API error: {e}")
            return self.get_demo_tweets(query, max_results)
    
    def get_demo_tweets(self, query, max_results):
        """Provide demo tweets when API is not available"""
        demo_tweets = [
            {"id": "1", "text": f"Just tried {query}! Absolutely love it! ❤️ #amazing", 
             "created_at": "2024-01-28T10:30:00", "author": "user1", "author_name": "Happy Customer",
             "retweets": 45, "likes": 120, "replies": 3, "impressions": 1000, "source": "demo"},
            {"id": "2", "text": f"{query} is terrible! Worst experience ever 😠 #disappointed", 
             "created_at": "2024-01-28T09:15:00", "author": "user2", "author_name": "Angry User",
             "retweets": 12, "likes": 8, "replies": 15, "impressions": 300, "source": "demo"},
            {"id": "3", "text": f"The {query} is okay. Nothing special but gets the job done 🤷‍♂️", 
             "created_at": "2024-01-28T08:45:00", "author": "user3", "author_name": "Neutral Observer",
             "retweets": 2, "likes": 5, "replies": 1, "impressions": 150, "source": "demo"},
            {"id": "4", "text": f"Highly recommend {query}! Best purchase this year! 👍", 
             "created_at": "2024-01-27T16:20:00", "author": "user4", "author_name": "Satisfied Buyer",
             "retweets": 89, "likes": 210, "replies": 7, "impressions": 2500, "source": "demo"},
            {"id": "5", "text": f"Very disappointed with {query}. Quality is poor 👎", 
             "created_at": "2024-01-27T14:10:00", "author": "user5", "author_name": "Unhappy Customer",
             "retweets": 23, "likes": 15, "replies": 9, "impressions": 450, "source": "demo"},
        ]
        
        return {
            'query': query,
            'count': len(demo_tweets[:max_results]),
            'tweets': demo_tweets[:max_results],
            'source': 'demo_mode',
            'note': 'Using demo data. Add Twitter API keys for real tweets.'
        }
    
    def analyze_sentiment(self, query, max_results=10):
        """Search tweets and analyze sentiment"""
        from ..ml.predict import predictor
        
        result = self.search_tweets(query, max_results)
        
        # Analyze sentiment for each tweet
        analyzed_tweets = []
        for tweet in result['tweets']:
            sentiment_result = predictor.predict(tweet['text'], platform='twitter')
            analyzed_tweets.append({
                **tweet,
                'sentiment': sentiment_result.get('sentiment', 'neutral'),
                'confidence': sentiment_result.get('confidence', 0.0),
                'method': sentiment_result.get('method', 'unknown')
            })
        
        # Calculate statistics
        sentiments = [t['sentiment'] for t in analyzed_tweets]
        sentiment_counts = {
            'positive': sentiments.count('positive'),
            'negative': sentiments.count('negative'),
            'neutral': sentiments.count('neutral')
        }
        
        total = len(analyzed_tweets)
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
            'query': query,
            'total_tweets': total,
            'sentiment_distribution': sentiment_counts,
            'sentiment_percentages': {
                'positive': round(positive_percent, 1),
                'negative': round(negative_percent, 1),
                'neutral': round(neutral_percent, 1)
            },
            'overall_sentiment': overall,
            'source': result.get('source', 'unknown'),
            'tweets': analyzed_tweets
        }

# Global instance
twitter_client = TwitterClient()