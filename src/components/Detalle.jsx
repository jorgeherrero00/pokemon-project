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
          backgroundColor: 'rgba(75,192,192,0.2)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <>
      <div className='div-detalles'>
        <h2 style={{textTransform:'uppercase'}}>{listaDetalles?.name}</h2>
        <img
          src={listaDetalles?.sprites?.other?.showdown?.front_default}
          alt=""
        />
        <p>Experiencia: {listaDetalles?.base_experience}</p>
        <p>Habilidades: </p>
        <ul>
          {listaDetalles?.abilities &&
            listaDetalles.abilities.map((ability, index) => (
              <li key={index}>{ability.ability.name}</li>
            ))}
        </ul>
        <p>Altura: {listaDetalles?.height}0 cm</p>
        <p>Peso: {listaDetalles?.weight / 10}kg</p>
        <p>Stats: </p>
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
        barThickness: 20, // Ajusta este valor según tus preferencias
      },
    },
  }}
/>
        <Link to="/">Volver</Link>
      </div>
    </>
  );
}

export default Detalle;
