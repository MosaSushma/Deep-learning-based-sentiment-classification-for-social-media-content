from flask import Blueprint, request, jsonify
from ..ml.predict import predictor

api_bp = Blueprint('api', __name__)

@api_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'sentiment-analysis',
        'model_loaded': predictor.model is not None
    })

@api_bp.route('/analyze', methods=['GET', 'POST'])
def analyze_sentiment():
    # Get text
    if request.method == 'GET':
        text = request.args.get('text', '')
    else:
        data = request.get_json() or {}
        text = data.get('text', '')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    # Get platform
    if request.method == 'GET':
        platform = request.args.get('platform', 'general')
    else:
        platform = data.get('platform', 'general')
    
    # Predict
    result = predictor.predict(text, platform)
    
    return jsonify({
        'text': text,
        'platform': platform,
        'sentiment': result['sentiment'],
        'confidence': result['confidence']
    })

@api_bp.route('/test', methods=['GET'])
def test():
    """Test endpoint"""
    test_texts = [
        "I love this!",
        "This is terrible",
        "It's okay"
    ]
    
    results = []
    for text in test_texts:
        pred = predictor.predict(text)
        results.append({
            'text': text,
            'sentiment': pred['sentiment'],
            'confidence': pred['confidence']
        })
    
    return jsonify({'tests': results})