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
				value={this.props.squares[row][col]}
				onClick={() => this.props.onClick(row, col)}
			/>
		);
  }
  
  render() {
    return (
      <div>
        <div class="column-label">
          <p>0</p>
          <p>1</p>
          <p>2</p>
        </div>
        <div className="board-row">
          <p class="row-label">0</p>
          {this.renderSquare(0, 0)}
          {this.renderSquare(0, 1)}
          {this.renderSquare(0, 2)}
        </div>
        <div className="board-row">
          <p class="row-label">1</p>
          {this.renderSquare(1, 0)}
          {this.renderSquare(1, 1)}
          {this.renderSquare(1, 2)}
        </div>
        <div className="board-row">
          <p class="row-label">2</p>
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
        squares: [[null, null, null], [null, null, null], [null, null, null]],
        // only 9 squares, so only 9 total possible turns
        moveLocations: [[null, null], [null, null], [null, null], [null, null], [null, null], [null, null], [null, null], [null, null], [null, null],],
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(row, col) {
    //create new history object adding one more empty space to the previous one
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    //current is the most recent state of the game
    const current = history[history.length - 1];
    //copy squares into new variable
    var squares = current.squares.slice();
    //copy move locations into new variable
    var moveLocations = current.moveLocations.slice();

		if (calculateWinner(squares) || squares[row][col]) {
			return;
		}
    var clickedRow = squares[row].slice();
    clickedRow[col] = this.state.xIsNext ? 'X' : 'O';
    squares[row] = clickedRow;

    moveLocations[this.state.stepNumber] = [row, col];
		this.setState({
			history: history.concat([{
        squares: squares,
        moveLocations: moveLocations,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
		});
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
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + '. Row: ' + step.moveLocations[move - 1][0] + ' Col: ' + step.moveLocations[move - 1][1] :
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
            squares={current.squares}
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
  // all the different possible winning lines [row, col]
  const lines = [
    //horizontal
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    //vertical
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [1, 3]],
    //diagonal
    [[0, 0], [1, 1], [2, 2]],
    [[2, 0], [1, 1], [0, 2]]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a[0]][a[1]] && squares[a[0]][a[1]] === squares[b[0]][b[1]] && squares[a[0]][a[1]] === squares[c[0]][c[1]]) {
      return squares[a[0]][a[1]];
    }
  }
  return null;
}
  
// ========================================
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
  