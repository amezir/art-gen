import gsap from 'gsap';

const domApp = document.getElementById('app');

// Create and configure the canvas
const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
domApp.appendChild(canvas);

// Get the restart button and color selector from the DOM
const restartButton = document.getElementById('rs');
const colorSelector = document.getElementById('changeColor');

// Define the grid dimensions and colors
const rows = 60;
const cols = 30;
const squareSize = 10;
const colorSchemes = {
  'Schema 1': ['#22162B', '#451F55', '#724E91', '#E54F6D', '#F8C630'],
  'Schema 2': ['#574AE2', '#222A68', '#654597', '#AB81CD', '#E2ADF2'],
  'Schema 3': ['#FFD700', '#FF8C00', '#FF4500', '#DC143C', '#8B0000'],
  'Schema 4': ['#002626', '#0E4749', '#95C623', '#E55812', '#EFE7DA'],
};
let colors = colorSchemes['Schema 1'];

// Calculate offsets to center the grid relative to the canvas center
const offsetX = (canvas.width - cols * squareSize) / 2;
const offsetY = (canvas.height - rows * squareSize) / 2;

let cercles = [];

// Function to create the grid of circles
function createGrid() {
  cercles = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const xCercle = col * squareSize + offsetX;
      const yCercle = row * squareSize + offsetY;
      const cercle = {
        x: xCercle,
        y: yCercle,
        size: squareSize,
        color: colors[Math.floor(Math.random() * colors.length)],
        actions: 0,
        scale: 0,
        opacity: 1,
        line : {
          from: {
            x: xCercle,
            y: yCercle
          },
          to: {
            x: xCercle,
            y: yCercle
          },
          opacity: 1
        }
      };
      cercles.push(cercle);
      ctx.fillStyle = cercle.color;
      ctx.beginPath();
      ctx.arc(cercle.x + cercle.size / 2, cercle.y + cercle.size / 2, cercle.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Function to draw all circles
function drawCercles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  cercles.forEach((cercle) => {
    ctx.globalAlpha = cercle.opacity;
    
    ctx.beginPath();
    ctx.strokeStyle = cercle.color;
    ctx.translate(cercle.size / 2, cercle.size / 2);
    ctx.moveTo(cercle.line.from.x, cercle.line.from.y);
    ctx.lineTo(cercle.x, cercle.y);
    ctx.translate(-cercle.size / 2, -cercle.size / 2);
    ctx.stroke();
    ctx.closePath();

    ctx.save();
    ctx.translate(cercle.x + cercle.size / 2, cercle.y + cercle.size / 2);
    ctx.scale(cercle.scale, cercle.scale);
    ctx.translate(-cercle.x - cercle.size / 2, -cercle.y - cercle.size / 2);
    ctx.fillStyle = cercle.color;
    ctx.beginPath();
    ctx.arc(cercle.x + cercle.size / 2, cercle.y + cercle.size / 2, cercle.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.globalAlpha = 1;
  });
}

// Function to animate a circle with random movement
function animateCercle(cercle) {
  const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';

  const animationProps = {
    size: squareSize * (1 + Math.random()),
    duration: Math.random() * 3 + 1,
    delay: Math.random() * 2,
    // onComplete callback to increment actions and remove circle after 2 actions
    onStart: () => {
      cercle.line.from.x = cercle.x;
      cercle.line.from.y = cercle.y;
    },
    onComplete: () => {
      cercle.actions++;
      if (cercle.actions < 3) {
        animateCercle(cercle);
      } else {
        gsap.to(cercle, {
          opacity: 0,
          duration: 1,
          onComplete: () => {
            const index = cercles.indexOf(cercle);
            if (index > -1) {
              cercles.splice(index, 1);
            }
          }
        });
      }
    }
  };

  // Random movement in x or y direction
  if (direction === 'horizontal') {
    animationProps.x = cercle.x + (Math.random() - 0.5) * squareSize * 20;
  } else {
    animationProps.y = cercle.y + (Math.random() - 0.5) * squareSize * 20;
  }

  gsap.to(cercle, animationProps);
}

// Start initial scale animations for all circles
function startAnimations() {
  cercles.forEach((cercle) => {
    gsap.to(cercle, {
      scale: 1,
      duration: 2,
      onComplete: () => animateCercle(cercle)
    });
  });
}

// Animation loop using requestAnimationFrame
function animate() {
  drawCercles();
  requestAnimationFrame(animate);
}

// Function to restart the animation
function restartAnimation() {
  createGrid();
  startAnimations();
}

// Attach event listener to the restart button
restartButton.addEventListener('click', restartAnimation);

// Attach event listener to the color selector
colorSelector.addEventListener('change', (event) => {
  colors = colorSchemes[event.target.value];
  restartAnimation();
});

// Initialize the grid and start the animation loop
createGrid();
startAnimations();
animate();