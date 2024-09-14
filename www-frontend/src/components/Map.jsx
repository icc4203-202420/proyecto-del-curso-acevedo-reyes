import { useEffect, useState, useRef } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useLoadGMapsLibraries } from '../hooks/useLoadGMapsLibraries';
import { MAPS_LIBRARY, MARKER_LIBRARY } from '../constants';
import { randomCoordinates } from '../utils';
//import useAxios from 'axios-hooks';
import axios from 'axios';

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

  useEffect(() => {
    if (!libraries) {
      return;
    }

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

    const { Map } = libraries[MAPS_LIBRARY];

    mapRef.current = new Map(mapNodeRef.current, {
      mapId: 'DEMO_MAP_ID',
      center: MAP_CENTER,
      zoom: 1,
    });

    const { AdvancedMarkerElement: Marker } = libraries[MARKER_LIBRARY];
    
    const barPositions = bars.map(bar => ({ 
      lat: bar.latitude, lng: bar.longitude 
    }));

    const markers = barPositions.map((position) => new Marker({ position, map: mapRef.current }));

    //markerCluster.current = new MarkerClusterer({
    //  map: mapRef.current,
    //  markers,
    //});
  }, [libraries]);

 
  return (
  <>
    <div 
      ref   = {mapNodeRef} 
      style = {{ 
        width: '90%', 
        height: '250px',
        margin: '0 auto',
        borderRadius: '16px',
        //border: '1px solid rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)',  
      }}
    />
    

    {!libraries && <h1>Cargando. . .</h1>}
    {loading && <h1>Cargando. . .</h1>}
    {error && <h1>Error al cargar el Mapa. . .</h1>}

  </>
  );
  
};

export default Map;