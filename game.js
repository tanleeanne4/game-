class BunnyGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.restartBtn = document.getElementById('restartBtn');
        
        // Game state
        this.gameRunning = false;
        this.gameOver = false;
        this.score = 0;
        this.gameSpeed = 3;
        this.gravity = 0.6;
        this.jumpPower = -12;
        
        // Ground
        this.groundY = this.canvas.height - 50;
        
        // Player (Bunny)
        this.bunny = {
            x: 50,
            y: this.groundY - 40,
            width: 40,
            height: 40,
            velocityY: 0,
            isJumping: false,
            color: '#ffb6c1' // Light pink for bunny
        };
        
        // Obstacles (carrots)
        this.obstacles = [];
        this.obstacleSpawnTimer = 0;
        this.obstacleSpawnInterval = 120;
        
        // Sky elements
        this.timeOfDay = 0; // 0-1000 representing time of day cycle
        this.timeDirection = 1; // 1 for day advancing, -1 for night advancing
        this.timeSpeed = 0.2; // Speed of day/night cycle
        
        // Clouds, stars and flowers for background
        this.clouds = [];
        this.stars = [];
        this.flowers = [];
        this.initClouds();
        this.initStars();
        this.initFlowers();
        
        this.bindEvents();
        this.gameLoop();
    }
    
    initClouds() {
        for (let i = 0; i < 5; i++) {
            this.clouds.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * 100 + 20,
                width: 60 + Math.random() * 40,
                height: 30 + Math.random() * 20,
                speed: 0.5 + Math.random() * 0.5,
                opacity: 0.7 + Math.random() * 0.3
            });
        }
    }
    
    initStars() {
        for (let i = 0; i < 30; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * 150,
                size: 1 + Math.random() * 2,
                twinkleSpeed: 0.03 + Math.random() * 0.05,
                twinklePhase: Math.random() * Math.PI * 2
            });
        }
    }
    
    initStars() {
        for (let i = 0; i < 30; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * 150,
                size: 1 + Math.random() * 2,
                twinkleSpeed: 0.03 + Math.random() * 0.05,
                twinklePhase: Math.random() * Math.PI * 2
            });
        }
    }
    
    initFlowers() {
        const flowerColors = ['#FF69B4', '#FFB6C1', '#FFC0CB', '#FF1493', '#DB7093'];
        for (let i = 0; i < 8; i++) {
            this.flowers.push({
                x: Math.random() * this.canvas.width,
                y: this.groundY - 15 - Math.random() * 10,
                size: 8 + Math.random() * 6,
                color: flowerColors[Math.floor(Math.random() * flowerColors.length)]
            });
        }
    }
    
    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                if (!this.gameRunning && !this.gameOver) {
                    this.startGame();
                } else if (this.gameRunning) {
                    this.hop();
                } else if (this.gameOver) {
                    this.restartGame();
                }
            }
        });
        
        this.restartBtn.addEventListener('click', () => {
            this.restartGame();
        });
    }
    
    startGame() {
        this.gameRunning = true;
        this.gameOver = false;
        this.score = 0;
        this.obstacles = [];
        this.bunny.y = this.groundY - 40;
        this.bunny.velocityY = 0;
        this.bunny.isJumping = false;
        this.restartBtn.style.display = 'none';
    }
    
    hop() {
        if (!this.bunny.isJumping && this.gameRunning) {
            this.bunny.velocityY = this.jumpPower;
            this.bunny.isJumping = true;
        }
    }
    
    update() {
        if (!this.gameRunning) return;
        
        // Update time of day
        this.timeOfDay += this.timeSpeed * this.timeDirection;
        if (this.timeOfDay > 1000) {
            this.timeDirection = -1;
        } else if (this.timeOfDay < 0) {
            this.timeDirection = 1;
        }
        
        // Update bunny physics
        this.bunny.velocityY += this.gravity;
        this.bunny.y += this.bunny.velocityY;
        
        // Ground collision
        if (this.bunny.y >= this.groundY - this.bunny.height) {
            this.bunny.y = this.groundY - this.bunny.height;
            this.bunny.velocityY = 0;
            this.bunny.isJumping = false;
        }
        
        // Update clouds
        this.clouds.forEach(cloud => {
            cloud.x -= cloud.speed;
            if (cloud.x + cloud.width < 0) {
                cloud.x = this.canvas.width + Math.random() * 200;
                cloud.y = Math.random() * 100 + 20;
            }
        });
        
        // Update stars
        this.stars.forEach(star => {
            star.twinklePhase += star.twinkleSpeed;
            if (star.twinklePhase > Math.PI * 2) {
                star.twinklePhase = 0;
            }
        });
        
        // Spawn obstacles (carrots)
        this.obstacleSpawnTimer++;
        if (this.obstacleSpawnTimer >= this.obstacleSpawnInterval) {
            this.spawnObstacle();
            this.obstacleSpawnTimer = 0;
            // Increase difficulty
            if (this.obstacleSpawnInterval > 80) {
                this.obstacleSpawnInterval -= 2;
            }
        }
        
        // Update obstacles
        this.obstacles.forEach((obstacle, index) => {
            obstacle.x -= this.gameSpeed;
            
            // Remove off-screen obstacles
            if (obstacle.x + obstacle.width < 0) {
                this.obstacles.splice(index, 1);
                this.score += 10;
            }
            
            // Check collision
            if (this.checkCollision(this.bunny, obstacle)) {
                this.gameOver = true;
                this.gameRunning = false;
                this.restartBtn.style.display = 'inline-block';
            }
        });
        
        // Update score
        this.scoreElement.textContent = this.score;
    }
    
    spawnObstacle() {
        const obstacle = {
            x: this.canvas.width,
            y: this.groundY - 30,
            width: 20,
            height: 30,
            color: '#FFA500', // Orange for carrot
            isCarrot: true
        };
        this.obstacles.push(obstacle);
    }
    
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw sky with gradient based on time of day
        this.drawSky();
        
        // Draw stars (visible during night)
        if (this.timeOfDay > 500) {
            const starOpacity = Math.min(1, (this.timeOfDay - 500) / 500);
            this.drawStars(starOpacity);
        }
        
        // Draw clouds
        this.clouds.forEach(cloud => {
            // Clouds are less visible at night
            const cloudOpacity = cloud.opacity * (1 - Math.max(0, (this.timeOfDay - 500) / 500 * 0.7));
            this.drawCloud(cloud.x, cloud.y, cloud.width, cloud.height, cloudOpacity);
        });
        
        // Draw ground
        this.ctx.fillStyle = '#90EE90'; // Light green grass
        this.ctx.fillRect(0, this.groundY, this.canvas.width, this.canvas.height - this.groundY);
        
        // Draw flowers
        this.flowers.forEach(flower => {
            this.drawFlower(flower.x, flower.y, flower.size, flower.color);
        });
        
        // Draw bunny
        this.ctx.fillStyle = this.bunny.color;
        this.ctx.fillRect(this.bunny.x, this.bunny.y, this.bunny.width, this.bunny.height);
        
        // Draw obstacles
        this.obstacles.forEach(obstacle => {
            this.ctx.fillStyle = obstacle.color;
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
        
        // Draw game over message
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'white';
            this.ctx.font = '30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2);
        }
    }
    
    drawSky() {
        // Create gradient based on time of day
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.groundY);
        
        if (this.timeOfDay < 250) { // Dawn
            const t = this.timeOfDay / 250;
            gradient.addColorStop(0, this.lerpColor('#0C1445', '#E0B0FF', t));
            gradient.addColorStop(1, this.lerpColor('#1D2951', '#FFC0CB', t));
        } else if (this.timeOfDay < 500) { // Day
            gradient.addColorStop(0, '#87CEEB'); // Sky blue
            gradient.addColorStop(1, '#E0FFFF'); // Light cyan
        } else if (this.timeOfDay < 750) { // Dusk
            const t = (this.timeOfDay - 500) / 250;
            gradient.addColorStop(0, this.lerpColor('#87CEEB', '#E0B0FF', t));
            gradient.addColorStop(1, this.lerpColor('#E0FFFF', '#FFC0CB', t));
        } else { // Night
            gradient.addColorStop(0, '#0C1445'); // Dark blue
            gradient.addColorStop(1, '#1D2951'); // Navy blue
        }
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.groundY);
    }
    
    lerpColor(a, b, t) {
        // Convert hex to rgb
        const ah = parseInt(a.replace(/#/g, ''), 16);
        const ar = ah >> 16;
        const ag = ah >> 8 & 0xff;
        const ab = ah & 0xff;
        
        const bh = parseInt(b.replace(/#/g, ''), 16);
        const br = bh >> 16;
        const bg = bh >> 8 & 0xff;
        const bb = bh & 0xff;
        
        // Interpolate
        const rr = ar + t * (br - ar);
        const rg = ag + t * (bg - ag);
        const rb = ab + t * (bb - ab);
        
        return `#${((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1)}`;
    }
    
    drawStars(opacity) {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        this.stars.forEach(star => {
            // Make stars twinkle
            const twinkle = 0.5 + Math.sin(star.twinklePhase) * 0.5;
            const size = star.size * twinkle;
            
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawCloud(x, y, width, height, opacity) {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        
        // Draw a fluffy cloud using multiple circles
        const radiusX = width / 4;
        const radiusY = height / 2;
        
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
        this.ctx.ellipse(x + width * 0.3, y - height * 0.1, radiusX, radiusY, 0, 0, Math.PI * 2);
        this.ctx.ellipse(x + width * 0.6, y, radiusX, radiusY, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    // Draw ground line
        this.ctx.strokeStyle = '#228B22'; // Forest green
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.groundY);
        this.ctx.lineTo(this.canvas.width, this.groundY);
        this.ctx.stroke();
        
        // Draw bunny
        this.drawBunny();
        
        // Draw obstacles (carrots)
        this.obstacles.forEach(obstacle => {
            this.drawCarrot(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
        
        // Draw game over screen
        if (this.gameOver) {
            this.drawGameOver();
        }
        
        // Draw start screen
        if (!this.gameRunning && !this.gameOver) {
            this.drawStartScreen();
        }
    }
    
    drawBunny() {
        // Bunny body
        this.ctx.fillStyle = this.bunny.color;
        this.ctx.fillRect(this.bunny.x, this.bunny.y, this.bunny.width, this.bunny.height);
        
        // Bunny ears
        this.ctx.fillStyle = this.bunny.color;
        this.ctx.fillRect(this.bunny.x + 5, this.bunny.y - 15, 8, 15); // left ear
        this.ctx.fillRect(this.bunny.x + 25, this.bunny.y - 15, 8, 15); // right ear
        
        // Inner ears
        this.ctx.fillStyle = '#FFC0CB'; // Pink
        this.ctx.fillRect(this.bunny.x + 7, this.bunny.y - 12, 4, 10); // left inner ear
        this.ctx.fillRect(this.bunny.x + 27, this.bunny.y - 12, 4, 10); // right inner ear
        
        // Bunny face
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(this.bunny.x + 8, this.bunny.y + 8, 5, 5); // left eye
        this.ctx.fillRect(this.bunny.x + 27, this.bunny.y + 8, 5, 5); // right eye
        
        // Bunny nose
        this.ctx.fillStyle = '#FF69B4'; // Hot pink
        this.ctx.fillRect(this.bunny.x + 18, this.bunny.y + 15, 4, 4); // nose
        
        // Bunny feet
        this.ctx.fillStyle = '#FFC0CB'; // Pink
        this.ctx.fillRect(this.bunny.x + 5, this.bunny.y + 30, 10, 10); // left foot
        this.ctx.fillRect(this.bunny.x + 25, this.bunny.y + 30, 10, 10); // right foot
    }
    
    drawFlower(x, y, size, color) {
        this.ctx.fillStyle = color;
        // Draw petals
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const petalX = x + Math.cos(angle) * size;
            const petalY = y + Math.sin(angle) * size;
            this.ctx.beginPath();
            this.ctx.arc(petalX, petalY, size/2, 0, Math.PI * 2);
            this.ctx.fill();
        }
        // Draw center
        this.ctx.fillStyle = '#FFFF00'; // Yellow center
        this.ctx.beginPath();
        this.ctx.arc(x, y, size/3, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawCarrot(x, y, width, height) {
        // Carrot body (orange)
        this.ctx.fillStyle = '#FFA500';
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + width, y);
        this.ctx.lineTo(x + width/2, y + height);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Carrot top (green)
        this.ctx.fillStyle = '#228B22';
        this.ctx.fillRect(x - 2, y - 10, width + 4, 10);
    }
    
    drawCloud(x, y, width, height) {
        this.ctx.beginPath();
        this.ctx.arc(x + width * 0.25, y + height * 0.5, width * 0.25, 0, Math.PI * 2);
        this.ctx.arc(x + width * 0.5, y + height * 0.4, width * 0.3, 0, Math.PI * 2);
        this.ctx.arc(x + width * 0.75, y + height * 0.5, width * 0.25, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawGameOver() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#FF69B4'; // Hot pink
        this.ctx.font = '48px Courier New';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 30);
        
        this.ctx.font = '24px Courier New';
        this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
        this.ctx.fillText('Press SPACE to restart', this.canvas.width / 2, this.canvas.height / 2 + 60);
    }
    
    drawStartScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#FF69B4'; // Hot pink
        this.ctx.font = '36px Courier New';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Bunny Hop Adventure', this.canvas.width / 2, this.canvas.height / 2 - 40);
        
        this.ctx.font = '20px Courier New';
        this.ctx.fillText('Press SPACE or UP arrow to start', this.canvas.width / 2, this.canvas.height / 2 + 20);
        this.ctx.fillText('Hop over the carrots!', this.canvas.width / 2, this.canvas.height / 2 + 50);
    }
    
    restartGame() {
        this.startGame();
    }
    
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new BunnyGame();
});