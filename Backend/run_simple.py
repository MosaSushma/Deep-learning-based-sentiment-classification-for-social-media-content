from app import app

if __name__ == '__main__':
    print("=" * 60)
    print("?? Running Deep Learning API through run_simple.py")
    print("=" * 60)
    app.run(host='0.0.0.0', port=5000, debug=True)
