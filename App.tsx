import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import HomeScreen from './src/screens/HomeScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import NoPermissionScreen from './src/screens/NoPermissionScreen';
import PDFViewer from './src/screens/PdfScreen';

const Stack = createStackNavigator();

const App = () => {
  const [hasPermission, setHasPermission] = useState<any>(null);

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
        if (cameraPermission === RESULTS.GRANTED) {
          setHasPermission(true);
        } else {
          setHasPermission(false);
          Alert.alert('Permiso denegado', 'Necesitamos acceso a la cámara y almacenamiento para continuar.');
        }
      } catch (error) {
        setHasPermission(false);
        Alert.alert('Error', 'Hubo un problema al solicitar permisos.');
      }
    };

    requestPermissions();
  }, []);

  if (hasPermission === null) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={hasPermission ? 'Home' : 'NoPermission'}>
        <Stack.Screen name="Home" component={HomeScreen} options={{
          headerShown: false,
        }} />
        <Stack.Screen name="NoPermission" component={NoPermissionScreen} />
        <Stack.Screen name="PDFViewer" component={PDFViewer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
