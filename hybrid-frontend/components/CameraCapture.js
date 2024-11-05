import React, { useState } from 'react';
import { View, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

function CameraCapture({ onCapture }) {
  const [cameraImage, setCameraImage] = useState(null);

  const openCamera = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permiso requerido", "La aplicación necesita acceder a la cámara.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      setCameraImage(result.uri);
      onCapture(result.uri);
    }
  };

  return (
    <View>

      <Button 
        title="Tomar Foto" 
        onPress={openCamera} 
      />
      
      {cameraImage && 
        <Image 
        source = {{ uri: cameraImage }} 
        style  = {{ width: 200, height: 200, marginVertical: 10 }} 
        />
      }
    
    </View>
  );
}

export default CameraCapture;
