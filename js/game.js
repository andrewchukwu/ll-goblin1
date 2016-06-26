// Create the canvas
var canvas = document.createElement("canvas");

//Get the canvas context
var ctx = canvas.getContext("2d");


//Set the canvas width and height
canvas.width = 512;
canvas.height = 480;


// Add canvas to the web page
document.body.appendChild(canvas);

// Background image information
var bgReady = false; //This indicates when the background images has loaded
var bgImage = new Image(); //Create an image object that we will load the image into

/**
 * When the background image has loaded, set bgReady to true. We will load the image below.
 *
 * This is known as an event handler - the browser will tell our program that has finished loading
 * the image
 */
bgImage.onload = function () {
	bgReady = true;
};

/**
 * Loads the background image from the images directory. You will find the background image
 * in the images directory
 */
bgImage.src = "images/background1.png";


// Load the Hero image
/**
 * We perform a similar procedure for loading our hero
 */
var heroReady = false; //indicates when the hero image has been loaded
var heroImage = new Image(); //An object to hold the hero image

/**
 * When the hero images has been loaded, set heroReady to true.
 * Another event handler here
 */
heroImage.onload = function () {
	heroReady = true;
};

/**Load the hero image - We can change the image by loading a different file*/
heroImage.src = "images/hero1.png";

// Load the Monster image
/**
 * We perform a similar image loading procedure for loading the monster. We can change the monster
 * by loading a different file
 */

var monsterReady = false;
var monsterImage = new Image();

monsterImage.onload = function () {
	monsterReady = true;
};

//Load the monster image
monsterImage.src = "images/monster1.png";


// Game objects
/**
 * Like for the player object in the "moveasquare" example, we setup an object that
 * represents information about the game we are creating
 *
 */
var hero = {
	speed: 256, // movement in pixels per movement
    x:canvas.width / 2, //put the hero half way on the canvas (x axis)
    y:canvas.height / 2, //put the hero half way on the canvas (y axis)

    //Extra features
    //Add a score for the hero
    score: 0
};

//Monster object
var monster = {};

//Number of monsters the hero has caught
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

//Adding timer and score
var GAME_TIME = 10;

/*
 * Information about the game
 */
var game ={
    score: 0, //Current score
    timer: GAME_TIME, //The length of time the game lasts
    gameStarted: false,//If the game has started
    gameOverFlag:false, //If the game is now over

    //Reset the game
    reset: function() {
        this.timer=GAME_TIME;
        this.score=0;
        //Reset the value
        monstersCaught=0;
        this.gameStarted=true;
    }
}

/**
 * Timer logic (countdown timer from initial value)
 */
var countdown = function()
{
    console.log("Countdown timer called");
    /** If there is more seconds on the clock we reduce it*/
    if(game.timer>0)
    {
        game.timer-=1;
    }
    else
    {
        /**Once the counter reaches 0, we call the gameOver() function and cancel the
         * countdown timer
         */
        gameOver();
        clearInterval(countdownTimer); //cancel the timer
    }
    //render();
}
//Set when we start the game
var countdownTimer = null;


//Called when the game is over
var gameOver = function()
{
    game.gameOverFlag=true;
    game.gameStarted=false;
    console.log("Game Over: gameOverFlag="+game.gameOverFlag);
    startButton.disabled=false; //Re-enable the start game button so we can play another game

}

/**
 * Get a reference to the HTML button defined
 * @type {HTMLElement}
 */
var startButton = document.getElementById('startButton');

//Called when the start button is pressed
var startGame = function()
{
    console.log("Button clicked: "+startButton); //We log that the game has started
    countdownTimer=setInterval('countdown()',1000); //Start the game timer
    game.reset(); //Reset game
    startButton.disabled=true; //Disable the button so we cannot press during the game
}




addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
/**
 * Function : update()
 */
var reset = function () {
	//hero.x = canvas.width / 2;
	//hero.y = canvas.height / 2;

    /**
     * Throw the monster somewhere on the screen randomly. Notice the maths used to determine the location.
     * It considers the size of the monster and the  canvas size
     */

	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
/**
 * Function: update
 * @param modifier
 */
var update = function (modifier) {

    if(game.gameStarted) {
        /**When the game has started*/
        if (38 in keysDown) { // Player holding up
            hero.y -= hero.speed * modifier;
        }
        if (40 in keysDown) { // Player holding down
            hero.y += hero.speed * modifier;
        }
        if (37 in keysDown) { // Player holding left
            hero.x -= hero.speed * modifier;
        }
        if (39 in keysDown) { // Player holding right
            hero.x += hero.speed * modifier;
        }

        //Protect hero from going off the screen

        /**
         * Here is an important section of gaming logic - How do we determine if the hero
         * has captured the monster. Simply - the hero needs to be touching the monster.
         *
         * The logic below tests if one square, is overlapping another
         */
        if (
            hero.x <= (monster.x + 32)
            && monster.x <= (hero.x + 32)
            && hero.y <= (monster.y + 32)
            && monster.y <= (hero.y + 32)
        ) {
            ++monstersCaught;
            game.score += 10;
            console.log("Score is:" + game.score + "; timeleft=" + game.timer);
            reset();
        }
    }//If the game is started end
};

// Draw everything
var render = function () {
	if (bgReady) {
        //If the background is ready, draw it
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
        //If the hero is ready, draw it
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
        //If the monster is ready, draw it
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Output details of score and remaining time
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "20px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught+", Score: "+game.score, 32, 32);
    ctx.fillText("Time: "+game.timer,32,64);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
//Set the time first
var then = Date.now();
reset();
main();
