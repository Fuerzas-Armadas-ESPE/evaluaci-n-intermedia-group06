// App.jsx

import React, { useState } from 'react';
import Login from './login';
import InterfazProfesor from './InterfazProfesor';

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (userInfo) => {
    setUser(userInfo);
  };

  const handleLogout = () => {
    setUser(null);
  };
  
  return (
    <div>
      {user ? (
        <div>
          {user.role === 'profesor' && (
            <InterfazProfesor
              nombre={user.nombre}
              apellido={user.apellido}
              id={user.id}
              onLogout={handleLogout}
            />
          )}
          {user.role === 'estudiante' && (
            <h1>Bienvenido, Estudiante con clave primaria: {user.nombre}</h1>
          )}
          {/* Aquí deberías redirigir al componente correspondiente según el rol */}
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
