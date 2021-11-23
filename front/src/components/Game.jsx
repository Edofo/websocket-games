import { useState } from "react"

const Game = (props) => {

    const [end, setEnd] = useState(false)
    const [info, setInfo] = useState(false);

    const confirm = (e) => {
        e.preventDefault()
        const number = document.querySelector('#form-number')

        props.socket.emit("send number", number);
    
        setInfo(`Waiting for Player 1/2 ...`)

        props.socket.on('FINISH_NUMBER', () => {
            setInfo(false)
            setEnd(true)
            
        })

    }


    return (
        <div>
            <h2>Veuillez choisir un chiffre entre 0 et 1000</h2>
            <form onSubmit={(e) => confirm(e)}>
                <input id="form-number" type="number" placeholder="ex: 25"/>
                <button type="submit">Valider</button>
            </form>

            <div>
                <p>Joueur 1: {props.players[0]}</p>
                <p>Nombre de points: </p>
                <br />
                <p>Joueur 2: {props.players[1]}</p>
                <p>Nombre de points: </p>
            </div>
            {
                end &&
                    <div>
                        <p>LE BON NUMERO: {props.number}</p>
                    </div>
            }
        </div>
    )
}

export default Game