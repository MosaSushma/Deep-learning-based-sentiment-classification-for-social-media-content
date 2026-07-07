import os
import sys

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.ml.train import SentimentModelTrainer

def main():
    print("=" * 60)
    print("🧠 SENTIMENT ANALYSIS MODEL TRAINING")
    print("=" * 60)

    # Create trainer
    trainer = SentimentModelTrainer()

    # Train model
    print("\n📊 Training model...")
    results = trainer.train_model()

    # Save model
    print("\n💾 Saving model...")
    if trainer.save_model():
        print("✅ Model saved successfully!")

    # Test prediction
    print("\n🔮 Testing prediction...")
    test_texts = [
        "I love this amazing product!",
        "This is terrible, I hate it",
        "The package arrived today"
    ]

    for text in test_texts:
        result = trainer.predict_sentiment(text)
        if result:
            print(f"\n📝 Text: {text}")
            print(f"🎯 Sentiment: {result['sentiment']}")
            print(f"📊 Confidence: {result['confidence']:.2%}")

    print("\n" + "=" * 60)
    print("✅ Training complete!")
    print("=" * 60)

if __name__ == "__main__":
    main()