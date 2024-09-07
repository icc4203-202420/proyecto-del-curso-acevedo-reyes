import React from 'react';
import { AppBar, Box, Toolbar, InputBase, alpha } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';

// Componentes estilizados
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

function SearchAppBar({ searchKeywords, setSearchKeywords }) {
  const handleInputChange = (event) => {
    setSearchKeywords(event.target.value);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: 'lightgray' }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Search sx={{ bgcolor: 'white', width: '60%', display: 'flex', alignItems: 'center' }}>
              <SearchIconWrapper>
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Introduzca su búsqueda"
                inputProps={{ 'aria-label': 'search' }}
                value={searchKeywords}
                onChange={handleInputChange}
              />
            </Search>
            <SearchIcon />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default SearchAppBar;
