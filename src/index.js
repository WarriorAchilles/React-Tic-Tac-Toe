import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
	return (
		<button
			className="square"
			onClick={props.onClick}
		>
			{props.value}
		</button>
	);
}
  
class Board extends React.Component {
  renderSquare(row, col) {
    return (
			<Square
				value={this.props.otherSquares[row][col]}
				onClick={() => this.props.onClick(row, col)}
			/>
		);
  }
  
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0, 0)}
          {this.renderSquare(0, 1)}
          {this.renderSquare(0, 2)}
        </div>
        <div className="board-row">
          {this.renderSquare(1, 0)}
          {this.renderSquare(1, 1)}
          {this.renderSquare(1, 2)}
        </div>
        <div className="board-row">
          {this.renderSquare(2, 0)}
          {this.renderSquare(2, 1)}
          {this.renderSquare(2, 2)}
        </div>
      </div>
      );
  }
}
  
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        //squares: Array(9).fill(null),
        otherSquares: Array(3).fill(Array(3).fill(null)),
        //moveLocations: Array(9).fill(Array(2).fill(null)),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(row, col) {
    console.log('clicked row ' + row + ' col ' + col);
    //create new history object adding one more empty space to the previous one
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    //current is the most recent state of the game
    const current = history[history.length - 1];
    //copy squares into new variable
		//const squares = current.squares.slice();
    var otherSquares = current.otherSquares.slice();
		//if (calculateWinner(squares) || squares[i]) {
		//	return;
		//}
		//squares[i] = this.state.xIsNext ? 'X' : 'O';
    var clickedRow = otherSquares[row].slice();
    clickedRow[col] = this.state.xIsNext ? 'X' : 'O';
    otherSquares[row] = clickedRow;
    // otherSquares[row][col] = this.state.xIsNext ? 'X' : 'O'
    console.log(otherSquares);
		this.setState({
			history: history.concat([{
        otherSquares: otherSquares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
		});
    console.log('History:')
    for (var j = 0; j < history.length; j++) {
      console.log(history[j]);
    }
    console.log('end history');
	}

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    //const winner = calculateWinner(current.squares);
    const winner = false;

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            //squares={current.squares}
            otherSquares={current.otherSquares}
            onClick={(row, col) => this.handleClick(row, col)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
	}
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
  
// ========================================
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
  