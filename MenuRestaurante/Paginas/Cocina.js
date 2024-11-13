import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Cocina = () => {
    const [ordenes, setOrdenes] = useState([]);

    useEffect(() => {
        //fetch mamalon a la api para ver las ordenes
        const fetchOrdenes = async () => {
            const response = await fetch('http://localhost:3000/ordenes');
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

    //fetch mamalon para aceptar las ordenes con su id
    const botonAceptar = async (orden_id) => {
        await fetch(`http://localhost:3000/ordenes/aceptar/${orden_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const ordenToAct = ordenes.find((orden) => orden.orden_id === orden_id);
        if (ordenToAct) {
            setOrdenes((ordenesPrevias) => {
                const actOrdenes = [...ordenesPrevias]; 
                const index = actOrdenes.indexOf(ordenToAct);
                actOrdenes[index] = { ...ordenToAct, verificado: 1 }; 
                return actOrdenes;
            });
        }
    };

    //fetch mamalon para rechazar las ordenes con su id
    const botonRechazar = async (orden_id) => {
        //eliminar la orden de la interfaz
        setOrdenes((ordenesPrevias) => ordenesPrevias.filter((orden) => orden.orden_id !== orden_id));
        
        //eliminacion de la orden en la base de datos
        await fetch(`http://localhost:3000/ordenes/rechazar/${orden_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    };

    const botonCumpletar = async (orden_id) => {
        //eliminar la orden de la interfaz
        setOrdenes((ordenesPrevias) => ordenesPrevias.filter((orden) => orden.orden_id !== orden_id));
        
        //eliminacion de la orden en la base de datos
        await fetch(`http://localhost:3000/ordenes/cumpletar/${orden_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
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
        return(
        //cartitas donde se muestran las ordenes
        <View style={styles.card}>
            <Text style={styles.orderText}>Id Orden: {item.orden_id} Platillos: {platillosycantidades}</Text>
            {item.verificado === 0 && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.acceptButton} onPress={() => botonAceptar(item.orden_id)}>
                        <Text style={styles.buttonText}>Aceptar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rejectButton} onPress={() => botonRechazar(item.orden_id)}>
                        <Text style={styles.buttonText}>Rechazar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );};

    const renderItem2 = ({ item }) => {
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
        return(
        //cartitas donde se muestran las ordenes
        <View style={styles.card}>
            <Text style={styles.orderText}>Id Orden: {item.orden_id} Platillos: {platillosycantidades}</Text>
            {item.verificado === 1 && item.completada === 0 && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.cum} onPress={() => botonCumpletar(item.orden_id)}>
                        <Text style={styles.buttonText}>completar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );};

    return (
        //Componente gigante donde va todo
        <View style={styles.container}>
            <Text style={styles.header}>COCINA</Text>
            <View style={styles.seccion}>
                <Text style={styles.estadotexto}>En espera:</Text>
                <FlatList
                    data={ordenes.filter((orden) => orden.verificado === 0)}
                    keyExtractor={(item) => item.orden_id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                />
            </View>
            <View style={styles.seccion}>
                <Text style={styles.estadotexto}>Pedidos PENDIENTES:</Text>
                <FlatList
                    data={ordenes.filter((orden) => orden.verificado === 1 && orden.completada === 0)}
                    keyExtractor={(item) => item.orden_id.toString()}
                    renderItem={renderItem2}
                    contentContainerStyle={styles.listContainer}
                />
            </View>
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
    seccion: {
        flex: 2,
        marginBottom: 10,
    },
    estadotexto: {
        fontSize: 18,
        color: '#333',
        marginLeft: 20,
        marginTop: 10,
        fontWeight: 'bold',
    },
    listContainer: {
        marginVertical: 1,
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
    rejectButton: {
        backgroundColor: '#FF4444',
        padding: 10,
        borderRadius: 5,
    },
    cum:{
        backgroundColor: '#ff3389',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
});

export default Cocina;
