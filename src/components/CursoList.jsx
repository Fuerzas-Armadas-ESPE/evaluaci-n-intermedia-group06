import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import supabase from '../Supabase';

const CursoList = ({ idProfesor }) => {
  const [cursos, setCursos] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [nombreCurso, setNombreCurso] = useState('');
  const [selectedCurso, setSelectedCurso] = useState(null);

  useEffect(() => {
    // Cargar cursos al montar el componente
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    try {
      const { data, error } = await supabase
        .from('curso')
        .select('*')
        .eq('id_pro_cur', idProfesor);

      if (error) {
        console.error('Error fetching cursos:', error.message);
        throw error;
      }

      setCursos(data || []);
    } catch (error) {
      // Manejar el error según sea necesario
      console.error('Error durante la carga de cursos:', error.message);
    }
  };

  const handleOpenDialog = (curso) => {
    setSelectedCurso(curso);
    setNombreCurso(curso ? curso.nombre_cur : '');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedCurso(null);
    setNombreCurso('');
    setOpenDialog(false);
  };

  const handleGuardarCurso = async () => {
    try {
      if (selectedCurso) {
        // Modificar curso existente
        await supabase
          .from('curso')
          .upsert([
            {
              id_cur: selectedCurso.id_cur,
              nombre_cur: nombreCurso,
              id_pro_cur: idProfesor,
            },
          ]);
      } else {
        // Crear nuevo curso
        await supabase
          .from('curso')
          .upsert([
            {
              nombre_cur: nombreCurso,
              id_pro_cur: idProfesor,
            },
          ]);
      }

      // Actualizar la lista de cursos
      fetchCursos();
      handleCloseDialog();
    } catch (error) {
      // Manejar el error según sea necesario
      console.error('Error al guardar el curso:', error.message);
    }
  };

  const handleBorrarCurso = async (cursoId) => {
    try {
      await supabase.from('curso').delete().eq('id_cur', cursoId);
      // Actualizar la lista de cursos
      fetchCursos();
    } catch (error) {
      // Manejar el error según sea necesario
      console.error('Error al borrar el curso:', error.message);
    }
  };

  return (
    <div>
      <Button sx={{ bgcolor: '#1976D2', color: 'white' }}  onClick={() => handleOpenDialog(null)}>Nuevo Curso</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre del Curso</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cursos.map((curso) => (
              <TableRow key={curso.id_cur}>
                <TableCell>{curso.id_cur}</TableCell>
                <TableCell>{curso.nombre_cur}</TableCell>
                <TableCell>
                  <Button sx={{ bgcolor: '#4CAF50', color: 'white' , marginRight: '8px' }} onClick={() => handleOpenDialog(curso)}>Editar</Button>

                  <Button sx={{ bgcolor: '#F44336', color: 'white' , marginRight: '8px'}} onClick={() => handleBorrarCurso(curso.id_cur)}>Borrar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para Crear/Modificar Curso */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedCurso ? 'Editar Curso' : 'Nuevo Curso'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre del Curso"
            value={nombreCurso}
            onChange={(e) => setNombreCurso(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleGuardarCurso}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CursoList;
