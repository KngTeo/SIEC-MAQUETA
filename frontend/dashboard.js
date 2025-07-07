// dashboard.js

// 1) Contar empleados
fetch('http://localhost:3000/api/empleados')
  .then(res => res.json())
  .then(data => {
    document.getElementById('empleadosCount').textContent = data.length;
  })
  .catch(err => {
    console.error('Error al contar empleados:', err);
  });

// 2) Contar equipos y clasificar por estado
fetch('http://localhost:3000/api/equipos')
  .then(res => res.json())
  .then(data => {
    // Total de equipos
    document.getElementById('equiposCount').textContent = data.length;

    // Función auxiliar para normalizar estados
    const normalizeEstado = raw => {
      const e = raw.trim().toLowerCase();
      if (e.includes('repar'))       return 'Reparación';
      if (e === 'activo')            return 'Activo';
      if (e === 'inactivo')          return 'Inactivo';
      if (e === 'baja')              return 'Baja';
      return raw; // cualquier otro tal cual
    };

    // Conteo dinámico
    const estadoConteo = {};
    data.forEach(eqp => {
      const key = normalizeEstado(eqp.Estado);
      estadoConteo[key] = (estadoConteo[key] || 0) + 1;
    });

    // Actualizar contador específico
    document.getElementById('reparacionCount').textContent =
      estadoConteo['Reparación'] || 0;

    // 3) Gráfico dinámico
    const labels = Object.keys(estadoConteo);
    const values = labels.map(l => estadoConteo[l]);

    const ctx = document.getElementById('estadoChart').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: [
            '#28a745', // Activo
            '#6c757d', // Inactivo
            '#ffc107', // Reparación
            '#dc3545'  // Baja
          ].slice(0, labels.length) // sólo tantos colores como etiquetas
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  })
  .catch(err => {
    console.error('Error al contar equipos:', err);
  });
