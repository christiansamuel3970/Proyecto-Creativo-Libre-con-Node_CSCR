const axios = require('axios');

const OPENWEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';

const fetchWeather = async (city) => {
  try {
    if (!process.env.OPENWEATHER_API_KEY) {
      throw new Error('Falta configurar OPENWEATHER_API_KEY en el archivo .env');
    }

    const response = await axios.get(OPENWEATHER_URL, {
      params: {
        q: city,
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });

    const { main, weather, wind } = response.data;

    return {
      city: city,
      temperature: main.temp,
      humidity: main.humidity,
      pressure: main.pressure,
      description: weather[0].description,
      windSpeed: wind.speed,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error(`Ciudad no encontrada: ${city}`);
    }

    if (error.response && error.response.status === 401) {
      throw new Error('API key inválida de OpenWeather. Revisa OPENWEATHER_API_KEY');
    }

    throw new Error(`No se pudo obtener el clima para ${city}`);
  }
};

// Obtener pronóstico de tendencias
const getTrend = (history) => {
  if (history.length < 2) return 'stable';
  
  const recent = history[0].temperature;
  const previous = history[1].temperature;
  
  if (recent > previous) return 'rising';
  if (recent < previous) return 'falling';
  return 'stable';
};

module.exports = {
  fetchWeather,
  getTrend
};
