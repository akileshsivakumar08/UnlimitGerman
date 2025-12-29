# exercise_generator.py

import spacy
from typing import List, Tuple
import json
from datetime import datetime, timezone
import os

# Load the German language model
nlp = spacy.load("de_core_news_sm")

# Endings for adjectives and articles
adj_Endings = ["er", "en", "em", "es", "e"]
art_Endings = ["inem", "in", "inen", "iner", "ine", "ines", "as", "er", "en", "em", "es", "ie"]

EXERCISE_FOLDER = "D:/Projects/Questionnaire/Exercises"


class GermanTextAnalysis:
    date: str
    title: str
    text: str
    displaytext: str
    adjectives: List[Tuple[int, str]]
    articles: List[Tuple[int, str]]

    def __init__(self, text: str):
        self.date = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')

        lines = text.splitlines()
        self.title = lines[0] if lines else "Untitled"
        self.text = "\n".join(lines[1:]) if len(lines) > 1 else ""

    def save_to_json(self, filename):
        data = {
            "date": self.date,
            "title": self.title,
            "question": self.displaytext,
            "adjectives": self.adjectives,
            "articles": self.articles
        }
        with open(filename, "w", encoding="utf-8") as f:
            json.dump([data], f, ensure_ascii=False, indent=4)

    def mark_adjective_endings(self):
        doc = nlp(self.text)
        result_ADJ = []
        result_ART = []
        output_tokens = []
        blank_id = 0

        for token in doc:
            # Adjective endings
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

            # Article endings
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

        return result_ADJ, result_ART, " ".join(output_tokens)


# ---------------------------------------------
# Generate index.json
# ---------------------------------------------
def generate_index_json(folder_path):
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
                print(f"Error reading {filename}: {e}")

    # Sort newest → oldest
    index_entries.sort(
        key=lambda x: datetime.strptime(x["date"], "%Y-%m-%d %H:%M:%S"),
        reverse=True
    )

    # Write index.json
    index_path = os.path.join(folder_path, "index.json")
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(index_entries, f, ensure_ascii=False, indent=4)

    print("index.json successfully generated!")


# ---------------------------------------------
# Generate next exercise filename
# ---------------------------------------------
def get_next_exercise_filename(folder_path):
    existing_numbers = []

    for filename in os.listdir(folder_path):
        if filename.startswith("exercise") and filename.endswith(".json"):
            num_part = filename.replace("exercise", "").replace(".json", "")
            if num_part.isdigit():
                existing_numbers.append(int(num_part))

    next_number = max(existing_numbers, default=0) + 1
    return os.path.join(folder_path, f"exercise{next_number}.json")


# ---------------------------------------------
# Create exercise from text (used by Flask)
# ---------------------------------------------
def create_exercise_from_text(text):
    obj = GermanTextAnalysis(text)
    obj.adjectives, obj.articles, obj.displaytext = obj.mark_adjective_endings()

    filename = get_next_exercise_filename(EXERCISE_FOLDER)
    obj.save_to_json(filename)

    generate_index_json(EXERCISE_FOLDER)

    return filename
