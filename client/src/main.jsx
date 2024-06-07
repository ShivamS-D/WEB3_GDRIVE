import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'
import GDRIVE from './GDRIVE.jsx'
import { ContractContextProvider } from './ContractContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContractContextProvider>
<Router>
  <Routes>
<Route path='/' element={<App/>}></Route>
<Route path='/buy' element={<GDRIVE/>}></Route>
  </Routes>
    </Router>
    </ContractContextProvider>
  </React.StrictMode>
)
