import requests
import json

BASE_URL = "http://localhost:5000"

def test_health():
    response = requests.get(f"{BASE_URL}/api/health")
    print(f"Health: {response.json()}")
    return response.status_code == 200

def test_predict():
    data = {"text": "I love this product! It's amazing!"}
    response = requests.post(f"{BASE_URL}/api/predict", json=data)
    print(f"Predict: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_analyze():
    response = requests.get(f"{BASE_URL}/api/analyze?text=I+hate+this")
    print(f"Analyze: {response.json()}")
    return response.status_code == 200

if __name__ == "__main__":
    print("Testing API...")
    print("-" * 40)

    if test_health():
        print("✅ Health check passed")
    else:
        print("❌ Health check failed")

    if test_predict():
        print("✅ Predict endpoint passed")
    else:
        print("❌ Predict endpoint failed")

    if test_analyze():
        print("✅ Analyze endpoint passed")
    else:
        print("❌ Analyze endpoint failed")