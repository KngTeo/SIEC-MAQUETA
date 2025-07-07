// acta_perifericos.js
// Autocompletar datos de empleado y equipo en ActaEntrega y Renting
$(function() {
  const API = 'http://localhost:3000';

// ...

$('#cedula').on('blur', function() {
  const ced = $(this).val().trim();
  if (!ced) return;
  $.getJSON(`${API}/api/empleados/cedula/${ced}`)
    .done(emp => {
      $('#empresa').val(emp.Empresa);
      $('#area').val(emp.Area);
      $('#nombre').val(emp.Nombre);
      $('#cargo').val(emp.Cargo);
    })
    .fail(() => alert('Empleado no encontrado'));
});


  // Autocompletar datos del equipo al perder foco en el campo Serial (ID Equipo)
  $('#id-equipo, #idEquipo, #serialR').on('blur', function() {
    const serial = $(this).val().trim();
    if (!serial) return;
    $.getJSON(`${API}/api/equipos/serial/${serial}`)
      .done(eq => {
        // Detectar qué formulario estamos en base al ID existente
        if ($('#tipo-equipo').length) {
          // ActaEntrega.html
          $('#tipo-equipo').val(eq.TipoEquipo);
          $('#sistema-operativo').val(eq.sistema);
          $('#marca').val(eq.Marca);
          $('#board').val(eq.Modelo);
          $('#tipo-disco').val(eq.tipoDisco);
          $('#tamano-disco').val(eq.tamanoDisco);
          $('#dir-mac').val(eq.mac);
          $('#memoria-ram').val(eq.memoria);
          $('#procesador').val(eq.procesador);
        }
        if ($('#tipoEquipo').length) {
          // ActaEntregaRenting.html
          $('#tipoEquipo').val(eq.TipoEquipo);
          $('#modeloR').val(eq.Modelo);
          $('#marcaR').val(eq.Marca);
        }
      })
      .fail((jq, status, err) => {
        console.warn('Equipo lookup failed:', status, err);
        alert('Equipo no encontrado');
      });
  });
});
