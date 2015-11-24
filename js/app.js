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

        // Lose one life when there's a collision with the player
        player.livesUpdate();
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
    this.lives = 5;

    var HTMLscore = document.createElement('h2');
    var scoreText = document.createTextNode("Score: " + this.score );
    HTMLscore.setAttribute('id', 'score');
    HTMLscore.appendChild(scoreText);
    document.body.appendChild(HTMLscore);

    var HTMLlives = document.createElement('div');
    var livesText = document.createTextNode("Lives: " + this.lives);
    HTMLlives.setAttribute('id', 'lives');
    HTMLlives.appendChild(livesText);
    document.body.appendChild(HTMLlives);
};

Player.prototype.update = function() {
    // Prevent player from going off the canvas
    if (this.x > 404) this.x = 404;
    if (this.x < 0) this.x = 0;
    if (this.y > 400) this.y = 400;

    // Control events after player gets into water
    if (this.y < 60) {
        this.y = 400;
        playAudio('water');

        // Lose one life
        player.livesUpdate();
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.scoreUpdate = function(points) {
    var newScore = this.score += points;
    document.getElementById('score').firstChild.nodeValue = 'Score: ' + newScore;
};

Player.prototype.livesUpdate = function() {
    this.lives--;
    console.log(this.lives);
    document.getElementById('lives').firstChild.nodeValue = 'Lives: ' + this.lives;
    if (this.lives === 0) {
        playAudio('win');
        gem.x = undefined;
        gem.y = undefined;
        allEnemies = [];
    }
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
        case ('water') :
            myAudio.src = 'sounds/water-splash.wav';
            break;
        case ('win') :
            myAudio.src = 'sounds/win.mp3';
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
