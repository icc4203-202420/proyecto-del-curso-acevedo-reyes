import { useEffect, useState, useRef } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useLoadGMapsLibraries } from '../hooks/useLoadGMapsLibraries';
import { MAPS_LIBRARY, MARKER_LIBRARY } from '../constants';
import axios from 'axios';
import { Typography } from '@mui/material';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const MAP_CENTER = { lat: -31.56391, lng: 147.154312 };

const Map = () => {
  const libraries = useLoadGMapsLibraries();
  const markerCluster = useRef();
  const mapNodeRef = useRef();
  const mapRef = useRef();

  const [bars, setBars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect 1: se inicia el mapa cuando la librería de Google Maps esté disponible
  useEffect(() => {
    if (!libraries) return;

    const { Map } = libraries[MAPS_LIBRARY];

    mapRef.current = new Map(mapNodeRef.current, {
      mapId: 'DEMO_MAP_ID',
      center: MAP_CENTER,
      zoom: 1,
    });
  }, [libraries]);

  // Efecto 2: Obtener bares y añadir marcadores cuando el mapa y los bares estén disponibles
  useEffect(() => {
    if (!libraries || !mapRef.current) return;

    // Obtener bares desde el backend
    axios.get('/api/v1/bars')
      .then(response => {
        setBars(response.data.bars);
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [libraries]);

  // useEffect 3: se añaden los marcadores cuando los bares hayan sido fetcheados
  useEffect(() => {
    if (!libraries || !mapRef.current || bars.length === 0) return;

    const { AdvancedMarkerElement: Marker } = libraries[MARKER_LIBRARY];
    
    const barPositions = bars.map(bar => ({ 
      lat: bar.latitude, lng: bar.longitude 
    }));

    const markers = barPositions.map(position => new Marker({
      position,
      map: mapRef.current,
    }));

    // MarkerClusterer (opcional)
    // markerCluster.current = new MarkerClusterer({
    //   map: mapRef.current,
    //   markers,
    // });

  }, [libraries, bars]); // Este efecto se ejecuta cuando los bares son actualizados

  return (
    <>
      {!libraries && <Typography>Cargando Google Maps API</Typography>}
      {loading && <Typography>Cargando el mapa. . . </Typography>}
      {error && <Typography>Error al cargar el Mapa. . .</Typography>}

      <div 
        ref={mapNodeRef} 
        style={{ 
          width: '90%', 
          height: '250px',
          margin: '0 auto',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)',  
        }}
      />
    </>
  );
};

export default Map;
