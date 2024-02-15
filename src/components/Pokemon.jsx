import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Pokemon() {
  const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon/?offset=8&limit=8");
  const [listaPokemons, setListaPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const cargarMas = () => {
    setIsLoading(true); // Activar indicador de carga
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((datosPokemons) => {
        setUrl(datosPokemons.next);
        let pokemonDetailsPromises = datosPokemons.results.map((pokemon) =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
            .then((response) => response.json())
        );

        Promise.all(pokemonDetailsPromises)
          .then((pokemonDetails) => {
            let updatedPokemons = pokemonDetails.map((detail) => ({
              id: detail.id,
              name: detail.name,
              image: detail.sprites?.other?.showdown?.front_default,
              types: detail.types.map((type) => type.type.name),
            }));
            setListaPokemons([...listaPokemons, ...updatedPokemons]);
          })
          .catch((error) => {
            console.error("Error fetching Pokemon details", error);
          })
          .finally(() => {
            setIsLoading(false); // Desactivar indicador de carga después de completar la carga
          });
      })
      .catch((error) => {
        console.error("Error fetching Pokemon data", error);
        setIsLoading(false); // Desactivar indicador de carga en caso de error
      });
  };

  useEffect(() => {
    cargarMas(); // Carga inicial
  }, []);

  function obtenerClaseTipo(tipos) {
    const tipoClases = {
      normal: "normal",
      fighting: "fighting",
      flying: "flying",
      poison: "poison",
      ground: "ground",
      rock: "rock",
      bug: "bug",
      ghost: "ghost",
      steel: "steel",
      fire: "fire",
      water: "water",
      grass: "grass",
      electric: "electric",
      psychic: "psychic",
      ice: "ice",
      dragon: "dragon",
      dark: "dark",
      fairy: "fairy",
    };

    // Check if tipos is defined and not empty
    if (tipos && tipos.length > 0) {
      const claseTipo = tipos.find((tipo) => tipoClases[tipo]);

      // Return the class corresponding to the found type, or a default class if not found
      return claseTipo ? tipoClases[claseTipo] : "";
    }

    // Return a default class if tipos is undefined or empty
    return "";
  }

  let lista = listaPokemons.map((pokemon) => (
    <Link to={`/Detalle/${pokemon.name}`} key={pokemon.name}>
      <div className="grupo">
        <div className={`carta contenedor-cartas ${obtenerClaseTipo(pokemon.types)}`}>
          <p className="nombre" style={{ listStyle: "none" }}>
            {pokemon.name}
          </p>
          <p style={{ color: "black" }}>Pokemon Nº {pokemon.id}</p>
          <p
            style={{ color: "black" }}
            className={`tipos ${obtenerClaseTipo(pokemon.types)}`}
          >
            Tipo: <span>{pokemon.types.join(", ")}</span>
          </p>
          <img
            className="carta-img"
            style={{ width: "70px", marginBottom: "25px" }}
            src={pokemon.image}
            alt={pokemon.name}
          />
        </div>
      </div>
    </Link>
  ));

  return (
    <>
      <div className="grupo-cartas">{lista}</div>
      {isLoading && <div className="traffic-loader"></div>}
      {!isLoading && (
        <button onClick={cargarMas} disabled={isLoading}>
          Cargar Más
        </button>
      )}
    </>
  );
}

export default Pokemon;
