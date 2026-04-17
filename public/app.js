async function getWeather() {
  const city = document.getElementById("city").value;
  const type = document.getElementById("type").value;
  const resultDiv = document.getElementById("result");

  resultDiv.innerHTML = "Cargando...";

  try {
    const response = await fetch(
      `/api/weather?city=${encodeURIComponent(city)}&type=${type}`
    );

    const data = await response.json();

    if (data.error) {
      resultDiv.innerHTML = `❌ ${data.message}`;
      return;
    }

    // Clima actual
    if (data.type === "current") {
      resultDiv.innerHTML = `
        <h3>${data.city}</h3>
        <p>🌡️ ${data.temperature}°C</p>
        <p>🌤️ ${data.description}</p>
      `;
    }

    // Pronóstico
    if (data.type === "forecast") {
      resultDiv.innerHTML = `<h3>${data.city}</h3>`;

      data.forecast.forEach(day => {
        resultDiv.innerHTML += `
          <div>
            <p><strong>${day.date}</strong></p>
            <p>🌡️ Max: ${day.max}°C / Min: ${day.min}°C</p>
            <p>🌤️ ${day.description}</p>
          </div>
          <hr/>
        `;
      });
    }

  } catch (error) {
    resultDiv.innerHTML = "❌ Error de conexión";
  }
}