// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

var score;
var labelScore;
var player;
var pipes = [];
var width = 790;
var height = 400;
var gameSpeed = 200;
var gameGravity = 500;
var jumpPower = -170;
var splashDisplay;
var stars = [];
var pipeInterval = 1.75;
var gapSize = 100;
var gapMargin = 50;
var blockHeight = 50;
var pipeEndExtraWidth = 10;
var pipeEndHeight = 25;
var starHeight = 48;
var game = new Phaser.Game(width, height,Phaser.AUTO, 'game', stateActions);

/*
 * Loads all resources for the game and gives them names.
 */

jQuery("#greeting-form").on("submit", function(event_details) {
    alert("Submitted");
});

function start () {

    player.body.velocity.x = 0;
    player.body.velocity.y = -100;
    player.body.gravity.y = gameGravity;

    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);

    game.time.events.loop(pipeInterval * Phaser.Timer.SECOND, generatePipe);

    splashDisplay.destroy();

}

function preload() {
    game.load.image("InitialF", "../assets/fish.PNG");
    game.load.image("additionalImg2", "../assets/b.png");
    game.load.image("Player1", "../assets/player.png");
    game.load.image("pipe","../assets/pipe_blue.png");
    game.load.image("star","../assets/star.png")
    game.load.image("pipeEnd","../assets/pipe-end.png")

    game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.remove(start);

}



function create() {game.stage.setBackgroundColor('#3385D6');
    game.add.text(90,100,"Flying Fish!",
    {font: "100px Ebrima", fill: "#D6D6FF"});

    var background = game.add.sprite(600, 160, "InitialF");
    background.width = 150;
    background.height = 60;
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
    player.anchor.setTo(0.5,0.5);



    game.physics.startSystem(Phaser.Physics.ARCADE)
    game.physics.arcade.enable(player);

    splashDisplay = game.add.text(70,20, "Press ENTER to start, SPACEBAR to jump");

    game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
        .onDown.add(start);




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
    game.physics.arcade.overlap(player, pipes, gameOver);
    if(0>player.body.y || player.body.y>width){
        gameOver();
    }
    if(player.body.y < 0) {
        gameOver();
    }
    if(player.body.y > 400){
        gameOver();
    }
    player.rotation = Math.atan(player.body.velocity.y / 200);

    for(var i=stars.length - 1; i>=0; i--){
        game.physics.arcade.overlap(player,stars[i], function(){
            stars[i].destroy();
            stars.splice(i,1);
            changeScore();
        });
    }

    }

function changeScore(){
    score = score + 1;
    labelScore.setText(score.toString());

}

function addPipeEnd(x, y) {
    var block = game.add.sprite(x, y, "pipeEnd");
    pipes.push(block);
    game.physics.arcade.enable(block);
    block.body.velocity.x = -gameSpeed;
}

function generatePipe(){
    var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);


    for(var y=gapStart; y>0; y -= blockHeight){
        addPipeBlock(width,y - blockHeight);
    }
    addPipeEnd(width - pipeEndExtraWidth/2, gapStart - pipeEndHeight);

    addStar(width, gapStart + (gapSize / 2) - (starHeight / 2));

    for(var y=gapStart + gapSize ; y<height; y += blockHeight){
        addPipeBlock(width,y);
    }
    addPipeEnd(width- pipeEndExtraWidth/2,gapStart+gapSize);
    //changeScore();
}

function addPipeBlock(x, y) {
    var pipeBlock = game.add.sprite(x, y, "pipe");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock)
    pipeBlock.body.velocity.x = -gameSpeed;
}

function playerJump(){
    player.body.velocity.y = jumpPower;
}

function addStar(x, y){
    var star = game.add.sprite(x, y, "star");
    stars.push(star);
    game.physics.arcade.enable(star);
    star.body.velocity.x = - gameSpeed;
}

function gameOver(){
    score = 0
    gameGravity = gameGravity;
    game.state.restart();
    stars = [];
}

jQuery.get("/score", function(scores){
    console.log("Data: ",scores);
    scores.sort(function (scoreA, scoreB){
        var difference = scoreB.score - scoreA.score;
        return difference;
    });
    for (var i = 0; i < scores.length; i++) {
        jQuery("#scoreBoard").append(
            "<li>" +
            scores[i].name + ": " + scores[i].score +
            "</li>");
    }
});
