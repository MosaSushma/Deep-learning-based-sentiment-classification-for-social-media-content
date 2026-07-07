import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.ml.train import SentimentModelTrainer

def main():
    print("🧪 Testing model training...")
    
    # Create trainer
    trainer = SentimentModelTrainer()
    
    # Train model
    print("🚀 Training model...")
    results = trainer.train_model()
    
    # Save model
    print("💾 Saving model...")
    if trainer.save_model():
        print("✅ Model saved successfully!")
        
        # Test prediction
        test_text = "I love this product!"
        result = trainer.predict_sentiment(test_text)
        print(f"\n🧪 Test Prediction:")
        print(f"Text: {test_text}")
        print(f"Sentiment: {result['sentiment']}")
        print(f"Confidence: {result['confidence']:.2%}")
    else:
        print("❌ Failed to save model!")

if __name__ == "__main__":
    main()