

var diceArray = [];
var rollCount = 0;
var scoreValue;
var normalValue;//tallies individual/pairs of 1's and 5's
var bonusValue; //tallies triples and up



const scoreKey = {
	1: { 3: 300, 4: 1000, 5: 2000, 6: 3000 },
	2: { 3: 200, 4: 1000, 5: 2000, 6: 3000 },
	3: { 3: 300, 4: 1000, 5: 2000, 6: 3000 },
	4: { 3: 400, 4: 1000, 5: 2000, 6: 3000 },
	5: { 3: 500, 4: 1000, 5: 2000, 6: 3000 },
	6: { 3: 600, 4: 1000, 5: 2000, 6: 3000 },
  };



//Initialize the dice at the beginning and after each round
function initializeDice(){
	for(var i = 0; i < 6; i++){
		diceArray[i] = {};
		diceArray[i].id = "die" + (i + 1);
		diceArray[i].value = i + 1;
		diceArray[i].clicked = 0;
		diceArray[i].scored = 0;
		
		rollCount = 0;	
		scoreValue = 0;
		normalValue = 0;
		bonusValue = 0; 		
	}	
}



//Roll Dice Button
function rollDiceClick(){
	
	scoreCheck();
	rollCount++;

	//User has to make selection before rolling again. In valueCheck() rollCount is re-initialized to "0" when user makes selection 
	if (rollCount > 1){
		alert("Please make a selection");
		return;
	}	
	//Random dice generator
	for(var i=0; i < 6; i++){
		if(diceArray[i].clicked === 0){
			diceArray[i].scored = 0;
			diceArray[i].value = Math.floor((Math.random() * 6) + 1);
		}
	}
	rollingDiceAnimation();
	updateDiceImg();
	
	if(!validDiceCheck()){
		farkle();
	}
}



function scoreCheck(){

	var currentArray = [0,0,0,0,0,0];
	
	// Only count dice not "scored" in previous rounds.
	for(var i=0; i < 6; i++){
		if(diceArray[i].clicked === 1 && diceArray[i].scored == 0){
			currentArray[diceArray[i].value - 1]++;
			diceArray[i].scored = 1;
			rollCount = 0;		
		}
	}		
	for(var i=0; i < 6; i++){
		 if(currentArray[i] >= 3){
			bonusValue = scoreKey[(i + 1)][(currentArray[i])];
			}
			var oneInPlay = diceArray.filter(dice => dice.clicked === 1 && dice.scored === 1 && dice.value === 1);
			var fiveInPlay = diceArray.filter(dice => dice.clicked === 1 && dice.scored === 1 && dice.value === 5);

			if ((oneInPlay.length || fiveInPlay.length) <= 2){	
			normalValue =  (oneInPlay.length * 100) + (fiveInPlay.length * 50);
			}
	}
	//Calculate total and pass data to scoreboard for "Round Score"	
		scoreValue = bonusValue + normalValue;
		var score = document.getElementById('score');
		score.textContent = scoreValue;	
}



//Updates images of dice given values of rollDiceClick()
function updateDiceImg(){
	var diceImage;
	for(var i = 0; i < 6; i++){
		diceImage = "images/" + diceArray[i].value + ".png";
		document.getElementById(diceArray[i].id).setAttribute("src", diceImage);
	}
}



//Checks if valid dice are still in play
function validDiceCheck(){
	
	var validDice = diceArray.filter(dice => (dice.value === 1 || dice.value === 5) && dice.scored === 0)
		if(validDice.length === 0) return false;	
		
	return true;			
}

	

//Creates dice roll animation for dice that have not been "scored"
function rollingDiceAnimation(){

	for(var i = 0; i < 6; i++){	

		if(diceArray[i].scored === 0) {	
		document.getElementById(diceArray[i].id).animate([	
			// keyframes
			{ transform: 'rotate(0deg)' }, 
			{ transform: 'rotate(359deg)' }
		  ], {
			// timing options
			duration: 850,
			iterations: 1
		  });	 
	}
}}


//Toggles dice being selected or unselected - only dice that haven't been "scored" can be selected
function diceClick(img){

	var i = img.getAttribute("data-number");

	if(diceArray[i].scored === 0) {
		if(diceArray[i].clicked === 0){
			img.classList.toggle("transparent");
			diceArray[i].clicked = 1;
		}
		else {
			img.classList.toggle("transparent");
			diceArray[i].clicked = 0;
		}
	}
}


//Bank Score button - Calculates "total score" and resets round score. endTurn() calls initializeDice()
function bankClick(){

	var totalScore = 0;
	var total = document.getElementById('total');
	totalScore = totalScore + parseInt(total.textContent);
	
	scoreCheck();

	var score = document.getElementById('score');
	totalScore = totalScore + parseInt(score.textContent);

	total.textContent = totalScore;

	endTurn();
}


//Updates and re-initializes dice
function endTurn(){	
	
	var roundScore = document.getElementsByClassName('score');
	if(roundScore.length === 1) roundScore[0].textContent = 0;

	for(var i=0; i < 6; i++){
		var diceEl = document.getElementById(diceArray[i].id);
		diceEl.classList.remove("transparent");
		diceArray[i].clicked = 0;
		diceArray[i].scored = 1;
	}
	initializeDice();
	updateDiceImg();
}


// POPUP MODALS

//Instructions button - opens instructions modal
function instructionsClick(){

	var modal = document.getElementById("instructions_modal");
	var span = document.getElementsByClassName("close")[0];
	
	modal.style.display = "block";
		// When the user clicks on (x), close the modal
		span.onclick = function() {
		modal.style.display = "none";
		}

		//Click anywhere outside modal, it closes
		window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}
}



//Displays "Farkle message modal" with button to start new round
function farkle(){

	var score = document.getElementById('score');
	var displayFarkle = document.getElementById('farkle_modal');
	var nextRoundBtn = document.getElementById('next_round_btn');

	score.textContent = 0;
	displayFarkle.style.display = "block";
	nextRoundBtn.onclick = function() {
		displayFarkle.style.display = "none";
		endTurn();
	}
}
