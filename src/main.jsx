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

const router = createBrowserRouter([
  {
    path: "/",
    element: 
      <>
        <Cabecera></Cabecera>
        <App></App>
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
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
)
