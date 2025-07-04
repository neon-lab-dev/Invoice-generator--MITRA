import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Toaster } from 'sonner'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/routes'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <Provider store={store}> */}
        <RouterProvider router={router} />
        <Toaster position="top-center" richColors />
      {/* </Provider> */}
  </React.StrictMode>,
)
