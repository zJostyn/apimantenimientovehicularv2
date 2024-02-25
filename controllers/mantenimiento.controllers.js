const { Pool } = require("pg");

const pool = new Pool({
    connectionString: 'postgres://mantenimientovehicular_user:KMIHVUcUDmbWYTYy7oscft8oUb5snrTX@dpg-cmotqm6ct0pc73euesvg-a/mantenimientovehicular'
});

async function getMantenimientos(req, res) {

    try {
        const client = await pool.connect();
        const result = await client.query('select * from mantenimientos');
        client.release();
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

async function getMantenimientoID(req, res) {
    const { vehiculo_id } = req.body;

    try {
        const client = await pool.connect();
        const query = 'SELECT * FROM mantenimientos WHERE vehiculo_id = $1';
        const result = await client.query(query, [vehiculo_id]);
        client.release();

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

async function getIDs(req, res) {

    try {
        const client = await pool.connect();
        const result = await client.query('select id from mantenimientos');
        client.release();
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

async function createMantenimiento(req, res) {
    const { vehiculo_id, detalles, tipo, kilometraje, alertas, fecha, comentario } = req.body;
    const query = 'INSERT INTO mantenimientos(vehiculo_id, detalles, tipo, kilometraje, alertas, fecha, comentario) VALUES ($1,$2,$3,$4,$5,$6,$7)';
    const values = [vehiculo_id, detalles, tipo, kilometraje, alertas, fecha, comentario];

    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se guardo el mantenimiento' });
        } else {
            res.status(400).json({ message: 'No se guardo el mantenimiento' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });

    }
}

async function deleteMantenimiento(req, res) {
    const { id } = req.body;
    const query = 'Delete from mantenimientos where id=$1';
    const values = [id];

    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se guardo el mantenimiento' });
        } else {
            res.status(400).json({ message: 'No se guardo el mantenimiento' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });

    }
}

async function updateMantenimiento(req, res) {
    const { id } = req.body;
    const query = 'UPDATE mantenimientos SET alertas = \'Realizado\' WHERE id = $1';
    const values = [id];

    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se guardo el mantenimiento' });
        } else {
            res.status(400).json({ message: 'No se guardo el mantenimiento' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });

    }
}

async function updateMantenimiento1(req, res) {
    const { detalles, tipo, kilometraje, fecha, comentario, id } = req.body;
    const query = 'UPDATE mantenimientos SET detalles=$1, tipo=$2, kilometraje=$3, fecha=$4, comentario=$5 where id=$6';
    const values = [detalles, tipo, kilometraje, fecha, comentario, id];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se actualizó el mantenimiento' });

        } else {

            res.status(400).json({ message: 'No se actualizó el mantenimiento' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });

    }
}

async function mantenimientosPorRealizarLogin(req, res) {
    const { usuario_id, alertas} = req.body;
    const query = 'SELECT MA.alertas FROM mantenimientos MA, vehiculos VE WHERE MA.vehiculo_id = VE.id and VE.usuario_id = $1 and MA.alertas = $2';
    const values = [usuario_id, alertas];

    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.status(200).json('Tiene mantenimientos pendientes por realizar.');
        } else {
            res.status(400).json('No tiene ningun mantenimiento pendiente.');
        }
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });

    }
}

async function obtenerImagenVehiculoMant(req, res) {
    const { vehiculo_id} = req.body;
    const query = 'SELECT VE.link FROM vehiculos VE, mantenimientos MA WHERE VE.id = MA.vehiculo_id AND MA.vehiculo_id = $1 LIMIT 1';
    const values = [vehiculo_id];

    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });

    }
}

async function reAsignarFechaMantenimiento(req, res) {
    const { id, fecha } = req.body;
    const query = 'UPDATE mantenimientos SET fecha = $2 where id = $1';
    const values = [id, fecha];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.status(200).json('Se re agendo el mantenimiento');

        } else {

            res.status(400).json('No se pudo re agendar el mantenimiento');
        }
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });

    }
}

async function obtenerMantenimientoPorID(req, res) {
    const { id } = req.body;
    try {
        const client = await pool.connect();
        const query = 'SELECT MA.*, VE.marca, CONCAT(VE.tipo,' + "' '" + ',VE.modelo) AS nombre, VE.anio, VE.link, VE.placa, VE.chasis FROM mantenimientos MA, vehiculos VE WHERE MA.id = $1 and MA.vehiculo_id = VE.id';
        const result = await client.query(query, [id]);
        client.release();

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

async function obtenerMantenimientosVehiculo(req, res) {
    const { val } = req.body;
    try {
        const client = await pool.connect();
        const query = 'SELECT MA.*, VE.marca, CONCAT(VE.tipo,' + "' '" + ',VE.modelo) AS nombre, VE.anio, VE.link, VE.placa, VE.chasis FROM mantenimientos MA, vehiculos VE WHERE MA.vehiculo_id = $1 and MA.vehiculo_id = VE.id';
        const result = await client.query(query, [val]);
        client.release();

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
}



module.exports = {
    getMantenimientos,
    getMantenimientoID,
    getIDs,
    createMantenimiento,
    deleteMantenimiento,
    updateMantenimiento,
    updateMantenimiento1,
    mantenimientosPorRealizarLogin,
    obtenerImagenVehiculoMant,
    reAsignarFechaMantenimiento,
    obtenerMantenimientoPorID,
    obtenerMantenimientosVehiculo
};