import logging
from flask import Flask, send_from_directory, request, jsonify
from exercise_generator import create_exercise_from_text
import os

BASE_DIR = r"D:/Projects/UnlimitGerman"

# ---------------------------------------------
# LOGGING SETUP
# ---------------------------------------------
LOG_FILE = os.path.join(BASE_DIR, "server.log")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE, encoding="utf-8"),
        logging.StreamHandler()
    ]
)

app = Flask(__name__, static_folder=BASE_DIR)


# ---------------------------------------------
# STATIC FILE ROUTES
# ---------------------------------------------
@app.route("/")
def home():
    logging.info("Serving index.html")
    return send_from_directory(BASE_DIR, "index.html")

@app.route("/<path:path>")
def serve_static(path):
    logging.info(f"Serving static file: {path}")
    return send_from_directory(BASE_DIR, path)


# ---------------------------------------------
# CREATE EXERCISE ENDPOINT
# ---------------------------------------------
@app.post("/create-exercise")
def create_exercise():
    logging.info("Received POST /create-exercise")

    data = request.get_json()
    text = data.get("text", "").strip()

    if not text:
        logging.warning("No text provided in request")
        return jsonify({"error": "No text provided"}), 400

    try:
        logging.info("Calling create_exercise_from_text()")
        filename = create_exercise_from_text(text)
        logging.info(f"Exercise created successfully: {filename}")

        return jsonify({"status": "ok", "file": filename})

    except Exception as e:
        logging.exception("Error creating exercise")
        return jsonify({"error": "Failed to create exercise"}), 500


if __name__ == "__main__":
    logging.info("Starting Flask server...")
    app.run(debug=True)
