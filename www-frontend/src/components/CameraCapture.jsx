import React, { useRef, useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';

function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [stream, setStream] = useState(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream); // Guardamos el stream para detenerlo más adelante
        setCameraOn(true); // Activamos la cámara
        
      }
    } catch (error) {
      console.error("Error al acceder a la cámara", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop()); // Detenemos el stream de la cámara
      setStream(null);
    }
    setCameraOn(false);
  };

  const takePicture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && video.readyState === 4) { // Aseguramos que el video esté listo
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // imagen como un string en base64
      const imageBase64 = canvas.toDataURL('image/png');

      stopCamera();

      onCapture(imageBase64);
    } else {
      console.error("El video no está listo para capturar la imagen.");
    }
  };

  useEffect(() => {
    if (cameraOn) {
      startCamera();

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100); // 100 ms para esperar a que el DOM se actualice
    
    }

    return () => {
      if (stream) {
        stopCamera(); // desmontar componente
      }
    };
  }, [cameraOn]);

  return (
    <div>
      {cameraOn ? (
        <>
          <Box sx={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={takePicture}
              sx={{
                position: 'absolute',
                top: '-50px',  
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '10px 20px',
                fontSize: '16px',
                zIndex: 10, 
              }}
            >
              Tomar Foto
            </Button>
            
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '8px' }} />
          </Box>
          
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </>
      ) : (
        <button onClick={() => setCameraOn(true)}>Abrir Cámara</button>
      )}
    </div>
  );
}

export default CameraCapture;
