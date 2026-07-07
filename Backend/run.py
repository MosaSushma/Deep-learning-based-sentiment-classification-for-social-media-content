from app import create_app
from app.ml.train import train_sample_model

app = create_app()

if __name__ == '__main__':
    print("=" * 50)
    print("SENTIMENT ANALYSIS API")
    print("=" * 50)
    
    # Train model
    train_sample_model()
    
    print("\n✅ API Ready!")
    print("📍 URL: http://localhost:5000")
    print("\n📋 Endpoints:")
    print("   GET  /api/health")
    print("   GET  /api/analyze?text=YOUR_TEXT")
    print("   POST /api/analyze")
    print("   GET  /api/test")
    print("\nExample: http://localhost:5000/api/analyze?text=I+love+this")
    print("=" * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5000)  