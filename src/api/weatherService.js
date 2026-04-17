const fetchJson = require("../utils/fetchJson");
const validateCityInput = require("../utils/validateCity");
const { WEATHER_DESCRIPTIONS } = require("../config/constants");

/**
 * Obtiene el clima de una ciudad usando Open-Meteo.
 * 
 * @param {string} cityInput - Nombre de la ciudad
 * @param {string} type - "current" o "forecast"
 * @returns {Object} Datos del clima o error
 */
async function getWeatherByCity(cityInput, type = "current") {
  
  try {
    const city = validateCityInput(cityInput);

    // 🔹 Geocoding
    const geoData = await fetchJson(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`,
      "Error al consultar geocodificación"
    );

    if (!geoData.results?.length) {
      throw new Error("Ciudad no encontrada");
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 🔹 CLIMA ACTUAL
    if (type === "current") {
      const weatherData = await fetchJson(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
        "Error al consultar el clima"
      );

      const current = weatherData.current_weather;

      if (!current) {
        throw new Error("No se pudo obtener el clima actual");
      }

      return {
        type: "current",
        city: `${name}, ${country}`,
        temperature: current.temperature,
        description:
          WEATHER_DESCRIPTIONS[current.weathercode] ??
          "Condición desconocida"
      };
    }

    // 🔹 PRONÓSTICO 5 DÍAS
    if (type === "forecast") {
      const forecastData = await fetchJson(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`,
        "Error al consultar el pronóstico"
      );

      const daily = forecastData.daily;

      if (!daily) {
        throw new Error("No se pudo obtener el pronóstico");
      }

      // Tomar solo 5 días
      const forecast = daily.time.slice(0, 5).map((date, i) => ({
        date,
        max: daily.temperature_2m_max[i],
        min: daily.temperature_2m_min[i],
        description:
          WEATHER_DESCRIPTIONS[daily.weathercode[i]] ??
          "Condición desconocida"
      }));

      return {
        type: "forecast",
        city: `${name}, ${country}`,
        forecast
      };
    }

    throw new Error("Tipo de consulta inválido");

  } catch (error) {
    return {
      error: true,
      message: error.message
    };
  }
}
module.exports = { getWeatherByCity };
