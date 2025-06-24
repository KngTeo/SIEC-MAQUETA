// dashboard.js

// Llamar API para contar empleados
fetch('http://localhost:3000/api/empleados')
  .then(res => res.json())
  .then(data => {
    document.getElementById('empleadosCount').textContent = data.length;
  })
  .catch(err => {
    console.error('Error al contar empleados:', err);
  });

// Llamar API para contar equipos y clasificar por estado
fetch('http://localhost:3000/api/equipos')
  .then(res => res.json())
  .then(data => {
    document.getElementById('equiposCount').textContent = data.length;

    const estadoConteo = {
      Activo: 0,
      Inactivo: 0,
      Reparación: 0,
      Baja: 0
    };

    data.forEach(e => {
      if (estadoConteo[e.Estado]) {
        estadoConteo[e.Estado]++;
      }
    });

    document.getElementById('reparacionCount').textContent = estadoConteo['Reparación'] || 0;

    // Crear gráfico
    const ctx = document.getElementById('estadoChart').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(estadoConteo),
        datasets: [{
          label: 'Estados',
          data: Object.values(estadoConteo),
          backgroundColor: [
            '#28a745', // Activo
            '#6c757d', // Inactivo
            '#ffc107', // Reparación
            '#dc3545'  // Baja
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  })
  .catch(err => {
    console.error('Error al contar equipos:', err);
  });
