import './App.css'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './Components/Dashboard'
import Register from './Components/Register'
import Login from './Components/Login'
import AddProduct from './Components/AddProduct'

function App() {
 
  return (
    <>
    <Routes>

      <Route path='/' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/addProduct' element={<AddProduct/>}/>

      

    </Routes>
     
    </>
  )
}

export default App
