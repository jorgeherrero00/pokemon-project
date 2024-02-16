import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from '../../firebase';

function Cabecera() {
    const [name, setName] = useState('');
    const [pokemonBusqueda, setPokemonBusqueda] = useState(null); // Cambiado a null para manejar la búsqueda correcta
    const [user, setUser] = useState(null);
    const [mensaje, setMensaje] = useState(''); // Nuevo estado para el mensaje de éxito o falla

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (name.trim() !== '') {
                    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
                    if (response.ok) {
                        const datosPokemons = await response.json();
                        console.log(datosPokemons);
                        setPokemonBusqueda(datosPokemons);
                    } else {
                        console.error(`Error en la petición: ${response.status} - ${response.statusText}`);
                        setMensaje('No se encontró el Pokémon. Intenta de nuevo.');
                    }
                }
            } catch (error) {
                console.error('Error al realizar la petición:', error);
                setMensaje('Hubo un error en la búsqueda. Intenta de nuevo.');
            }
        };

        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                fetchData();
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [name]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    const handleInputChange = (event) => {
        setName(event.target.value);
        // Limpiar el estado de la búsqueda y el mensaje al cambiar el input
        setPokemonBusqueda(null);
        setMensaje('');
    };

    const provider = new GoogleAuthProvider();

    function iniciarSesion() {
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log(result.user);
            }).catch((error) => {
                console.error('Error al iniciar sesión:', error);
            });
    }

    function cerrarSesion() {
        signOut(auth).then(() => {
            console.log('Sesión cerrada');
        }).catch((error) => {
            console.error('Error al cerrar sesión:', error);
        });
    }

    return (
        <>
          <nav className="navbar">
            <div className="navbar-container">
              <Link to="/">Inicio</Link>
              <Link to="/pokemon">Pokemons</Link>
              <input
                type="text"
                placeholder="Buscar pokemons..."
                value={name}
                onChange={handleInputChange}
              />
              <h2>{mensaje}</h2>
              {pokemonBusqueda && (
                <>
                  <Link to={"/Detalle/" + pokemonBusqueda.name}>
                    <h4>{pokemonBusqueda.name}</h4>
                  </Link>
                  <img src={`https://pokeapi.co/media/sprites/pokemon/${pokemonBusqueda.id}.png`} alt="" />
                </>
              )}
              {!user ? (
                <>
                <button onClick={iniciarSesion}><img style={{ width: '20px',marginLeft:'550px' }} src="../public/img/google.png" alt="" /></button>
                <Link to="/inicioSesion"><button>Inicio de Sesión</button></Link>
                <Link to="/registro"><button>Registrarse</button></Link>
              </>
              ) : (
                <>
                <Link to="/jugar">Jugar</Link>
                  <p style={{color:'white',marginLeft: '650px'}}>{user.displayName || user.email}</p>
                  <button onClick={cerrarSesion}>Cerrar Sesión</button>
                </>
                
              )}
            </div>
          </nav>
        </>
      );
      
}

export default Cabecera;
