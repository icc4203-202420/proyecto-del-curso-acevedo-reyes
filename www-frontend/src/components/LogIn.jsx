import { Typography, Avatar, Button } from "@mui/material";
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom'; // Para la redirección

function LogIn() {
  const [formData, setFormData] = React.useState({
    nombreUsuario: '',
    contraseña: '',
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleBack = () => {
    navigate('/user'); // Redirige a "/user" al hacer clic en "Volver"
  };

  const handleSubmit = () => {
    // Por ahora no hacer nada
  };

  return (
    <Box
      className="login-form-container"
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
      noValidate
      autoComplete="off"
    >
      <Avatar sx={{ mr: 1, fontSize: '120px' }}>
        <LockOutlinedIcon />
      </Avatar>

      <Typography variant="h5" align="center" paragraph>
        Iniciar sesión
      </Typography>

      <TextField
        id="nombreUsuario"
        label="Nombre de Usuario"
        variant="outlined"
        name="nombreUsuario"
        value={formData.nombreUsuario}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        id="contraseña"
        label="Contraseña"
        type="password"
        variant="outlined"
        name="contraseña"
        value={formData.contraseña}
        onChange={handleChange}
        fullWidth
      />

      <Box display="flex" justifyContent="center" width="100%">
        <Button
          variant="outlined"
          sx={{ mr: 2, color: 'orange', borderColor: 'orange' }}
          onClick={handleBack} // Botón para regresar a "/user"
        >
          Volver
        </Button>
        <Button
          variant="outlined"
          color="success"
          onClick={handleSubmit} // Sin acción por el momento
        >
          Continuar
        </Button>
      </Box>
    </Box>
  );
}

export default LogIn;
