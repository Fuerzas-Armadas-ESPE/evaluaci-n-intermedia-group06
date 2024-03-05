import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Button, Container, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import supabase from '../Supabase';

const TemaList = ({ idProfesor }) => {
    const [temas, setTemas] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [selectedCurso, setSelectedCurso] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTema, setSelectedTema] = useState(null);
    const [titulo, setTitulo] = useState('');
    const [objetivo, setObjetivo] = useState('');

    useEffect(() => {
        async function fetchCursos() {
            try {
                let { data: cursos, error } = await supabase
                    .from('curso')
                    .select('id_cur')
                    .eq('id_pro_cur', idProfesor);

                if (error) {
                    throw error;
                }

                setCursos(cursos);
            } catch (error) {
                console.error('Error fetching cursos:', error.message);
            }
        }
        fetchCursos();

        async function fetchTemas() {
            try {
                let { data: cursos, error } = await supabase
                    .from('curso')
                    .select('id_cur')
                    .eq('id_pro_cur', idProfesor);

                if (error) {
                    throw error;
                }

                const idCursos = cursos.map((curso) => curso.id_cur);

                let { data: temas, error: temaError } = await supabase
                    .from('tema')
                    .select('*')
                    .in('id_cur_tem', idCursos);

                if (temaError) {
                    throw temaError;
                }

                setTemas(temas);

            } catch (error) {
                console.error('Error fetching temas:', error.message);
            }
        }
        fetchTemas();

    }, [idProfesor]);

    const handleOpenDialog = (tema = null) => {
        setSelectedCurso(tema ? tema.id_cur_tem : null);
        setSelectedTema(tema ? tema.id_tem : null);
        setTitulo(tema ? tema.titulo_tem : '');
        setObjetivo(tema ? tema.objetivo_tem : '');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setSelectedCurso(null);
        setSelectedTema(null);
        setTitulo('');
        setObjetivo('');
        setOpenDialog(false);
    };

    const handleCreateOrUpdateTema = async () => {
        try {
            if (selectedTema) {
                // Lógica para modificar el tema
                await supabase
                    .from('tema')
                    .update({
                        titulo_tem: titulo,
                        objetivo_tem: objetivo,
                    })
                    .eq('id_tem', selectedTema);
            } else {
                // Lógica para crear un nuevo tema
                await supabase
                    .from('tema')
                    .upsert([
                        {
                            titulo_tem: titulo,
                            objetivo_tem: objetivo,
                            id_cur_tem: selectedCurso,
                        },
                    ]);
            }

            // Actualizar la lista de temas
            fetchTemas();
            handleCloseDialog();
        } catch (error) {
            console.error('Error creating/updating tema:', error.message);
        }
    };

    const handleBorrarTema = async (idTema) => {
        try {
            // Lógica para borrar el tema
            await supabase
                .from('tema')
                .delete()
                .eq('id_tem', idTema);

            // Actualizar la lista de temas
            fetchTemas();
        } catch (error) {
            console.error('Error deleting tema:', error.message);
        }
    };

    return (
        <Container>
            {/* Agrega la caja de selección de cursos */}
            <Select
                label="Selecciona un curso"
                value={selectedCurso}
                onChange={(e) => setSelectedCurso(e.target.value)}
            >
                {cursos.map((curso) => (
                    <MenuItem key={curso.id_cur} value={curso.id_cur}>
                        {curso.id_cur}
                    </MenuItem>
                ))}
            </Select>

            {/* Botón para crear un nuevo tema o modificar uno existente */}
            <Button
                sx={{ bgcolor: '#1976D2', color: 'white', margin: '8px' }}
                onClick={() => handleOpenDialog()}
            >
                Crear Tema
            </Button>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Título</TableCell>
                        <TableCell>Objetivo</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {temas.map((tema) => (
                        <TableRow key={tema.id_tem}>
                            <TableCell>{tema.id_tem}</TableCell>
                            <TableCell>{tema.titulo_tem}</TableCell>
                            <TableCell>{tema.objetivo_tem}</TableCell>
                            <TableCell>
                                <Button
                                    sx={{ bgcolor: '#4CAF50', color: 'white', marginRight: '8px' }}
                                    onClick={() => handleOpenDialog(tema)}
                                >
                                    Modificar
                                </Button>
                                <Button
                                    sx={{ bgcolor: '#F44336', color: 'white', marginRight: '8px' }}
                                    onClick={() => handleBorrarTema(tema.id_tem)}
                                >
                                    Borrar
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Diálogo para Crear/Modificar Tema */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{selectedTema ? 'Modificar Tema' : 'Crear Nuevo Tema'}</DialogTitle>
                <DialogContent>
                    <TextField label="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
                    <TextField label="Objetivo" value={objetivo} onChange={(e) => setObjetivo(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleCreateOrUpdateTema}>Guardar</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default TemaList;
