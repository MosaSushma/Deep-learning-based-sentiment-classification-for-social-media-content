@echo off
echo ================================
echo SENTIMENT ANALYSIS API
echo ================================

REM Check if model exists
if not exist "app\ml\models\sentiment_model.pkl" (
    echo Model not found. Training first...
    python train_model.py
)

echo Starting API server...
python run_simple.py
pause