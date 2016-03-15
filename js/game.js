// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos


// http://juegos.canvas.ninja/

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

// stone image
var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload = function () {
	stoneReady = true;
};
stoneImage.src = "images/stone.png";

// monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var princess = {};
var princessesCaught = 0;

var stone = {};
var numstone=3;

var monster = {
	speed:32
};

//var monsters[]=3;
var stones=[5];

// Handle keyboard controls-> keyDown quiere decir que he pulsado una tecla
var keysDown = {};

addEventListener("keydown", function (e) {		//para cuando pulso una tecla -> keydown
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {		//para cuando dejo de pulsar una tecla ->keyup
	delete keysDown[e.keyCode];
}, false);
var pause_or_play = false;
var contadorPause = 0;

// Reset the game when the player catches a princess
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the princess somewhere on the screen randomly
	// La princesa se sitúa en el mapa aleatoriamente
	princess.x = 32 + (Math.random() * (canvas.width - 100));
	princess.y = 32 + (Math.random() * (canvas.height - 100));

	stone.x = 32 + (Math.random() * (canvas.width - 100));
	stone.y = 32 + (Math.random() * (canvas.height - 100));

	monster.x = 32 + (Math.random() * (canvas.width - 100));
	monster.y = 32 + (Math.random() * (canvas.height - 100));

	var i;
	for(i=0;i<numstone;i++){
		if(touchPrincess(hero.x, hero.y)||touchStone(hero.x, hero.y)||touchStone(princess.x, princess.y)||
			touchMonster(hero.x, hero.y)||touchMonster(princess.x, princess.y)||touchMonster(stone.x, stone.y)){
				reset();
		}
	}
};

// Update game objects
var update = function (modifier) {
	if(pause_or_play){
		return;
	}

	if (38 in keysDown && hero.y>20) { // Player holding up -> con hero.y>20 pongo un límite superior para el héroe
		if(!touchStone(hero.x, (hero.y - 7))){
			hero.y -= hero.speed * modifier;
		}
	}
	if (40 in keysDown && hero.y<415) { // Player holding down
		if(!touchStone(hero.x, (hero.y + 7))){
			hero.y += hero.speed * modifier;
		}
	}
	if (37 in keysDown && hero.x>25) { // Player holding left
		if(!touchStone((hero.x - 7), hero.y)){
			hero.x -= hero.speed * modifier;
		}
	}
	if (39 in keysDown && hero.x<450) { // Player holding right
		if(!touchStone((hero.x + 7), hero.y)){
			hero.x += hero.speed * modifier;
		}
	}

	// Quiero que el mostruo persiga al héroe todo el tiempo
	if (hero.x - monster.x > 0){
		if(!touchStone(monster.x, (monster.y + 3))){
			monster.x += monster.speed*modifier;
		}
	}else{
		if(!touchStone(monster.x, (monster.y - 3))){
			monster.x -= monster.speed*modifier;
		}
	}
	if (hero.y - monster.y > 0){
		if(!touchStone((monster.x + 3), monster.y)){
			monster.y += monster.speed*modifier;
		}
	}else{
		if(!touchStone((monster.x - 3), monster.y)){
			monster.y -= monster.speed*modifier;
		}
	}

	// Are they touching?
	if (touchPrincess(hero.x, hero.y)) {
		if(princessesCaught%10==0 && princessesCaught>9){
			nextLevels();
		}
		++princessesCaught;
		reset();
	}else if(touchMonster(hero.x, hero.y)){
		princessesCaught=0;
		monster.speed = 32;
		//alert("the end");
		reset();
	}

};

var nextLevels = function(){
	monster.speed += 16;
	++numstone;
}

var touchPrincess = function(px, py){
	var touch = false;

	if (px <= (princess.x + 25) && princess.x <= (px + 25) && py <= (princess.y + 25) && princess.y <= (py + 25)) {
		touch = true;
	}

	return touch;
}

var touchStone = function (px, py){
	var touch = false;
	if (px <= (stone.x + 25) && stone.x <= (px + 25) && py <= (stone.y + 25) && stone.y <= (py + 25)) {
		touch = true;
}

	return touch;
}

var touchMonster = function(px, py){
	var touch = false;

	if (px <= (monster.x + 25) && monster.x <= (px + 25) && py <= (monster.y + 25) && monster.y <= (py + 25)) {
		touch = true;
	}

	return touch;
}

function clickPause() {
	var boton = document.getElementById("pau").innerHTML;
	var pause = "Pause or Play!";
	contadorPause%=2;

	if ((boton.localeCompare(pause)==0) && (contadorPause==0)) {
		pause_or_play = true;
		contadorPause++;
	}else if(contadorPause!=0){
		pause_or_play = false;
		contadorPause++;
		return;
	}
}

function clickUpdate() {
	reset();
}

function clickSave() {
	localStorage.setItem("hero", JSON.stringify(hero));
	localStorage.setItem("princessesCaught", JSON.stringify(princessesCaught));
	localStorage.setItem("stone", JSON.stringify(stone));
	localStorage.setItem("monster", JSON.stringify(monster));
}

function clickLoad() {
	if (localStorage.getItem("princessesCaught")) {
		hero = JSON.parse(localStorage.getItem("hero"));
		princessesCaught = JSON.parse(localStorage.getItem("princessesCaught"));
		stone = JSON.parse(localStorage.getItem("stone"));
		monster = JSON.parse(localStorage.getItem("monster"));
	}else{
		return;
	}
}

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);	//para que se ponga el canvas
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);	//para pintar el heroe
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);	//para pintar a la princesa
	}

	if (stoneReady) {
		ctx.drawImage(stoneImage, stone.x, stone.y);	//para pintar a la piedra
	}

/*
	if (stoneReady) {
		var i;
		for (i = 0; i < numstone; i++){
		 	ctx.drawImage(stoneImage, stones[i].x, stones[i].y);
		}
	}
*/

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);	//para pintar a la princesa
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);

};

// The main game loop
var main = function () {
	// Para dar sensación de movimiento
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
