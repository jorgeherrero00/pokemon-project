import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
let url;
function Pokemon(){
    const [listaPokemons, setListaPokemons] = useState([]);
    function cargarMas(){
        fetch(url)
      .then((response) => response.json())
      .then((datosPokemons) => {
        url = datosPokemons.next
        console.log(datosPokemons.results);
        setListaPokemons([...listaPokemons,...datosPokemons.results]);
      });
  }
    useEffect(()=>{
   fetch("https://pokeapi.co/api/v2/pokemon/?offset=8&limit=8")
      .then((response) => response.json())
      .then((datosPokemons) => {
        url = datosPokemons.next
        console.log(datosPokemons.results);
        setListaPokemons([...datosPokemons.results]);
      });
  }, []);
  console.log(listaPokemons);

  let lista = listaPokemons.map(nombre=><Link to={"/Detalle/"+nombre.name}><li>{nombre.name}</li></Link>);
    return (
        <>
            <h1>Componente para lista Pokemons</h1>
            {lista}
            <button onClick={cargarMas}></button>
        </>
    )
}

export default Pokemon;