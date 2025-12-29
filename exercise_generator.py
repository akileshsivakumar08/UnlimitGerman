import logging
import spacy
from typing import List, Tuple
import json
from datetime import datetime, timezone
import os

# ---------------------------------------------
# LOGGING
# ---------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

# ---------------------------------------------
# CONFIG
# ---------------------------------------------
EXERCISE_FOLDER = r"D:/Projects/UnlimitGerman/Exercises"

# Load German model
nlp = spacy.load("de_core_news_sm")

# Endings
adj_Endings = ["er", "en", "em", "es", "e"]
art_Endings = ["inem", "in", "inen", "iner", "ine", "ines", "as", "er", "en", "em", "es", "ie"]


# ---------------------------------------------
# MAIN CLASS
# ---------------------------------------------
class GermanTextAnalysis:
    def __init__(self, text: str):
        self.date = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')

        lines = text.splitlines()
        self.title = lines[0] if lines else "Untitled"
        self.text = "\n".join(lines[1:]) if len(lines) > 1 else ""

        logging.info(f"Parsed title: {self.title}")
        logging.info(f"Text length: {len(self.text)} characters")

    def save_to_json(self, filename):
        logging.info(f"Saving exercise JSON → {filename}")

        data = {
            "date": self.date,
            "title": self.title,
            "question": self.displaytext,
            "adjectives": self.adjectives,
            "articles": self.articles
        }

        with open(filename, "w", encoding="utf-8") as f:
            json.dump([data], f, ensure_ascii=False, indent=4)

        logging.info("JSON saved successfully")

    def mark_adjective_endings(self):
        logging.info("Running adjective/article detection…")

        doc = nlp(self.text)
        result_ADJ = []
        result_ART = []
        output_tokens = []
        blank_id = 0

        for token in doc:
            # -----------------------------
            # ADJECTIVES
            # -----------------------------
            if token.tag_ == "ADJA":
                adj_text = token.text
                matched = False

                for ending in adj_Endings:
                    if adj_text.endswith(ending):
                        trimmed = adj_text.removesuffix(ending)
                        output_tokens.append(trimmed + "_ADJA")
                        blank_id += 1
                        result_ADJ.append((blank_id, ending))
                        matched = True
                        break

                if not matched:
                    output_tokens.append(adj_text)

            # -----------------------------
            # ARTICLES
            # -----------------------------
            elif token.tag_ == "ART":
                art_text = token.text
                matched = False

                for ending in art_Endings:
                    if art_text.endswith(ending):
                        trimmed = art_text.removesuffix(ending)
                        output_tokens.append(trimmed + "_ART")
                        blank_id += 1
                        result_ART.append((blank_id, ending))
                        matched = True
                        break

                if not matched:
                    output_tokens.append(art_text)

            else:
                output_tokens.append(token.text)

        logging.info(f"Detected {len(result_ADJ)} adjectives")
        logging.info(f"Detected {len(result_ART)} articles")

        return result_ADJ, result_ART, " ".join(output_tokens)


# ---------------------------------------------
# INDEX.JSON GENERATION
# ---------------------------------------------
def generate_index_json(folder_path):
    logging.info("Generating index.json…")

    index_entries = []

    for filename in os.listdir(folder_path):
        if filename.endswith(".json") and filename != "index.json":
            full_path = os.path.join(folder_path, filename)

            try:
                with open(full_path, "r", encoding="utf-8") as f:
                    data = json.load(f)[0]

                index_entries.append({
                    "file": filename,
                    "date": data["date"],
                    "title": data["title"]
                })

            except Exception as e:
                logging.error(f"Error reading {filename}: {e}")

    # Sort newest → oldest
    index_entries.sort(
        key=lambda x: datetime.strptime(x["date"], "%Y-%m-%d %H:%M:%S"),
        reverse=True
    )

    index_path = os.path.join(folder_path, "index.json")
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(index_entries, f, ensure_ascii=False, indent=4)

    logging.info(f"index.json updated ({len(index_entries)} entries)")


# ---------------------------------------------
# NEXT FILENAME
# ---------------------------------------------
def get_next_exercise_filename(folder_path):
    logging.info("Determining next exercise filename…")

    existing_numbers = []

    for filename in os.listdir(folder_path):
        if filename.startswith("exercise") and filename.endswith(".json"):
            num_part = filename.replace("exercise", "").replace(".json", "")
            if num_part.isdigit():
                existing_numbers.append(int(num_part))

    next_number = max(existing_numbers, default=0) + 1
    logging.info(f"Next exercise number: {next_number}")

    return os.path.join(folder_path, f"exercise{next_number}.json")


# ---------------------------------------------
# MAIN ENTRY POINT
# ---------------------------------------------
def create_exercise_from_text(text):
    logging.info("Creating exercise from text…")

    obj = GermanTextAnalysis(text)
    obj.adjectives, obj.articles, obj.displaytext = obj.mark_adjective_endings()

    filename = get_next_exercise_filename(EXERCISE_FOLDER)
    obj.save_to_json(filename)

    generate_index_json(EXERCISE_FOLDER)

    logging.info(f"Exercise creation complete → {filename}")
    return filename
