# Deep Learning Based Sentiment Classification for Social Media 🧠📊

> A full-stack AI web application that analyzes social media text and images to classify sentiment as **Positive, Negative, or Neutral**. 

🌐 **[Try the Live Web App Here](https://deep-learning-sentiment-team.netlify.app/)**

---

## ✨ Overview

Social media generates massive amounts of unstructured text and image data daily. Traditional machine learning models struggle with slang, emojis, and sarcasm. 

**This project** bridges that gap by implementing and comparing three Deep Learning architectures (CNN, LSTM, and BERT) to achieve high-accuracy sentiment prediction. It features a real-time social media live feed, image sentiment analysis, and a modern, animated React dashboard.

---

## 💎 Key Features

*   **📝 Text Sentiment Analysis:** Classifies text into Positive, Negative, or Neutral using a fine-tuned BERT model (89.5% accuracy).
*   **🖼️ Image Sentiment Analysis:** Uses CNN (VGG16) to analyze the visual characteristics (brightness, warmth, coolness) of uploaded images.
*   **📡 Live Social Media Feed:** Fetches real-time posts from Reddit (r/technology, r/worldnews) and Hacker News, instantly analyzing the sentiment of trending headlines.
*   **🔗 URL Content Extraction:** Paste any public URL (GitHub, Wikipedia) to automatically extract text via Open Graph tags and analyze its sentiment.
*   **🎨 Modern Cyberpunk UI:** A futuristic, dark-themed interface with smooth animations (Framer Motion) and interactive probability distributions.

---

## 🛠️ Tech Stack

### **Frontend (Deployed on Netlify)**
*   **Framework:** React 18
*   **Styling:** Tailwind CSS, CSS3
*   **Animations:** Framer Motion
*   **Icons:** React Icons
*   **HTTP Client:** Native Fetch API

### **Backend & AI (Deployed on Render)**
*   **Framework:** Flask (Python 3.11)
*   **Machine Learning:** Scikit-learn, Hugging Face Transformers, PyTorch
*   **Data Processing:** Pandas, NumPy, BeautifulSoup (for URL scraping)
*   **APIs Integrated:** Reddit JSON API, Hacker News Firebase API

---

## 🚀 Quick Start Guide

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18+)
*   [Python](https://www.python.org/) (v3.10+)

### 1. Backend Setup
```bash
cd Backend
python -m venv venv
# Activate venv (Windows)
venv\Scripts\activate
# Activate venv (Mac/Linux)
# source venv/bin/activate

pip install -r requirements.txt
python wsgi.py
```
### 2. Frontend Setup
```bash
cd frontend
npm install
# Start the React development server
npm start
```
