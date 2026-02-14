const express = require('express');
const router = express.Router();
const db = require('../config/database');
const weatherService = require('../services/weatherService');

router.get('/current/:city', async (req, res) => {
  try {
    const data = await weatherService.fetchWeather(req.params.city);
    if (!data) {
      return res.status(404).json({ error: `No se encontró clima para ${req.params.city}` });
    }
    res.json(data);
  } catch (error) {
    const isNotFound = error.message && error.message.includes('Ciudad no encontrada');
    res.status(isNotFound ? 404 : 500).json({ error: error.message });
  }
});

router.get('/history/:city', async (req, res) => {
  try {
    const history = await db.getWeatherHistory(req.params.city);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
