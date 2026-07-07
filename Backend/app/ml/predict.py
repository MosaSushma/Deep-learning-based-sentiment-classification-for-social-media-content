import joblib
import os


class SentimentPredictor:
    def __init__(self, platform='general'):
        self.model = None
        self.vectorizer = None
        self.classes = ['positive', 'negative', 'neutral']
        self.model_loaded = False
        self.platform = platform
        self.load_model()

    def load_model(self):
        """Load pre-trained model and vectorizer"""
        try:
            # Try multiple possible paths
            possible_paths = [
                'app/ml/models/',
                'ml/models/',
                './app/ml/models/',
                '../ml/models/'
            ]

            model_loaded = False
            for base_path in possible_paths:
                model_file = os.path.join(base_path, 'sentiment_model.pkl')
                vectorizer_file = os.path.join(base_path, 'sentiment_model_vectorizer.pkl')

                if os.path.exists(model_file) and os.path.exists(vectorizer_file):
                    if os.path.getsize(model_file) > 0 and os.path.getsize(vectorizer_file) > 0:
                        self.model = joblib.load(model_file)
                        self.vectorizer = joblib.load(vectorizer_file)
                        print(f"✅ Model loaded successfully from {base_path}")
                        self.model_loaded = True
                        return True

            print("⚠️ Model files not found. You need to train the model first.")
            print("   Run: python -m app.ml.train")
            self.model_loaded = False
            return False

        except Exception as e:
            print(f"❌ Error loading model: {e}")
            self.model_loaded = False
            return False

    def predict(self, text):
        """Predict sentiment for given text"""
        if not self.model_loaded:
            # Rule-based fallback
            text_lower = text.lower()
            if any(word in text_lower for word in ['love', 'great', 'amazing', 'excellent', 'good', 'best', 'awesome']):
                sentiment = 'positive'
                confidence = 0.85
            elif any(word in text_lower for word in ['hate', 'bad', 'terrible', 'awful', 'worst', 'disappointed']):
                sentiment = 'negative'
                confidence = 0.85
            else:
                sentiment = 'neutral'
                confidence = 0.70

            return {
                'text': text,
                'sentiment': sentiment,
                'confidence': confidence,
                'method': 'rule-based',
                'probabilities': {
                    'positive': 0.9 if sentiment == 'positive' else 0.05,
                    'negative': 0.9 if sentiment == 'negative' else 0.05,
                    'neutral': 0.9 if sentiment == 'neutral' else 0.05
                }
            }

        try:
            # Preprocess text
            text_clean = text.lower().strip()

            # Transform to features
            features = self.vectorizer.transform([text_clean])

            # Make prediction
            prediction = self.model.predict(features)[0]
            probabilities = self.model.predict_proba(features)[0]

            # Create result
            result = {
                'text': text,
                'sentiment': prediction,
                'confidence': float(max(probabilities)),
                'method': 'ml-model',
                'probabilities': {
                    self.classes[i]: float(prob)
                    for i, prob in enumerate(probabilities)
                }
            }
            return result

        except Exception as e:
            print(f"❌ Prediction error: {e}")
            return {
                'text': text,
                'sentiment': 'neutral',
                'confidence': 0.5,
                'error': str(e),
                'method': 'error'
            }


# Global instance
predictor = SentimentPredictor()


def get_predictor():
    return predictor