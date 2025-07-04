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
console.log(allSquares[0])
allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)
})


function assignRowCol(){
    allSquares.forEach(square =>{
        let row
        const squareId = square.getAttribute("square-id")
        if(squareId>=56){
            row = 8
        }
        else if(squareId>=48){
            row=7
        }
        else if(squareId>=40){
            row=6
        }
        else if(squareId>=32){
            row=5
        }
        else if(squareId>=24){
            row=4
        }
        else if(squareId>=16){
            row=3
        }
        else if(squareId>=8){
            row = 2
        }
        else{
            row = 1
        }
        square.setAttribute("row", row)
    })

    /*
    const row = Math.floor((63-i) / 8) + 1
    const col = 
    square.setAttribute('row', row)
    square.setAttribute('col', col)
    */
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
function moveSameRow(startId, endId){
    const isValid = Math.abs(endId-startId)<8 || Math.abs(endId-startId)%8==0
    return isValid;
}

function clearPath(startId, endId){

}

function rowClear(startId, endId){
    let rowStart = startId
    while(rowStart>8){
        rowStart-=8
    }
    for(let i = rowStart; i<=endId; i+=8){
        if(!tileClear(i)){
            console.log(false)
            return false;
        }
    }
    if(startId>endId){
        for(let i = startId; i>endId; i--){
            if(!tileClear(i)){
                console.log(false)
                return false
            }
        }
    }
    else{
        for(let i = startId; i<endId; i++){
            if(!tileClear(i)){
                console.log(false)
                return false
            }
        }
    }
    console.log(true)
    return true;
}

//Check If Title Number Has A Piece
function tileClear(tile){
    return !document.querySelector(`[square-id="${tile}"]`).firstChild
}

//Take The Move
function checkIfValid(target){
    
    const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'))
    const startId = Number(startPositionId)
    const piece = draggedElement.id
    /*
    console.log("targetId", targetId)
    console.log("startId", startId)
    console.log("piece", piece)
    */

    switch(piece){
        case 'pawn':
            const startRow = [8,9,10,11,12,13,14,15]
            if(
                (startRow.includes(startId) && targetId-startId==16 && !document.querySelector(`[square-id="${targetId}"]`).firstChild) ||
                (targetId-startId==8 && !document.querySelector(`[square-id="${targetId}"]`).firstChild) ||
                ((targetId-startId==7 || targetId-startId==9) && document.querySelector(`[square-id="${targetId}"]`).firstChild
)
                ) {
                return true
            }
            break;
        case 'rook':
            return moveSameRow(startId, targetId) && rowClear(startId, targetId)
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