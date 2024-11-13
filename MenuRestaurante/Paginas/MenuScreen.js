import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Button, StyleSheet, Alert } from 'react-native';

//ni modo no habia de otra
//atributos de las comidas
const comidas = [
  { id: '1', nombre: 'Pizza', precio: '5$', cantidad: '', imagen: 'https://www.simplyrecipes.com/thmb/rLl58QZmVP4C3zSlpkKBo72EUws=/2000x1333/filters:fill(auto,1)/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2019__09__easy-pepperoni-pizza-lead-3-8f256746d649404baa36a44d271329bc.jpg' },
  { id: '2', nombre: 'Hamburguesa', precio: '7$', cantidad: '', imagen: 'https://smartremo.es/wp-content/uploads/2020/04/hamburguesa-scaled.jpg' },
  { id: '3', nombre: 'Tacos', precio: '3$', cantidad: '', imagen: 'https://www.samtell.com/hs-fs/hubfs/Blogs/Four-Scrumptous-Tacos-Lined-up-with-ingredients-around-them-1.jpg?width=1800&name=Four-Scrumptous-Tacos-Lined-up-with-ingredients-around-them-1.jpg' },
  { id: '4', nombre: 'Pasta', precio: '4$', cantidad: '', imagen: 'https://res.cloudinary.com/norgesgruppen/images/c_scale,dpr_auto,f_auto,q_auto:eco,w_1600/tulcxcntmwnys5ndgqvk/pasta-alfredo' },
  { id: '5', nombre: 'Papas', precio: '15$', cantidad: '', imagen: 'https://tse4.mm.bing.net/th?id=OIP.w7rHhG9cxP-GRQJfuHFigQHaFj&pid=Api&P=0&h=180' },
  { id: '6', nombre: 'Pulpo', precio: '200$', cantidad: '', imagen: 'https://cdn.shopify.com/s/files/1/0078/5730/7737/files/80241-134_Pulpo_Adobado_receta-opt.jpg?v=1583177155' },
];

//funcion para seleccionar
export default function MenuScreen() {
  const [seleccionadas, setSeleccionadas] = useState([]);
  const seleccionarComida = (id) => {
    setSeleccionadas((prevSeleccionadas) => ({
      ...prevSeleccionadas,
      //le suma
      [id]: (prevSeleccionadas[id] || 0) + 1,
    }));
  };

//funcion para desseleccionar
  const quitarSeleccion = (id) => {
    setSeleccionadas((prevSeleccionadas) => {
      const nuevaSeleccion = { ...prevSeleccionadas };
      if (nuevaSeleccion[id] > 1) {
        //le desuma
        nuevaSeleccion[id] -= 1;
      } else {
        delete nuevaSeleccion[id];
      }
      return nuevaSeleccion;
    });
  };

  //funcion para enviar la comida
  const enviarACocina = async () => {
    if (Object.keys(seleccionadas).length === 0) {
      Alert.alert('Selecciona al menos una comida.');
      return;
    }
    //crar un array con las comidas que se seleccionaron para guardar el id y la cantidad
    const productosSeleccionados = comidas.filter(comida => Object.keys(seleccionadas).includes(comida.id));
    const insertProductos = productosSeleccionados.map(producto => ({
    id: producto.id,
    cantidad: seleccionadas[producto.id]
    }));
    //un forsito para sumar los precios y así
    let total = 0;
    // Ahora solo iteramos sobre las comidas seleccionadas
    for (let i = 0; i < productosSeleccionados.length; i++) {
      const comida = productosSeleccionados[i];
      const cantidad = seleccionadas[comida.id];

      //quitación del $
      total += parseFloat(comida.precio.replace('$', '')) * cantidad;
    }

    //fetch mamalon para crear una nueva orden con los productos y el total
    const response = await fetch('http://localhost:3000/nuevaorden', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        insertProductos: insertProductos,
        insertTotal: total,
      }),
    });
    if (Object.keys(seleccionadas).length === 0) {
      Alert.alert('Selecciona al menos una comida.');
    } else {
      //se limpia la seleccion de comida y se manda una alerta con cuantas comidas se enviaron
      setSeleccionadas([]);
      Alert.alert(`Enviando ${seleccionadas.length} comidas a cocina.`);
    }
  };

    //como se mostrara la comida
  const renderComida = ({ item }) => {
    const cantidadSeleccionada = seleccionadas[item.id] || 0;

    return (
      //tarjetita para seleccionar las comidas (ya me dio hambre)
      <View style={[styles.card, cantidadSeleccionada > 0 && styles.seleccionada]}>
        <Image source={{ uri: item.imagen }} style={styles.imagen} />
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.precio}>{item.precio}</Text>
        <Text style={styles.cantidadTexto}>Cantidad: {cantidadSeleccionada}</Text>
        <View style={styles.botones}>
          <TouchableOpacity style={styles.boton} onPress={() => seleccionarComida(item.id)}>
            <Text style={styles.botonTexto}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.boton} onPress={() => quitarSeleccion(item.id)}>
            <Text style={styles.botonTexto}>-</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    //un contenedor con todo y asi
    <View style={styles.container}>
      <FlatList
        data={comidas}
        renderItem={renderComida}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.lista}
      />
      <Button title="Enviar a Cocina" onPress={enviarACocina} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  lista: {
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    margin: 8,
    borderRadius: 8,
    alignItems: 'center',
    padding: 16,
    elevation: 2,
  },
  seleccionada: {
    borderColor: '#ff6347',
    borderWidth: 2,
  },
  imagen: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  nombre: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  precio: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  botonTexto: {
    fontSize: 40,
    textAlign: 'center'
  }
});
