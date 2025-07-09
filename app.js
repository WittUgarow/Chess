const gameboard = document.querySelector("#gameboard")
const playerDisplay = document.querySelector("#player")
const infoDisplay = document.querySelector("#info-display")
const width = 8
let playerTurn = 'white'
playerDisplay.textContent = playerTurn

const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '', '', '', '', '', '', '', '', 
    '', '', '', '', '', '', '', '', 
    '', '', '', '', '', '', '', '', 
    '', '', '', '', '', '', '', '', 
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook,
]

function createBoard(){
    startPieces.forEach((startPiece, i) =>{
        const square = document.createElement('div')
        square.classList.add('square')
        square.innerHTML = startPiece
        square.firstChild?.setAttribute('draggable', true)
        square.setAttribute('square-id', (width*width-1)-i)
        const row = Math.floor((63-i) / 8) + 1
        if (row%2 ==0){
            square.classList.add(i%2==0 ? "beige" : "brown")
        }
        else{
            square.classList.add(i%2==0 ? "brown" : "beige")
        }
        if (i<=15){
            square.firstChild.firstChild.classList.add("black")
        }
        else if (i>=48){
            square.firstChild.firstChild.classList.add("white")
        }
        gameboard.append(square)
    })
}

createBoard()


const allSquares = document.querySelectorAll("#gameboard .square")
allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)
})

//Asign Each Tile A Row And Col For Easier Movement
function assignRowCol(){
    allSquares.forEach(square =>{
        const squareId = square.getAttribute("square-id")
        let row = Math.floor(squareId/8)+1
        let col = squareId % 8 + 1
        square.setAttribute("row", row)
        square.setAttribute("col", col)
    })
}
assignRowCol()

//Drag Functions
let startPositionId
let draggedElement
function dragStart(e){
    startPositionId = e.target.parentNode.getAttribute('square-id')
    draggedElement = e.target
}

function dragOver(e){
    e.preventDefault()
}

function dragDrop(e){
    e.stopPropagation()
    const correctGo = draggedElement.firstChild.classList.contains(playerTurn)
    const taken = e.target.classList.contains("piece")
    const valid = checkIfValid(e.target)
    const opponentGo = playerTurn === 'white' ? 'black' : 'white'
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo)
    
    if(correctGo){
        if(takenByOpponent && valid){
            e.target.parentNode.append(draggedElement)
            e.target.remove()
            changePlayerTurn()
            return
        }

        if(taken && !takenByOpponent){
            return
        }

        if(valid){
            e.target.append(draggedElement)
            changePlayerTurn()
            return
        }
    } 
}


//Valid Path Functions
function moveSameRow(){
   return startTile.getAttribute('row') ==  targetTile.getAttribute('row')
}

function moveSameCol(){
    return startTile.getAttribute('col') ==  targetTile.getAttribute('col')
}

function moveIsDiagonal(){
    
    const valid = Math.abs(startTile.getAttribute('col')-targetTile.getAttribute('col')) == Math.abs(startTile.getAttribute('row')-targetTile.getAttribute('row'))
    console.log(valid)
    return valid
}

function rowClear(){
    return true
}

function colClear(){
    return true
}

function diagonalClear(){
    return true
}

//Check If Title Number Has A Piece
function tileClear(id){
    return !document.querySelector(`[square-id="${id}"]`).firstChild
}

let startTile
let startId

let targetTile
let targetId


//Take The Move
function checkIfValid(target){
    
    targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'))
    targetTile = document.querySelector(`[square-id="${targetId}"]`)
    startId = Number(startPositionId)
    startTile = document.querySelector(`[square-id="${startId}"]`)
    
    const piece = draggedElement.id

    switch(piece){
        case 'pawn':
            if(targetTile.getAttribute('col')!=startTile.getAttribute('col')){
                return !tileClear(targetId) && (targetTile.getAttribute('row')-startTile.getAttribute('row')==1) && (Math.abs(targetTile.getAttribute('col')-startTile.getAttribute('col'))==1)
            }
            const normalMove = targetTile.getAttribute('row')-startTile.getAttribute('row')==1 && tileClear(targetId)
            const startMove = (startTile.getAttribute('row')==2) && tileClear(startTile.getAttribute('row')+1) && tileClear(startId+8)
            return (normalMove || startMove)
            break;
        case 'rook':
            return (moveSameRow() && rowClear()) || (moveSameCol() && colClear())
            break;
        case 'bishop':
            return (moveIsDiagonal() && diagonalClear())
            break;
        case 'queen':
            return (moveSameRow() && rowClear()) || (moveSameCol() && colClear()) || (moveIsDiagonal() && diagonalClear())
            break;
        case 'knight':
            let colDifKnight = Math.abs(targetTile.getAttribute('col')-startTile.getAttribute('col'))
            let rowDifKnight = Math.abs(targetTile.getAttribute('row')-startTile.getAttribute('row'))
            return (colDifKnight==2 && rowDifKnight==1) || (colDifKnight==1 && rowDifKnight==2)
            break;
        case 'king':
            let colDifKing = Math.abs(targetTile.getAttribute('col')-startTile.getAttribute('col'))
            const rowDifKing = Math.abs(targetTile.getAttribute('row')-startTile.getAttribute('row'))
            return (colDifKing<=1 && rowDifKing<=1)
            break;
    }


}

function changePlayerTurn(){
    if(playerTurn=="black"){
        reverseIds()
        playerTurn="white"
    }
    else{
        revertIds()
        playerTurn="black"
    }
    playerDisplay.textContent=playerTurn
}


//Reset Square Id's For Path Calculation
function reverseIds(){
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) => square.setAttribute('square-id', (width*width-1)-i))
    assignRowCol()
}

function revertIds(){
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) => square.setAttribute('square-id', i))
    assignRowCol()

}