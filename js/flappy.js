// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);

/*
 * Loads all resources for the game and gives them names.
 */
function preload(){
    game.load.image("additionalsecondImg", "../assets/paw.png");
    game.load.image("playersecondImg", "../assets/kittenplayer.png");
    game.load.image("pipe","../assets/pipe_purple.png");


}

/*
 * Initialises the game. This function is only called once.
 */
var score;
var labelScore;
var player;
var pipes = [];




function create() {game.stage.setBackgroundColor ("#F0B2F0");
// set the background colour of the scene
    game.add.text(310,10, "Welcome",
        {font: "40px Verdana", fill: "#9900CC"});

    player = game.add.sprite(350, 200, "playersecondImg");
    player.width = 40;
    player.height = 40;

    game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
        .onDown.add(moveRight);
    game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
        .onDown.add(moveLeft);
    game.input.keyboard.addKey(Phaser.Keyboard.UP)
        .onDown.add(moveUp);
    game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
        .onDown.add(moveDown);

    score = 0;
    labelScore = game.add.text(20,20, "0");

    game.input
        .onDown
        .add(clickHandler);

    generatePipe();

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(player);
    player.body.velocity.x = 0;
    player.body.velocity.y = -150;
    player.body.gravity.y = 380;

    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);

    pipeInterval = 1.75;
    game.time.events
        .loop(pipeInterval * Phaser.Timer.SECOND,
        generatePipe);

}


function clickHandler(event){

    var background = game.add.sprite(event.x,event.y,"additionalsecondImg");
    background.width = 80;
    background.height = 80;
}
/*
 * This function updates the scene. It is called for every new frame.
 */
function update(){

    for(var index=0; index<pipes.length; index++){
        game.physics.arcade
            .overlap(player,
        pipes[index],
        game0ver);
    }
}



function game0ver() {
    location.reload();
}



function changeScore(){
    score = score + 1;
    labelScore.setText(score.toString());

}

function moveRight(){
    player.x += 30;
}

function moveLeft(){
    player.x -= 30;
}

function moveUp(){
 player.y -= 30;
}

function moveDown() {
    player.y += 30;
}



function generatePipe() {
    //calculate a random position for the gap
    var gap = game.rnd.integerInRange(1, 5);
    // generate the pipes, except where the gap should be
    for (var count = 0; count < 8; count++) {
        if (count != gap && count != gap + 1) {
            addPipeBlock(750, count * 50);
        }
    }changeScore();
}


function addPipeBlock(x, y) {
    var pipeBlock = game.add.sprite(x,y,"pipe");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = -200;
}

function playerJump (){
    player.body.velocity.y = -170
}