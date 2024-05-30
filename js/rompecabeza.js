let puzzleImages = {
    easy: 'img/bluey.jpg', // Replace with actual image paths
    medium: 'img/horaDeAventura.jpg',
    hard: 'img/goku.jpg'
};

let correctOrder = [];
let currentOrder = [];
function startGame(difficulty) {
    closeModal()
    let piecesPerSide;
    switch(difficulty) {
        case 'easy':
            piecesPerSide = 2;
            break;
        case 'medium':
            piecesPerSide = 3;
            break;
        case 'hard':
            piecesPerSide = 4;
            break;
    }

    let imageSrc = puzzleImages[difficulty];
    createPuzzle(imageSrc, piecesPerSide);
}

function createPuzzle(imageSrc, piecesPerSide) {
    let container = document.getElementById('puzzle-container');
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${piecesPerSide}, 1fr)`;

    let img = new Image();
    img.src = imageSrc;
    img.onload = function() {
        let pieceWidth = 800 / piecesPerSide;
        let pieceHeight = 800 / piecesPerSide;

        correctOrder = [];
        currentOrder = [];
        let piecesArr = [];

        for(let y = 0; y < piecesPerSide; y++) {
            for(let x = 0; x < piecesPerSide; x++) {
                let canvas = document.createElement('canvas');
                canvas.width = pieceWidth;
                canvas.height = pieceHeight;
                canvas.classList.add('puzzle-piece');
                let context = canvas.getContext('2d');
                context.drawImage(img, x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);
                canvas.id = `piece-${x}-${y}`;
                canvas.draggable = true;
                canvas.addEventListener('dragstart', dragStart);
                canvas.addEventListener('dragover', dragOver);
                canvas.addEventListener('drop', drop);
                piecesArr.push(canvas);
                correctOrder.push(canvas.id);
            }
        }
        shuffleArray(piecesArr).forEach(piece => container.appendChild(piece));
        currentOrder = Array.from(container.children).map(piece => piece.id);
    };
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    let draggedPieceId = event.dataTransfer.getData('text/plain');
    let draggedPiece = document.getElementById(draggedPieceId);
    let targetPiece = event.target;

    if (targetPiece.classList.contains('puzzle-piece')) {
        let parent = targetPiece.parentNode;
        let sibling = draggedPiece.nextSibling === targetPiece ? draggedPiece : draggedPiece.nextSibling;
        parent.insertBefore(draggedPiece, targetPiece);
        parent.insertBefore(targetPiece, sibling);

        currentOrder = Array.from(parent.children).map(piece => piece.id);
        checkWin();
    }
}

function shuffleArray(array) {
    for(let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function checkWin() {
    if (JSON.stringify(currentOrder) === JSON.stringify(correctOrder)) {
        showModal();
    }
}


function showModal() {
    let modal = document.getElementById("winModal");
    modal.style.display = "flex";
}

function closeModal() {
    let modal = document.getElementById("winModal");
    modal.style.display = "none";
}

function restartGame() {
    location.reload();
}