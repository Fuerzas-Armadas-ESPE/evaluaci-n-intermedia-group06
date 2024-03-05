import React, { useState } from 'react';
import { Button, Container, AppBar, Toolbar, Typography, Paper } from '@mui/material';
import CursoList from './components/CursoList';
import TemaList from './components/TemaList';

const InterfazProfesor = ({ nombre, apellido, id, onLogout, handleMenuClick }) => {
  const [menuSeleccionado, setMenuSeleccionado] = useState(null);

  return (
    <Container
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Bienvenido Profesor {nombre} {apellido}
          </Typography>
          <Button color="inherit" onClick={onLogout}>
            Cerrar Sesión
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ flexGrow: 1, padding: 2 }}>
        {/* Contenido principal de la interfaz */}
        <Paper elevation={3} sx={{ padding: '20px', margin: '20px', textAlign: 'center' }}>
          <div sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button color="primary" onClick={() => setMenuSeleccionado('Cursos')}>
              Cursos
            </Button>
            <Button color="primary" onClick={() => setMenuSeleccionado('Temas')}>
              Temas
            </Button>
            <Button color="primary" onClick={() => setMenuSeleccionado('Actividades')}>
              Actividades
            </Button>
            <Button color="primary" onClick={() => setMenuSeleccionado('Asignaciones')}>
              Asignaciones
            </Button>
          </div>

          {/* Añade el componente correspondiente al menú seleccionado */}
          {menuSeleccionado === 'Cursos' && <CursoList idProfesor={id} />}
          {menuSeleccionado === 'Temas' && <TemaList idProfesor={id} />}
        </Paper>
      </Container>
    </Container>
  );
};

export default InterfazProfesor;
