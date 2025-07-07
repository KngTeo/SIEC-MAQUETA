const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const usuariosRoutes = require('./routes/usuarios');
const empleadosRoutes = require('./routes/empleados'); 
const equiposRoutes = require('./routes/equipos');
const asignacionesRoutes = require('./routes/asignaciones');
const cronogramasRoutes = require('./routes/cronogramas');
const informesRoutes = require('./routes/informes');

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/equipos', equiposRoutes);
app.use('/api/asignaciones', asignacionesRoutes);
app.use('/api/cronogramas', cronogramasRoutes);
app.use('/api/informes', informesRoutes);

app.listen(3000, () => {
  console.log('Servidor backend corriendo en http://localhost:3000');
});
