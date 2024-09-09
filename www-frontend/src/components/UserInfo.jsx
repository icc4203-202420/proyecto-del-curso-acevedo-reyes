import * as React from 'react';
import Box from '@mui/material/Box';
import logo from '../assets/logo.png';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { Typography } from '@mui/material';

function UserInfo() {
  const navigate = useNavigate(); // Hook for navigation

  const handleRegister = () => {
    navigate('/sign-up'); // Redirect to the Register page
  };

  const handleLogin = () => {
    navigate('/log-in'); // Redirect to the Login page
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove user from local storage
    localStorage.removeItem('token'); // Remove token from local storage
    navigate('/user'); // Redirect to the Home page
  }

  return (
    <Box
      className="user-info-container"
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center', // Center everything vertically
        height: '100vh', // Full vertical centering
      }}
      noValidate
      autoComplete="off"
    >
      <Box display="flex" justifyContent="center" mb={2}>
        <img src={logo} style={{ width: '200px', height: 'auto' }} alt="Logo" />
      </Box>

      {localStorage.getItem('user') && (
        <>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          ola usuario con id {localStorage.getItem('user')} estas logeado...
        </Typography>

        <Button
          variant="contained"
          sx={{ backgroundColor: 'gray', color: 'white', mb: 2 }} // Custom gray color
          onClick={handleLogout} // Handle Login button click
          >
          Cerrar sesión
        </Button>
        </>
      )}

      {!localStorage.getItem('user') && (
      <>
      <Button
        variant="contained"
        sx={{ backgroundColor: 'gray', color: 'white', mb: 2 }} // Custom gray color
        onClick={handleLogin} // Handle Login button click
      >
        Iniciar sesión
      </Button>

      <Button
        variant="contained"
        sx={{ backgroundColor: 'gray', color: 'white' }} // Custom gray color
        onClick={handleRegister} // Handle Register button click
      >
        Registrarse
      </Button>
      </>
      )}
    </Box>
  );
}
export default UserInfo;
