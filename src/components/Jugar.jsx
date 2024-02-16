import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function Jugar() {
  const auth = getAuth();
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);
  const [pokemonData, setPokemonData] = useState(null);
  const [opciones, setOpciones] = useState([]);
  const [respuestaCorrecta, setRespuestaCorrecta] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [puedeHacerClick, setPuedeHacerClick] = useState(true);
  const [puntaje, setPuntaje] = useState(0);
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuarioAutenticado(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setPuedeHacerClick(true);
      const randomPokemonId = Math.floor(Math.random() * 800) + 1;
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`);
      if (response.ok) {
        const datosPokemons = await response.json();
        setPokemonData(datosPokemons);

        const nombres = [datosPokemons.name];
        for (let i = 0; i < 3; i++) {
          const randomId = Math.floor(Math.random() * 800) + 1;
          const randomResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
          if (randomResponse.ok) {
            const randomPokemon = await randomResponse.json();
            nombres.push(randomPokemon.name);
          }
        }

        const shuffledNombres = nombres.sort(() => Math.random() - 0.5);
        setOpciones(shuffledNombres);
        setRespuestaCorrecta(datosPokemons.name);
        setMensaje('');
      } else {
        console.error(`Error en la petición: ${response.status} - ${response.statusText}`);
        setMensaje('Error al cargar el Pokémon. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al realizar la petición:', error);
      setMensaje('Error al cargar el Pokémon. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    cargarRanking();
  }, []);

  const cargarRanking = async () => {
    try {
      const rankingCollection = collection(db, 'ranking');
      const rankingQuery = query(rankingCollection, orderBy('puntaje', 'desc'), limit(10));
      const rankingSnapshot = await getDocs(rankingQuery);
      const rankingData = rankingSnapshot.docs.map((doc) => doc.data());
      setRanking(rankingData);
    } catch (error) {
      console.error('Error al cargar el ranking:', error);
    }
  };

  const handleClick = async (opcion) => {
    if (puedeHacerClick) {
      setPuedeHacerClick(false);
  
      if (opcion === respuestaCorrecta) {
        setMensaje('¡Correcto!');
        setPuntaje((prevPuntaje) => prevPuntaje + 1); // Sumar 1 punto al puntaje actual
      } else {
        setMensaje('Incorrecto. Intenta de nuevo.');
        setPuntaje((prevPuntaje) => Math.max(prevPuntaje - 1, 0)); // Restar 1 punto, asegurándote de que no sea menor que 0
      }
  
      await agregarAlRanking();
  
      fetchData();
    }
  };

  const agregarAlRanking = async () => {
    try {
      if (usuarioAutenticado) {
        const rankingCollection = collection(db, 'ranking');
        const usuarioQuery = query(rankingCollection, where('userId', '==', usuarioAutenticado.uid));
        const usuarioSnapshot = await getDocs(usuarioQuery);

        if (usuarioSnapshot.docs.length > 0) {
          const usuarioDoc = usuarioSnapshot.docs[0];
          await updateDoc(usuarioDoc.ref, {
            puntaje: puntaje + usuarioDoc.data().puntaje,
          });
        } else {
          await addDoc(rankingCollection, {
            userId: usuarioAutenticado.uid,
            nombre: usuarioAutenticado.displayName ? usuarioAutenticado.displayName : usuarioAutenticado.email,
            puntaje,
            fecha: serverTimestamp(),
          });
        }
      } else {
        // Manejar el caso en el que no hay un usuario autenticado (puedes ignorar, mostrar mensaje, etc.)
      }

      cargarRanking();
    } catch (error) {
      console.error('Error al agregar al ranking:', error);
    }
  };

  return (
    <div className="container">
      <div className="juego">
        {pokemonData && (
          <>
            <h2>Adivina el Pokémon:</h2>
            <img src={pokemonData.sprites.other['official-artwork'].front_default} alt={pokemonData.name} className="silueta" />
            <div>
              {opciones.map((opcion, index) => (
                <button key={index} onClick={() => handleClick(opcion)} disabled={!puedeHacerClick}>
                  {opcion}
                </button>
              ))}
            </div>
            <p className={mensaje.startsWith('¡') ? 'mensaje-correcto' : 'mensaje-incorrecto'}>{mensaje}</p>
          </>
        )}
        {isLoading && <div className="traffic-loader"></div>}
      </div>
  
      <div className="ranking">
  <h3>Ranking:</h3>
  <ul>
    {ranking.map((jugador, index) => (
      <li key={index}>
        {index + 1}. {jugador.nombre ? jugador.nombre : jugador.email} - Puntaje: {jugador.puntaje}
      </li>
    ))}
  </ul>
</div>
    </div>
  );
  
}

export default Jugar;
