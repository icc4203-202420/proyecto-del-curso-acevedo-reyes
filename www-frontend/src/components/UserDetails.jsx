import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import { Autocomplete, TextField, Grid, Typography, CircularProgress, Box, AppBar, Button, Toolbar } from '@mui/material';
import axios from 'axios';
import placeHolder from '../assets/placeholder.jpg';

function UserDetails() {
  const { userId } = useParams();  // Obtener el ID del usuario desde la URL
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBar, setSelectedBar] = useState(null); // Bar seleccionado en el autocomplete

  const currentUser = parseInt(localStorage.getItem('user'));

  useEffect(() => { 
    axios.get(`http://127.0.0.1:3001/api/v1/users/${userId}`)
      .then(response => {
        setUser(response.data.user);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:3001/api/v1/users/${currentUser}/friendships`)
      .then(response => {
        console.log(response.data.friends);
        setFriends(response.data.friends);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [currentUser, friends]);
      
  const handleAddFriend = () => {
    if (selectedBar) {
      axios.post('http://127.0.0.1:3001/api/v1/users/:id/friendships', {
        user: currentUser,
        user_id: currentUser,
        friend_id: userId,  // Usuario del perfil
        bar_id: selectedBar // Bar seleccionado
      })
      .then(response => {
        alert("Amistad creada con éxito");
      })
      .catch(error => {
        if (error.response && error.response.data.message) {
          // Si el servidor respondió con status 422 (error)
          alert(error.response.data.message);  // Muestra el mensaje de error del servidor
        } else {
          console.error(error);
          alert("Error al crear la amistad");
        }
      });
    } else {
      alert("Por favor selecciona un bar.");
    }
  };
  

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Failed to load user.</Typography>;
  if (!user) return <Typography color="error">User not found.</Typography>;

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      height="100vh" 
      flexDirection="column"
    >
      <AppBar position="fixed" sx={{ bgcolor: "lightgray" }}>
        <Toolbar>
          <Button component={RouterLink} to="/" sx={{color: 'black'}}>
            <NavigateBeforeIcon />
            Usuarios
          </Button>
        </Toolbar>
      </AppBar>

      
      <Box mt={10} p={2} border="1px solid #ccc" width="70%">
        
        <Grid container spacing={1} alignItems="center">
          {/* Imagen a la izquierda */}
          <Grid item xs={2}>
            <img src={placeHolder} alt={`${user.handle} image`} style={{ width: '100px', height: 'auto' }} />
          </Grid>

          <Grid item xs={2}></Grid>

          {/* Texto a la derecha */}
          <Grid item xs={8}>
            <Typography variant="h6">
              <strong> <PersonAddAltIcon sx={{ fontSize: 35 }} />  @</strong> {user.handle}
            </Typography>
            <Typography variant="body2">
              Acá debería haber una descripción, pero recién ahora me doy cuenta de que eso nunca
              <br></br>estuvo considerado en el modelo, así que voy a dejar por estándar el nombre y apellido:
              <br></br> <strong>{user.first_name} {user.last_name}</strong>
            </Typography>
          </Grid>
        </Grid>
        
        { user.id !== currentUser && !friends.some(friend => friend.id === user.id) && (
          
          <>
          <Typography variant="h5"> 
            <BookmarkAddedIcon sx={{ fontSize: 35 }} /> 
            Añade un bar de un evento en que se hayan conocido
          </Typography>

          
          {/* Autocomplete */}
          <Box mt={4} display="flex" alignItems="center">
            <Autocomplete
              disablePortal
              options={user.bars}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Selecciona una opción" />}
              onChange={(event, newValue) => setSelectedBar(newValue)} // Almacenar la opción seleccionada
            />
            {/* Botón "Añadir Amigo" */}
            <Button
              variant="contained"
              sx={{ ml: 2 }}
              onClick={handleAddFriend} // Al hacer clic, crear la amistad
            >
              Añadir Amigo
            </Button>
          </Box>

          </>
        )}

        { user.id !== currentUser && friends.some(friend => friend.id === user.id) && (
          <Typography variant="h5" align='center'> 
            <BookmarkAddedIcon sx={{ fontSize: 35 }} /> 
            Ya son amigos!!
          </Typography>
        )}
        
      </Box>

      <Toolbar /> 
    </Box>

    
  );
}

export default UserDetails;
