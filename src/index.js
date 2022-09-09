import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

function Square(props) {
	return (
		<button
			className="col square"
			onClick={props.onClick}
      id={props.id}
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
        id={row + "-" + col}
			/>
		);
  }

  //helper
  renderRow(i) {
    let row = [];
    row.push(<p className="col row-labels">{i}</p>);
    for (var j = 0; j < 3; j++) {
      row.push(this.renderSquare(i, j));
    }
    return row;
  }

  renderGrid() {
    let grid = [];
    for (var i = 0; i < 3; i++) {
      grid.push(
        <div className="row flex-grow-1">
          {this.renderRow(i)}
        </div>
      );
    }
    return grid;
  }
  
  render() {
    return (
      <div className="container d-flex flex-column game-grid">
        <div className="row">
          <p className="col spacer"></p>
          <p className="col">0</p>
          <p className="col">1</p>
          <p className="col">2</p>
        </div>
        {this.renderGrid()}
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
      listReversed: false,
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

    //un-highlight any highlighted squares
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        document.getElementById(i + "-" + j).classList.remove("winner");
      }
    }
  }

  toggleList() {
    document.getElementById('move-list').toggleAttribute('reversed');
    if (this.state.listReversed) {
      this.setState({
        listReversed: false,
      });
    } else {
      this.setState({
        listReversed: true,
      });
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + '. Row: ' + step.moveLocations[move - 1][0] + ' Col: ' + step.moveLocations[move - 1][1] :
        'Go to game start';

      if (move === this.state.stepNumber) {
        return (
          <li className="selected" key={move}>
            <button className="selected btn btn-secondary mb-1" onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      } else {
        return (
          <li key={move}>
            <button className="btn btn-secondary mb-1" onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      }
    });

    let status;
    if (winner && winner !== 'tie') {
      status = 'Winner: ' + winner;
    } else if (winner === 'tie') {
      status = 'Tie';
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
          <button id="list-toggler" className="btn btn-primary my-2" onClick={() => this.toggleList()}>Toggle move list order</button>
          <ol id="move-list">{!this.state.listReversed ? moves : moves.slice().reverse()}</ol>
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
    [[0, 2], [1, 2], [2, 2]],
    //diagonal
    [[0, 0], [1, 1], [2, 2]],
    [[2, 0], [1, 1], [0, 2]]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // if we have a winner
    if (squares[a[0]][a[1]] && squares[a[0]][a[1]] === squares[b[0]][b[1]] && squares[a[0]][a[1]] === squares[c[0]][c[1]]) {
      //highlight the winning sqaures
      document.getElementById(a[0] + "-" + a[1]).classList.add("winner");
      document.getElementById(b[0] + "-" + b[1]).classList.add("winner");
      document.getElementById(c[0] + "-" + c[1]).classList.add("winner");
      return squares[a[0]][a[1]];
    }
  }
  // calculate tie
  let emptySquares = 0;
  for (let j = 0; j < 3; j++) {
    for (let k = 0; k < 3; k++) {
      if (!squares[j][k]) {
        emptySquares++;
      }
    }
  }
  if (emptySquares === 0) {
    return 'tie';
  }

  return null;
}
  
// ========================================
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
  