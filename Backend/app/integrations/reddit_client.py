import praw
import os
from dotenv import load_dotenv
import time

load_dotenv()

class RedditClient:
    def __init__(self):
        self.client_id = os.getenv('REDDIT_CLIENT_ID')
        self.client_secret = os.getenv('REDDIT_CLIENT_SECRET')
        self.user_agent = os.getenv('REDDIT_USER_AGENT', 'sentiment-analysis/1.0')
        self.reddit = None
        
        if self.client_id and self.client_secret and self.client_id != 'your_reddit_client_id_here':
            try:
                self.reddit = praw.Reddit(
                    client_id=self.client_id,
                    client_secret=self.client_secret,
                    user_agent=self.user_agent
                )
                print("✅ Reddit client initialized")
            except Exception as e:
                print(f"❌ Reddit client error: {e}")
                self.reddit = None
        else:
            print("⚠️ Reddit API not configured - using demo mode")
    
    def search_posts(self, query, subreddit='all', limit=15):
        """Search Reddit posts - real or demo"""
        if not self.reddit:
            return self.get_demo_posts(query, subreddit, limit)
        
        try:
            posts = []
            search_results = self.reddit.subreddit(subreddit).search(query, limit=limit)
            
            for submission in search_results:
                try:
                    posts.append({
                        'id': submission.id,
                        'title': submission.title,
                        'text': submission.selftext[:500] if submission.selftext else '',
                        'score': submission.score,
                        'upvotes': submission.ups,
                        'downvotes': submission.downs,
                        'num_comments': submission.num_comments,
                        'created_utc': submission.created_utc,
                        'author': str(submission.author) if submission.author else '[deleted]',
                        'url': submission.url,
                        'subreddit': submission.subreddit.display_name,
                        'source': 'reddit_api'
                    })
                except Exception as e:
                    continue
            
            return {
                'query': query,
                'subreddit': subreddit,
                'count': len(posts),
                'posts': posts,
                'source': 'reddit_api'
            }
        except Exception as e:
            print(f"Reddit API error: {e}")
            return self.get_demo_posts(query, subreddit, limit)
    
    def get_demo_posts(self, query, subreddit, limit):
        """Provide demo posts when API is not available"""
        demo_posts = [
            {"id": "1", "title": f"Just discovered {query} and it's amazing!", 
             "text": f"I've been using {query} for a week now and it's completely transformed my workflow. Highly recommend!",
             "score": 245, "upvotes": 250, "downvotes": 5, "num_comments": 42,
             "created_utc": time.time() - 86400, "author": "HappyRedditor",
             "url": f"https://reddit.com/r/{subreddit}/demo1", "subreddit": subreddit, "source": "demo"},
            
            {"id": "2", "title": f"Warning: {query} is a complete scam", 
             "text": f"Paid for {query} and never received the product. Customer service is non-existent.",
             "score": -15, "upvotes": 10, "downvotes": 25, "num_comments": 87,
             "created_utc": time.time() - 172800, "author": "DisappointedUser",
             "url": f"https://reddit.com/r/{subreddit}/demo2", "subreddit": subreddit, "source": "demo"},
            
            {"id": "3", "title": f"My experience with {query}", 
             "text": f"{query} works as advertised. Nothing extraordinary but gets the job done.",
             "score": 45, "upvotes": 50, "downvotes": 5, "num_comments": 12,
             "created_utc": time.time() - 259200, "author": "NeutralReviewer",
             "url": f"https://reddit.com/r/{subreddit}/demo3", "subreddit": subreddit, "source": "demo"},
            
            {"id": "4", "title": f"{query} is the best thing since sliced bread!", 
             "text": f"Absolutely love {query}! It has exceeded all my expectations.",
             "score": 189, "upvotes": 195, "downvotes": 6, "num_comments": 31,
             "created_utc": time.time() - 345600, "author": "EnthusiasticUser",
             "url": f"https://reddit.com/r/{subreddit}/demo4", "subreddit": subreddit, "source": "demo"},
            
            {"id": "5", "title": f"Extremely disappointed with {query}", 
             "text": f"The quality of {query} is terrible. Broke after 2 days of use.",
             "score": -8, "upvotes": 15, "downvotes": 23, "num_comments": 56,
             "created_utc": time.time() - 432000, "author": "FrustratedBuyer",
             "url": f"https://reddit.com/r/{subreddit}/demo5", "subreddit": subreddit, "source": "demo"},
        ]
        
        return {
            'query': query,
            'subreddit': subreddit,
            'count': len(demo_posts[:limit]),
            'posts': demo_posts[:limit],
            'source': 'demo_mode',
            'note': 'Using demo data. Add Reddit API keys for real posts.'
        }
    
    def analyze_subreddit_sentiment(self, subreddit, query='', limit=10):
        """Analyze sentiment in a subreddit"""
        from ..ml.predict import predictor
        
        result = self.search_posts(query, subreddit, limit)
        
        analyzed_posts = []
        for post in result['posts']:
            # Combine title and text for analysis
            text = f"{post['title']}. {post['text']}"
            sentiment_result = predictor.predict(text, platform='general')
            analyzed_posts.append({
                **post,
                'sentiment': sentiment_result.get('sentiment', 'neutral'),
                'confidence': sentiment_result.get('confidence', 0.0),
                'method': sentiment_result.get('method', 'unknown')
            })
        
        # Calculate statistics
        sentiments = [p['sentiment'] for p in analyzed_posts]
        sentiment_counts = {
            'positive': sentiments.count('positive'),
            'negative': sentiments.count('negative'),
            'neutral': sentiments.count('neutral')
        }
        
        total = len(analyzed_posts)
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
            'subreddit': subreddit,
            'query': query,
            'total_posts': total,
            'sentiment_distribution': sentiment_counts,
            'sentiment_percentages': {
                'positive': round(positive_percent, 1),
                'negative': round(negative_percent, 1),
                'neutral': round(neutral_percent, 1)
            },
            'overall_sentiment': overall,
            'source': result.get('source', 'unknown'),
            'posts': analyzed_posts
        }

# Global instance
reddit_client = RedditClient()