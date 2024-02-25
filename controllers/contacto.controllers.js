const { Pool } = require("pg");

const pool = new Pool({
    connectionString: 'postgres://mantenimientovehicular_user:KMIHVUcUDmbWYTYy7oscft8oUb5snrTX@dpg-cmotqm6ct0pc73euesvg-a/mantenimientovehicular'
});

async function getRegistros(req, res) {

    try {
        const client = await pool.connect();
        const result = await client.query('select * from contacto');
        client.release();
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

async function createRegistro(req, res) {
    const { nombre, correo, mensaje } = req.body;
    const query = 'INSERT INTO contacto(nombre, correo, mensaje) VALUES ($1,$2,$3)';
    const values = [nombre, correo, mensaje];

    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Registro guardado' });
        } else {
            res.status(400).json({ message: 'No se guardo el registro' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });

    }
}

async function deleteContacto(req, res) {
    const { id } = req.body;
    const query = 'Delete from contacto where id=$1';
    const values = [id];

    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se eliminó el contacto' });
        } else {
            res.status(400).json({ message: 'No se eliminó el contacto' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });

    }
}

module.exports = {
    getRegistros,
    createRegistro,
    deleteContacto
}