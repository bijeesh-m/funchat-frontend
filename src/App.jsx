import { useEffect, useState } from "react";
import "./App.css";
import "./index.css"
import io from "socket.io-client";
import { nanoid } from "nanoid";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./pages/Sidebar";
import Chat from "./pages/Chat";

const socket = io("http://localhost:5000");

function App() {
    return(
        <div>
            <Routes>
                <Route path="/" element={<Chat/>}/>
            </Routes>
        </div>
    )
}

export default App;
