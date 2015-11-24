// Class to generate enemies
var Enemy = function(rowCount) {
    // Set enemie's location
    this.x = -202;
    this.y = rowCount * 85 + 60;

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
        && this.x < player.x + 101
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
    var scoreText = document.createTextNode("SCORE: " + this.score );
    HTMLscore.setAttribute('id', 'score');
    HTMLscore.appendChild(scoreText);
    document.body.appendChild(HTMLscore);

    // Add lives to the DOM
    var HTMLlives = document.createElement('div');
    var livesText = document.createTextNode("LIVES: " + this.lives);
    HTMLlives.setAttribute('id', 'lives');
    HTMLlives.appendChild(livesText);
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
        player.livesUpdate();
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
        player.x = undefined;
        player.y = undefined;
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

// Class to manage gems
var Gem = function () {

    // Set gem in random location on stone blocks only
    this.x = Math.floor(Math.random() * (5-1) +1) * 101;
    this.y = Math.floor(Math.random() * (4 - 0)) * 85 + 60;

    // Set gem image
    this.sprite = 'images/gem-blue.png';
};

// Gem's update method
Gem.prototype.update = function() {

    // Collision management. Check if gem is in the same
    // location as the player
    if (this.x > player.x - 80
        && this.x < player.x + 101
        && this.y === player.y
        ) {

        // If true, play gem collision sound
        playAudio('gem');

        // Remove gem from screen
        this.x = undefined;
        this.y = undefined;

        // Update score by 100 points
        player.scoreUpdate(100);

        // Create a new gem in a random position
        gem = new Gem();
    }
}

// Draw gem on screen
Gem.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Method to play sound effects
var playAudio = function(type) {

    // Create <audio> element on DOM
    var myAudio = document.createElement("audio");

    // Check what sound is required by the "type" argument
    // passed to the method and set the correct file
    // source
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
        case ('endgame') :
            myAudio.src = 'sounds/win.mp3';
            break;
    }

    // Play selected file
    myAudio.play();
};

// Method that allows to play again after "Play again" button
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
    gem.x = Math.floor(Math.random() * (5-1) +1) * 101;
    gem.y = Math.floor(Math.random() * (4 - 0)) * 85 + 60;

    // Reset score and lives counters
    document.getElementById('score').firstChild.nodeValue = 'SCORE: 0';
    document.getElementById('lives').firstChild.nodeValue = 'LIVES: 5';
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
