// css
import './App.css';

// react
import { useCallback, useEffect, useState } from "react";

// data
import { wordsList } from './data/words';

// components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  { id: 1, name: 'start'},
  { id: 2, name: 'game'},
  { id: 3, name: 'end'},
]

const guessesQty = 3;

function App() {

  // states
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);
  const [guesses, setGuesses] = useState(guessesQty);
  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words);

    // categories[key]
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // words[key][value]
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category }

  }, [words]);

  const startGame = useCallback(() => {

    // clearLetterStates();
    setScore(0);

    const { word, category } = pickWordAndCategory();

    const getLetter = word.toLowerCase().split('');

    // fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(getLetter);

    
    setGameStage(stages[1].name);
    

  }, [pickWordAndCategory]);

  const verifyLetter = (letter) => {
    
    const normalizedLetter = letter.toLowerCase();

    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    };

    if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => 
        [...actualGuessedLetters, normalizedLetter]
      );
    } else {
      setWrongLetters((actualWrongLetters) => 
        [...actualWrongLetters, normalizedLetter]
      );

      setGuesses(actualGuesses => actualGuesses - 1);
    };

  };

  const clearLetterStates =() => {
      setGuessedLetters([]);
      setWrongLetters([]);
      // score(0)
      // setGuesses(3);
  }

  useEffect(() => {
    if (guesses <= 0) {
      // reset all states
      clearLetterStates();

      setGameStage(stages[2].name);

    }
  }, [guesses]);

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    if(guessedLetters.length === uniqueLetters.length) {
      setScore((actualScore) => (actualScore += 100));
      
      clearLetterStates();
      
      const { word, category } = pickWordAndCategory();

      const getLetter = word.toLowerCase().split('');

      // fill states
      setPickedWord(word);
      setPickedCategory(category);
      setLetters(getLetter);

      // startGame();
    }

  }, [guessedLetters, letters, pickWordAndCategory]);

  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);

    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame}/>}
      {gameStage === 'game' && 
      <Game 
        verifyLetter={verifyLetter} 
        category={pickedCategory}
        pickedWord={pickedWord}
        letters={letters}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score}
        />}
      {gameStage === 'end' && <GameOver retry={retry} score={score}/>}
    </div>
  );
};

export default App;
