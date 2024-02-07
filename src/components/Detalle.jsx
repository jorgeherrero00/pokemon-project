import { useState } from 'react'
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
function Detalle() {
    const [listaDetalles, setListaDetalles] = useState([]);

    let {id} = useParams();
        useEffect(()=>{
            fetch("https://pokeapi.co/api/v2/pokemon/"+id)
               .then((response) => response.json())
               .then((datosPokemons) => {
                 console.log(datosPokemons);
                 setListaDetalles(datosPokemons)
               });
           }, []);
           
    return (
        <>
            <h2>{listaDetalles.name}</h2>
            <img src={listaDetalles.sprites && listaDetalles.sprites.back_default} alt="" />´
            <p>Experiencia: {listaDetalles.base_experience}</p>
            <p>Habilidades: </p>
            <ul>
                {listaDetalles.abilities &&
                    listaDetalles.abilities.map((ability, index) => (
                        <li key={index}>{ability.ability.name}</li>
                    ))}
            </ul>
            <p>Altura: {listaDetalles.height}0 cm</p>
            <p>Peso: {listaDetalles.weight/10}kg</p>
            <p>Stats: </p>
            <ul>
                {listaDetalles.stats &&
                    listaDetalles.stats.map((stat, index) => (
                        <li key={index}>
                            {stat.stat.name}: {stat.base_stat}
                        </li>
                    ))}
            </ul>
        </>
    );
}

export default Detalle;