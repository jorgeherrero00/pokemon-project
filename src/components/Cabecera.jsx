import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';

function Cabecera() {
    const [name, setName] = useState('');
    const [pokemonBusqueda, setPokemonBusqueda] = useState([]);

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
                    }
                }
            } catch (error) {
                console.error('Error al realizar la petición:', error);
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

    const handleInputChange = (event) => {
        setName(event.target.value);
    };

    return (
        <>
            <Link to="/">Inicio</Link>
            <Link to="/pokemon">Pokemons</Link>
            <input
                type="text"
                placeholder="Buscar pokemons..."
                value={name}
                onChange={handleInputChange}  
            />

            <h2>Resultados de la búsqueda: </h2>
            <h4>{pokemonBusqueda.name}</h4>
        </>
    );
}

export default Cabecera;
