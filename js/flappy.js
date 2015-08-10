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
function preload() {game.load.image("InitialF", "../assets/fish.PNG");
    game.load.image("additionalImg2", "../assets/b.png");
    game.load.image("Player1", "../assets/player.png");
    game.load.image("pipe","../assets/pipe_blue.png");

}

var score;
var labelScore;
var player;
var pipes = [];

function create() {game.stage.setBackgroundColor('#3385D6');
    // set the background colour of the scene
    game.add.text(90,100,"Flying Fish!",
    {font: "100px Ebrima", fill: "#D6D6FF"});

    var background = game.add.sprite(600, 160, "InitialF");
    background.width = 200;
    background.height = 75;
    var background = game.add.sprite(580,110, "additionalImg2");
    background.width = 60;
    background.height = 50;
    var background = game.add.sprite(650,80, "additionalImg2");
    background.width = 60;
    background.height = 50;
    var background = game.add.sprite(580,40, "additionalImg2");
    background.width = 70;
    background.height = 60;
    var background = game.add.sprite(610,165, "additionalImg2");
    background.width = 40;
    background.height = 30;
    game.input
        .onDown
        .add(clickHandler);

    score = 0;
labelScore = game.add.text(20,20,"0");


    player = game.add.sprite(350,100, "Player1" );
    player.width = 60;
    player.height = 30;


    game.input.keyboard.addKey(Phaser.Keyboard.UP)
        .onDown.add(moveup);
    game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
        .onDown.add(movedown);

    generatePipe();

game.physics.startSystem(Phaser.Physics.ARCADE)
    game.physics.arcade.enable(player);
    player.body.velocity.x = 0;
    player.body.velocity.y = -100;
    player.body.gravity.y = 400;


    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);

    pipeInterval = 2;
    game.time.events
        .loop(pipeInterval * Phaser.Timer.SECOND,
        generatePipe);

}

function clickHandler(event) {
    var background = game.add.sprite(event.x, event.y, "additionalImg2");
    background.width = 50;
    background.height = 40;
}
/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
    for (var index = 0; index < pipes.length; index++) {
    game.physics.arcade
        .overlap(player,
        pipes[index],
        gameOver)
}
}

function changeScore(){
    score = score + 1;
    labelScore.setText(score.toString());

}


function moveup(){
    player.y -=50
}
function movedown(){
    player.y +=50
}
function generatePipe(){
    //calculate a random position for the gap
    var gap = game.rnd.integerInRange(1, 5);
    //generate the pipes, except where the gap should be
    for (var count=0; count<8; count++) {
        if(count != gap && count != gap+1) {
            addPipeBlock(750, count*50);
        }
    }
    changeScore();
}

function addPipeBlock(x, y) {
    var pipeBlock = game.add.sprite(x, y, "pipe");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock)
    pipeBlock.body.velocity.x = -200
}

function playerJump(){
    player.body.velocity.y = -200;
}

function gameOver(){
    location.reload();

}