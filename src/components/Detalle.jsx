import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarController, BarElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarController, BarElement);

function Detalle() {
  const [listaDetalles, setListaDetalles] = useState({});
  let { id } = useParams();

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon/" + id)
      .then((response) => response.json())
      .then((datosPokemons) => {
        console.log(datosPokemons);
        setListaDetalles(datosPokemons);
      });
  }, [id]);

  const getStatsData = () => {
    const labels = listaDetalles?.stats?.map((stat) => stat.stat.name);
    const data = listaDetalles?.stats?.map((stat) => stat.base_stat);

    return {
      labels: labels || [],
      datasets: [
        {
          label: 'Stats',
          data: data || [],
          backgroundColor: 'white',
          borderColor: 'white',
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <>
      <div className='div-detalles'>
        <h2 style={{textTransform:'uppercase',color:'aqua'}}>{listaDetalles?.name}</h2>
        <img
          src={listaDetalles?.sprites?.other?.showdown?.front_default}
          alt=""
        />
        <p className='campoDetalles'>Experiencia: {listaDetalles?.base_experience}</p>
        <ul className='campoDetalles'>
          {listaDetalles?.abilities &&
            listaDetalles.abilities.map((ability, index) => (
              <li style={{listStyle:'none'}} key={index}>Habilidad: {ability.ability.name}</li>
            ))}
        </ul>
        <p className='campoDetalles'>Altura: {listaDetalles?.height}0 cm</p>
        <p className='campoDetalles'>Peso: {listaDetalles?.weight / 10}kg</p>
        <p className='campoDetalles'>Stats: </p>
        <Bar
  data={getStatsData()}
  options={{
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    elements: {
      bar: {
        barThickness: 5, 
      },
    },
  }}
/>


<button style={{color:'black'}}>        <Link to="/">Volver</Link>
</button>
      </div>
    </>
  );
}

export default Detalle;
