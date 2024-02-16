import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

function InicioSesion() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleInicioSesion = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Usuario autenticado:', user);
      setMensaje('¡Inicio de sesión exitoso!'); // Mensaje de confirmación
      // Puedes redirigir al usuario a otra página o realizar otras acciones después del inicio de sesión
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
      setMensaje('Error al iniciar sesión. Por favor, verifica tu correo y contraseña.'); // Mensaje de error
      // Maneja el error, muestra un mensaje de error, etc.
    }
  };

  return (
    <div>
      <h2 style={{marginTop:'50px'}}>Inicio de Sesión</h2>
      {mensaje && <p>{mensaje}</p>}
      <form>
        <label>
          Correo electrónico:
          <input type="email" value={email} onChange={handleEmailChange} />
        </label>
        <br />
        <label>
          Contraseña:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <br />
        <button type="button" onClick={handleInicioSesion}>
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}

export default InicioSesion;
