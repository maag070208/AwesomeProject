import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  Button,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { TextInput } from 'react-native-paper';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import Geolocation from '@react-native-community/geolocation';

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { width, height } = Dimensions.get('window');
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({
    empleado: '',
    email: '',
    numero: '',
    sitio: '',
    comentarios: '',
    photo: null,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState<any>({
    username: '',
    password: '',
  });

  const device = useCameraDevice('back');
  const camera = React.useRef<any>(null);

  const isStepValid = () => {
    if (currentStep === 0) {
      return (
        formData.empleado.trim() &&
        formData.comentarios.trim() &&
        formData.email.trim() &&
        formData.numero.trim() &&
        formData.sitio.trim()
      );
    }
    if (currentStep === 1) {
      return !!formData.photo;
    }
    return true;
  };

  const handleGeneratePDF = async () => {
    try {
      Geolocation.getCurrentPosition(async (info) => {
        const { latitude, longitude } = info.coords;

        // Obtener la fecha y hora actual en el formato requerido
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleString('es-MX', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });

        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    font-size: 12px;
                    line-height: 1.4;
                    color: #333;
                }
                .header {
                    background-color: #425ea6;
                    padding: 10px;
                    text-align: center;
                    color: #fff;
                    font-size: 18px;
                }
                .container {
                    margin: 10px auto;
                    padding: 10px;
                    max-width: 750px;
                    background-color: #ffffff;
                }
                .row {
                    display: flex;
                    flex-wrap: wrap;
                    margin-bottom: 10px;
                }
                .column {
                    flex: 1;
                    padding: 10px;
                    min-width: 300px; /* Para mantener las columnas proporcionales */
                }
                .section {
                    margin-bottom: 8px;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    font-size: 12px;
                }
                .photo-container img, .map-container img {
                    width: 100%;
                    height: auto;
                    aspect-ratio: 4 / 5; /* Relación 4:5 para mantener la proporción */
                    object-fit: cover;
                    border-radius: 5px;
                    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
                }
                .footer {
                    text-align: center;
                    margin-top: 10px;
                    font-size: 10px;
                    color: #555;
                }
            </style>
          </head>
          <body>
            <div class="header">
              Intelli Site Solutions
            </div>
            <div class="container">
                <!-- Primera fila: Información -->
                <div class="row">
                    <div class="column">
                        <div class="section">
                            <p><strong>Empleado:</strong> ${formData.empleado || 'Sin datos'}</p>
                        </div>
                        <div class="section">
                            <p><strong>Mail:</strong> ${formData.email || 'Sin datos'}</p>
                        </div>
                        <div class="section">
                            <p><strong>Número Reporte:</strong> ${formData.numero || 'Sin datos'}</p>
                        </div>
                    </div>
                    <div class="column">
                        <div class="section">
                            <p><strong>Sitio:</strong> ${formData.sitio || 'Sin datos'}</p>
                        </div>
                        <div class="section">
                            <p><strong>Comentarios:</strong> ${formData.comentarios || 'Sin datos'}</p>
                        </div>
                        <div class="section">
                            <p><strong>Fecha y Hora:</strong> ${formattedDate}</p>
                        </div>
                    </div>
                </div>
  
                <!-- Segunda fila: Foto y mapa -->
                <div class="row">
                    <div class="column photo-container">
                        <h3>Foto</h3>
                        ${formData.photo
            ? `<img src="${formData.photo}" alt="Foto del formulario" />`
            : '<p>No hay foto disponible.</p>'
          }
                    </div>
                    <div class="column map-container">
                        <div>
                        <h3>Mapa</h3>
                         <p>LAT: ${latitude} - LONG: ${longitude}</p>
                        </div>
                        <img src="https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=600x200&markers=color:red%7Clabel:A%7C${latitude},${longitude}&key=AIzaSyBti77aQuE-O444R8uwCRzKkwdyEexYzDU" alt="Ubicación en mapa" />
                    </div>
                </div>
            </div>
          </body>
          </html>
        `;

        // Definir opciones para la creación del PDF
        const pdfOptions = {
          html: htmlContent,
          fileName: 'Reporte_Formulario',
          directory: RNFS.DownloadDirectoryPath,
        };

        // Crear el PDF
        const pdf = await RNHTMLtoPDF.convert(pdfOptions);
        Alert.alert(
          'PDF Generado',
          `El archivo PDF se guardó en: ${pdf.filePath}`
        );

        // Navegar a la vista del PDF
        navigation.navigate('PDFViewer', { filePath: pdf.filePath });
      });
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      Alert.alert('Error', 'No se pudo generar el archivo PDF.');
    }
  };




  const steps = [
    {
      title: 'Información de sitio',
      content: (
        <>
          <TextInput
            label={'Empleado'}
            value={formData.empleado}
            onChangeText={text => setFormData({ ...formData, empleado: text })}
            style={styles.input}
          />
          <TextInput
            label={'Mail'}
            value={formData.email}
            onChangeText={text => setFormData({ ...formData, email: text })}
            style={styles.input}
          />
          <TextInput
            label={'Número Reporte'}
            value={formData.numero}
            onChangeText={text => setFormData({ ...formData, numero: text })}
            style={styles.input}
          />
          <TextInput
            label={'Sitio'}
            value={formData.sitio}
            onChangeText={text => setFormData({ ...formData, sitio: text })}
            style={styles.input}
          />
          <TextInput
            label={'Comentarios'}
            value={formData.comentarios}
            onChangeText={text => setFormData({ ...formData, comentarios: text })}
            style={styles.input}
          />
        </>
      ),
    },
    {
      title: 'Tomar Foto',
      content: device && (
        // eslint-disable-next-line react-native/no-inline-styles
        <View style={{ flex: 1 }}>
          <Camera
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ flex: 1 }}
            device={device}
            isActive={true}
            ref={camera}
            photo={true}
          />
          <Button
            title="Tomar Foto"
            onPress={async () => {
              if (camera.current) {
                const photo = await camera.current.takePhoto({
                  quality: 1,
                  fileType: 'jpg',
                });
                setFormData({ ...formData, photo: `file://${photo.path}` });
                setCurrentStep(2);
              }
            }}
          />
        </View>
      ),
    },
    {
      title: 'Previsualización de Foto',
      content: formData.photo ? (
        // eslint-disable-next-line react-native/no-inline-styles
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={{ uri: formData.photo }}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ width: 300, height: 300, marginBottom: 20 }}
          />
          <Button
            title="Repetir"
            onPress={() => {
              setFormData({ ...formData, photo: null });
              setCurrentStep(1);
            }}
          />
        </View>
      ) : (
        <Text>No hay foto disponible</Text>
      ),
    },
    {
      title: 'Confirmación',
      content: (
        <View>
          <Text style={styles.text}>Empleado: {formData.empleado}</Text>
          <Text style={styles.text}>Mail: {formData.email}</Text>
          <Text style={styles.text}>Número Reporte: {formData.numero}</Text>
          <Text style={styles.text}>Sitio: {formData.sitio}</Text>
          <Text style={styles.text}>Comentarios: {formData.comentarios}</Text>
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {formData.photo && (
              <Image
                source={{ uri: formData.photo }}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  width: width / 1.5,
                  height: height / 2,
                  marginVertical: 20,
                }}
              />
            )}
          </View>
          <Button title="Descargar PDF" onPress={handleGeneratePDF} />
        </View>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleLogin = () => {
    if (loginData.username === 'admin' && loginData.password === 'admin123') {
      setIsLoggedIn(true);
    } else {
      Alert.alert('Error', 'Credenciales incorrectas');
    }
  };

  if (!isLoggedIn) {
    return (
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flex: 1, // Ocupa toda la pantalla
          justifyContent: 'center', // Centra verticalmente
          alignItems: 'center', // Centra horizontalmente
          padding: 20,
          backgroundColor: '#f5f5f5', // Opción para dar un fondo claro
        }}>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontSize: 40,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
            color: '#425ea6',
          }}>
          Intelli Site Solutions
        </Text>
        <TextInput
          label="Usuario"
          value={loginData.username}
          onChangeText={text => setLoginData({ ...loginData, username: text })}
          // eslint-disable-next-line react-native/no-inline-styles
          style={[styles.input, { width: '80%' }]} // Ancho ajustado para mayor estética
        />
        <TextInput
          label="Contraseña"
          value={loginData.password}
          onChangeText={text => setLoginData({ ...loginData, password: text })}
          secureTextEntry
          // eslint-disable-next-line react-native/no-inline-styles
          style={[styles.input, { width: '80%' }]} // Ancho ajustado
        />
        <Button
          title="Iniciar sesión"
          color={'#425ea6'}
          onPress={handleLogin}
        />
      </View>
    );
  }

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={styles.title}>{steps[currentStep].title}</Text>
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ flex: 1 }}>{steps[currentStep].content}</View>
      <View style={styles.navigation}>
        {currentStep > 0 && <Button title="Atrás" onPress={handleBack} />}
        {currentStep < steps.length - 1 && (
          <Button
            title="Siguiente"
            onPress={handleNext}
            disabled={!isStepValid()}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
  },
  logo: {
    width: 250,
    height: 200,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginVertical: 2,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default HomeScreen;
