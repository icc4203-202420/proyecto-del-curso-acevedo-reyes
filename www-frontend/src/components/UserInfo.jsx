import * as React from 'react';
import Box from '@mui/material/Box';
import logo from '../assets/logo.png';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

function UserInfo() {
  const navigate = useNavigate(); // Hook for navigation

  const handleRegister = () => {
    navigate('/'); // Redirect to the Register page
  };

  const handleLogin = () => {
    navigate('/'); // Redirect to the Login page
  };

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
    </Box>
  );
}
export default UserInfo;
