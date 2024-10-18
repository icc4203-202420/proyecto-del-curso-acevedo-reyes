import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, CircularProgress, Box, Grid, Link } from '@mui/material';
import axios from 'axios';

function UsersList({ searchKeywords }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:3001/api/v1/users')
      .then(response => {
        setUsers(response.data.users);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Failed to load users.</Typography>;

  // Filtrar usuarios en base a las palabras claves de búsqueda
  const filteredUsers = users.filter(user => 
    `${user.handle}`.toLowerCase().includes(searchKeywords.toLowerCase())
  );

  return (
    <Box>
      {filteredUsers.map(user => (
        <Grid container spacing={2} alignItems="center" key={user.id} sx={{ mb: 3 }}>
          <Grid item xs={8}>
            <Typography variant="caption">
              {user.first_name} {user.last_name} - {user.email}
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Link
              key={user.id}
              component={RouterLink}
              to={`/users/${user.id}`}
              underline="none"
            >
              <Typography variant="h6" fontWeight="bold">
                {user.handle}
              </Typography>
            </Link>
          </Grid>
        </Grid>
      ))}
    </Box>
  );
}

export default UsersList;
