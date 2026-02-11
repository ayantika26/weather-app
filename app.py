from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

# 🔑 OpenWeather API key
API_KEY = "364e0e6679c0c57cd5bec26585c40f55"

# 🌍 Current weather API
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

# 🌦 5-day forecast API
FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"


# 🏠 Home route (loads page)
@app.route("/")
def home():
    return render_template("index.html")


# 🌤 Weather API route (THIS IS THE ONE YOU ASKED ABOUT)
@app.route("/weather", methods=["GET"])
def get_weather():
    city = request.args.get("city")

    if not city:
        return jsonify({"error": "City is required"})

    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric"
    }

    # Current weather
    response = requests.get(BASE_URL, params=params)
    data = response.json()

    # 5-day forecast
    forecast_res = requests.get(FORECAST_URL, params=params).json()

    days = []
    temps = []

    for item in forecast_res["list"]:
        if "12:00:00" in item["dt_txt"]:
            days.append(item["dt_txt"].split(" ")[0])
            temps.append(item["main"]["temp"])

    return jsonify({
        "city": city,
        "temperature": round(data["main"]["temp"], 1),
        "condition": data["weather"][0]["description"],
        "humidity": data["main"]["humidity"],
        "wind": data["wind"]["speed"],
        "forecast": {
            "days": days,
            "temps": temps
        }
    })


# ▶️ Run the app (ALWAYS AT BOTTOM)
if __name__ == "__main__":
    app.run(debug=True)
