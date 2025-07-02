// 迷宮參數
let level = 1;
let ROWS = 10;
let COLS = 10;
const CELL_SIZE = 48;
const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const message = document.getElementById('message');

// 迷宮地圖（0: 路徑, 1: 牆壁）
let maze = [];

// 小津琳初始位置
let player = { x: 0, y: 0 };
// 圓形物品位置（右下角）
let goal = { x: COLS - 1, y: ROWS - 1 };
let wallRate = 0.2;

// 確保格數為奇數
function adjustOdd(n) {
    return n % 2 === 0 ? n + 1 : n;
}

// 生成簡單迷宮（可改進為隨機生成）
function generateMaze() {
    // 初始化全牆
    maze = Array.from({ length: ROWS }, () => Array(COLS).fill(1));
    // DFS 挖通路
    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    function carve(x, y) {
        maze[y][x] = 0;
        let dirs = shuffle([
            [0, -2], [0, 2], [-2, 0], [2, 0]
        ]);
        for (const [dx, dy] of dirs) {
            const nx = x + dx, ny = y + dy;
            if (ny > 0 && ny < ROWS - 1 && nx > 0 && nx < COLS - 1 && maze[ny][nx] === 1) {
                maze[y + dy / 2][x + dx / 2] = 0;
                carve(nx, ny);
            }
        }
    }
    // 起點終點都設在奇數格
    player = { x: 1, y: 1 };
    goal = { x: COLS - 2, y: ROWS - 2 };
    carve(player.x, player.y);
    maze[goal.y][goal.x] = 0;
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (maze[y][x] === 1) {
                ctx.fillStyle = '#666';
                ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }
    // 畫圓形物品
    ctx.beginPath();
    ctx.arc(goal.x * CELL_SIZE + CELL_SIZE / 2, goal.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 3, 0, Math.PI * 2);
    ctx.fillStyle = 'gold';
    ctx.fill();
    // 畫小津琳（用圓形代表）
    ctx.beginPath();
    ctx.arc(player.x * CELL_SIZE + CELL_SIZE / 2, player.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 3, 0, Math.PI * 2);
    ctx.fillStyle = 'skyblue';
    ctx.fill();
}

function movePlayer(dx, dy) {
    const nx = player.x + dx;
    const ny = player.y + dy;
    if (maze[ny][nx] === 0) {
        player.x = nx;
        player.y = ny;
        if (player.x === goal.x && player.y === goal.y) {
            message.textContent = '恭喜小津琳吃到圓形物品，進入下一關！';
            setTimeout(nextLevel, 1000);
            return;
        }
    }
    drawMaze();
}

function nextLevel() {
    level++;
    ROWS = adjustOdd(Math.min(10 + level * 2, 29)); // 29為最大奇數
    COLS = adjustOdd(Math.min(10 + level * 2, 29));
    wallRate = Math.min(0.2 + level * 0.05, 0.45); // 牆壁密度提升，最多0.45
    canvas.width = COLS * CELL_SIZE;
    canvas.height = ROWS * CELL_SIZE;
    message.textContent = `第${level}關，加油！`;
    setTimeout(() => {
        message.textContent = '';
        generateMaze();
        drawMaze();
    }, 1200);
}

document.addEventListener('keydown', (e) => {
    if (message.textContent) return;
    if (e.key === 'ArrowUp') movePlayer(0, -1);
    if (e.key === 'ArrowDown') movePlayer(0, 1);
    if (e.key === 'ArrowLeft') movePlayer(-1, 0);
    if (e.key === 'ArrowRight') movePlayer(1, 0);
});

// 等待載入完成再綁定事件
window.onload = function() {
    const startLink = document.getElementById('startLink');
    const canvas = document.getElementById('mazeCanvas');
    startLink.onclick = function(e) {
        e.preventDefault();
        startLink.style.display = 'none';
        canvas.style.display = '';
        message.textContent = '';
        level = 1;
        ROWS = adjustOdd(10);
        COLS = adjustOdd(10);
        wallRate = 0.2;
        generateMaze();
        drawMaze();
    };
};
