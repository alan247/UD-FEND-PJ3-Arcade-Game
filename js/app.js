// Enemy
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
        playAudio('collision');
    }

    // Return enemies when end of canvas reached
    if (this.x > 505) this.x = -202;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';
    this.score = 0;

    var h2 = document.createElement('h2');
    var text = document.createTextNode("Score: " + this.score);
    h2.setAttribute('id', 'score');
    h2.appendChild(text);
    document.body.appendChild(h2);
};

Player.prototype.update = function() {
    // Prevent player from going off the canvas
    if (this.x > 404) this.x = 404;
    if (this.x < 0) this.x = 0;
    if (this.y < -25) this.y = -25;
    if (this.y > 400) this.y = 400;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.scoreUpdate = function(points) {
    var newScore = this.score += points;
    document.getElementById('score').firstChild.nodeValue = 'Score: ' + newScore;
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

var Gem = function () {
    this.x = Math.floor(Math.random() * (5-1) +1) * 101;
    this.y = Math.floor(Math.random() * (4 - 0)) * 85 + 60;
    this.sprite = 'images/gem-blue.png';
};

Gem.prototype.update = function() {

    // Collision management
    if (this.x > player.x - 80
        && this.x < player.x + 101
        && this.y === player.y
        ) {
        playAudio('gem');
        this.x = undefined;
        this.y = undefined;
        player.scoreUpdate(100);
        gem = new Gem();
    }
}

Gem.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var playAudio = function(type) {
    var myAudio = document.createElement("audio");
    switch (type) {
        case ('collision') :
            myAudio.src = 'sounds/hurt.wav';
            break;
        case ('gem') :
            myAudio.src = 'sounds/gem.wav';
            break;
    }
    myAudio.play();
};



var allEnemies = [];
var player = new Player(404,400);
var gem = new Gem();
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
