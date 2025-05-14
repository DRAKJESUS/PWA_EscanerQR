// static/js/sync.js

window.addEventListener("load", () => {
    const estado = document.getElementById("estado-conexion");
  
    // Muestra el estado actual
    function actualizarEstado() {
      if (navigator.onLine) {
        estado.innerHTML = '<span style="color:green">🟢 En línea</span>';
        sincronizarPendientes();
      } else {
        estado.innerHTML = '<span style="color:red">🔴 Sin conexión</span>';
      }
    }
  
    window.addEventListener("online", actualizarEstado);
    window.addEventListener("offline", actualizarEstado);
  
    actualizarEstado(); // al cargar
  
    // Guarda localmente si no hay conexión
    window.guardarLocalmente = function (qr) {
      let pendientes = JSON.parse(localStorage.getItem("pendientes")) || [];
      pendientes.push({ qr, fecha: new Date().toISOString() });
      localStorage.setItem("pendientes", JSON.stringify(pendientes));
      console.warn("Guardado localmente:", qr);
    };
  
    // Sincroniza registros locales con el backend
    function sincronizarPendientes() {
      const pendientes = JSON.parse(localStorage.getItem("pendientes")) || [];
      if (!pendientes.length) return;
  
      console.log("🔁 Sincronizando registros locales...");
  
      pendientes.forEach((item, index) => {
        fetch("/api/registrar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ qr: item.qr }),
        })
          .then(res => res.json())
          .then(data => {
            console.log("✔️ Sincronizado:", item.qr);
            pendientes.splice(index, 1);
            localStorage.setItem("pendientes", JSON.stringify(pendientes));
            agregarFila(item.qr); // actualiza tabla
          })
          .catch(err => {
            console.error("❌ Error al sincronizar:", err);
          });
      });
    }
  
    // Agrega fila nueva a la tabla sin recargar
    window.agregarFila = function (qr) {
      const tabla = document.getElementById("tabla-productos");
      const ahora = new Date();
      const nuevaFila = `
        <tr>
          <td>${qr}</td>
          <td>Producto desconocido</td>
          <td>${ahora.toISOString().split("T")[0]}</td>
          <td>${ahora.toTimeString().split(" ")[0]}</td>
        </tr>
      `;
      tabla.innerHTML += nuevaFila;
    };
  });
  