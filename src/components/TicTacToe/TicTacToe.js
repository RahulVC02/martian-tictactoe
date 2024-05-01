import React, { useState } from 'react';
import '../../styles/TicTacToe.css';

const boardSize = 3;
const initialBoard = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));

const TicTacToe = () => {
  const [board, setBoard] = useState(initialBoard);
  const [isPlayerOne, setIsPlayerOne] = useState(true);
  const [availableMoves, setAvailableMoves] = useState({
    'x': 3, 'X': 3, 'o': 3, 'O': 3
  });
  const [winner, setWinner] = useState(null);
  const [mode, setMode] = useState(null); // Default mode

  const checkForWin = (smallPlayer, bigPlayer, newBoard) => {
    const lines = [
      [[0, 0], [0, 1], [0, 2]], // Rows
      [[1, 0], [1, 1], [1, 2]],
      [[2, 0], [2, 1], [2, 2]],
      [[0, 0], [1, 0], [2, 0]], // Columns
      [[0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 2], [2, 2]],
      [[0, 0], [1, 1], [2, 2]], // Diagonals
      [[0, 2], [1, 1], [2, 0]]
    ];
    const flag = lines.some(line => line.every(([r, c]) => (newBoard[r][c] === smallPlayer || newBoard[r][c] === bigPlayer)));
    return flag;
  };

  const handleCellClick = (row, col, event) => {
    if (winner) return;
    setBoard(prevBoard => {
      const newBoard = prevBoard.map(row => [...row]);
      const currentPlayer = isPlayerOne ? 'x' : 'o';
      const largerPlayer = isPlayerOne ? 'X' : 'O';

      const opponentSmaller = isPlayerOne ? 'o' : 'x';
      const opponentLarger = isPlayerOne ? 'O' : 'X';

      if (!newBoard[row][col]) {
        if (availableMoves[currentPlayer] > 0) {
          newBoard[row][col] = currentPlayer;
          setAvailableMoves(prev => ({...prev, [currentPlayer]: prev[currentPlayer] - 1}));
        }
      } else if (newBoard[row][col] === currentPlayer && availableMoves[largerPlayer] > 0) {
        newBoard[row][col] = largerPlayer;
        setAvailableMoves(prev => ({...prev, [largerPlayer]: prev[largerPlayer] - 1, [currentPlayer]: prev[currentPlayer] + 1}));
      } else if (newBoard[row][col] !== currentPlayer && newBoard[row][col] !== largerPlayer &&  newBoard[row][col] !== opponentLarger) {
        if (availableMoves[largerPlayer] > 0) {
          newBoard[row][col] = largerPlayer;
          if(mode === 'ReturnOnStomp') {
          setAvailableMoves(prev => ({...prev, [largerPlayer]: prev[largerPlayer] - 1, [opponentSmaller]: prev[opponentSmaller] + 1}));}
          else {
            setAvailableMoves(prev => ({...prev, [largerPlayer]: prev[largerPlayer] - 1}));}
          }
      }

      const winDetected = checkForWin(currentPlayer,largerPlayer, newBoard);
      if (winDetected) {
        setWinner(`Player ${isPlayerOne ? 'One' : 'Two'}`);
      } else {
        setIsPlayerOne(!isPlayerOne);
      }
      
      return newBoard;
    });
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setAvailableMoves({'x': 3, 'X': 3, 'o': 3, 'O': 3});
    setWinner(null);
    setIsPlayerOne(true);
    setMode(null);
  };

  const handleModeChange = (selectedMode) => {
    setMode(selectedMode);
  };

  return (
    <div className="game">
      {mode && <div className="mode">Mode: {mode}</div>}
      {mode === null && (
        <div>
          <p className="mode-info">Pick a game mode!</p>
          <div className="mode-buttons">
            <button onClick={() => handleModeChange('Default')}>Default</button>
            <button onClick={() => handleModeChange('ReturnOnStomp')}>Return on Stomp</button>
          </div>
        </div>
      )}

      <div className="gameplay">
      <div className="board">
        {[0, 1, 2].map(row => (
          <div key={row} className="board-row">
            {[0, 1, 2].map(col => (
              <button key={col} className="cell" onClick={(event) => handleCellClick(row, col, event)}>
                {board[row][col]}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="players-moves">
        <div className="player-moves">
          <div className="player-name">Player One's Moves:</div>
          <div>x: {availableMoves['x']}, X: {availableMoves['X']}</div>
        </div>
        <div className="player-moves">
          <div className="player-name">Player Two's Moves:</div>
          <div>o: {availableMoves['o']}, O: {availableMoves['O']}</div>
        </div>
      </div>
      </div>
      {winner && (
        <div className="winner">
          {winner} wins!
        </div>
      )}
      <button className="restart-button" onClick={resetGame}>Restart Game</button>
    </div>
  );
};

export default TicTacToe;
