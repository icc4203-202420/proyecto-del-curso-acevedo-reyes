import { useEffect, useState, useRef } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useLoadGMapsLibraries } from '../hooks/useLoadGMapsLibraries';
import { MAPS_LIBRARY, MARKER_LIBRARY } from '../constants';
import axios from 'axios';
import { Typography, TextField, Grid } from '@mui/material';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const DEFAULT_MAP_CENTER = { lat: -31.56391, lng: 147.154312 };

const Map = () => {
  const libraries = useLoadGMapsLibraries();
  //const markerCluster = useRef();
  const mapNodeRef = useRef();
  const mapRef = useRef(); 
  const infoWindowRef = useRef(); // el despliegue de info relevante a cada marcador

  const [bars, setBars] = useState([]);
  const [filteredBars, setFilteredBars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(DEFAULT_MAP_CENTER);
  const [searchKeywords, setSearchKeywords] = useState('');

  // useEffect 1: buscar la ubicación actual del usuario en el navegador
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error obteniendo la ubicación", error);
        }
      );
    }
  }, []);

  // useEffect 2: se inicia el mapa cuando la librería de google maps esté disponible
  useEffect(() => {
    if (!libraries) return;

    const { Map } = libraries[MAPS_LIBRARY];

    mapRef.current = new Map(mapNodeRef.current, {
      mapId: 'DEMO_MAP_ID',
      center: currentLocation,
      zoom: 12,
    });

    // despliegue de info relevante a marcadores! 
    const { InfoWindow } = libraries[MAPS_LIBRARY];
    infoWindowRef.current = new InfoWindow();
  }, [libraries, currentLocation]);

  // useEffect 3: obtener bares y añadir marcadores cuando el mapa y los bares estén disponibles
  useEffect(() => {
    if (!libraries || !mapRef.current) return;

    // Obtener bares desde el backend
    axios.get('/api/v1/bars')
      .then(response => {
        setBars(response.data.bars);
        setFilteredBars(response.data.bars); // Inicialmente todos los bares son visibles
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [libraries]);

  // useEffect 4: se añaden los marcadores cuando los bares hayan sido filtrados
  useEffect(() => {
    if (!libraries || !mapRef.current || filteredBars.length === 0 || searchKeywords === '') {  
      // limpia los marcadores si no hay bares filtrados
      if (mapRef.current) {
        mapRef.current.markers?.forEach(marker => marker.setMap(null));
      }
      return;
    }
  
    const { AdvancedMarkerElement: Marker } = libraries[MARKER_LIBRARY];
  
    // Limpia los marcadores anteriores
    mapRef.current.markers?.forEach(marker => marker.setMap(null));
  
    const markers = filteredBars.map(bar => {
      const marker = new Marker({
        position: { lat: bar.latitude, lng: bar.longitude },
        map: mapRef.current,
      });
  
      // se almacenen los marcadores en un array en mapRef para poder eliminarlos después
      if (!mapRef.current.markers) {
        mapRef.current.markers = [];
      }
      mapRef.current.markers.push(marker);
  
      // ventana de información con detalles del bar
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div>
            <h3>${bar.name}</h3>
            <p>${bar.address.line1}, ${bar.address.line2}</p>
            <p>${bar.address.city}, ${bar.address.country.name}</p>
            <a href="/bars/${bar.id}">Ver detalles del bar</a>
          </div>
        `,
      });
  
      marker.addListener('click', () => {
        infoWindow.open(mapRef.current, marker);
      });
  
      return marker;
    });
  }, [libraries, filteredBars]);
  
  // manejo de searchKeyowrds
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchKeywords(value);

    if (value === null || value === '') {
      setFilteredBars([]);
    } 
    else {
      const filtered = bars.filter(bar => 
        bar.name.toLowerCase().includes(value) ||
        bar.address.line1.toLowerCase().includes(value) ||
        bar.address.line2.toLowerCase().includes(value) ||
        bar.address.city.toLowerCase().includes(value) ||
        bar.address.country.name.toLowerCase().includes(value)
      );
      setFilteredBars(filtered);
    }
    
  };

  return (
    <>
      {!libraries && <Typography>Cargando Google Maps API</Typography>}
      {loading && <Typography>Cargando el mapa. . . </Typography>}
      {error && <Typography>Error al importar los bares. . .</Typography>}

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
      /><br />

      <Grid container spacing={1} justifyContent="center">
        <TextField
          label       = "Descubre bares cercanos!"
          variant     = "outlined"
          margin      = "none"
          value       = {searchKeywords}
          onChange    = {handleSearch}
          placeholder = "Buscar por nombre, dirección, ciudad o país"
        />
      </Grid>
    </>
  );
};

export default Map;

