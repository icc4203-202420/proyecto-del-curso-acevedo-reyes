import { Typography, Avatar, Button } from "@mui/material";
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { useNavigate } from 'react-router-dom'; // Para la redirección

function SignIn() {
  const [formData, setFormData] = React.useState({
    nombre: '',
    apellido: '',
    correoElectronico: '',
    nombreUsuario: '',
    calle: '',
    ciudad: '',
    pais: '',
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
      className="user-info-container"
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
        <PersonOutlinedIcon />
      </Avatar>

      <Typography variant="h5" align="center" paragraph>
        ¡Regístrate!
      </Typography>

      <TextField
        id="nombre"
        label="Nombre"
        variant="outlined"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        id="apellido"
        label="Apellido"
        variant="outlined"
        name="apellido"
        value={formData.apellido}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        id="correoElectronico"
        label="Correo Electrónico"
        variant="outlined"
        name="correoElectronico"
        value={formData.correoElectronico}
        onChange={handleChange}
        fullWidth
      />
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
        id="calle"
        label="Calle"
        variant="outlined"
        name="calle"
        value={formData.calle}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        id="ciudad"
        label="Ciudad"
        variant="outlined"
        name="ciudad"
        value={formData.ciudad}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        id="pais"
        label="País"
        variant="outlined"
        name="pais"
        value={formData.pais}
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

export default SignIn;
