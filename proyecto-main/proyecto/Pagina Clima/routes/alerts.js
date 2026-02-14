const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.post('/:city', async (req, res) => {
  const { condition, threshold } = req.body;
  try {
    const validConditions = ['temperature_below', 'temperature_above', 'humidity_above', 'wind_speed'];
    const numericThreshold = Number(threshold);

    if (!validConditions.includes(condition)) {
      return res.status(400).json({ error: 'Condición de alerta inválida' });
    }

    if (!Number.isFinite(numericThreshold)) {
      return res.status(400).json({ error: 'El umbral debe ser numérico' });
    }

    await db.createAlert(req.params.city, condition, numericThreshold);
    res.json({ message: 'Alerta creada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:city', async (req, res) => {
  try {
    const alerts = await db.getAlerts(req.params.city);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
