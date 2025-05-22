const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Si tienes clave en WAMP, ponla aquí
  database: 'siec'
});

connection.connect((err) => {
  if (err) {
    console.error('Error de conexión:', err);
  } else {
    console.log('Conectado a MySQL');
  }
});

module.exports = connection;
