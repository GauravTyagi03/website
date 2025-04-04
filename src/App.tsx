import { Component, createSignal, onMount, onCleanup } from 'solid-js';
import styles from './App.module.css';

const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_HEIGHT = 30;
const BRICK_WIDTH = 80;
const BRICK_PADDING = 15;
const BALL_RADIUS = 8;
const PADDLE_HEIGHT = 15;
const PADDLE_WIDTH = 120;
const INITIAL_BALL_SPEED = 4;
const SPEED_INCREMENT = 0.4; // Increased from 0.25 for more challenge
const BASE_SPEED_MULTIPLIER = 1.2; // Speed increase per round
const GAME_COLOR = '#48854d'; // BlueViolet color

const App: Component = () => {
  const [score, setScore] = createSignal(0);
  const [gameOver, setGameOver] = createSignal(false);
  const [round, setRound] = createSignal(1);
  let canvas: HTMLCanvasElement | undefined;
  let animationFrameId: number;
  let gameState = {
    ballX: 0,
    ballY: 0,
    ballDX: INITIAL_BALL_SPEED,
    ballDY: -INITIAL_BALL_SPEED,
    paddleX: 0,
    bricks: [] as { x: number; y: number; status: number }[],
    rightPressed: false,
    leftPressed: false,
  };

  const initBricks = () => {
    gameState.bricks = [];
    for (let c = 0; c < BRICK_COLS; c++) {
      for (let r = 0; r < BRICK_ROWS; r++) {
        gameState.bricks.push({ x: 0, y: 0, status: 1 });
      }
    }
  };

  const startNewRound = () => {
    if (!canvas) return;
    
    // Initialize ball position
    gameState.ballX = canvas.width / 2;
    gameState.ballY = canvas.height - 30;
    
    // Calculate new base speed for the round
    const roundSpeedMultiplier = Math.pow(BASE_SPEED_MULTIPLIER, round() - 1);
    const baseSpeed = INITIAL_BALL_SPEED * roundSpeedMultiplier;
    
    // Reset ball direction with new base speed
    gameState.ballDX = baseSpeed;
    gameState.ballDY = -baseSpeed;
    
    // Reset paddle position
    gameState.paddleX = (canvas.width - PADDLE_WIDTH) / 2;
    
    // Reset bricks
    initBricks();
  };

  const initGame = () => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    // Reset game state
    setScore(0);
    setGameOver(false);
    setRound(1);
    
    startNewRound();
  };

  const drawBall = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.arc(gameState.ballX, gameState.ballY, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = GAME_COLOR;
    ctx.fill();
    ctx.closePath();
  };

  const drawPaddle = (ctx: CanvasRenderingContext2D) => {
    if (!canvas) return;
    ctx.beginPath();
    ctx.rect(gameState.paddleX, canvas.height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillStyle = GAME_COLOR;
    ctx.fill();
    ctx.closePath();
  };

  const drawBricks = (ctx: CanvasRenderingContext2D) => {
    if (!canvas) return;
    for (let c = 0; c < BRICK_COLS; c++) {
      for (let r = 0; r < BRICK_ROWS; r++) {
        if (gameState.bricks[c * BRICK_ROWS + r].status === 1) {
          const brickX = c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_PADDING;
          const brickY = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_PADDING;
          gameState.bricks[c * BRICK_ROWS + r].x = brickX;
          gameState.bricks[c * BRICK_ROWS + r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
          ctx.fillStyle = GAME_COLOR;
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  };

  const drawRoundInfo = (ctx: CanvasRenderingContext2D) => {
    ctx.font = '20px Arial';
    ctx.fillStyle = '#48854d';
    ctx.textAlign = 'right';
    ctx.fillText(`Round: ${round()}`, canvas!.width - 20, 30);
  };

  const collisionDetection = () => {
    let bricksRemaining = 0;
    for (let c = 0; c < BRICK_COLS; c++) {
      for (let r = 0; r < BRICK_ROWS; r++) {
        const b = gameState.bricks[c * BRICK_ROWS + r];
        if (b.status === 1) {
          bricksRemaining++;
          if (
            gameState.ballX > b.x &&
            gameState.ballX < b.x + BRICK_WIDTH &&
            gameState.ballY > b.y &&
            gameState.ballY < b.y + BRICK_HEIGHT
          ) {
            gameState.ballDY = -gameState.ballDY;
            b.status = 0;
            setScore(score() + 1);
            
            // Increase ball speed
            const speedMultiplier = 1 + (score() * SPEED_INCREMENT / 10);
            const currentSpeed = Math.sqrt(gameState.ballDX * gameState.ballDX + gameState.ballDY * gameState.ballDY);
            gameState.ballDX = (gameState.ballDX / currentSpeed) * INITIAL_BALL_SPEED * speedMultiplier * Math.pow(BASE_SPEED_MULTIPLIER, round() - 1);
            gameState.ballDY = (gameState.ballDY / currentSpeed) * INITIAL_BALL_SPEED * speedMultiplier * Math.pow(BASE_SPEED_MULTIPLIER, round() - 1);
          }
        }
      }
    }
    
    // Check if round is complete
    if (bricksRemaining === 0) {
      setRound(round() + 1);
      startNewRound();
    }
  };

  const drawGameOver = (ctx: CanvasRenderingContext2D) => {
    if (!canvas) return;
    ctx.font = '48px Arial';
    ctx.fillStyle = GAME_COLOR;
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    
    // Add replay message
    ctx.font = '24px Arial';
    ctx.fillText('Press SPACE to play again', canvas.width / 2, canvas.height / 2 + 50);
  };

  const draw = () => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks(ctx);
    drawBall(ctx);
    drawPaddle(ctx);
    drawRoundInfo(ctx);

    if (gameOver()) {
      drawGameOver(ctx);
      return;
    }

    collisionDetection();

    // Ball collision with walls
    if (gameState.ballX + gameState.ballDX > canvas.width - BALL_RADIUS || gameState.ballX + gameState.ballDX < BALL_RADIUS) {
      gameState.ballDX = -gameState.ballDX;
    }
    if (gameState.ballY + gameState.ballDY < BALL_RADIUS) {
      gameState.ballDY = -gameState.ballDY;
    } else if (gameState.ballY + gameState.ballDY > canvas.height - BALL_RADIUS) {
      if (
        gameState.ballX > gameState.paddleX &&
        gameState.ballX < gameState.paddleX + PADDLE_WIDTH &&
        gameState.ballY + BALL_RADIUS > canvas.height - PADDLE_HEIGHT
      ) {
        // Calculate relative position of ball hit on paddle (0 to 1)
        const hitPos = (gameState.ballX - gameState.paddleX) / PADDLE_WIDTH;
        
        // Adjust angle based on where the ball hits the paddle (-60 to 60 degrees)
        const angle = (hitPos - 0.5) * Math.PI / 1.5;
        
        // Calculate new velocity components while maintaining current speed
        const speed = Math.sqrt(gameState.ballDX * gameState.ballDX + gameState.ballDY * gameState.ballDY);
        gameState.ballDX = speed * Math.sin(angle);
        gameState.ballDY = -speed * Math.abs(Math.cos(angle));
      } else {
        setGameOver(true);
      }
    }

    // Paddle movement
    if (gameState.rightPressed && gameState.paddleX < canvas.width - PADDLE_WIDTH) {
      gameState.paddleX += 7;
    } else if (gameState.leftPressed && gameState.paddleX > 0) {
      gameState.paddleX -= 7;
    }

    // Update ball position
    gameState.ballX += gameState.ballDX;
    gameState.ballY += gameState.ballDY;

    animationFrameId = requestAnimationFrame(draw);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      gameState.rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      gameState.leftPressed = true;
    } else if (e.code === 'Space' && gameOver()) {
      initGame();
      draw();
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      gameState.rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      gameState.leftPressed = false;
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!canvas) return;
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
      gameState.paddleX = relativeX - PADDLE_WIDTH / 2;
    }
  };

  onMount(() => {
    initGame();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas?.addEventListener('mousemove', handleMouseMove);
    draw();
  });

  onCleanup(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    canvas?.removeEventListener('mousemove', handleMouseMove);
    cancelAnimationFrame(animationFrameId);
  });

  return (
    <div class={styles.App}>
      <div class={styles.gameContainer}>
        <div class={styles.scoreBoard}>Score: {score()} | Round: {round()}</div>
        <canvas ref={canvas} />
      </div>
    </div>
  );
};

export default App;
