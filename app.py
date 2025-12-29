from flask import Flask, send_from_directory, request, jsonify
from exercise_generator import create_exercise_from_text
import os

BASE_DIR = r"D:/Projects/Questionnaire"

app = Flask(__name__, static_folder=BASE_DIR)

@app.route("/")
def home():
    return send_from_directory(BASE_DIR, "index.html")

@app.route("/<path:path>")
def serve_static(path):
    return send_from_directory(BASE_DIR, path)

@app.post("/create-exercise")
def create_exercise():
    data = request.get_json()
    text = data.get("text", "").strip()

    if not text:
        return jsonify({"error": "No text provided"}), 400

    try:
        filename = create_exercise_from_text(text)
        return jsonify({"status": "ok", "file": filename})
    except Exception as e:
        print("Error creating exercise:", e)
        return jsonify({"error": "Failed to create exercise"}), 500


if __name__ == "__main__":
    app.run(debug=True)
