import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

function Registro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleRegistro = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Usuario registrado:', user);
      setMensaje('¡Registro exitoso!'); // Mensaje de confirmación
      // Puedes redirigir al usuario a otra página o realizar otras acciones después del registro
    } catch (error) {
      console.error('Error al registrar al usuario:', error.message);
      setMensaje('Error al registrarse. Por favor, intenta de nuevo.'); // Mensaje de error
      // Maneja el error, muestra un mensaje de error, etc.
    }
  };

  return (
    <div>
      <h2>Registro</h2>
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
        <button type="button" onClick={handleRegistro}>
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default Registro;
