// informes.js
document.addEventListener('DOMContentLoaded', () => {
  const form   = document.getElementById('formInforme');
  const header = document.getElementById('informeHeader');
  const body   = document.getElementById('informeBody');

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const tipo  = document.getElementById('tipoInforme').value;
    const start = document.getElementById('fechaInicio').value;
    const end   = document.getElementById('fechaFin').value;

    if (!tipo) return alert('Seleccione un tipo de informe.');

    // Construir URL con query params
    let url = `http://localhost:3000/api/informes/${tipo}`;
    const q   = new URLSearchParams();
    if (start) q.append('start', start);
    if (end)   q.append('end',   end);
    if ([...q].length) url += `?${q.toString()}`;

    try {
      const res  = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Limpiar tabla
      header.innerHTML = '';
      body.innerHTML   = '';

      if (!data.length) {
        header.innerHTML = '<tr><th colspan="10">No hay datos para mostrar</th></tr>';
        return;
      }

      // Cabecera dinámica
      const cols = Object.keys(data[0]);
      header.innerHTML = '<tr>' + cols.map(c => `<th>${c}</th>`).join('') + '</tr>';

      // Filas
      data.forEach(row => {
        const tr = document.createElement('tr');
        cols.forEach(c => {
          const td = document.createElement('td');
          td.textContent = row[c];
          tr.appendChild(td);
        });
        body.appendChild(tr);
      });

    } catch (err) {
      console.error('Error al generar informe:', err);
      alert('Error al generar informe.');
    }
  });
});

