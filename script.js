// --- Particle Background Effect (Canvas) ---
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const particleCount = 100;
const particleColor = '#E0B0FF'; // Lighter purple for background particles

// Set canvas size to match viewport
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(x, y) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1; // 1 to 3
        this.speedX = Math.random() * 0.5 - 0.25; // -0.25 to 0.25
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = particleColor;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap particles around the screen
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the frame

    particles.forEach(p => {
        p.update();
        p.draw();
    });
}

// Initialize and start the background animation
initParticles();
animateParticles();

// --- Glitter/Touch Effect ---
let glitterParticles = [];
const glitterColors = ['#FFFFFF', '#8A2BE2', '#E0B0FF']; // White, Purple, Light Purple

class GlitterParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 8 - 4; // Fast burst in X direction
        this.speedY = Math.random() * 8 - 4; // Fast burst in Y direction
        this.color = glitterColors[Math.floor(Math.random() * glitterColors.length)];
        this.life = 100; // Time until fade
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.2; // Gravity effect
        this.life -= 1; // Reduce life
        this.size *= 0.98; // Shrink over time
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.life / 100; // Fade out
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function createGlitterBurst(e) {
    const x = e.clientX;
    const y = e.clientY;
    
    // Create about 20 glitter particles on click/touch
    for (let i = 0; i < 20; i++) {
        glitterParticles.push(new GlitterParticle(x, y));
    }
}

// Add the event listener to the canvas (or body)
canvas.addEventListener('click', createGlitterBurst);
canvas.addEventListener('touchstart', (e) => {
    // Prevent default to stop scroll/zoom on mobile
    e.preventDefault(); 
    // Get the touch location
    createGlitterBurst(e.touches[0]); 
});

function animateGlitter() {
    // Clear the glitter particles array by keeping only the ones that are still alive
    glitterParticles = glitterParticles.filter(p => p.life > 0 && p.size > 0.1);

    glitterParticles.forEach(p => {
        p.update();
        p.draw();
    });

    // Request the next frame
    requestAnimationFrame(animateGlitter);
}

// Start the glitter animation loop
animateGlitter();