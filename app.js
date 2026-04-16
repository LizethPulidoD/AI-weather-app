const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 🔹 Función para validar y limpiar input
function validateCityInput(input) {
  if (typeof input !== "string") {
    throw new Error("La ciudad debe ser un texto");
  }

  const cleaned = input.trim();

  if (cleaned.length === 0) {
    throw new Error("Debes ingresar un nombre de ciudad válido");
  }

  // ❌ Solo números (ej: "123")
  if (/^\d+$/.test(cleaned)) {
    throw new Error("La ciudad no puede ser solo números");
  }

  // ❌ No contiene letras (ej: "@@@", "123")
  if (!/[a-zA-Z]/.test(cleaned)) {
    throw new Error("La ciudad debe contener letras");
  }

  return cleaned;
}

async function getWeatherByCity(cityInput) {
  try {
    // ✅ Validar y limpiar input
    const city = validateCityInput(cityInput);

    // 1. Geocoding
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok) {
      throw new Error("Error al consultar la API de geocodificación");
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("Ciudad no encontrada");
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2. Clima
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error("Error al consultar la API del clima");
    }

    const weatherData = await weatherResponse.json();
    const current = weatherData.current_weather;

    if (!current) {
      throw new Error("No se pudo obtener el clima actual");
    }

    const weatherDescriptions = {
      0: "Despejado",
      1: "Mayormente despejado",
      2: "Parcialmente nublado",
      3: "Nublado",
      61: "Lluvia ligera",
      63: "Lluvia moderada",
      80: "Chubascos",
      95: "Tormenta"
    };

    return {
      city: `${name}, ${country}`,
      temperature: current.temperature,
      description:
        weatherDescriptions[current.weathercode] || "Condición desconocida"
    };

  } catch (error) {
    return {
      error: true,
      message: error.message
    };
  }
}

// 👇 Entrada del usuario
rl.question("🌍 Ingresa el nombre de una ciudad: ", async (city) => {
  const result = await getWeatherByCity(city);

  if (result.error) {
    console.log("❌ Error:", result.message);
  } else {
    console.log(`\n📍 Clima en ${result.city}`);
    console.log(`🌡️ Temperatura: ${result.temperature}°C`);
    console.log(`🌤️ Estado: ${result.description}`);
  }

  rl.close();
});