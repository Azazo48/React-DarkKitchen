import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise();

//definicion de un monton de funciones bien aja que luego se exportaran para usarse en la app.js
//los nombres hablan por si solos (?)

export async function ordenesCocina() {
    const [rows] = await pool.query(
        `call verOrdenesCocina();`
    );
    return rows;
}

export async function ordenesPago() {
    const [rows] = await pool.query(
        `call verOrdenesPago();`
    );
    return rows;
}

export async function ordenesCumpletadas(id) {
    const [rows] = await pool.query(
        `call cumpletarOrden(?);`,
        [id]
    );
    return rows;
}

export async function aceptarOrden(id) {
    await pool.query(
        `call aceptarOrden(?);`, 
        [id]
    );
}

export async function pagarOrden(id, tipoPago) {
    await pool.query(
        `call pagarOrden(?, ?);`,
        [id, tipoPago]
    );
}

export async function rechazarOrden(id) {
    await pool.query(
        `call rechazarOrden(?)`, 
        [id]
    );
}

export async function nuevaOrden(productos, total) {
    const [result] = await pool.query(
        `call guardarOrden(?,?)`,
        [JSON.stringify(productos), total]
    );
    return result.insertId;
}
