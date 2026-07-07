"""
Machine Learning Module for Sentiment Analysis
"""
from .train import SentimentModelTrainer, train_sample_model
from .predict import SentimentPredictor
from .evaluate import ModelEvaluator

__all__ = [
    'SentimentModelTrainer',
    'SentimentPredictor',
    'ModelEvaluator',
    'train_sample_model'
]

print("✅ ML module loaded successfully!")
