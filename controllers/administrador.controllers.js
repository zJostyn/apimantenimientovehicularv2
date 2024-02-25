const { Pool } = require("pg");

const pool = new Pool({
    connectionString: 'postgres://mantenimientovehicular_user:KMIHVUcUDmbWYTYy7oscft8oUb5snrTX@dpg-cmotqm6ct0pc73euesvg-a/mantenimientovehicular'
});

async function getAccesoAdmin(req, res) {
    const { correo, pass } = req.body;

    try {
        const client = await pool.connect();
        const query = 'SELECT * FROM usuario WHERE nombredeusuario = $1';
        const result = await client.query(query, [nombredeusuario]);
        client.release();

        if (result.rows.length === 1) {
            const usuario = result.rows[0];
            if (usuario.pass === pass) {
                res.json({ message: 'Inicio de sesión exitoso', usuario });
            } else {
                res.status(401).json({ error: 'Contraseña incorrecta' });
            }
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

async function getUsuarioID(req, res) {
    const { nombredeusuario, pass } = req.body;

    try {
        const client = await pool.connect();
        const query = 'SELECT * FROM usuario WHERE nombredeusuario = $1';
        const result = await client.query(query, [nombredeusuario]);
        client.release();

        if (result.rows.length === 1) {
            const usuario = result.rows[0];
            if (usuario.pass === pass) {
                res.json({ message: 'Inicio de sesión exitoso', usuario_id: usuario.id, usuario_rol: usuario.rol });
            } else {
                res.status(401).json({ error: 'Contraseña incorrecta' });
            }
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

async function getUsuarios(req, res) {

    try {
        const client = await pool.connect();
        const result = await client.query('select * from usuario');
        client.release();
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });

    }
}

async function createUsuarios(req, res) {
    const rol = 'Cliente';
    const { nombrecompleto, nombredeusuario, email, pass } = req.body;
    const query = 'INSERT INTO usuario(nombrecompleto, nombredeusuario, email, pass, rol, estado) VALUES ($1,$2,$3,$4,$5, $6)';
    const values = [nombrecompleto, nombredeusuario, email, pass, rol, 'Pendiente'];

    try {

        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se guardo el usuario' });

        } else {

            res.status(400).json({ message: 'No se guardo el usuario' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });

    }
}

async function habilitarUsuario(req, res) {
    const { id } = req.body;
    const query = 'UPDATE usuario SET estado = \'Activo\' WHERE id = $1';
    const values = [id];

    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se actualizó el estado del usuario' });
        } else {
            res.status(400).json({ message: 'No se actualizó el estado  del usuario' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });

    }
}

async function bloquearUsuario(req, res) {
    const { id } = req.body;
    const query = 'UPDATE usuario SET estado = \'Bloqueado\' WHERE id = $1';
    const values = [id];

    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se actualizó el estado del usuario' });
        } else {
            res.status(400).json({ message: 'No se actualizó el estado  del usuario' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });

    }
}

module.exports = {
    getAccesoUsuario,
    getUsuarioID,
    getUsuarios,
    createUsuarios,
    habilitarUsuario,
    bloquearUsuario
};