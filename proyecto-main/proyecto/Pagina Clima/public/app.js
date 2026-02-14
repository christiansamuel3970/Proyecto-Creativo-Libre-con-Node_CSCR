const API_BASE = (() => {
  if (window.location.protocol === 'file:') return 'http://localhost:3000';
  if (window.location.hostname === 'localhost' && window.location.port && window.location.port !== '3000') {
    return 'http://localhost:3000';
  }
  return '';
})();

const socket = io(API_BASE || undefined);
let currentCity = 'Madrid';
let temperatureChart = null;

const apiFetch = async (path, options) => {
  try {
    return await fetch(`${API_BASE}${path}`, options);
  } catch (error) {
    throw new Error('No se pudo conectar al servidor. Verifica que esté ejecutándose en http://localhost:3000');
  }
};

socket.on('weather-update', (data) => {
  if (data.city === currentCity) {
    updateWeatherUI(data);
  }
});

const conditionLabels = {
  temperature_below: 'Temperatura baja',
  temperature_above: 'Temperatura alta',
  humidity_above: 'Humedad alta',
  wind_speed: 'Viento fuerte'
};

const searchWeather = async () => {
  const cityInput = document.getElementById('cityInput');
  const city = (cityInput.value || currentCity).trim();
  if (!city) return;

  currentCity = city;

  try {
    const response = await apiFetch(`/api/weather/current/${encodeURIComponent(city)}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'No se pudo obtener el clima de la ciudad');
    }
    const data = await response.json();
    updateWeatherUI(data);
    loadWeatherHistory(city);
    loadAlerts(city);
    cityInput.value = '';
  } catch (error) {
    alert(error.message || 'Error al buscar la ciudad');
  }
};

const updateWeatherUI = (data) => {
  document.getElementById('cityName').textContent = data.city;
  document.getElementById('temperature').textContent = Math.round(data.temperature);
  document.getElementById('description').textContent = data.description;
  document.getElementById('humidity').textContent = data.humidity;
  document.getElementById('windSpeed').textContent = Math.round(data.windSpeed * 3.6);
};

const loadWeatherHistory = async (city) => {
  try {
    const response = await apiFetch(`/api/weather/history/${encodeURIComponent(city)}`);
    if (!response.ok) {
      return;
    }
    const history = await response.json();
    updateChart(history);
  } catch (error) {
    console.error('Error cargando historial:', error);
  }
};

const updateChart = (history) => {
  const labels = history.reverse().map((h) => new Date(h.timestamp).toLocaleTimeString());
  const temps = history.map((h) => h.temperature);

  const ctx = document.getElementById('temperatureChart').getContext('2d');

  if (temperatureChart) {
    temperatureChart.destroy();
  }

  temperatureChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Temperatura (C)',
        data: temps,
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.15)',
        borderWidth: 3,
        tension: 0.35,
        fill: true,
        pointRadius: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: {
            maxTicksLimit: 8,
            color: '#5b6678'
          },
          grid: {
            display: false
          }
        },
        y: {
          ticks: {
            color: '#5b6678'
          },
          grid: {
            color: 'rgba(91, 102, 120, 0.12)'
          }
        }
      }
    }
  });
};

const createAlert = async () => {
  const condition = document.getElementById('conditionSelect').value;
  const thresholdInput = document.getElementById('thresholdInput');
  const threshold = thresholdInput.value;
  const numericThreshold = Number(threshold);

  if (!Number.isFinite(numericThreshold)) {
    alert('Ingresa un valor numérico válido para la alerta');
    return;
  }

  try {
    const response = await apiFetch(`/api/alerts/${encodeURIComponent(currentCity)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ condition, threshold: numericThreshold })
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'No se pudo crear la alerta');
    }
    loadAlerts(currentCity);
    thresholdInput.value = '';
  } catch (error) {
    alert(error.message || 'Error creando alerta');
  }
};

const loadAlerts = async (city) => {
  try {
    const response = await apiFetch(`/api/alerts/${encodeURIComponent(city)}`);
    if (!response.ok) {
      return;
    }
    const alerts = await response.json();
    const alertsList = document.getElementById('alertsList');

    if (!alerts.length) {
      alertsList.innerHTML = '<p class="alert-empty">No hay alertas activas para esta ciudad.</p>';
      return;
    }

    alertsList.innerHTML = alerts
      .map((alert) => `
        <article class="alert-row">
          <span>${conditionLabels[alert.condition] || alert.condition}</span>
          <strong>${alert.threshold}</strong>
        </article>
      `)
      .join('');
  } catch (error) {
    console.error('Error cargando alertas:', error);
  }
};

window.addEventListener('load', searchWeather);
