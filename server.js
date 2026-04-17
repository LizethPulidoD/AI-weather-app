const express = require("express");
const path = require("path");
const { getWeatherByCity } = require("./src/api/weatherService");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

// Endpoint API
app.get("/api/weather", async (req, res) => {
  const { city, type } = req.query;

  const result = await getWeatherByCity(city, type);

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});