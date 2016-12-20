$( function() {
	/*******************************************************
							  ***************************
			  					Les variables globales
								***************************
	*******************************************************/

	//Les boutons
	var buttons = $(".section button");
	var currentDiv = buttons.parent();

	//Les infos d'Eliot
	var EliotInfos = $("#EliotInfos");
	var MorphinePilules = $('.MorphinePilules > span');
	var MorphinePilulesValue = 5;
	var StressLevel = $('.StressLevel > span');
	var StressLevelValue = 0;



	/*******************************************************
							  ***************************
			  							Initialisation
								***************************
	*******************************************************/

	//Cacher les infos d'Eliot
	$('#EliotInfos').hide();
	// // $('#ContournerEnigme > button').hide();
	// // $('#MessageDA button').hide();
	// // $('#ChercherMDP > button').hide();

	//Tableaux qui associe le nom d'une action avec
	//une méthode
	var actionsName = {
		"start" : startGame,
		"findMDP" : findMDP,
		"reset": resetGame,
		"enigmeSortableEasy": enigmeSortableEasy,
		"enigmeSortableHard": enigmeSortableEasy,
		"puzzleDA": puzzleDA,
	}

	//Tableau
	var impactsName = {
		"loose10S" : loose10S,
		"add10S" : add10S,
		"add20S" : add20S,
		"add30S" : add30S,
	}


	/*******************************************************
							  ***************************
			  							Fonctions
								***************************
	*******************************************************/

	//Pour chaque click sur l'un des boutons, cacher la div actuelle, puis
	//afficher la div suivante. +
	buttons.click(function() {
		$(this).each(function(){
			$(this).parent().hide();

			//Grace à l'attribut desc, on va pouvoir associer l'affichage
			// de la bonne div par rapport au bouton clicker
			var nextSection = $(this).attr('go');
			gotoSection(nextSection);

			//Si le bouton a un attr impact, alors on
			//affecte associe sa valeur à une fonction associée dans le tableau
			//impactsName
			var hasImpact = $(this).attr('impact');
			if(hasImpact != undefined){
				impactsName[hasImpact]();
			}

			//vérifie si il y a	un attribut action à la div parent.
			//Si oui, alors on va exécuter l'action associée
			var action = $(this).parent('div').attr('action');
			if(action){
				actionsName[action]();
			}

			//L'attribut desc permet d'associer l'affichage du bon texte
			// par rapport au bouton précédemment clické, spécialement dans le cas
			// d'une div pouvant apparaître par différents chemins
			var desc = $(this).attr('desc');
			if(desc != undefined){
				$('div.'+desc).show().siblings('div').hide();
			}

			//Delimitation du niveau de stress maximal pour mener à bien le jeu
			if(StressLevelValue >= 90){
				endGame();
			}
		});
	});

	/*Afficher la div ayant l'identifiant correspondant à l'attribut go du
	bouton, et vérifier si cette div a un attribut action. Si oui, alors
	afficher la fonction associée dans le tableau actionsName*/
	function gotoSection(key) {
			$('div#'+key).fadeIn(1000).each(function(){
				var action = $(this).attr('action');
				if(action){
					actionsName[action]();
				}
			});
	}

	/*Initialiser les valeurs par défault du niveau de stress et de pilules*/
	function startGame() {
		$('#EliotInfos').show();
		$(StressLevel).html(StressLevelValue);
		$(MorphinePilules).html(MorphinePilulesValue);
	}

	function resetGame() {
		$('#EliotInfos').hide();
		StressLevelValue = 0;
		MorphinePilulesValue = 5;
	}

function endGame(){
	$('div').hide();
	var gameOver = $('#GameOver');
	gameOver.children('.normal-death').hide();
	gameOver.fadeIn(500);

}


	function loose10S(){
		StressLevelValue -= 10;
		StressLevel.html(StressLevelValue);
		MorphinePilulesValue -= 1;
		MorphinePilules.html(MorphinePilulesValue);
	}

	function add10S(){
		StressLevelValue += 10;
		StressLevel.html(StressLevelValue);
	}


	function add20S(){
		StressLevelValue += 20;
		StressLevel.html(StressLevelValue);
	}

	function add30S(){
		StressLevelValue += 20;
		StressLevel.html(StressLevelValue);
	}

	//Cette fonction va permettre de tester les valeurs rentrées par le joueur,
	//Elle va également limiter le nombre d'essai à 3. Si dans ces 3 essais le MDP est
	//trouvé, alors les boutons d'actions s'affichent, sinon le joueur perd
	function findMDP(){
		$('#ChercherMDP > button').hide();
		var nbEssais = 3;
		$('#sendMDP').click(function(e){
			var MDPProposition = $('#findMDPInput').val();
			nbEssais -= 1;
			e.preventDefault();
			//Vérifier si il reste encore des essais au joueur
			if(nbEssais > 0){
				//Si mdp = leavemehere
				if(MDPProposition == "leavemehere"){
					alert('mot de passe trovué');
					$('button').fadeIn();
				}else{
					alert('il vous reste ' + nbEssais + ' chance(s)');
				}
				// Si tous les essais ont été passés
		 	}else{
		 		$('div').hide();
				$('#GameOver').fadeIn();
				$('button').show();
			}
		});
	}

	//Cette fonction correspond au jeu final qui sauve Darlene. Ici c'est la version facile.
	//Utilisant le plugin sortable de jquery UI, le but est de remettre de l'ordre dans les
	//différentes propositions pour débloquer le bouton qui sauve Darlene
	function enigmeSortableEasy(){
		$('#SuivreEnigme > button').hide();
		$('.SDSEnigme > ul').sortable( {
			update: function(event,ui){
				var Order = $(this).sortable('toArray').toString();
				if(Order == "1,2,3,4,5,6,7"){
				alert('ok');
					$('button').show();
				}
			}
		});
	}

	//Cette fonction correspond au jeu final qui sauve Darlene. Ici c'est la version facile.
	//Utilisant le plugin sortable de jquery UI, le but est de remettre de l'ordre dans les
	//différentes propositions pour débloquer le bouton qui sauve Darlene
	function enigmeSortableHard(){
		decompteHard();
		$('#ContournerEnigme > button').hide();
		$('.SDCEnigme > ul').sortable( {
			update: function(event,ui){
				var Order = $(this).sortable('toArray').toString();
				if(Order == "1,2,3,4,5"){
					$('button').show();
				}
			}
		});
	}

	function decompteHard(){
		var time = 15;

		timer = setInterval(function(){
			if(time > 0){
				time--;
				$('.decompteHardValue').html(time);
			}
			else {
				clearInterval(timer);
				$('div').hide();
				$('#GameOver').fadeIn();
				$('button').show();
			}
		},1000);
	}

	function puzzleDA(){
		$('#MessageDA > button, #MessageDA > h2').hide();
		// $('#MessageDA > h2')

		// define your own settings
			 var mySettings = {
				   rows:3,
					 cols: 3,
					 hole: 5,
					 shuffle: true,
					 numbers: false,
					 control: {
							 toggleNumbers: false,
							 counter: false,
							 timer: false
					 },
					 animation: {
							 shuffleRounds: 1,
							 slidingSpeed: 100,
							 shuffleSpeed: 200
					 },

					 success: {
							fadeOriginal: false,    // cross-fade original image [true|false]
							callback: function(){
								alert('it works');
								$('#MessageDA > button, #MessageDA > h2').fadeIn();
							},    // callback a user-defined function [function]
							callbackTimeout: 300    // time in ms after which the callback is called
				},
			 };

			 $('.imgPuzzleMessageDA').jqPuzzle(mySettings);
		 }















});
