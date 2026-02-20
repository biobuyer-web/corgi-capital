/* ============================================
   CORGI RUN — Easter Egg Game
   An endless runner where Mango jumps over
   Bloomberg terminals, falling stonks, and
   NYC pigeons.
   ============================================ */

function openGame() {
  const modal = document.getElementById('game-modal');
  modal.classList.add('open');
  startGame();
}

function closeGame() {
  const modal = document.getElementById('game-modal');
  modal.classList.remove('open');
  stopGame();
}

document.getElementById('game-close').addEventListener('click', closeGame);

// Close on backdrop click
document.getElementById('game-modal').addEventListener('click', function(e) {
  if (e.target === this) closeGame();
});

// ============================================
// GAME ENGINE
// ============================================

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('game-score');

// Responsive canvas
function resizeCanvas() {
  const maxW = Math.min(600, window.innerWidth - 40);
  canvas.width = maxW;
  canvas.height = 200;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let animFrame = null;
let gameRunning = false;
let gameStarted = false;

// Game state
let score = 0;
let highScore = parseInt(localStorage.getItem('corgiRunHS') || '0');
let speed = 4;
let frame = 0;

// Ground
const GROUND = canvas.height - 40;

// Corgi player
const corgi = {
  x: 80,
  y: GROUND,
  w: 50,
  h: 35,
  vy: 0,
  jumping: false,
  dead: false,
  legFrame: 0,

  jump() {
    if (!this.jumping && !this.dead) {
      this.vy = -13;
      this.jumping = true;
    }
  },

  update() {
    if (this.dead) return;
    this.vy += 0.65; // gravity
    this.y += this.vy;
    if (this.y >= GROUND) {
      this.y = GROUND;
      this.vy = 0;
      this.jumping = false;
    }
    this.legFrame = Math.floor(frame / 6) % 4;
  },

  draw() {
    const x = this.x;
    const y = this.y;
    const w = this.w;
    const h = this.h;
    const cx = x + w / 2;
    const cy = y + h / 2;

    ctx.save();
    if (this.dead) {
      ctx.translate(cx, cy);
      ctx.rotate(0.3);
      ctx.translate(-cx, -cy);
    }

    // Body
    ctx.fillStyle = '#E8732A';
    ctx.beginPath();
    ctx.ellipse(cx, y + h * 0.65, w * 0.42, h * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#D4A843';
    ctx.beginPath();
    ctx.ellipse(x + w * 0.75, y + h * 0.3, w * 0.28, h * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = '#E8732A';
    ctx.beginPath();
    ctx.moveTo(x + w * 0.6, y + h * 0.1);
    ctx.lineTo(x + w * 0.52, y - h * 0.15);
    ctx.lineTo(x + w * 0.68, y + h * 0.05);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + w * 0.85, y + h * 0.1);
    ctx.lineTo(x + w * 0.95, y - h * 0.15);
    ctx.lineTo(x + w * 0.75, y + h * 0.05);
    ctx.fill();

    // Snout
    ctx.fillStyle = '#FDF0D5';
    ctx.beginPath();
    ctx.ellipse(x + w * 0.88, y + h * 0.38, w * 0.14, h * 0.14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#1A1208';
    ctx.beginPath();
    ctx.arc(x + w * 0.8, y + h * 0.26, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x + w * 0.81, y + h * 0.24, 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#5C3A1E';
    ctx.beginPath();
    ctx.ellipse(x + w * 0.94, y + h * 0.36, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs (animated)
    const legOffsets = [
      [0, 0, 4, 4],
      [2, -2, 2, 6],
      [4, 0, 0, 4],
      [2, 2, 2, 2]
    ];
    const lo = legOffsets[this.legFrame];
    ctx.fillStyle = '#E8732A';
    // Front legs
    ctx.fillRect(x + w * 0.55, y + h * 0.78 + lo[0], 7, 14);
    ctx.fillRect(x + w * 0.68, y + h * 0.78 + lo[1], 7, 14);
    // Back legs
    ctx.fillRect(x + w * 0.22, y + h * 0.78 + lo[2], 7, 14);
    ctx.fillRect(x + w * 0.35, y + h * 0.78 + lo[3], 7, 14);

    // Tail
    ctx.strokeStyle = '#D4A843';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    const tailWag = Math.sin(frame * 0.3) * 8;
    ctx.moveTo(x + w * 0.1, y + h * 0.55);
    ctx.quadraticCurveTo(x - w * 0.1, y + h * 0.3 + tailWag, x - w * 0.05, y + h * 0.15 + tailWag);
    ctx.stroke();

    // Belly
    ctx.fillStyle = 'rgba(253, 240, 213, 0.5)';
    ctx.beginPath();
    ctx.ellipse(cx, y + h * 0.72, w * 0.22, h * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();

    // X eyes if dead
    if (this.dead) {
      ctx.strokeStyle = '#C0392B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + w * 0.77, y + h * 0.22);
      ctx.lineTo(x + w * 0.83, y + h * 0.30);
      ctx.moveTo(x + w * 0.83, y + h * 0.22);
      ctx.lineTo(x + w * 0.77, y + h * 0.30);
      ctx.stroke();
    }

    ctx.restore();
  },

  getHitbox() {
    return { x: this.x + 10, y: this.y, w: this.w - 20, h: this.h };
  }
};

// Obstacles
const OBSTACLE_TYPES = [
  {
    label: 'Bloomberg Terminal',
    draw(x, y, w, h) {
      // Monitor
      ctx.fillStyle = '#1A1208';
      ctx.fillRect(x, y, w, h * 0.7);
      // Screen (red Bloomberg)
      ctx.fillStyle = '#C0392B';
      ctx.fillRect(x + 3, y + 3, w - 6, h * 0.7 - 10);
      // Screen text lines
      ctx.fillStyle = '#FF6B6B';
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(x + 5, y + 6 + i * 7, w - 10, 3);
      }
      // Stand
      ctx.fillStyle = '#1A1208';
      ctx.fillRect(x + w/2 - 5, y + h * 0.7, 10, h * 0.2);
      ctx.fillRect(x + 5, y + h * 0.88, w - 10, h * 0.12);
      // Label
      ctx.fillStyle = '#FF6B6B';
      ctx.font = 'bold 7px monospace';
      ctx.fillText('BLMBRG', x + 2, y + h * 0.7 - 2);
    },
    w: 42, h: 55
  },
  {
    label: 'NYC Pigeon',
    draw(x, y, w, h) {
      const t = frame * 0.2;
      // Body
      ctx.fillStyle = '#7F8C8D';
      ctx.beginPath();
      ctx.ellipse(x + w/2, y + h * 0.55, w * 0.38, h * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
      // Head
      ctx.fillStyle = '#95A5A6';
      ctx.beginPath();
      ctx.arc(x + w * 0.72, y + h * 0.32, h * 0.2, 0, Math.PI * 2);
      ctx.fill();
      // Beak
      ctx.fillStyle = '#E8732A';
      ctx.beginPath();
      ctx.moveTo(x + w * 0.88, y + h * 0.3);
      ctx.lineTo(x + w, y + h * 0.28);
      ctx.lineTo(x + w * 0.88, y + h * 0.35);
      ctx.fill();
      // Wings (flapping)
      ctx.fillStyle = '#636E72';
      ctx.beginPath();
      ctx.ellipse(x + w * 0.45, y + h * 0.4 + Math.sin(t) * 5, w * 0.3, h * 0.12, -0.3 + Math.sin(t) * 0.3, 0, Math.PI * 2);
      ctx.fill();
      // Eye
      ctx.fillStyle = '#E8732A';
      ctx.beginPath();
      ctx.arc(x + w * 0.78, y + h * 0.28, 2, 0, Math.PI * 2);
      ctx.fill();
      // Legs
      ctx.strokeStyle = '#BDC3C7';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + w * 0.4, y + h * 0.82);
      ctx.lineTo(x + w * 0.38, y + h);
      ctx.moveTo(x + w * 0.55, y + h * 0.82);
      ctx.lineTo(x + w * 0.57, y + h);
      ctx.stroke();
    },
    w: 45, h: 40
  },
  {
    label: 'Stonks Crashing',
    draw(x, y, w, h) {
      // Chart background
      ctx.fillStyle = '#2C3E50';
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = '#34495E';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);
      // Chart line going down
      ctx.strokeStyle = '#E74C3C';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 4, y + 8);
      ctx.lineTo(x + 10, y + 12);
      ctx.lineTo(x + 16, y + 10);
      ctx.lineTo(x + 22, y + 18);
      ctx.lineTo(x + 28, y + 25);
      ctx.lineTo(x + 34, y + 35);
      ctx.lineTo(x + w - 4, y + h - 8);
      ctx.stroke();
      // Arrow going down
      ctx.fillStyle = '#E74C3C';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('↓', x + w/2 - 5, y + h/2 + 5);
      // Label
      ctx.fillStyle = '#ECF0F1';
      ctx.font = '6px monospace';
      ctx.fillText('WOOF', x + 4, y + h - 4);
    },
    w: 40, h: 50
  }
];

let obstacles = [];
let particles = [];
let nextObstacle = 90;

// Stars/particles in background
let bgStars = Array.from({ length: 20 }, () => ({
  x: Math.random() * 600,
  y: Math.random() * GROUND,
  s: Math.random() * 2 + 0.5,
  a: Math.random()
}));

function spawnObstacle() {
  const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
  // Sometimes double obstacle
  const count = Math.random() < 0.15 && score > 300 ? 2 : 1;
  for (let i = 0; i < count; i++) {
    obstacles.push({
      x: canvas.width + i * 70,
      y: GROUND + corgi.h - type.h,
      w: type.w,
      h: type.h,
      type
    });
  }
  nextObstacle = Math.max(50, 120 - score * 0.05) + Math.random() * 60;
}

function spawnParticles(x, y) {
  for (let i = 0; i < 12; i++) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.8) * 6,
      life: 1,
      color: ['#E8732A', '#D4A843', '#FDF0D5', '#C0392B'][Math.floor(Math.random() * 4)]
    });
  }
}

function checkCollision(a, b) {
  return a.x < b.x + b.w &&
         a.x + a.w > b.x &&
         a.y < b.y + b.h &&
         a.y + a.h > b.y;
}

function drawGround() {
  // Ground strip
  ctx.fillStyle = '#2A1A08';
  ctx.fillRect(0, GROUND + corgi.h, canvas.width, canvas.height - GROUND - corgi.h);

  // Ground line
  ctx.strokeStyle = '#E8732A';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, GROUND + corgi.h);
  ctx.lineTo(canvas.width, GROUND + corgi.h);
  ctx.stroke();

  // Scrolling dashes
  ctx.strokeStyle = '#D4A843';
  ctx.lineWidth = 1;
  ctx.setLineDash([20, 20]);
  ctx.lineDashOffset = -(frame * speed * 0.5) % 40;
  ctx.beginPath();
  ctx.moveTo(0, GROUND + corgi.h + 12);
  ctx.lineTo(canvas.width, GROUND + corgi.h + 12);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawBackground() {
  // Sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, GROUND + corgi.h);
  grad.addColorStop(0, '#0D0A06');
  grad.addColorStop(1, '#1A0F05');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Stars
  bgStars.forEach(s => {
    ctx.fillStyle = `rgba(253, 240, 213, ${s.a * 0.6})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.s, 0, Math.PI * 2);
    ctx.fill();
  });

  // Scrolling NYC skyline silhouette
  ctx.fillStyle = 'rgba(26, 18, 8, 0.8)';
  const skylineOffset = (frame * speed * 0.3) % canvas.width;
  drawSkyline(-skylineOffset);
  drawSkyline(canvas.width - skylineOffset);
}

function drawSkyline(offsetX) {
  const buildings = [
    [0, 60, 30, 80],
    [35, 40, 20, 100],
    [60, 50, 35, 90],
    [100, 30, 25, 110],
    [130, 55, 28, 85],
    [165, 35, 22, 105],
    [193, 60, 40, 80],
    [240, 25, 18, 115],
    [265, 50, 30, 90],
    [300, 40, 25, 100],
    [330, 55, 35, 85],
    [372, 30, 20, 110],
    [397, 60, 28, 80],
    [432, 45, 32, 95],
    [470, 35, 24, 105],
    [500, 55, 38, 85],
    [545, 28, 22, 112],
    [574, 50, 30, 90],
  ];

  buildings.forEach(([bx, height, width]) => {
    const x = bx + offsetX;
    const y = GROUND + corgi.h - height;
    ctx.fillRect(x, y, width, height);
    // Windows
    ctx.fillStyle = 'rgba(212, 168, 67, 0.4)';
    for (let wx = x + 4; wx < x + width - 4; wx += 7) {
      for (let wy = y + 5; wy < y + height - 5; wy += 10) {
        if (Math.random() > 0.3) {
          ctx.fillRect(wx, wy, 3, 4);
        }
      }
    }
    ctx.fillStyle = 'rgba(26, 18, 8, 0.8)';
  });
}

function drawHUD() {
  // Score
  ctx.fillStyle = '#D4A843';
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`SCORE: ${score}`, 10, 20);

  // High score
  ctx.fillStyle = 'rgba(212, 168, 67, 0.6)';
  ctx.font = '11px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`BEST: ${Math.max(score, highScore)}`, canvas.width - 10, 20);
  ctx.textAlign = 'left';

  // Speed indicator
  if (score > 0) {
    ctx.fillStyle = 'rgba(232, 115, 42, 0.7)';
    ctx.font = '9px monospace';
    ctx.fillText(`SPEED: ${speed.toFixed(1)}x`, 10, 34);
  }
}

function drawStartScreen() {
  drawBackground();
  drawGround();
  corgi.draw();

  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#D4A843';
  ctx.font = 'bold 22px "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.fillText('🐾 CORGI RUN', canvas.width / 2, canvas.height / 2 - 30);

  ctx.fillStyle = 'rgba(253, 246, 236, 0.8)';
  ctx.font = '13px monospace';
  ctx.fillText('PRESS SPACE or TAP TO START', canvas.width / 2, canvas.height / 2 + 5);

  if (highScore > 0) {
    ctx.fillStyle = 'rgba(212, 168, 67, 0.7)';
    ctx.font = '11px monospace';
    ctx.fillText(`BEST: ${highScore}`, canvas.width / 2, canvas.height / 2 + 25);
  }

  ctx.fillStyle = 'rgba(253, 246, 236, 0.4)';
  ctx.font = '10px monospace';
  ctx.fillText('Avoid Bloomberg terminals, pigeons & crashing stonks', canvas.width / 2, canvas.height / 2 + 50);

  ctx.textAlign = 'left';
}

function drawGameOver() {
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#E8732A';
  ctx.font = 'bold 26px "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.fillText('MARKET CRASH!', canvas.width / 2, canvas.height / 2 - 35);

  ctx.fillStyle = '#D4A843';
  ctx.font = '14px monospace';
  ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 - 10);

  if (score >= highScore) {
    ctx.fillStyle = '#E8732A';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('NEW HIGH SCORE!', canvas.width / 2, canvas.height / 2 + 10);
  }

  ctx.fillStyle = 'rgba(253, 246, 236, 0.8)';
  ctx.font = '12px monospace';
  ctx.fillText('SPACE or TAP to try again', canvas.width / 2, canvas.height / 2 + 35);

  ctx.fillStyle = 'rgba(212, 168, 67, 0.6)';
  ctx.font = '10px monospace';
  ctx.fillText('"The market can stay irrational longer than a corgi can stay still."', canvas.width / 2, canvas.height / 2 + 58);

  ctx.textAlign = 'left';
}

let isDead = false;

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameStarted) {
    drawStartScreen();
    animFrame = requestAnimationFrame(gameLoop);
    return;
  }

  drawBackground();
  drawGround();

  if (!isDead) {
    frame++;
    score = Math.floor(frame / 5);
    speed = 4 + score * 0.008;
    scoreEl.textContent = `Score: ${score}  |  Best: ${Math.max(score, highScore)}`;

    // Spawn obstacles
    nextObstacle--;
    if (nextObstacle <= 0) spawnObstacle();

    // Update obstacles
    obstacles = obstacles.filter(o => o.x + o.w > -10);
    obstacles.forEach(o => {
      o.x -= speed;
      o.type.draw(o.x, o.y, o.w, o.h);

      // Collision
      const hit = corgi.getHitbox();
      if (checkCollision(hit, { x: o.x + 4, y: o.y + 4, w: o.w - 8, h: o.h - 4 })) {
        isDead = true;
        corgi.dead = true;
        spawnParticles(corgi.x + corgi.w / 2, corgi.y + corgi.h / 2);
        if (score > highScore) {
          highScore = score;
          localStorage.setItem('corgiRunHS', highScore);
        }
      }
    });

    corgi.update();
  } else {
    // Still draw obstacles fading out
    obstacles.forEach(o => o.type.draw(o.x, o.y, o.w, o.h));
  }

  corgi.draw();

  // Particles
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.3;
    p.life -= 0.025;
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - 3, p.y - 3, 6, 6);
    ctx.globalAlpha = 1;
  });

  drawHUD();

  if (isDead) {
    drawGameOver();
  }

  animFrame = requestAnimationFrame(gameLoop);
}

function startGame() {
  frame = 0;
  score = 0;
  speed = 4;
  obstacles = [];
  particles = [];
  nextObstacle = 90;
  isDead = false;
  gameStarted = false;
  corgi.y = GROUND;
  corgi.vy = 0;
  corgi.jumping = false;
  corgi.dead = false;

  if (animFrame) cancelAnimationFrame(animFrame);
  gameLoop();
}

function stopGame() {
  if (animFrame) cancelAnimationFrame(animFrame);
  gameRunning = false;
}

function handleJump() {
  if (!gameStarted) {
    gameStarted = true;
    return;
  }
  if (isDead) {
    startGame();
    gameStarted = true;
    return;
  }
  corgi.jump();
}

// Controls
document.addEventListener('keydown', function(e) {
  if (!document.getElementById('game-modal').classList.contains('open')) return;
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault();
    handleJump();
  }
  if (e.code === 'Escape') {
    closeGame();
  }
});

canvas.addEventListener('click', handleJump);
canvas.addEventListener('touchstart', function(e) {
  e.preventDefault();
  handleJump();
}, { passive: false });
