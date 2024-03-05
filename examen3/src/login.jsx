// Login.jsx

import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import RegisterForm from './components/RegisterForm';
import supabase from './Supabase';

const Login = ({ onLogin }) => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  const handleLogin = async () => {
    try {
      // Consultar la tabla de profesor
      const { data: profesores, error: profesorError } = await supabase
        .from('profesor')
        .select('*')
        .eq('user_pro', username)
        .eq('key_pro', password);

      if (profesorError) {
        console.error('Error en la consulta a profesor:', profesorError.message);
        throw profesorError;
      }

      if (profesores.length > 0) {
        // Usuario encontrado en la tabla de profesor
        const { nombre_pro, apellido_pro, id_pro } = profesores[0];
        onLogin({ role: 'profesor', nombre: nombre_pro, apellido: apellido_pro, id: id_pro });
        return;
      }

      // Consultar la tabla de estudiante
      const { data: estudiantes, error: estudianteError } = await supabase
        .from('estudiante')
        .select('*')
        .eq('user_est', username)
        .eq('key_est', password);

      if (estudianteError) {
        console.error('Error en la consulta a estudiante:', estudianteError.message);
        throw estudianteError;
      }

      if (estudiantes.length > 0) {
        // Usuario encontrado en la tabla de estudiante
        const { nombre_est, apellido_est, id_est } = estudiantes[0];
        onLogin({ role: 'estudiante', nombre: nombre_est, apellido: apellido_est, id: id_est });
        return;
      }

      // Si no se encuentra en ninguna tabla
      setWarningMessage('Usuario no registrado');
    } catch (error) {
      console.error('Error durante la autenticación:', error.message);
      // Manejar el error según sea necesario
      setWarningMessage(`Error durante la autenticación: ${error.message}`);
    }
  };

  const handleOpenRegister = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Registro</DialogTitle>
        <DialogContent>
          <RegisterForm />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
      <div>
        {warningMessage && <p style={{ color: 'red' }}>{warningMessage}</p>}
        <TextField label="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
        <TextField label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={handleLogin}>Iniciar sesión</Button>
        <Button onClick={handleOpenRegister}>Registrarse</Button>
      </div>
    </div>
  );
};

export default Login;
