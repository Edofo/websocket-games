import React, { useState, useEffect } from "react";
import { io } from "socket.io-client"
import Game from "./components/Game";

const App = () => {

    const [socket, setSocket] = useState(null);

    const [info, setInfo] = useState(false);
    const [nickname, setNickname] = useState('');

    const [game, setGame] = useState(false);
    const [players, setPlayers] = useState([]);
    const [number, setNumber] = useState(0);


    const [load, setLoad] = useState(false);

    useEffect(() => {
        const socket = io("http://localhost:4000", { transports : ['websocket'] });
        setSocket(socket);
        console.log(socket)
    }, []);

    const Leave = () => {
        socket.disconnect()
        setInfo(false)
        setNickname('')
    }
    
    const formSend = (e) => {
        e.preventDefault()
        const nickname = document.querySelector(`#form-nickname`).value
        setNickname(nickname)

        if(!load) {

            setLoad(true)

            socket.emit("send nickname", nickname, );
    
            setInfo(`Waiting for Player ${players}/2 ...`)
    
            socket.on('GAME_START', (players, number) => {
                setInfo(false)
                setNumber(number)
                setPlayers(players)
                setGame(true)
                
            })
            
        }
    }

    return (
        <div>

            <header>
                <h1>! WebSocket Game !</h1>
            </header>

            {
                !game ?
                    <div>
                        <form onSubmit={(e) => formSend(e)}>
                            <h2>Jouer au jeu</h2>
                            <div>
                                <label>Nickame :
                                    <input id="form-nickname" type="text" placeholder="Nickname" name="nickname" />
                                </label>
                            </div>
                            <button type="submit">Start</button>
                        </form>

                        {
                            info && 
                                <div>
                                    <p>{info}</p>
                                    <button onClick={() => Leave()}>Leave</button>
                                </div>
                        }

                    </div>
                :
                    <Game socket={socket} players={players} nickname={nickname} number={number}/>
            }


            <footer>
                <p>&copy; All rights reserved</p>
            </footer>
            
        </div>
    );
}

export default App;