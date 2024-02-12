import React, { useState, useEffect } from 'react';

function Jugar() {
    const [pokemonData, setPokemonData] = useState(null);
    const [opciones, setOpciones] = useState([]);
    const [respuestaCorrecta, setRespuestaCorrecta] = useState('');
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener datos de un Pokémon aleatorio
                const randomPokemonId = Math.floor(Math.random() * 800) + 1;
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`);
                if (response.ok) {
                    const datosPokemons = await response.json();
                    setPokemonData(datosPokemons);

                    // Obtener una lista de nombres de Pokémon para las opciones (incluyendo el nombre correcto)
                    const nombres = [datosPokemons.name];
                    for (let i = 0; i < 3; i++) {
                        const randomId = Math.floor(Math.random() * 800) + 1;
                        const randomResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
                        if (randomResponse.ok) {
                            const randomPokemon = await randomResponse.json();
                            nombres.push(randomPokemon.name);
                        }
                    }

                    // Barajar la lista de nombres
                    const shuffledNombres = nombres.sort(() => Math.random() - 0.5);

                    setOpciones(shuffledNombres);
                    setRespuestaCorrecta(datosPokemons.name);
                    setMensaje('');
                } else {
                    console.error(`Error en la petición: ${response.status} - ${response.statusText}`);
                }
            } catch (error) {
                console.error('Error al realizar la petición:', error);
            }
        };

    }, [mensaje]); // Agregamos 'mensaje' como dependencia para que se vuelva a ejecutar cuando cambie

    const handleClick = (opcion) => {
        if (opcion === respuestaCorrecta) {
            setMensaje('¡Correcto!');
            fetchData();
            // Pasa al siguiente Pokémon después de 2 segundos
        } else {
            setMensaje('Incorrecto. Intenta de nuevo.');
            fetchData();
        }
    };

    return (
        <div>
            {pokemonData && (
                <>
                    <h2>Adivina el Pokémon:</h2>
                    <img src={pokemonData.sprites.other.showdown.front_default} alt={pokemonData.name} className='silueta' />
                    <div>
                        {opciones.map((opcion, index) => (
                            <button key={index} onClick={() => handleClick(opcion)}>
                                {opcion}
                            </button>
                        ))}
                    </div>
                    <p>{mensaje}</p>
                </>
            )}
        </div>
    );
}

export default Jugar;
