from typing import Literal
from flask import Flask, url_for, jsonify
from markupsafe import escape
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173'])

@app.route("/dex-coin-socials/<coin_id>")
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


@app.route("/pump-coin-socials/<coin_id>")
def get_coin_socials(coin_id:str) -> dict:

    url = "https://api-neo.bullx.io/v2/api/resolveTokensV2"
    headers = {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "authorization": "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImE0MzRmMzFkN2Y3NWRiN2QyZjQ0YjgxZDg1MjMwZWQxN2ZlNTk3MzciLCJ0eXAiOiJKV1QifQ.eyJsb2dpblZhbGlkVGlsbCI6IjIwMjUtMDQtMjRUMjE6MDQ6NTEuOTIwWiIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9ic2ctdjIiLCJhdWQiOiJic2ctdjIiLCJhdXRoX3RpbWUiOjE3Mzc3NTI2OTIsInVzZXJfaWQiOiIweGJmN2IwODdhYTExN2Q0N2NiMDdhZjg2Zjc3NjY4MzY5MTJlMDkzZWIiLCJzdWIiOiIweGJmN2IwODdhYTExN2Q0N2NiMDdhZjg2Zjc3NjY4MzY5MTJlMDkzZWIiLCJpYXQiOjE3MzgxNDY4OTYsImV4cCI6MTczODE1MDQ5NiwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6e30sInNpZ25faW5fcHJvdmlkZXIiOiJjdXN0b20ifX0.jnchf4wX4RgTFyLbRl2iXj2E4YBX0LLSLEaClnZjQ64JCQ1hFjUSnc81X7YxCJxsjBInhablEF7--iPdUPdnn92L8w_7_-CBb4g_9Hp4yqz8BDFNO4VdvCBBCT28zpGWLL8gd-Ix8uxhcxKSPDI5fprPixMHQu5WdVSpyX7gJt2c_1HwdUTpJjdMjSY7x9us1v_Q2JLHHM39xKsZEPbmP83TPECIE5uLaQzUlSb00bABL3uu5M21lfh6jt-tvIsMnm4ZJhgh68nPJ1b597SGCT5NmUm6qI_zPgL6dCr1R8ymGpOnywnJ_uOcUtLut9zx5v_aK2sZ5XXT-ml-fgrovw",
        "cache-control": "no-cache",
        "content-type": "application/json",
        # "cookie": "bullx-visitor-id=0xbf7b087aa117d47cb07af86f7766836912e093eb.90d4d20ed19aa5aad5a85c8981e57be256703c409986b37febe29d4fcb58380d; bullx-cs-token=VzNmBP-dxL9iE8_DPlFM6.70f8193cc89db3d768418fb483ce56b970e6e0f57c8e65668384ce9f113fa221; bullx-nonce-id=0O4dKZDqhdLjz6a-H_1l-8uDq7yE_WrZipH5uX6BZGR3wUmny04Nha_AZB5nmEnj; bullx-session-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIweGJmN2IwODdhYTExN2Q0N2NiMDdhZjg2Zjc3NjY4MzY5MTJlMDkzZWIiLCJpczJGQVZhbGlkYXRlZCI6dHJ1ZSwic2Vzc2lvbklkIjoiVnpObUJQLWR4TDlpRThfRFBsRk02Iiwic3Vic2NyaXB0aW9uUGxhbiI6IkJBU0lDIiwiaGFzaCI6Ijc2NmMyMjA1Zjg2MTY5ZWQzMmQ4Mzg2ODJmOTA5NmFlNjRkOTRjMzU4NTI5N2IyMDMyZWYzZjFkZjk1MmM1YTIiLCJoYXNoMiI6WyI3NjZjMjIwNWY4NjE2OWVkMzJkODM4NjgyZjkwOTZhZTY0ZDk0YzM1ODUyOTdiMjAzMmVmM2YxZGY5NTJjNWEyIl0sImlhdCI6MTczNzc1Mjc2MywiZXhwIjoyNzYzMTA0NTk3MDR9._y9nDhbOaPFGBTtZSuzzG3psBsbnyAByXlkOtokuoRs",
        "origin": "https://neo.bullx.io",
        "pragma": "no-cache",
        "priority": "u=1, i",
        "referer": "https://neo.bullx.io/",
        "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
        "x-cs-token": "VzNmBP-dxL9iE8_DPlFM6.70f8193cc89db3d768418fb483ce56b970e6e0f57c8e65668384ce9f113fa221"
    }

    data = {
        "name": "resolveTokensV2",
        "data": {
            "addresses": [f"{coin_id}"],
            "chainId": 1399811149
        }
    }

    response = requests.post(url, headers=headers, json=data)
    res_data = response.json()
    if coin_id in res_data['data']:
        links = res_data['data'].get(coin_id, {}).get('links', {})   
        socials = [
            ['Website:', links.get('website', 'Not found')],
            ['Twitter:', links.get('twitter', 'Not found')],
        ]
        print(type(socials))
        return socials
    return 'No links found on pumpfun'

@app.route("/")
def index() -> str:
    return "<p>Hello, World TESTING THE APP!</p>"


with app.test_request_context():
    print(url_for('index'))
    print(url_for('get_coin_meta', coin_id='John Doe'))
