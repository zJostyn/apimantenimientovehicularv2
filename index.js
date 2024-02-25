const express = require('express');
const app = express();
const cors = require('cors');

var mantenimiento_routes = require('./routes/mantenimiento.routes');

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());

//rutas
app.use('/api', mantenimiento_routes);

//levantar el servidor
app.listen('3000');
console.log('Escuchando servidor 3000')

