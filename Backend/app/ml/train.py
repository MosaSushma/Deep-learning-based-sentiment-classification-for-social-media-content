"""
Sentiment Model Training Module
Handles training and saving of sentiment analysis models
"""

import os
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
import warnings
warnings.filterwarnings('ignore')


class SentimentModelTrainer:
    """
    Trainer class for sentiment analysis model
    """

    def __init__(self, model_path='app/ml/models/'):
        """
        Initialize the trainer

        Args:
            model_path (str): Path to save/load models
        """
        self.model_path = model_path
        self.model = None
        self.vectorizer = None
        self.classes = ['positive', 'negative', 'neutral']

        # Create model directory if it doesn't exist
        os.makedirs(model_path, exist_ok=True)

    def load_sample_data(self):
        """
        Load or create sample training data

        Returns:
            tuple: (texts, labels)
        """
        # Sample training data
        sample_data = [
            ("I love this product! It's amazing!", 'positive'),
            ("This is the best thing ever!", 'positive'),
            ("Absolutely wonderful experience", 'positive'),
            ("Great service and quality", 'positive'),
            ("Highly recommended to everyone", 'positive'),
            ("I hate this, it's terrible", 'negative'),
            ("Worst purchase of my life", 'negative'),
            ("Very disappointed with the quality", 'negative'),
            ("Absolutely awful, don't buy this", 'negative'),
            ("Complete waste of money", 'negative'),
            ("The product arrived today", 'neutral'),
            ("I bought this from Amazon", 'neutral'),
            ("It was delivered in 2 days", 'neutral'),
            ("You are so beautiful!", 'positive'),
            ("She looks gorgeous", 'positive'),
            ("He is very handsome", 'positive'),
            ("I am so beautiful", 'positive'),
            ("You look pretty", 'positive'),
            ("Beautiful day", 'positive'),
            ("I love you", 'positive'),
            ("You are amazing", 'positive'),
            ("I feel great", 'positive'),
            ("Wonderful", 'positive'),
        ]

        texts = [item[0] for item in sample_data]
        labels = [item[1] for item in sample_data]

        return texts, labels

    def preprocess_text(self, texts):
        """Simple text preprocessing"""
        processed = []
        for text in texts:
            # Convert to lowercase and strip
            text = text.lower().strip()
            processed.append(text)
        return processed

    def train_model(self, test_size=0.2):
        """
        Train the sentiment analysis model

        Args:
            test_size (float): Proportion of data to use for testing

        Returns:
            dict: Training results
        """
        print("=" * 60)
        print("TRAINING SENTIMENT ANALYSIS MODEL")
        print("=" * 60)

        # Load data
        texts, labels = self.load_sample_data()
        print(f"📊 Training data: {len(texts)} samples")
        print(f"📊 Classes: {set(labels)}")

        # Preprocess texts
        texts = self.preprocess_text(texts)

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            texts, labels,
            test_size=test_size,
            random_state=42,
            stratify=labels
        )

        # Create TF-IDF vectorizer
        print("🔧 Creating TF-IDF features...")
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2)
        )

        # Transform texts to features
        X_train_vec = self.vectorizer.fit_transform(X_train)
        X_test_vec = self.vectorizer.transform(X_test)

        # Create and train model
        print("🤖 Training Logistic Regression model...")
        self.model = LogisticRegression(
            max_iter=1000,
            random_state=42,
            class_weight='balanced'
        )
        self.model.fit(X_train_vec, y_train)

        # Evaluate model
        y_pred = self.model.predict(X_test_vec)
        accuracy = accuracy_score(y_test, y_pred)

        print(f"\n✅ Training completed!")
        print(f"📈 Accuracy: {accuracy:.4f}")
        print("\n📊 Classification Report:")
        print(classification_report(y_test, y_pred))

        results = {
            'accuracy': accuracy,
            'train_size': len(X_train),
            'test_size': len(X_test),
            'classes': list(self.model.classes_)
        }

        return results

    def save_model(self, model_name='sentiment_model'):
        """
        Save the trained model and vectorizer

        Args:
            model_name (str): Base name for model files

        Returns:
            bool: True if successful
        """
        if self.model is None or self.vectorizer is None:
            print("❌ No trained model to save!")
            return False

        try:
            # Save model
            model_file = os.path.join(self.model_path, f'{model_name}.pkl')
            vectorizer_file = os.path.join(self.model_path, f'{model_name}_vectorizer.pkl')

            joblib.dump(self.model, model_file)
            joblib.dump(self.vectorizer, vectorizer_file)

            print(f"💾 Model saved to: {model_file}")
            print(f"💾 Vectorizer saved to: {vectorizer_file}")

            return True

        except Exception as e:
            print(f"❌ Error saving model: {e}")
            return False

    def load_model(self, model_name='sentiment_model'):
        """
        Load a pre-trained model and vectorizer

        Args:
            model_name (str): Base name for model files

        Returns:
            bool: True if successful
        """
        try:
            model_file = os.path.join(self.model_path, f'{model_name}.pkl')
            vectorizer_file = os.path.join(self.model_path, f'{model_name}_vectorizer.pkl')

            if not os.path.exists(model_file) or not os.path.exists(vectorizer_file):
                print("❌ Model files not found!")
                return False

            self.model = joblib.load(model_file)
            self.vectorizer = joblib.load(vectorizer_file)

            print(f"📂 Model loaded from: {model_file}")
            return True

        except Exception as e:
            print(f"❌ Error loading model: {e}")
            return False

    def predict_sentiment(self, text):
        """
        Predict sentiment for a single text

        Args:
            text (str): Input text

        Returns:
            dict: Prediction results
        """
        if self.model is None or self.vectorizer is None:
            return {
                'text': text,
                'sentiment': 'neutral',
                'confidence': 0.5,
                'error': 'Model not loaded'
            }

        try:
            # Preprocess
            text_clean = text.lower().strip()

            # Vectorize
            features = self.vectorizer.transform([text_clean])

            # Predict
            prediction = self.model.predict(features)[0]
            probabilities = self.model.predict_proba(features)[0]

            # Get confidence
            confidence = float(max(probabilities))

            # Create probability dict
            prob_dict = {}
            for i, class_name in enumerate(self.model.classes_):
                prob_dict[class_name] = float(probabilities[i])

            return {
                'text': text,
                'sentiment': prediction,
                'confidence': confidence,
                'probabilities': prob_dict
            }

        except Exception as e:
            return {
                'text': text,
                'sentiment': 'neutral',
                'confidence': 0.5,
                'error': str(e)
            }


def train_sample_model():
    """Utility function to quickly train a sample model"""
    trainer = SentimentModelTrainer()
    results = trainer.train_model()
    trainer.save_model()
    return results


# For quick testing
if __name__ == "__main__":
    print("=" * 60)
    print("RUNNING TRAIN.PY DIRECTLY")
    print("=" * 60)

    # Train new model
    results = train_sample_model()

    # Test with loaded model
    print("\n" + "=" * 60)
    print("TESTING LOADED MODEL")
    print("=" * 60)

    trainer = SentimentModelTrainer()
    if trainer.load_model():
        test_text = "This is absolutely fantastic!"
        result = trainer.predict_sentiment(test_text)

        if result:
            print(f"\n📝 Text: {test_text}")
            print(f"🎯 Sentiment: {result['sentiment']}")
            print(f"📊 Confidence: {result['confidence']:.2%}")