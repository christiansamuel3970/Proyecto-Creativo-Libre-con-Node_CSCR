const db = require('../config/database');
const emailService = require('./emailService');

const checkAlerts = async (weatherData) => {
  const alerts = await db.getAlerts(weatherData.city);
  const triggeredAlerts = [];

  for (const alert of alerts) {
    let triggered = false;

    switch (alert.condition) {
      case 'temperature_below':
        triggered = weatherData.temperature < alert.threshold;
        break;
      case 'temperature_above':
        triggered = weatherData.temperature > alert.threshold;
        break;
      case 'humidity_above':
        triggered = weatherData.humidity > alert.threshold;
        break;
      case 'wind_speed':
        triggered = weatherData.windSpeed > alert.threshold;
        break;
    }

    if (triggered) {
      triggeredAlerts.push(alert);
      // Enviar notificación por email
      await emailService.sendAlert(weatherData, alert);
    }
  }

  return triggeredAlerts;
};

module.exports = {
  checkAlerts
};
