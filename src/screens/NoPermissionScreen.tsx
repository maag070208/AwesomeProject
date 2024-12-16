import React from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { openSettings } from 'react-native-permissions';

const NoPermissionScreen = () => {

    const handleOpenSettings = () => {
        openSettings().catch(() => {
            Alert.alert('Error', 'No se puede abrir la configuración de la aplicación.');
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Permiso denegado</Text>
            <Text style={styles.message}>
                Necesitamos acceso a la cámara para tomar fotos. Por favor, habilita el permiso desde la configuración de la aplicación.
            </Text>
            <Button title="Abrir Configuración" onPress={handleOpenSettings} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    }
});

export default NoPermissionScreen;
