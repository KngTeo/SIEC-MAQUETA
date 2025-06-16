const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const usuariosRoutes = require('./routes/usuarios');
const empleadosRoutes = require('./routes/empleados'); 
const equiposRoutes = require('./routes/equipos');
const loginRoute = require('./routes/login');
const asignacionesRoutes = require('./routes/asignaciones');

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/equipos', equiposRoutes);
app.use('/api/login', loginRoute);
app.use('/api/asignaciones', asignacionesRoutes);

app.listen(3000, () => {
  console.log('Servidor backend corriendo en http://localhost:3000');
});
