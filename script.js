function getWeather() {
    const city = document.getElementById("cityInput").value;
    const result = document.getElementById("weatherResult");

    if (city === "") {
        result.innerHTML = "<p>Please enter a city name</p>";
        return;
    }

    result.innerHTML = "<p>Loading weather...</p>";

    fetch(`/weather?city=${city}`)
        .then(response => response.json())
        .then(data => {

            if (data.error) {
                result.innerHTML = `<p>${data.error}</p>`;
                return;
            }

            // 🌤 Weather emoji logic
            let emoji = "🌤";
            const condition = data.condition.toLowerCase();

            if (condition.includes("rain")) emoji = "🌧";
            else if (condition.includes("cloud")) emoji = "☁️";
            else if (condition.includes("clear")) emoji = "☀️";
            else if (condition.includes("snow")) emoji = "❄️";
            else if (condition.includes("thunder")) emoji = "⛈";

            // ⚠️ Smart weather alert
            let alertMsg = "😊 Weather looks good today!";
            if (data.temperature > 35) alertMsg = "🔥 Heatwave alert! Stay hydrated.";
            else if (data.temperature < 10) alertMsg = "❄️ Cold weather alert! Wear warm clothes.";
            else if (condition.includes("rain")) alertMsg = "🌧 Rain expected. Carry an umbrella.";

            // 🖥 Display data
            result.innerHTML = `
                <h2>${emoji} ${data.city}</h2>
                <p>🌡 Temperature: ${data.temperature} °C</p>
                <p>${emoji} Condition: ${data.condition}</p>
                <p>💧 Humidity: ${data.humidity}%</p>
                <p>💨 Wind Speed: ${data.wind} m/s</p>
                <p><b>${alertMsg}</b></p>

                <canvas id="chart" width="280" height="200"></canvas>
            `;

            drawChart(data.forecast.days, data.forecast.temps);
        })
        .catch(error => {
            result.innerHTML = "<p>Error fetching weather data</p>";
            console.error(error);
        });
}


// 📊 5-Day Forecast Chart
function drawChart(days, temps) {
    const ctx = document.getElementById("chart").getContext("2d");

    new Chart(ctx, {
        type: "line",
        data: {
            // show only date number (no month/year)
            labels: days.map(d => d.split("-")[2]),
            datasets: [{
                data: temps,
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Date"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Temperature (°C)"
                    }
                }
            }
        }
    });
}


