$( function() {
	soundAction();
	helpMDP();
	helpFish();
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
	var MorphinePilulesValue = 3;
	var StressLevel = $('.StressLevel > span');
	var StressLevelValue = 0;
	var nbEssais;
	var timer;
	var time = 15;

	/*******************************************************
							  ***************************
			  							Initialisation
								***************************
	*******************************************************/

	//Cacher les infos d'Eliot
	$('#EliotInfos').hide();
	$('.ModifyInfos > span').hide();

	$('.MorphinePilules').click(function(e){
		if(MorphinePilulesValue > 0){
			loose10S();
		} else {
			e.preventDefault();
			MorphinePilules = 0;
		}
	});


	//Tableaux qui associe le nom d'une action avec
	//une méthode
	var actionsName = {
		"start" : startGame,
		"findMDP" : findMDP,
		"enigmeSortableEasy": enigmeSortableEasy,
		"enigmeSortableHard": enigmeSortableHard,
		"puzzleDA": puzzleDA,
		"puzzleAppartDarlene" :puzzleAppartDarlene,
		"findFish": findFish,
		"GameOver":endGame,
	}

	//Tableau
	var impactsName = {
		"loose10S" : loose10S,
		"add10S" : add10S,
		"add20S" : add20S,
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

			//L'attribut desc permet d'associer l'affichage du bon texte
			// par rapport au bouton précédemment clické, spécialement dans le cas
			// d'une div pouvant apparaître par différents chemins
			var desc = $(this).attr('desc');
			if(desc != undefined){
				$('div.'+desc).show().siblings('div').hide();
			}

			//Grace à l'attribut desc, on va pouvoir associer l'affichage
			// de la bonne div par rapport au bouton clicker
			var nextSection = $(this).attr('go');
			gotoSection(nextSection);
			changeBackground(nextSection);

			if(nextSection == "intro"){
				window.location.href = window.location.href;
			}

			if(nextSection == "FinalSave"){
				$('div').not('#FinalSave,.filter').hide();
				clearInterval(timer);
			}


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

			//Delimitation du niveau de stress maximal pour mener à bien le jeu
			if(StressLevelValue > 90){
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


	/*Initialiser les valeurs par défault du niveau de stress et de pilules.
	et les infos en début de jeu pour comprendre les règles*/
	function startGame() {
		// if(MorphinePilules == 0){
		// 	$('#lostPillule').hide();
		// }
		$('#ReveilBrutal').children().not('.infos_begin').hide();
		$('.infos_begin > button').click(function(e){
			e.preventDefault();
			$(this).parent().hide();
			$('#ReveilBrutal').children().not('.infos_begin').fadeIn();
		});
		$('#EliotInfos').show();
		$(StressLevel).html(StressLevelValue);
		$(MorphinePilules).html(MorphinePilulesValue);
	}


	/*Fonction lorsque le jouer a perdu d'une mort liée à de mauvais choix.*/
	function endGame(){
			$('div').not('.filter').hide();
			$('button').show();
			$('#GameOver').fadeIn(500);
			$('body').css('background','url("img/elliotMad.png") center no-repeat / cover');
	}


	//Cette fonction baisse de 10 le niveau de stress et l'affiche,
	// et diminue de 1 le nombre de pilules
	function loose10S(){
		$('.ModifyInfos > span:first-of-type').fadeIn().fadeOut(1000);
		StressLevelValue -= 10;
		$(StressLevel).html(StressLevelValue);
		MorphinePilulesValue -= 1;
		$(MorphinePilules).html(MorphinePilulesValue);
	}


	//Cette fonction augmente de 10 le niveau de stress et l'affiche
	function add10S(){
		$('.ModifyInfos > span:nth-of-type(2)').fadeIn().fadeOut(1000);
		StressLevelValue += 10;
		$(StressLevel).html(StressLevelValue);
	}


	//Cette fonction augmente de 20 le niveau de stress et l'affiche
	function add20S(){
		$('.ModifyInfos > span:nth-of-type(3)').fadeIn().fadeOut(1000);
		StressLevelValue += 20;
		$(StressLevel).html(StressLevelValue);
	}

	//Cette fonction se lance lorsque le joueur décide d'utiliser l'aide pour trouver
	// le mot de passe, elle affiche une liste de propositions pendant 7s, le MDP est
	// l'une d'entre elles. Si le joueur n'a plus de pilules, il lui est impossible
	// d'utiliser l'aide car elle coûte à chaque fois 1 pillule
	function helpMDP(e){
		$('.helpMDP').click(function(e){
			$('.listMDP').fadeOut();
			if(MorphinePilulesValue >= 1){
				MorphinePilulesValue -= 1;
				$(MorphinePilules).html(MorphinePilulesValue);
				$('.listMDP').fadeIn(500);
				setTimeout(function(){
					$('.listMDP').fadeOut(500)
				},7000);
			} else {
				$('.NoHelp').fadeIn(500);
			}

		});
	}

	// Fonction similaire à l'aide pour la recherche du mot de passe. Il s'agit ici
	// de l'aide pour trouver le nom du poisson
	function helpFish(e){
		$('.helpFish').click(function(e){
			$('.listFish').fadeOut();
			if(MorphinePilulesValue >= 1){
				MorphinePilulesValue -= 1;
				$(MorphinePilules).html(MorphinePilulesValue);
				$('.listFish').fadeIn(500);
				setTimeout(function(){
					$('.listFish').fadeOut(500)
				},7000);
			} else {
				$('.NoHelp').fadeIn(500);
			}

		});
	}



	//Cette fonction va permettre de tester les valeurs rentrées par le joueur,
	//Elle va également limiter le nombre d'essai à 3. Si dans ces 3 essais le MDP est
	//trouvé, alors les boutons d'actions s'affichent, sinon le joueur perd
	function findMDP(e){
		nbEssais = 3;
		$('#ChercherMDP > button').hide();
		$('#sendMDP').click(function(e){
			var MDPProposition = $('#findMDPInput').val();
			nbEssais -= 1;
			e.preventDefault();
			//Vérifier si il reste encore des essais au joueur
			if(nbEssais > 0){
				//Si mdp = leavemehere
				if(MDPProposition == "leavemehere" || MDPProposition == "LeaveMeHere"
				|| MDPProposition == "leave_me_here" || MDPProposition == "leave-me-here"
				|| MDPProposition == "leave me here" || MDPProposition == "LEAVEMEHERE"
				|| MDPProposition == "leavemeHere" || MDPProposition == "Leavemehere"){
					MorphinePilulesValue += 2;
					$(MorphinePilules).html(MorphinePilulesValue);
					$('#ChercherMDP > form').fadeOut();
					$('button').fadeIn();
				}else{
					alert('il vous reste ' + nbEssais + ' chance(s)');
				}
		 	}else{
				endGame();
				// $('#GameOver').fadeIn();
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
					MorphinePilulesValue += 1;
					$(MorphinePilules).html(MorphinePilulesValue);
					$('button').show();
					$(this).fadeOut();
				}
			}
		});
	}


	//Cette fonction correspond au jeu final qui sauve Darlene. Ici c'est la version facile.
	//Utilisant le plugin sortable de jquery UI, le but est de remettre de l'ordre dans les
	//différentes propositions pour débloquer le bouton qui sauve Darlene
	function enigmeSortableHard(){

		//La fonction enigmeSortableHard utilise un compteur pour résoudre l'enigme.
		//Si la solution est trouvée dans le temps imparti, alors le joueur accède au niveau suivante
		//Sinon il perd la partie
		$('#ContournerEnigme > button').hide();
		timer = setInterval(function(){
			time--;
			if(time > 0){
				$('.decompteHardValue').html(time);
				$('.SDCEnigme > ul').sortable( {
					update: function(event,ui){
						var Order = $(this).sortable('toArray').toString();
						if(Order == "1,2,3,4,5"){
							$('.SDCEnigme > p').hide();
							clearInterval(timer);
							time++;
							$(this).fadeOut();
							MorphinePilulesValue += 1;
							$(MorphinePilules).html(MorphinePilulesValue);
							$('button').show();
						}
					}
				});
			} else {
				clearInterval(timer);
				endGame();
			}
		},1000);

	}

	//Cette fonction va permettre de tester les valeurs rentrées par le joueur,
	//Elle va également limiter le nombre d'essai à 3. Si dans ces 3 essais le nom du
	//poisson est trouvé, alors les boutons d'actions s'affichent, sinon le joueur perd
	function findFish(){
		time = 1000;
		nbEssais = 3;
		$('#ContournerEnigmeSuite > button').hide();
		$('#sendNameFish').click(function(e){
			var FishProposition = $('#findFishInput').val();
			nbEssais -= 1;
			e.preventDefault();
			//Vérifier si il reste encore des essais au joueur
				//Si mdp = qwerty
				if(nbEssais > 0){
					if(FishProposition == "qwerty" || FishProposition == "QWERTY"
					|| FishProposition == "Qwerty" || FishProposition == "QwErTy"){
						$('#ContournerEnigmeSuite > form').fadeOut();
						$('button').fadeIn();
					} else {
						alert('il vous reste ' + nbEssais + ' chance(s)');
					}
				} else{
					endGame();
				}
		});
	}


	//La fonction puzzleDA correspond à l'enigme Puzzle pour lire le message de
	//la Dark Army. Le but est de recomposer le puzzle pour pouvoir voir le contenu du message
	function puzzleDA(){
		$('#MessageDA > button, #MessageDA > h2').hide();
		setTimeout(function(){
			$('.skipPuzzleMessageAndLoose').fadeIn();
		}, 5000);
		setTimeout(function(){
			$('.skipPuzzleMessageAndWin').fadeIn();
		}, 10000);
		//Les paramètres du puzzleDA
		var mySettingsPuzzle1 = {
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
						 $('.imgPuzzleMessageDA').fadeOut();
						 $('#MessageDA > button, #MessageDA > h2').fadeIn(500);
					 },    // callback a user-defined function [function]
					 callbackTimeout: 300    // time in ms after which the callback is called
		 },
		};
    $('.imgPuzzleMessageDA').jqPuzzle(mySettingsPuzzle1);
	}


	//La fonction puzzleDA correspond à l'enigme Puzzle pour lire le message de
	//la Dark Army. Le but est de recomposer le puzzle pour pouvoir voir le contenu du message
	function puzzleAppartDarlene(){
		$('#RepondreMessagePortableDarlene > button, #RepondreMessagePortableDarlene > h2').hide();
		setTimeout(function(){
			$('.skipPuzzleMessageAndLoose').fadeIn();
		}, 5000);
		setTimeout(function(){
			$('.skipPuzzleMessageAndWin').fadeIn();
		}, 10000);
		//Les paramètres du puzzleDA
		var mySettingsPuzzle2 = {
				rows:4,
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
						 $('.imgPuzzleMessageDA').fadeOut();
						 $('#RepondreMessagePortableDarlene > button, #RepondreMessagePortableDarlene > h2').fadeIn(500);
					 },    // callback a user-defined function [function]
					 callbackTimeout: 300    // time in ms after which the callback is called
		 },
		};
    $('.imgPuzzlePortableDarlene').jqPuzzle(mySettingsPuzzle2);
	}


	//Cette fonction change l'image de fond en fonction des choix de l'utilisateur
	function changeBackground(key){
		if(key == "start"){ $('body').css('background','url("img/eliotcharacter.jpg") center no-repeat /cover') }
		if(key == "ReveilBrutal"){ $('body').css('background','url("img/eliotbed.jpg") center no-repeat / cover'); }
		if(key == "MDPOubli" && $('.RBTelephone').is(":visible")){ $('body').css('background','url("img/phone.jpg") center no-repeat / cover'); }
		if(key == "MDPOubli" && $('.RBMorphine').is(":visible")){ $('body').css('background','url("img/drug.jpg") center no-repeat / cover'); }
		if(key == "ChercherMDP"){ $('body').css('background','url("img/forgetmdp.jpg") center no-repeat / cover'); }
		if(key == "DarkArmyInfiltration"){ $('body').css('background','url("img/serverhacked.png") center no-repeat / cover'); }
		if(key == "ReveilEtrange"){ $('body').css('background','url("img/sleep.jpg") center no-repeat / cover'); }
		if(key == "ReveilEtrange" && $('.MDPOMorphine').is(":visible")){ $('body').css('background','url("img/drug.jpg") center no-repeat / cover'); }
		if(key == "4x4Surveillance"){ $('body').css('background','url("img/4x4Surveillance.jpg") center no-repeat / cover'); }
		if(key == "FSociety"){ $('body').css('background','url("img/FsocietyHangar.png") center no-repeat / cover'); }
		if(key == "PapierAdresse"){ $('body').css('background','url("img/QrMessage.png") center no-repeat / cover'); }
		if(key == "ConnexionPCFSociety"){ $('body').css('background','url("img/hackedfsociety.jpg") center no-repeat / cover');}
		if(key == "AppartDarlene"){ $('body').css('background','url("img/appartementDarlene.jpg") center no-repeat / cover');}
		if(key == "SaveDarlene"){ $('body').css('background','url("img/walktohangar.jpg") center no-repeat / cover');}
		if(key == "SuivreEnigme"){ $('body').css('background','url("img/epreuveFinaleEasy.jpg") center no-repeat / cover');}
		if(key == "ContournerEnigme"){ $('body').css('background','url("img/epreuveFinaleHard.jpg") center no-repeat / cover');}
		if(key == "FinalSave"){ $('body').css('background','url("img/SaveDarlene.jpg") center no-repeat / cover');}
		if(key == "GameOver" ){ $('body').css('background','url("img/elliotMad.png") center no-repeat / cover');}
	}

	// Cette fonction active le son et le charge, ou l'enlève.
	function soundAction(){

		var audioElement = document.createElement('audio');
		audioElement.setAttribute('src', 'song/soundtrack.mp3');
		audioElement.setAttribute('src', 'song/soundtrack.ogg');
		audioElement.setAttribute('src', 'song/soundtrack.wav');
		audioElement.play();

		audioElement.volume = 0;

		$("#soundAction").click(function(){
			if ($(this).attr('data-click-state') == 1) {
				$(this).attr('data-click-state', 0)
				$(this).attr('src','img/sound-mute.svg');
				audioElement.volume = 0;
			} else {
				$(this).attr('data-click-state', 1)
				$(this).attr('src', 'img/sound-active.svg');
				audioElement.volume = 0.2;
			}
		});

	}

});
