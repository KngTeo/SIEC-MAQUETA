// Crear equipo
$('#equipmentForm').submit(function (e) {
  e.preventDefault();

  const equipo = {
    empresa         : $('#empresa').val(),
    numeroSerie     : $('#numserie').val(),
    tipoEquipo      : $('#tipoEquipo').val(),
    modelo          : $('#modelo').val(),
    marca           : $('#marca').val(),
    procesador      : $('#procesador').val(),
    ram             : $('#ram').val(),
    tipoDisco       : $('#tipodisco').val(),
    tamanioDisco    : $('#tamañodisco').val(),
    mac             : $('#mac').val(),
    sistemaOperativo: $('#os').val(),
    office          : $('#office').val(),
    antivirus       : $('#antivirus').val(),
    estado          : $('#estado').val(),
    usuarioEquipo   : $('#usuario').val(),
    contrasenaEquipo: $('#contrasena').val(),
    observacion     : $('#observacion').val()
  };

  fetch('http://localhost:3000/api/equipos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(equipo)
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);

      $('#equipmentTableBody').prepend(`
        <tr data-id="${data.equipoId}">
          <td>${data.equipoId}</td>
          <td>${equipo.empresa}</td>
          <td>${equipo.numeroSerie}</td>
          <td>${equipo.tipoEquipo}</td>
          <td>${equipo.modelo}</td>
          <td>${equipo.marca}</td>
          <td>${equipo.procesador}</td>
          <td>${equipo.ram}</td>
          <td>${equipo.tipoDisco} ${equipo.tamanioDisco}</td>
          <td>${equipo.mac}</td>
          <td>${equipo.sistemaOperativo}</td>
          <td>${equipo.office}</td>
          <td>${equipo.antivirus}</td>
          <td>${equipo.estado}</td>
          <td>${equipo.usuarioEquipo}</td>
          <td>${equipo.contrasenaEquipo}</td>
          <td>${equipo.observacion}</td>
          <td>
            <button class="btn btn-warning btn-sm btn-editar">Editar</button>
            <button class="btn btn-danger  btn-sm btn-eliminar">Eliminar</button>
          </td>
        </tr>
      `);

      $('#equipmentForm')[0].reset();
    })
    .catch(err => {
      console.error('Error al registrar equipo:', err);
      alert('Error al agregar equipo.');
    });
});

// Cargar equipos existentes
$(document).ready(function () {
  fetch('http://localhost:3000/api/equipos')
    .then(res => res.json())
    .then(data => {
      data.forEach(eq => {
        $('#equipmentTableBody').append(`
          <tr data-id="${eq.EquipoID}">
            <td>${eq.EquipoID}</td>
            <td>${eq.Empresa}</td>
            <td>${eq.NumeroSerie}</td>
            <td>${eq.TipoEquipo}</td>
            <td>${eq.Modelo}</td>
            <td>${eq.Marca}</td>
            <td>${eq.Procesador}</td>
            <td>${eq.RAM}</td>
            <td>${eq.TipoDisco} ${eq.TamanioDisco}</td>
            <td>${eq.Mac}</td>
            <td>${eq.SistemaOperativo}</td>
            <td>${eq.Office}</td>
            <td>${eq.Antivirus}</td>
            <td>${eq.Estado}</td>
            <td>${eq.Usuario}</td>
            <td>${eq.Contrasena}</td>
            <td>${eq.Observacion}</td>
            <td>
              <button class="btn btn-warning btn-sm btn-editar">Editar</button>
              <button class="btn btn-danger  btn-sm btn-eliminar">Eliminar</button>
            </td>
          </tr>
        `);
      });
    })
    .catch(err => {
      console.error('Error al cargar equipos:', err);
      alert('No se pudieron cargar los equipos');
    });
});

// Eliminar equipo
$(document).on('click', '.btn-eliminar', function () {
  const row = $(this).closest('tr');
  const id = row.data('id');

  if (confirm('¿Eliminar este equipo?')) {
    fetch(`http://localhost:3000/api/equipos/${id}`, { method: 'DELETE' })
      .then(r => r.json())
      .then(d => {
        alert(d.message);
        row.remove();
      })
      .catch(err => {
        console.error('Error al eliminar:', err);
        alert('No se pudo eliminar.');
      });
  }
});

// Editar equipo
$(document).on('click', '.btn-editar', function () {
  const row = $(this).closest('tr');
  const id = row.data('id');

  const empresa         = prompt('Empresa:', row.children().eq(1).text());
  const numeroSerie     = prompt('Serial:', row.children().eq(2).text());
  const tipoEquipo      = prompt('Tipo:', row.children().eq(3).text());
  const modelo          = prompt('Modelo:', row.children().eq(4).text());
  const marca           = prompt('Marca:', row.children().eq(5).text());
  const procesador      = prompt('Procesador:', row.children().eq(6).text());
  const ram             = prompt('RAM:', row.children().eq(7).text());
  const tipoDisco       = prompt('Tipo Disco:', row.children().eq(8).text().split(' ')[0]);
  const tamanioDisco    = prompt('Tamaño Disco:', row.children().eq(8).text().split(' ')[1]);
  const mac             = prompt('MAC:', row.children().eq(9).text());
  const sistemaOperativo= prompt('Sistema Operativo:', row.children().eq(10).text());
  const office          = prompt('Office:', row.children().eq(11).text());
  const antivirus       = prompt('Antivirus:', row.children().eq(12).text());
  const estado          = prompt('Estado:', row.children().eq(13).text());
  const usuarioEquipo   = prompt('Usuario:', row.children().eq(14).text());
  const contrasenaEquipo= prompt('Contraseña:', row.children().eq(15).text());
  const observacion     = prompt('Observación:', row.children().eq(16).text());

  const actualizado = {
    empresa, numeroSerie, tipoEquipo, modelo, marca,
    procesador, ram, tipoDisco, tamanioDisco, mac,
    sistemaOperativo, office, antivirus, estado,
    usuarioEquipo, contrasenaEquipo, observacion
  };

  fetch(`http://localhost:3000/api/equipos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(actualizado)
  })
    .then(r => r.json())
    .then(data => {
      alert(data.message);
      row.children().eq(1).text(empresa);
      row.children().eq(2).text(numeroSerie);
      row.children().eq(3).text(tipoEquipo);
      row.children().eq(4).text(modelo);
      row.children().eq(5).text(marca);
      row.children().eq(6).text(procesador);
      row.children().eq(7).text(ram);
      row.children().eq(8).text(`${tipoDisco} ${tamanioDisco}`);
      row.children().eq(9).text(mac);
      row.children().eq(10).text(sistemaOperativo);
      row.children().eq(11).text(office);
      row.children().eq(12).text(antivirus);
      row.children().eq(13).text(estado);
      row.children().eq(14).text(usuarioEquipo);
      row.children().eq(15).text(contrasenaEquipo);
      row.children().eq(16).text(observacion);
    })
    .catch(err => {
      console.error('Error al editar:', err);
      alert('No se pudo editar el equipo.');
    });
});
