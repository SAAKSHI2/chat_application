import Chat from "./pages/Chat";
import Login from "./pages/Login"
import Register from "./pages/Register";
import io from "socket.io-client";
import {BrowserRouter, Routes,Route } from 'react-router-dom';
import Groups from "./pages/Groups";

const socket = io.connect("http://localhost:3001");


function App() {

  return(
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/register" element={<Register />} />
      <Route path="/chats" element={<Groups socket={socket}/>}/>
      <Route path="/displayChats" element={<Chat socket ={socket}/>}/>

    </Routes>
  </BrowserRouter>
  )

}

export default App;
