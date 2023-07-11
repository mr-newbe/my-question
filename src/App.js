import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import React from 'react';
import { CharactorCounter } from './components/First_echo';
import { Todo_show } from './components/Todo';
function App() {
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/echo" element={<CharactorCounter/>}></Route>
        <Route path='/todo' element={<Todo_show/>}></Route>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
