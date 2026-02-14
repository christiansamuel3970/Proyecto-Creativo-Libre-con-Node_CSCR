require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const db = require('./config/database');
const weatherRoutes = require('./routes/weather');
const alertRoutes = require('./routes/alerts');
const weatherService = require('./services/weatherService');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Inicializar base de datos
db.initialize();

// Rutas
app.use('/api/weather', weatherRoutes);
app.use('/api/alerts', alertRoutes);

// WebSocket para actualizaciones en tiempo real
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Actualizar datos cada 10 minutos
setInterval(async () => {
  const cities = (process.env.CITIES || '').split(',').map((city) => city.trim()).filter(Boolean);
  if (!cities.length) return;

  for (const city of cities) {
    try {
      const data = await weatherService.fetchWeather(city);
      if (!data) continue;
      db.saveWeather(data);
      io.emit('weather-update', data);
    } catch (error) {
      console.error(`No se pudo actualizar clima para ${city}:`, error.message);
    }
  }
}, 600000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🌤️ Weather Hub ejecutándose en puerto ${PORT}`);
});

module.exports = { io };
