import { Link } from "react-router-dom";
function Cabecera(){


    function busquedaPokemons(){

    }
    return(
        <>
        <Link to="/">Inicio</Link>
        <Link to="/pokemon">Pokemons</Link>
        <input type="text" placeholder="Buscar pokemons..." />
        </>
    )
}

export default Cabecera;