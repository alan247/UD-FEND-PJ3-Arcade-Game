var TILE_WIDTH = 101,
    TILE_HEIGHT = 85;

// Class to generate enemies
var Enemy = function(rowCount) {
    // Set enemie's location
    this.x = -202;
    this.y = rowCount * TILE_HEIGHT + 60;

    // Set speed by generating to a random generated number
    // between 80 and 300
    this.speed = Math.floor(Math.random() * (300 - 80)) + 80;

    // Enemy png image
    this.sprite = 'images/enemy-bug.png';
};

// Enemy update method
Enemy.prototype.update = function(dt) {

    // Update enemy location by multiplying speed by
    // time delta
    this.x += this.speed * dt;

    // Collision management. Check if enemy is in the same
    // location as the player
    if (this.x > player.x - 80
        && this.x < player.x + TILE_WIDTH
        && this.y === player.y
        ) {

        // If player and enemy are in the same location,
        // reset player to initial location
        player.reset();

        // Play enemy collision sound
        playAudio('collision');

        // Lose one life when there's a collision with
        // the player
        player.livesUpdate();
    }

    // Return enemies to start point when end of canvas
    // reached
    if (this.x > 505) this.x = -202;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Class to generate player
var Player = function() {

    // Set player initial location
    this.x = 202;
    this.y = 400;

    // Set player image
    this.sprite = 'images/char-boy.png';

    // Set initial score
    this.score = 0;

    // Set initial amount of player's lives
    this.lives = 5;

    // Add score to the DOM
    var HTMLscore = document.createElement('div');
    HTMLscore.innerHTML = 'SCORE: ' + this.score;
    HTMLscore.setAttribute('id', 'score');
    document.body.appendChild(HTMLscore);

    // Add lives to the DOM
    var HTMLlives = document.createElement('div');
    HTMLlives.innerHTML = 'LIVES: ' + this.lives;
    HTMLlives.setAttribute('id', 'lives');
    document.body.appendChild(HTMLlives);
};

// Player update method
Player.prototype.update = function() {

    // Prevent player from going off the canvas
    if (this.x > 404) this.x = 404;
    if (this.x < 0) this.x = 0;
    if (this.y > 400) this.y = 400;

    // Control events after player gets into water
    if (this.y < 60) {

        // Reset player to initial location
        this.reset();

        // Play water collision sound
        playAudio('water');

        // Lose one life after contact with water
        this.livesUpdate();
    }
};

// Draw player on screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Method to update player's score
Player.prototype.scoreUpdate = function(points) {

    // Add specified points to old score
    var newScore = this.score += points;

    // Update DOM with new score
    document.getElementById('score').firstChild.nodeValue = 'SCORE: ' + newScore;
};

// Method to update player's lives
Player.prototype.livesUpdate = function() {

    // Reduce lives by one
    this.lives--;

    // Update DOM with current lives
    document.getElementById('lives').firstChild.nodeValue = 'LIVES: ' + this.lives;

    // Check if there are lives left
    if (this.lives === 0) {

        // Play endgame sound
        playAudio('endgame');

        // Remove player, gems and enemies
        gem.x = undefined;
        gem.y = undefined;
        this.x = undefined;
        this.y = undefined;
        allEnemies = [];

        // Display message with final score and option to play again
        document.getElementById('end').style.display = 'block';
        document.getElementById('final-score').innerHTML = this.score;
    }
};

// Method to send player to initial position
Player.prototype.reset = function() {
    this.x = 202;
    this.y = 400;
};

// Method to handle input keys and move the player accordingly
Player.prototype.handleInput = function(key) {

    switch(key) {
        case 'left':
            this.x -= TILE_WIDTH;
            break;
        case 'right':
            this.x += TILE_WIDTH;
            break;
        case 'up':
            this.y -= TILE_HEIGHT;
            break;
        case 'down':
            this.y += TILE_HEIGHT;
            break;
    }
};

// Class to manage gems
var Gem = function () {

    // Call reset method to make Gem appear in random location
    this.reset();

    // Set gem image
    this.sprite = 'images/gem-blue.png';
};

// Gem's update method
Gem.prototype.update = function() {

    // Collision management. Check if gem is in the same
    // location as the player
    if (this.x > player.x - 80
        && this.x < player.x + TILE_WIDTH
        && this.y === player.y
        ) {

        // If true, play gem collision sound
        playAudio('gem');

        // Update score by 100 points
        player.scoreUpdate(100);

        // Create a new gem in a random position
        this.reset();
    }
}

// Gems reset method
Gem.prototype.reset = function () {

    // Set gem in random location on stone blocks only
    this.x = Math.floor(Math.random() * (5-1) +1) * TILE_WIDTH;
    this.y = Math.floor(Math.random() * (4 - 0)) * TILE_HEIGHT + 60;
};

// Draw gem on screen
Gem.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Method to play sound effects
var playAudio = function(type) {

    // Create <audio> element on DOM
    var myAudio;

    // Check what sound is required by the 'type' argument
    // passed to the method and set the correct file
    // source
    switch (type) {
        case ('collision') :
            var collisionAudio = document.createElement('audio');
            collisionAudio.src = 'sounds/hurt.wav';
            collisionAudio.play();
            break;
        case ('gem') :
            var gemAudio = document.createElement('audio');
            gemAudio.src = 'sounds/gem.wav';
            gemAudio.play();
            break;
        case ('water') :
            var waterSound = document.createElement('audio');
            waterSound.src = 'sounds/water-splash.wav';
            waterSound.play();
            break;
        case ('endgame') :
            var endgameSound = document.createElement('audio');
            endgameSound.src = 'sounds/win.mp3';
            endgameSound.play();
            break;
    }


};

// Method that allows to play again after 'Play again' button
// is clicked on the final score modal window
var playAgain = function() {

    // Hide modal with final score
    document.getElementById('end').style.display = 'none';

    // Display new set of enemies
    for (var i = 0; i < 4; i++) {
        allEnemies.push(new Enemy(i));
    }

    // Send player to initial position
    player.reset();

    // Display a gem in a random position
    gem.reset();

    // Reset score and lives counters
    document.getElementById('score').innerHTML = 'SCORE: 0';
    document.getElementById('lives').innerHTML = 'LIVES: 5';
    player.score = 0;
    player.lives = 5;
};

// Initialize game
// Create an empty array to store enemies
var allEnemies = [];

// Create player by calling Player class
var player = new Player();

// Create first gem by calling Gem class
var gem = new Gem();

// Create 4 enemies and push them into allEnemies array
// This passes a number from 1 to 4 as an argument to
// Enemy class. Each number corresponds to a diferent row
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
