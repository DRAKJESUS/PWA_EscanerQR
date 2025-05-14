# 📱 Escáner QR - Inventario Offline (PWA)

Este es un sistema de escaneo de códigos QR hecho con **Flask + MongoDB**, que funciona incluso **sin conexión a Internet**, gracias a su implementación como **PWA (Progressive Web App)**. Perfecto para llevar control de productos en inventario desde el navegador del celular o PC.

---

## 🚀 Características principales

- 📷 Escaneo de códigos QR en tiempo real
- 💾 Guarda productos incluso si no hay internet (modo **offline**)
- 🔁 Sincroniza automáticamente los registros cuando regresa la conexión
- 🧾 Tabla en vivo con los productos escaneados
- 👤 Sistema de login
- 📦 Base de datos MongoDB para persistencia
- ⚙️ Dockerizado para ejecución simple
- 🧭 Funciona como una aplicación móvil instalable (PWA)

---

## 🛠️ Tecnologías usadas

- Python 3.10
- Flask
- MongoDB
- HTML5 + CSS3 + JS
- html5-qrcode.js (lector de cámara)
- Service Workers + Manifest.json (para PWA)
- Docker y Docker Compose

---

## 🐳 Cómo correr con Docker

```bash
docker-compose up --build
```

- Backend: http://127.0.0.1:5001
- MongoDB: http://localhost:27017

---

## 🔐 Usuario de prueba

| Usuario | Contraseña |
|--------|-------------|
| admin  | admin123    |

---

## 📦 Estructura del proyecto

```
Escaneo Qr/
│
├── app.py                 # Backend Flask
├── requirements.txt       # Dependencias
├── Dockerfile
├── docker-compose.yml
│
├── templates/
│   └── index.html         # Página principal
│   └── login.html         # Login
│
├── static/
│   ├── styles.css
│   ├── manifest.json      # PWA
│   ├── sw.js              # Service Worker
│   └── js/
│       ├── scanner.js     # Código de escaneo + offline
│       └── html5-qrcode.min.js
```

---

## 🧠 Funcionalidad Offline

- Si el dispositivo **no tiene internet**, el código QR se guarda en `localStorage`
- Al reconectarse, esos datos se **sincronizan automáticamente** a MongoDB
- Todo esto lo maneja `scanner.js` con ayuda del Service Worker

---

## 📲 Cómo instalar como App

1. Abre la app desde el navegador (Chrome/Edge/Android)
2. Verás la opción **"Agregar a pantalla de inicio"**
3. Ahora puedes usarla **como si fuera una app nativa**

---


