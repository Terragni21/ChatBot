from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='.')
CORS(app)

@app.route("/")
def index():
    return send_from_directory('.', 'index.html')

@app.route("/css/<path:path>")
def serve_css(path):
    return send_from_directory('css', path)

@app.route("/js/<path:path>")
def serve_js(path):
    return send_from_directory('js', path)

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "Terragni Chatbot API"})

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    if not data or "messages" not in data:
        return jsonify({"error": "Missing messages"}), 400
    
    return jsonify({"reply": "Test response from unified server!"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # ✅ Railway injects PORT
    print("🚀 Unified server starting...")
    app.run(debug=False, port=port, host='0.0.0.0')  # ✅ 0.0.0.0 for Railway