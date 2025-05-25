import { BrowserRouter } from 'react-router-dom'
import AppRoute from './routes/AppRoute'
import { Toaster } from 'react-hot-toast'

function App() {

  return (
    <BrowserRouter>
      <AppRoute />    
      <Toaster />
    </BrowserRouter>
  )
}

export default App
