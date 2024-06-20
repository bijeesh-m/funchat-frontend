import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { v4 as uuidv4 } from "uuid";

const socket = io("http://localhost:5000");

const userId = uuidv4(); // Unique identifier for the user

const Chat = () => {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [typing, setTyping] = useState(false);
    const [scroll, setScroll] = useState(false);

    const messagesEndRef = useRef(null);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message !== "") {
            socket.emit("chat", message);
            setChat((prevMessages) => [...prevMessages, { text: message, received: false }]);
            setMessage("");
        }
    };

    useEffect(() => {
        socket.on("chat", (message) => {
            setScroll(!scroll);
            setChat((prevMessages) => [...prevMessages, { text: message, received: true }]);
        });

        return () => {
            socket.off("chat");
        };
    });

    useEffect(() => {
        messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }, [scroll]);

    const handleChange = (e) => {
        setTyping(true)
        io.emit("typing")
        setMessage(e.target.value);
    };

    return (
        <div className=" h-screen flex">
            <div className=" w-1/4 h-screen bg-white">
                <div className=" flex items-center justify-between  text-xl font-bold p-5 border-black border-b shadow-sm shadow-fuchsia-700">
                    <p>Fun Chat</p>
                    <Tooltip title="Add new chat" arrow col>
                        <AddIcon className=" cursor-pointer" />
                    </Tooltip>
                </div>

                <div className="  w-full border-b ">
                    <button className=" w-full  p-3 justify-between gap-5 flex items-center">
                        <div className=" flex items-center">
                            <div className=" w-10 h-10 rounded-full bg-black"></div>
                            <p className=" p-2 text-lg">Bijeesh</p>
                        </div>
                        <span class="inline-flex items-center justify-center w-6 h-6 ms-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
                            99+
                        </span>
                    </button>
                </div>
            </div>
            <div className="  flex-1 flex flex-col justify-between ">
                <div className=" border-l border-black border-b shadow-sm shadow-fuchsia-700 ">
                    <p className=" p-5 text-lg">User</p>
                </div>
                <form onSubmit={handleSendMessage} className="p-5 ">
                    <div ref={messagesEndRef} id="chat-container" className=" mb-8 pr-7 max-h-[400px] overflow-y-auto">
                        {chat.map((payload) => {
                            return (
                                <div className={`   ${!payload?.received && "flex justify-end "} w-full`}>
                                    <p className=" py-1 w-fit px-2 m-3 bg-white rounded-md">{payload.text}</p>
                                </div>
                            );
                        })}
                    </div>
                    <div className=" flex gap-2">
                        <TextField
                            size="small"
                            value={message}
                            onChange={(e) => handleChange(e)}
                            name="message"
                            className=" bg-white rounded-md text-xs w-full"
                            placeholder="Write your message"
                        />
                        <button className=" flex-1">
                            <SendIcon fontSize="large" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Chat;
