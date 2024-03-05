// components/RegisterForm.jsx

import React, { useState } from 'react';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import supabase from '../Supabase';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleRegister = async () => {
    try {
      // Insertar un nuevo registro según el rol seleccionado
      if (role === 'profesor') {
        await supabase.from('profesor').upsert([
          {
            nombre_pro: name,
            apellido_pro: lastname,
            user_pro: user,
            key_pro: password // Ajusta según tus necesidades
          },
        ]);
      } else if (role === 'estudiante') {
        await supabase.from('estudiante').upsert([
          {
            nombre_est: name,
            apellido_est: lastname,
            user_est: user,
            key_est: password // Ajusta según tus necesidades
          },
        ]);
      }

      console.log('Registro exitoso');
      // Aquí puedes realizar acciones adicionales después de un registro exitoso

    } catch (error) {
      console.error('Error durante el registro:', error.message);
      // Manejar el error según sea necesario
    }
  };

  return (
    <div>
      <TextField label="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label="Apellido" value={lastname} onChange={(e) => setLastname(e.target.value)} />
      <TextField label="Usuario" value={user} onChange={(e) => setUser(e.target.value)} />
      <TextField label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <FormControl>
        <InputLabel id="rol-label">Rol</InputLabel>
        <Select
          labelId="rol-label"
          id="rol-select"
          value={role}
          label="Rol"
          onChange={(e) => setRole(e.target.value)}
        >
          <MenuItem value="profesor">Profesor</MenuItem>
          <MenuItem value="estudiante">Estudiante</MenuItem>
        </Select>
      </FormControl>

      <Button onClick={handleRegister}>Registrarse</Button>
    </div>
  );
};

export default RegisterForm;
