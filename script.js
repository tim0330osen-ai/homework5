JavaScript
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [];
let food = { x: 5, y: 5 };
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;
let gameInterval = null;
let isRunning = false;
let isPaused = false;

highScoreElement.textContent = highScore;

// 初始化遊戲狀態
function resetGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    dx = 1;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    generateFood();
}

// 產生隨機食物
function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    // 確保食物不會生在蛇身上
    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) {
            generateFood();
        }
    });
}

// 主遊戲迴圈
function gameLoop() {
    if (isPaused) return;

    update();
    if (checkGameOver()) {
        endGame();
        return;
    }
    draw();
}

// 更新蛇的位置與碰撞判定
function update() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // 吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem("snakeHighScore", highScore);
        }
        generateFood();
    } else {
        snake.pop(); // 沒吃到食物就移除尾巴
    }
}

// 碰撞檢查 (牆壁或自己)
function checkGameOver() {
    const head = snake[0];
    // 撞牆
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    // 撞到自己
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// 繪製遊戲畫面
function draw() {
    // 清空畫布
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 繪製食物
    ctx.fillStyle = "#f87171";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    // 繪製蛇
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? "#4ade80" : "#22c55e";
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

// 結束遊戲
function endGame() {
    clearInterval(gameInterval);
    isRunning = false;
    startBtn.textContent = "重新開始";
    alert(`遊戲結束！你的得分是: ${score}`);
}

// 開始或重新開始遊戲
function startGame() {
    if (isRunning) {
        clearInterval(gameInterval);
    }
    resetGame();
    isRunning = true;
    isPaused = false;
    pauseBtn.textContent = "暫停";
    startBtn.textContent = "重新開始";
    gameInterval = setInterval(gameLoop, 100);
}

// 切換暫停
function togglePause() {
    if (!isRunning) return;
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? "繼續" : "暫停";
}

// 鍵盤控制
window.addEventListener("keydown", e => {
    if (!isRunning || isPaused) return;
    switch (e.key) {
        case "ArrowUp":
            if (dy === 0) { dx = 0; dy = -1; }
            break;
        case "ArrowDown":
            if (dy === 0) { dx = 0; dy = 1; }
            break;
        case "ArrowLeft":
            if (dx === 0) { dx = -1; dy = 0; }
            break;
        case "ArrowRight":
            if (dx === 0) { dx = 1; dy = 0; }
            break;
    }
});

// 手機虛擬鍵盤控制
document.getElementById("btn-up").addEventListener("click", () => {
    if (isRunning && !isPaused && dy === 0) { dx = 0; dy = -1; }
});
document.getElementById("btn-down").addEventListener("click", () => {
    if (isRunning && !isPaused && dy === 0) { dx = 0; dy = 1; }
});
document.getElementById("btn-left").addEventListener("click", () => {
    if (isRunning && !isPaused && dx === 0) { dx = -1; dy = 0; }
});
document.getElementById("btn-right").addEventListener("click", () => {
    if (isRunning && !isPaused && dx === 0) { dx = 1; dy = 0; }
});

startBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", togglePause);

// 初始化靜態畫面
resetGame();
draw();
