import React from 'react'
import ReactDOM from 'react-dom/client'
import './globals.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import App from "./App.tsx";
import TransformMatrices from "./playgrounds/TransformMatrices/TransformMatrices.tsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/transformmatrices',
        element: <TransformMatrices />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
