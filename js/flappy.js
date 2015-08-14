// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)


var width = 790;
var height = 400;
var gameSpeed = -200;
var gameGravity = 380;
var jumpPower = -170;
var score;
var labelScore;
var player;
var pipes = [];
var fish = [];
var pipeInterval = 1.75;
var gapSize = 100;
var gapMargin= 50;
var blockHeight = 50;
var pipeEndExtraWidth= 10;
var pipeEndHeight = 25;
var stars = [];

var game = new Phaser.Game(width, height, Phaser.AUTO, 'game', stateActions);

/*
 * Loads all resources for the game and gives them names.
 */


jQuery("#greeting-form").on("submit", function(event_details) {
    alert("Submitted");
    //event_details.preventDefault();
});


function preload(){
    game.load.image("additionalsecondImg", "../assets/paw.png");
    game.load.image("playersecondImg", "../assets/kittenplayer.png");
    game.load.image("pipe","../assets/pipe_purple.png");
    game.load.image("pipeEnd", "../assets/pipe-end-purple.png");
    game.load.image("fish","../assets/fish.gif");
    game.load.image("back", "../assets/flying-background.png");
    game.load.image("stars","../assets/star.png");

}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    game.stage.setBackgroundColor ("#F0B2F0");
// set the background colour of the scene
    game.add.text(230,150, "Catapult",
        {font: "80px Verdana", fill: "#F4C9F4"});

    player = game.add.sprite(350, 200, "playersecondImg");
    player.width = 40;
    player.height = 40;
    player.anchor.setTo(0.5, 0.5);

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(player);

    game.input
        .onDown
        .add(clickHandler);

    score = 0;
    labelScore = game.add.text(20,20, "0");


    game.input.keyboard
        .addKey(Phaser.Keyboard.ENTER)
        .onDown.add(start);

    splashDisplay = game.add.text(120,360, "Press ENTER to start, SPACEBAR to jump");



}
function start () {
    game.input.keyboard
    .addKey(Phaser.Keyboard.SPACEBAR)
    .onDown.add(playerJump);


    generatePipe();

    player.body.velocity.x = 0;
    player.body.velocity.y = -150;
    player.body.gravity.y = gameGravity;

    pipeInterval = 1.75;
    game.time.events
        .loop(pipeInterval * Phaser.Timer.SECOND,
        generate);

    splashDisplay.destroy();
}



function clickHandler() {

    var background = game.add.sprite(event.x,event.y,"additionalsecondImg");
    background.width = 80;
    background.height = 80;
}


function game0ver() {
    game.state.restart();
    $("#greeting").show();
    $("#score").val(score.toString());
    gameGravity = 380;
    var star = [];
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

        if(player.body.y < 0) {
            game0ver();
    }
        if(player.body.y > 400){
            game0ver();
    }

    player.rotation = Math.atan(player.body.velocity.y / gameSpeed);

    for(var i=fish.length - 1; i>=0; i--){
        game.physics.arcade.overlap(player,fish[i], function(){

            changeGravity(-50);
           fish[i].destroy();
            fish.splice(i,1);

        });
    }


    for(var i=stars.length - 1; i>=0; i--){
        game.physics.arcade.overlap(player,stars[i], function(){
            stars[i].destroy();
            stars.splice(i,1);
            changeScore();
        });
    }

}


function changeScore() {
        score = score + 1;
        labelScore.setText(score.toString());

    }


function playerJump() {
        player.body.velocity.y = jumpPower;

    }

$.get("/score", function (scores) {
        scores.sort(function (scoreA, scoreB) {
            var difference = scoreB.score - scoreA.score;
            return difference;
        });
        for (var i = 0; i < scores.length; i++) {
            $("#scoreBoard").append(
                "<li>" +
                scores[i].name + ": " + scores[i].score +
                "</li>");
            console.log("Data: ", scores);

        }
    });

function changeGravity(g) {
        gameGravity += g;
        player.body.gravity.y = gameGravity;
    }

function generatePipe() {
    var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);
    for (var y=gapStart; y>0; y-=blockHeight){
            addPipeBlock(width, y-blockHeight);
        }
    addPipeEnd(width-pipeEndExtraWidth/2, gapStart - pipeEndHeight);
    for (var y=gapStart +gapSize; y<height; y+=blockHeight){
        addPipeBlock(width, y);
    }
    addPipeEnd(width-pipeEndExtraWidth/2, gapStart + gapSize);
    changeScore();
}


function addPipeBlock(x, y) {
    var pipeBlock = game.add.sprite(x, y, "pipe");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = gameSpeed;

}
function addPipeEnd(x,y){
    var block =game.add.sprite(x,y,"pipeEnd");
    pipes.push(block);
    game.physics.arcade.enable(block);
    block.body.velocity.x=gameSpeed;
}


function generatefish() {
        var bonus = game.add.sprite(width, height, "fish");
    bonus.scale.x = 0.25;
    bonus.scale.y = 0.25;
        fish.push(bonus);
        game.physics.arcade.enable(bonus);
        bonus.body.velocity.x = -250;
        bonus.body.velocity.y = -game.rnd.integerInRange(60, 100);
    }

function generate() {
        var diceRoll = game.rnd.integerInRange(1,10);
        if (diceRoll == 1) {
            generatefish();
        } else {
            generatePipe();
        }
    }
