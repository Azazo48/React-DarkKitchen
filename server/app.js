import express from "express";
//Importacion de las funciones de database.js si no se importan pues no funcionan
import {
    ordenesCocina,
    aceptarOrden,
    rechazarOrden,
    nuevaOrden,
    ordenesPago,
    pagarOrden,
    ordenesCumpletadas,
} from "./database.js";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

//funcion para obtener las ordenes para que se muestren en cocina
app.get("/ordenes", async (req, res) => {
    const ordenesToCocina = await ordenesCocina();
    res.status(200).send(ordenesToCocina);
});


//funcion para obtener las ordenes que se mostraran en pago
app.get("/ordenespago", async (req, res) => {
  const ordenesToPago = await ordenesPago();
  res.status(200).send(ordenesToPago);
});


//funcion para aceptarOrden ordenes y cambiar su estatus en la base de datos CAMPO: "verificado"(creo)
app.patch("/ordenes/aceptar/:id", async (req, res) => {
  const { id } = req.params;
  await aceptarOrden(id);
  return res.status(200).json({ message: "Orden aceptada", orden_id: id });
});

//funcion para completar orden
app.patch("/ordenes/cumpletar/:id", async (req, res) => {
  const { id } = req.params;
  await ordenesCumpletadas(id);
  return res.status(200).json({ message: "Orden cumpletada", orden_id: id });
});

//funcion para pagar las ordenes con su id y el tipo de pago
app.patch("/ordenes/pagar/:id", async (req, res) => {
  const { id } = req.params;
  const { tipoDePago } = req.body;
  await pagarOrden(id, tipoDePago);
});


//funcion para rechazar ordenes y cambiar su estatus en la base de datos CAMPO: "cancelada"(creo)
app.patch("/ordenes/rechazar/:id", async (req, res) => {
    const { id } = req.params;
    await rechazarOrden(id);
});


app.post("/nuevaorden", async (req, res) => {
  const { insertProductos, insertTotal } = req.body;
  const insertId = await nuevaOrden(insertProductos, insertTotal);
  res.status(201).json({ message: 'Orden nueviada', id: insertId });
});


//api en el puerto 3000 :P
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
