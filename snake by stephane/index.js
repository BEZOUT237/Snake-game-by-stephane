const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas dimensions
const canvasSize = 600;
canvas.width = canvasSize;
canvas.height = canvasSize;

// Cell size and grid
const cellSize = 20;
const rows = canvasSize / cellSize;
const cols = canvasSize / cellSize;

// Initial snake and fruit setup
let snake = [{ x: 5, y: 5 }];
let fruit = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
let direction = { x: 0, y: 0 };
let score = 0;
let highScore = localStorage.getItem('highScore') || 0; // Récupérer le plus haut score
let gameRunning = true;
let playerName = ""; // Nom du joueur

// Obtenir le nom du joueur
function getPlayerName() {
    playerName = prompt("Bienvenue ! Quel est ton nom ?", "Mboutman");
    if (!playerName) playerName = "Joueur Mystère"; // Valeur par défaut
}

// Mise à jour de l'affichage des scores
function updateScoreDisplay() {
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('highScore').innerText = `High Score: ${highScore}`;
}

// Draw the snake
function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
    });
}

// Draw the fruit
function drawFruit() {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(
        fruit.x * cellSize + cellSize / 2,
        fruit.y * cellSize + cellSize / 2,
        cellSize / 2,
        0,
        2 * Math.PI
    );
    ctx.fill();
}

// Appréciation humoristique en fonction du score
function showAppreciation() {
    const appreciations = [
        {
            score: 0, message: "Même les murs te battent Mboutman...Essaye encore ! 😂", img:"Projet ISN/ change th w.jpg"},
        { score: 5, message: "Pas mal, mais le serpent est encore affamé ! 🐍", img: "https://via.placeholder.com/150?text=Keep+Going" },
        { score: 10, message: "Tu deviens un pro ! Ne t'arrête pas là ! 🚀", img: "https://via.placeholder.com/150?text=Awesome" },
        { score: 20, message: "Wow ! Champion du monde 🏆🐍 !", img: "https://via.placeholder.com/150?text=Legend" }
    ];

    // Sélectionner une appréciation en fonction du score
    let appreciation = appreciations.find(a => score >= a.score) || appreciations[0];

    // Afficher le message et l'image dans une boîte modale
    const modalHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 20px; text-align: center; background: #fff; border: 2px solid #333; z-index: 1000;">
            <h2>${playerName}, ${appreciation.message}</h2>
            <img src="${appreciation.img}" alt="Funny image" style="max-width: 100%; margin-top: 10px;" />
            <button id="closeModal" style="margin-top: 20px; padding: 10px 20px;">Recommencer</button>
        </div>
    `;

    // Créer une div pour le modal
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = modalHTML;
    document.body.appendChild(modalDiv);

    // Fermer le modal et relancer la partie
    document.getElementById('closeModal').addEventListener('click', () => {
        modalDiv.remove();
        resetGame();
    });
}

// Update game logic
function update() {
    if (!gameRunning) return;

    const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // Check if snake eats fruit
    if (newHead.x === fruit.x && newHead.y === fruit.y) {
        score++;
        updateScoreDisplay();
        fruit = {
            x: Math.floor(Math.random() * cols),
            y: Math.floor(Math.random() * rows)
        };
    } else {
        snake.pop();
    }

    // Check for collisions
    if (
        newHead.x < 0 || newHead.y < 0 ||
        newHead.x >= cols || newHead.y >= rows ||
        snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
    ) {
        gameOver();
    }

    snake.unshift(newHead);
}

// Handle Game Over
function gameOver() {
    gameRunning = false;
    alert(`Game over! Your score: ${score}`);

    // Mettre à jour le plus haut score si nécessaire
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }

    showAppreciation(); // Afficher une appréciation
    updateScoreDisplay();
}

// Reset the game
function resetGame() {
    snake = [{ x: 5, y: 5 }];
    fruit = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    direction = { x: 0, y: 0 };
    score = 0;
    gameRunning = true;
    updateScoreDisplay();
}

// Render the game
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFruit();
}

// Game loop
function gameLoop() {
    update();
    render();
    setTimeout(gameLoop, 150);
}

// Listen for key presses
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -1 };
    if (e.key === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: 1 };
    if (e.key === 'ArrowLeft' && direction.x === 0) direction = { x: -1, y: 0 };
    if (e.key === 'ArrowRight' && direction.x === 0) direction = { x: 1, y: 0 };

    if (!gameRunning && (e.key === 'r' || e.key === 'R')) {
        resetGame();
    }
});

// Initialiser le jeu
getPlayerName();
resetGame();
gameLoop();
