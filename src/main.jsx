import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Pokemon from './components/Pokemon.jsx';
import Cabecera from './components/Cabecera.jsx';
import Detalle from './components/Detalle.jsx';
import Jugar from './components/Jugar.jsx';
import Landing from './components/Landing.jsx';
import InicioSesion from './components/InicioSesion.jsx';
import Registro from './components/Registro.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: 
      <>
        <Cabecera></Cabecera>
        <Landing></Landing>
      </>,
    errorElement:<h1>Ruta no apta</h1>
  },
  {
    path: "pokemon",
    element: 
      <>
          <Cabecera></Cabecera>
          <Pokemon></Pokemon>
      </>
    
    
  },
  {
    path: "detalle/:id",
    element: 
      <Detalle></Detalle>
  },
  {
    path:"jugar",
    element:
    <>
        <Cabecera></Cabecera>
        <Jugar></Jugar>
    </>

  },
  {
    path:"inicioSesion",
    element:
    <>
      <Cabecera></Cabecera>
      <InicioSesion></InicioSesion>
    </>
  },
  {
    path:"registro",
    element:
    <>
    <Cabecera></Cabecera>
    <Registro></Registro>
  </>  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router}></RouterProvider>
)
