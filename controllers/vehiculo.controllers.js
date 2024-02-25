const { Pool } = require("pg");

const pool = new Pool({
    connectionString: 'postgres://mantenimientovehicular_user:KMIHVUcUDmbWYTYy7oscft8oUb5snrTX@dpg-cmotqm6ct0pc73euesvg-a/mantenimientovehicular'
});

async function getVehiculos(req, res) {

    try {
        const client = await pool.connect();
        const result = await client.query('select * from vehiculos');
        client.release();
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });

    }
}

async function getVehiculoID(req, res) {
    const { usuario_id } = req.body;

    try {
        const client = await pool.connect();
        const query = 'SELECT * FROM vehiculos WHERE usuario_id = $1';
        const result = await client.query(query, [usuario_id]);
        client.release();

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

async function createVehiculo(req, res) {
    const { usuario_id, marca, modelo, anio, tipo, chasis, placa, kilometraje, link } = req.body;
    const query = 'INSERT INTO vehiculos(usuario_id, marca, modelo, anio, tipo, chasis, placa, kilometraje, link) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)';
    const values = [usuario_id, marca, modelo, anio, tipo, chasis, placa, kilometraje, link];

    try {

        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se guardo el vehiculo' });

        } else {

            res.status(400).json({ message: 'No se guardo el vehiculo' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });

    }
}

async function updateVehiculo(req, res) {
    const { usuario_id, marca, modelo, anio, tipo, chasis, placa, kilometraje, link, id } = req.body;
    const query = 'UPDATE vehiculos SET usuario_id=$1, marca=$2, modelo=$3, anio=$4, tipo=$5, chasis=$6, placa=$7, kilometraje=$8, link=$9 where id=$10';
    const values = [usuario_id, marca, modelo, anio, tipo, chasis, placa, kilometraje, link, id];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se guardo el vehiculo' });

        } else {

            res.status(400).json({ message: 'No se guardo el vehiculo' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });

    }
}

async function getIDsVehiculo(req, res) {
    const { usuario_id } = req.body;
    try {
        const client = await pool.connect();
        const query = 'SELECT id, CONCAT(tipo,' + "' '" + ',modelo) AS nombre FROM vehiculos WHERE usuario_id = $1';
        const result = await client.query(query, [usuario_id]);
        client.release();
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });

    }
}

async function deleteVehiculo(req, res) {
    const { id } = req.body;
    const query = 'Delete from vehiculos where id=$1';
    const values = [id];

    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se eliminó vehículo' });
        } else {
            res.status(400).json({ message: 'No se eliminó vehículo' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });

    }
}

module.exports = {
    getVehiculos,
    getVehiculoID,
    createVehiculo,
    getIDsVehiculo,
    updateVehiculo,
    deleteVehiculo
};