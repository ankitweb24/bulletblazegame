let btnSubmit = document.getElementById("btnSubmit");
let userInput = document.getElementById("username");
let form_ = document.getElementById("form_");
let gameArea = document.querySelector(".gameArea");
let mainPlayer = document.querySelector(".mainPlayer");

let gameOver = false;

let triggerBulletSound = new Audio("../assets/music/gaaan.mp3");
let enemyDeath = new Audio("../assets/music/exp1.mp3");

let scoreDisplay = document.querySelector(".scoreDisplay");

let gameAreaW, gameAreaH;

const player = { score: 0 };

let bulletInterval;
let enemyInterval;

const playerPosition = {
  x: 200,
  y: 350,
  speed: 5,
};

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
  Space: false,
};

const checkCollision = (bullet, bulletMoveInterval) => {
  const enemis = document.querySelectorAll(".enemy");
  enemis.forEach((enemy) => {
    const bulletRect = bullet.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();

    if (
      bulletRect.left < enemyRect.right &&
      bulletRect.right > enemyRect.left &&
      bulletRect.top < enemyRect.bottom &&
      bulletRect.bottom > enemyRect.top
    ) {
      bullet.remove();
      enemy.remove();
      clearInterval(bulletMoveInterval);
      enemyDeath.play();

      player.score += 10;
      updateScoreFunction();
    }
  });
};

const updateScoreFunction = () => {
  scoreDisplay.textContent = `Score : ${player.score}`;
  const highScore = getHighScore();
  if (player.score > highScore) {
    localStorage.setItem("highScore", player.score);
  }
};

const getHighScore = () => {
  return parseInt(localStorage.getItem("highScore")) || 0;
};



const enemyGenrateFunction = () => {
  const enemy = document.createElement("div");
  enemy.classList.add("enemy");
  const randomX = Math.random() * (gameAreaW - 50);

  enemy.style.left = `${randomX}px`;
  enemy.style.top = `0px`;

  gameArea.appendChild(enemy);

  const enemyMoveInterval = setInterval(() => {
    const enemyPosition = enemy.offsetTop;
    if (enemyPosition + enemy.offsetHeight >= playerPosition.y) {
      clearInterval(enemyMoveInterval);
      enemy.remove();
      endGame();
    } else {
      enemy.style.top = `${enemyPosition + 5}px`;
    }
  }, 50);
};

const fireBullets = () => {
  const bullet = document.createElement("div");
  bullet.classList.add("bullet");

  bullet.style.left = `${playerPosition.x + mainPlayer.offsetWidth / 2 - 1}px`;
  bullet.style.top = `${playerPosition.y}px`;

  gameArea.appendChild(bullet);

  const bulletMoveInterval = setInterval(() => {
    const bulletPosition = bullet.offsetTop;

    if (bulletPosition < 0) {
      bullet.remove();
      clearInterval(bulletMoveInterval);
    } else {
      bullet.style.top = `${bulletPosition - 10}px`;
      checkCollision(bullet, bulletMoveInterval);
    }
  }, 30);
};

const startFireBullets = () => {
  if (!bulletInterval) {
    bulletInterval = setInterval(() => {
      fireBullets();
    }, 200);
  }
};

const stopFireBullets = () => {
  clearInterval(bulletInterval);
  bulletInterval = null;
};
const keydownFunction = (e) => {
  keys[e.key] = true;

  if (e.key === " ") {
    startFireBullets();
    triggerBulletSound.play();
    triggerBulletSound.loop = true;
  }
};

const keyupFunction = (e) => {
  keys[e.key] = false;
  if (e.key === " ") {
    stopFireBullets();
    triggerBulletSound.pause();
    triggerBulletSound.loop = false;
    triggerBulletSound.currentTime = 0;
  }
};

const updatePlayer = () => {
  if (keys.ArrowUp && playerPosition.y > 0) {
    playerPosition.y -= playerPosition.speed;
  }
  if (
    keys.ArrowDown &&
    playerPosition.y < gameAreaH - mainPlayer.offsetHeight
  ) {
    playerPosition.y += playerPosition.speed;
  }

  if (keys.ArrowLeft && playerPosition.x > 0) {
    playerPosition.x -= playerPosition.speed;
  }
  if (
    keys.ArrowRight &&
    playerPosition.x < gameAreaW - mainPlayer.offsetWidth
  ) {
    playerPosition.x += playerPosition.speed;
  }

  mainPlayer.style.transform = `translate(${playerPosition.x}px, ${playerPosition.y}px)`;
};

document.addEventListener("keydown", keydownFunction);
document.addEventListener("keyup", keyupFunction);

const gamePlay = () => {
  if (player.start) {
    updatePlayer();
    window.requestAnimationFrame(gamePlay);
  }
};

btnSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  let userName = userInput.value;
  if (userName !== "") {
    form_.classList.add("hide");
    gameArea.classList.remove("hide");
    player.start = true;
    localStorage.setItem("username", userName);
    gameAreaW = gameArea.offsetWidth;
    gameAreaH = gameArea.offsetHeight;
    window.requestAnimationFrame(gamePlay);
    enemyInterval = setInterval(enemyGenrateFunction, 1000);
  }
});

function endGame() {
  gameOver = true;
  player.start = false;
  clearInterval(enemyInterval)
  clearInterval(bulletInterval)

  const highScore = getHighScore();

  alert(`GAME OVER! YOUR SCORE : ${player.score}. High Score : ${highScore}`)

}
