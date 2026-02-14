# 🌤️ Pagina Clima

Un dashboard meteorológico inteligente construido con **Node.js** que proporciona datos en tiempo real, análisis de tendencias y un sistema de alertas personalizadas.

## 🎯 Características

- **Dashboard interactivo** con actualizaciones en tiempo real mediante WebSocket
- **Datos meteorológicos** de múltiples ciudades (temperatura, humedad, presión, viento)
- **Sistema de alertas** personalizables (temperatura alta/baja, humedad, viento fuerte)
- **Gráficos históricos** de tendencias de temperatura
- **Base de datos SQLite** para almacenamiento persistente
- **Notificaciones por email** cuando se activan alertas

## 🛠️ Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **Socket.io** - Comunicación en tiempo real
- **SQLite3** - Base de datos
- **Chart.js** - Gráficos interactivos
- **Axios** - Cliente HTTP
- **OpenWeatherMap API** - Datos meteorológicos

## 📋 Requisitos

- Node.js 14+
- npm o yarn
- Clave API de [OpenWeatherMap](https://openweathermap.org/api)

## ⚙️ Instalación

```bash
# Clonar o descargar el proyecto
cd weather-intelligence-hub

# Instalar dependencias
npm install

# Crear archivo .env con tus credenciales
echo "OPENWEATHER_API_KEY=tu_clave_aqui" > .env
echo "PORT=3000" >> .env
echo "CITIES=Madrid,Barcelona,Valencia" >> .env
```

## 🚀 Uso

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

Abre `http://localhost:3000` en tu navegador.

## 📊 Ejemplos de Uso

### Buscar clima de una ciudad
```javascript
GET /api/weather/current/Madrid
```

### Obtener historial
```javascript
GET /api/weather/history/Madrid
```

### Crear alerta
```javascript
POST /api/alerts/Madrid
{
  "condition": "temperature_above",
  "threshold": 30
}
```

### Ver alertas activas
```javascript
GET /api/alerts/Madrid
```

## 📁 Estructura del Proyecto


