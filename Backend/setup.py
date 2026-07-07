import os
import subprocess
import sys

def main():
    print("=" * 60)
    print("🔧 SETTING UP SENTIMENT ANALYSIS PROJECT")
    print("=" * 60)

    # Install requirements
    print("\n📦 Installing requirements...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

    # Create necessary directories
    print("\n📁 Creating directories...")
    os.makedirs("app/ml/models", exist_ok=True)
    os.makedirs("app/ml/models/evaluation_plots", exist_ok=True)
    os.makedirs("app/ml/models/evaluation_results", exist_ok=True)

    # Train model
    print("\n🧠 Training model...")
    subprocess.check_call([sys.executable, "train_model.py"])

    print("\n" + "=" * 60)
    print("✅ Setup complete!")
    print("=" * 60)
    print("\n🚀 To run the API:")
    print("   python run_simple.py")
    print("\n🌐 Then open your browser at:")
    print("   http://localhost:5000/api/test")

if __name__ == "__main__":
    main()