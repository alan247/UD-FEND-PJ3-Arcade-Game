var Enemy = function(rowCount) {
    this.x = -202;
    this.y = rowCount * 85 + 60;
    this.speed = Math.floor(Math.random() * (300 - 80)) + 80;
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.update = function(dt) {

    // Update enemy location
    this.x += this.speed * dt;

    // Collision management
    if (this.x > player.x - 80
        && this.x < player.x + 101
        && this.y === player.y
        ) {
        player.x = 401;
        player.y = 400;
    }

    // Return enemies when end of canvas reached
    if (this.x > 808) this.x = -101;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function() {
    // Prevent player from going off the canvas
    if (this.x > 705) this.x = 705;
    if (this.x < 0) this.x = 0;
    if (this.y < -25) this.y = -25;
    if (this.y > 400) this.y = 400;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {

    switch(key) {
        case 'left':
            player.x -= 101;
            break;
        case 'right':
            player.x += 101;
            break;
        case 'up':
            player.y -= 85;
            break;
        case 'down':
            player.y += 85;
            break;
    }
};

var allEnemies = [];
var player = new Player(404,400);
var enemy = new Enemy(0, 135);
var enemy2 = new Enemy(50, 135)

for (var i = 0; i < 4; i++) {
    allEnemies.push(new Enemy(i));
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
