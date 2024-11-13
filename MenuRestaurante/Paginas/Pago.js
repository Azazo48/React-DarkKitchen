import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet, Picker, Alert } from 'react-native';

const Pago = () => {
    const [ordenes, setOrdenes] = useState([]);
    const [metodosPago, setMetodosPago] = useState({});

    useEffect(() => {
        //fetch mamalon a la api para ver las ordenes
        const fetchOrdenes = async () => {
            const response = await fetch('http://localhost:3000/ordenespago');
            const data = await response.json();
            setOrdenes(data[0]);
        };

        fetchOrdenes();
        //hacer un intervalo para llamar a la api
        const intervalo = setInterval(() => {
            fetchOrdenes();
        }, 2000);//cada 5 segundos
        return () => clearInterval(intervalo);
    }, []);

    //funcion para aceptar
    const tuggleAceptar = async (orden_id) => {
        const metodoPago = metodosPago[orden_id];

        if (!metodoPago) {
            Alert.alert('Selecciona el metodo de pago');
            return;
        }

        //eliminacion de la orden
        setOrdenes((prevOrdenes) => prevOrdenes.filter((orden) => orden.orden_id !== orden_id));

        //eliminacion de la orden pero ahora en la base de datos
        await fetch(`http://localhost:3000/ordenes/pagar/${orden_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tipoDePago: metodoPago }),
        });
    };

    const renderItem = ({ item }) => {
        //otro forsito para que se vean bien los nombres de los productos y sus cantidades
        let platillosycantidades = '';
        for (let i = 0; i < item.productos_nombres.length; i++) {
            //el nombre + la cantidad
            platillosycantidades += `${item.productos_nombres[i]}[${item.productos_cantidad[i]}]`;
            if (i < item.productos_nombres.length - 1) {
                //Cuando termina un producto y se salte al otro una pequeña separacion
                platillosycantidades += ', ';
            }
            
        }
        //mostrar el precio total de la orden
        platillosycantidades += ` Total: ${item.total}`
        return(
        //otras cartas para ver las ordenes
        <View style={styles.card}>
            <Text style={styles.orderText}>Id Orden: {item.orden_id} Platillos: {platillosycantidades}</Text>
            <Picker
                selectedValue={metodosPago[item.orden_id] || ''}
                style={styles.colapse}
                onValueChange={(itemValue) => setMetodosPago((prev) => ({ ...prev, [item.orden_id]: itemValue }))}>
                <Picker.Item label="Selecciona un método de pago" value="" />
                <Picker.Item label="Efectivo" value="Efectivo" />
                <Picker.Item label="Crédito" value="Crédito" />
            </Picker>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.acceptButton} onPress={() => tuggleAceptar(item.orden_id)}>
                    <Text style={styles.buttonText}>Pagar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );};

    return (
        //y otro container gigante con todo
        <View style={styles.container}>
            <Text style={styles.header}>PAGOS</Text>
            <Text style={styles.estado}>Por Pagar:</Text>
            <FlatList
                data={ordenes}
                keyExtractor={(item) => item.orden_id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: 16,
    },
    header: {
        backgroundColor: '#333',
        color: '#FFD700',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 20,
    },
    estado: {
        fontSize: 18,
        color: '#333',
        marginLeft: 20,
        marginTop: 10,
        fontWeight: 'bold',
    },
    listContainer: {
        marginVertical: 10,
    },
    card: {
        width: '90%',
        backgroundColor: '#FFCC00',
        padding: 15,
        margin: 10,
        borderRadius: 10,
    },
    orderText: {
        fontSize: 16,
        color: '#000',
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    acceptButton: {
        backgroundColor: '#00CC66',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    colapse: {
        height: 50,
        width: '50%',
        marginVertical: 10,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 5,
    },
});

export default Pago;
