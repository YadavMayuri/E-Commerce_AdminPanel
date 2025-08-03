import './App.css'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './Components/Dashboard'
import Register from './Components/Register'
import Login from './Components/Login'
import SingleProduct from './Components/SingleProduct'

function App() {
 
  return (
    <>
    <Routes>

      <Route path='/' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/singleProduct' element={<SingleProduct/>}/>

    </Routes>
     
    </>
  )
}

export default App
