import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button id={props.id} className="square" onClick=
            {props.onClick}>
            {props.value}
        </button>
    );
}
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square 
         id={"square_"+i}
         value={this.props.squares[i]}
         onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
        let board = [];
        board.push(React.createElement('div'));

        let pos = 0;
        for (let i = 0; i < 3; i++){ //create row
            let squares = [];
            for (let j = 0; j < 3; j++) { //create columns
                squares.push(this.renderSquare(pos++))
            }
        board.push(<div className="board-row">{squares}</div>);
        }
        
        for(let i = 0; i < board.length; i++){
            document.getElementById("square_");
        }

      return board;
    }
  }
  
  class Game extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                row: 0,
                col: 0,
            }],
            stepNumber: 0,
            xIsNext: true,
            desc_asc: true,
        }
      }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        let matrix = getRowCol(i)

        this.setState({
            history: history.concat([{
                squares: squares,
                row: matrix[0],
                col: matrix[1],
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step, squares) {
        for(let i = 0; i < squares.length; i++){
            let board_squares = document.getElementById("square_" + i);
            board_squares.className = "square";
        }

        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    sortMoves() {
        this.setState({
            desc_asc: !this.state.desc_asc,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        const winner = calculateWinner(current.squares, 0);
        const winningSquares = calculateWinner(current.squares, 1);

        const moves = history.map((step, move) => {
            let move_desc = 'Go to move #' + move + ' (' + step.col + ',' + step.row + ')';
            let current_move = move === this.state.stepNumber ? <b>{move_desc}</b> : move_desc;

            const desc = move ? current_move : 'Go to game start';

            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move, current.squares)}>{desc}</button>
                </li>
            );
        });

        let status;
        let matchEnded = checkMatchStatus(current.squares);

        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            if (!matchEnded){
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            } else {
                status = 'Match tied.'
            }
        }

        if (winningSquares) {
            for(let i = 0; i < current.squares.length; i++){
                if(i === winningSquares[0] || i === winningSquares[1] || i === winningSquares[2]){
                    let winner = document.getElementById("square_" + i);
                    winner.className = "winning_square";
                }
            }
        } 

        if(!this.state.desc_asc) {
            moves.sort(function(a,b) {
                return b.key - a.key;
            })
        }

      return (
        <div className="header">
            <h1>Tic-Tac-Toe</h1>
            <div className="game">
                <div id="board_layout" className="board">
                    <div className="status">{status}</div>
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <h2>Sort</h2>
                    <button className="sort" onClick={() => this.sortMoves()}>Sort Asc/Desc</button>
                    <h2>Moves</h2>
                    <ol>{moves}</ol>
                </div>
            </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function checkMatchStatus(squares) {
    return squares.every(function(i) {
        if (i !== null) {
            return true; 
        } return false;
    }) ? true : false;
  }

  function calculateWinner(squares, option) {
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
        for (let i = 0; i < lines.length; i++){
            const [a, b, c] = lines[i];
            if (option === 0){
                if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                    return squares[a];
                }
            } else {
                if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                    return [a, b, c];
                }
            }
        }
    return null;
  }

  function getRowCol(pos){
    let row, col;
    switch(pos){
        case 0: row = 0; col = 0; break;
        case 1: row = 0; col = 1; break;
        case 2: row = 0; col = 2; break;
        case 3: row = 1; col = 0; break;
        case 4: row = 1; col = 1; break;
        case 5: row = 1; col = 2; break;
        case 6: row = 2; col = 0; break;
        case 7: row = 2; col = 1; break;
        case 8: row = 2; col = 2; break;
        default://ignore will never be called
    }
    return [row, col];
  }
  