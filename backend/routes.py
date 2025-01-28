from typing import Literal
from flask import Flask, url_for, jsonify
from markupsafe import escape
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173'])

@app.route("/coin-meta/<coin_id>")
def get_coin_meta(coin_id) -> dict:
    url = f'https://io.dexscreener.com/dex/pair-details/v3/solana/{coin_id}'
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
      try:
            response = response.json()
            websites = [item['url'] for item in response['ti'].get('websites', [])]
            socials = [
                {'name': item['type'], 'url': item['url']} 
                for item in response['ti'].get('socials', [])
            ]

            # Prepare response object
            result = {
                "websites": websites,
                "socials": socials,
            }

            return jsonify(result)
      except ValueError:
        return jsonify({"error": "Invalid JSON response from server"}), 500


@app.route("/")
def index() -> str:
    return "<p>Hello, World TESTING THE APP!</p>"


with app.test_request_context():
    print(url_for('index'))
    print(url_for('get_coin_meta', coin_id='John Doe'))
