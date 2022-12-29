import './GameOver.css'

const GameOver = ({retry, score}) => {
  return (
    <div>
        <h1>Fim do Jogo!</h1>
        <h2 className='score'>Pontuação final:
          <span> {score} </span>
        </h2>
        <button onClick={retry}>Resetar</button>
    </div>
  )
}

export default GameOver