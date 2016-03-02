	var mois_dernier = {"debut":29,"fin":30};
	var mois_courant = {"debut":1,"fin":31};
	var mois_suivant = {"debut":1,"fin":2};
		
	function genererMois(mois, actif)
	{
		html = "";	
		for(jour = mois["debut"]; jour <= mois["fin"]; jour++)
		{
			html += '<li'+ ((actif)?' id="'+jour+'"':'') +'><span>' + jour + '</span></li>';
		}
		return '<ul>' + html + '</ul>';
	}
	html = '';
	html += '<li id="mois-dernier">'+ genererMois(mois_dernier, false) + '</li>';
	html += '<li id="mois-courant">'+ genererMois(mois_courant, true) + '</li>';
	html += '<li id="mois-suivant">'+ genererMois(mois_suivant, false) + '</li>';
	document.getElementsByTagName("body")[0].innerHTML = '<div id="calendrier-et-taches"><ol id="calendrier">'+html+'</ol></div>';

	
	var couleur;
	function afficherListeTaches(listeTaches)
	{
		for(titre in listeTaches)
		{
			tache = listeTaches[titre];
			debut = tache["debut"].split("-");
			couleur = tache["couleur"]?tache["couleur"]:couleur;
			
			jour = parseInt(debut[2]) + (mois_dernier.fin - mois_dernier.debut + 1);
			decalage = {};
			decalage.vertical = ((((jour - 1)/7) >> 0)*7.8 + 1) + 1.5; // 1.5 for date
			decalage.horizontal = ((jour - 1)%7)*10.8 + 2.55;
			
			largeurJour = "9.6";
			largeurInterstice = "1.2";
			width = largeurJour; // 10.4 - 2*.3 - 2*.1
			if(parseInt(debut[2]) == 1) {width = 2*largeurJour + 1*largeurInterstice;}
			
			html = '<p style="width:'+width+'em;background-color:'+couleur+';left:'+decalage.horizontal+'em;top:'+decalage.vertical+'em;">' + titre + '</p>';
			//alert(html);
			calendrierEtTaches = document.getElementById("calendrier-et-taches");
			calendrierEtTaches.innerHTML += html;
			if(tache["taches"]) afficherListeTaches(tache["taches"]);
		}
	}

	for(cleTheme in themes)
	{
		theme = themes[cleTheme];
		afficherListeTaches(theme);
	}

	// Fonctionne seulement si l'objet calendrier est parent position 
	// -> il a position:relative dans la feuille de style
	// dont work because of the float -> use logic instead (& more efficient)
	function calculerPositionDansCalendrier(objet)
	{
		position = {top:0, left:0};
		
		if(objet != null && objet.id != "calendrier")
		{
			positionParent = calculerPositionDansCalendrier(objet.offsetParent);	
			position.top = positionParent.top + objet.style.top;
			position.left = positionParent.left + objet.style.left;
		}
		
		return position;
	}

	//position = calculerPositionDansCalendrier(document.getElementById('8'));
	