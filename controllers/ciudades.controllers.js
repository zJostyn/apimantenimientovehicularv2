const { Pool } = require("pg");

//cadena de conexion
const pool = new Pool({
    connectionString: 'postgres://mantenimientovehicular_user:KMIHVUcUDmbWYTYy7oscft8oUb5snrTX@dpg-cmotqm6ct0pc73euesvg-a/mantenimientovehicular'
});

//funcion para devolver todas las ciudades
async function getCiudades(req, res) {

    try {
        const client = await pool.connect();
        const result = await client.query('select * from cooperativas');
        client.release();
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });

    }

}

//funcion para insertar una ciudad
async function createCooperativa(req, res) {
    const maxID = 'select MAX (id) AS max_id from cooperativas';
    const maxIDResult = await pool.query(maxID);
    const id = maxIDResult.rows[0].max_id;
    const { nombre, direccion, telefono, dominiocorreo } = req.body;
    const query = 'INSERT INTO cooperativas(id, nombre, direccion, telefono, dominiocorreo) VALUES ($1,$2,$3,$4,$5)';
    const values = [id, nombre, direccion, telefono, dominiocorreo];

    try {

        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se guardo la cooperativa' });

        } else {

            res.status(400).json({ message: 'No se guardo la cooperativa' });
        }
        //res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });

    }

}
//funcion para devolver una ciudad x un id
async function getCiudad(req, res) {
    const { id } = req.params;
    const query = 'SELECT * FROM ciudades where id_ciudad=$1'
    const values = [id];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        res.status(200);
        if (result.rowCount > 0) {
            res.json(result.rows);
        } else {
            res.status(500).json({ message: 'No existe la ciudad' });
        }


    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" });
    }


}



//función para modificar una ciudad
async function updateCiudad(req, res) {
    const { id } = req.params;
    const { nombre, provincia } = req.body;
    const query = 'UPDATE ciudades SET nombre=$2, provincia=$3 WHERE id_ciudad=$1';
    const values = [id, nombre, provincia];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se actualizó la ciudad' });
        } else {
            res.status(400).json({ message: 'No se actualizó' });
        }
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" });
    }
}

//eliminar ciudad por un id 


async function deleteCiudad(req, res) {
    const { id } = req.params;
    const query = 'DELETE FROM ciudades where id_ciudad=$1'
    const values = [id];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Ciudad eliminada' });
        } else {
            res.status(500).json({ message: 'No existe la ciudad' });
        }


    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" });
    }


}

module.exports = {
    getCiudades,
    createCooperativa,
    getCiudad,
    updateCiudad,
    deleteCiudad
};