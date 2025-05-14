function actualizarEstadoConexion() {
    const estado = document.getElementById("estadoConexion");
    if (navigator.onLine) {
        estado.textContent = "🟢 En línea";
        estado.style.color = "green";
        sincronizarPendientes();
    } else {
        estado.textContent = "🔴 Sin conexión - se guardarán localmente";
        estado.style.color = "red";
    }
}

function agregarFilaTabla(qr) {
    const tabla = document.getElementById("tabla-productos");
    const fila = tabla.insertRow(0);
    const ahora = new Date();
    fila.innerHTML = `
        <td>${qr}</td>
        <td>Producto desconocido</td>
        <td>${ahora.toISOString().split('T')[0]}</td>
        <td>${ahora.toLocaleTimeString()}</td>
    `;
}

function registrarCodigo(qr) {
    const producto = {
        qr: qr.trim()
    };

    if (navigator.onLine) {
        fetch("/api/registrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(producto)
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "registrado") {
                agregarFilaTabla(qr);
            } else if (data.status === "repetido") {
                alert("⚠️ Código ya registrado.");
            } else {
                guardarOffline(producto.qr);
            }
        })
        .catch(() => {
            guardarOffline(producto.qr);
        });
    } else {
        guardarOffline(producto.qr);
    }
}

function guardarOffline(qr) {
    let pendientes = JSON.parse(localStorage.getItem("pendientes") || "[]");

    // Evita duplicados locales
    if (!pendientes.includes(qr)) {
        pendientes.push(qr);
        localStorage.setItem("pendientes", JSON.stringify(pendientes));
        alert("🕓 Código guardado offline.");
        agregarFilaTabla(qr);
    } else {
        console.log("Código ya está en la cola offline.");
    }
}

function sincronizarPendientes() {
    let pendientes = JSON.parse(localStorage.getItem("pendientes") || "[]");
    if (pendientes.length === 0) return;

    let pendientesActualizados = [];

    pendientes.forEach(qr => {
        fetch("/api/registrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ qr })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "registrado") {
                agregarFilaTabla(qr);
                console.log("✅ Sincronizado:", qr);
            } else if (data.status === "repetido") {
                console.log("⚠️ Ya estaba registrado:", qr);
            } else {
                pendientesActualizados.push(qr);
            }

            // Si ya procesamos todos, actualizamos el localStorage
            if (qr === pendientes[pendientes.length - 1]) {
                localStorage.setItem("pendientes", JSON.stringify(pendientesActualizados));
                if (pendientesActualizados.length === 0) {
                    localStorage.removeItem("pendientes");
                    alert("✅ Registros offline sincronizados.");
                }
            }
        })
        .catch(() => {
            pendientesActualizados.push(qr);
        });
    });
}

document.addEventListener("DOMContentLoaded", function () {
    actualizarEstadoConexion();

    window.addEventListener("online", actualizarEstadoConexion);
    window.addEventListener("offline", actualizarEstadoConexion);

    const scanner = new Html5Qrcode("reader");
    const config = { fps: 10, qrbox: 250 };

    scanner.start(
        { facingMode: "environment" },
        config,
        qrCodeMessage => {
            registrarCodigo(qrCodeMessage);
        },
        errorMessage => {
            // console.warn("Escaneo fallido:", errorMessage);
        }
    ).catch(err => {
        document.getElementById("reader").innerText = "❌ No se pudo iniciar la cámara.";
        console.error("Error cámara:", err);
    });
});
