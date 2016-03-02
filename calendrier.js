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
	function afficherListeTaches(listeTaches, focal) 
	{
		focal--; // 0 is focus now
		for(titre in listeTaches)
		{
			tache = listeTaches[titre];
			
			if(tache["focus"])
			switch(tache["focus"])
			{
				case "enfants": focal=1; break
				case "petits-enfants": focal=2; break
				default:focal = parseInt(tache["debut"]); // for deep tree, focus can be specified as a number
			}
			couleur = tache["couleur"]?tache["couleur"]:couleur;
			if(0 == focal)
			{
				debut = tache["debut"].split("-");
				fin = tache["fin"].split("-");
				jourDebut = parseInt(debut[2]);
				jourFin = parseInt(fin[2]);
				duree = jourFin - jourDebut + 1;
				jour = jourDebut + (mois_dernier.fin - mois_dernier.debut + 1);
				decalage = {};
				decalage.vertical = ((((jour - 1)/7) >> 0)*7.8 + 1) + 1.5; // 1.5 for date
				decalage.horizontal = ((jour - 1)%7)*10.8 + 2.55;
				
				largeurJour = "9.6";// 10.4 - 2*.3 - 2*.1
				largeurInterstice = "1.2";
				width = duree*largeurJour + (duree-1)*largeurInterstice;
				
				html = '<p style="width:'+width+'em;background-color:'+couleur+';left:'+decalage.horizontal+'em;top:'+decalage.vertical+'em;">' + titre + '</p>';
				//alert(html);
				calendrierEtTaches = document.getElementById("calendrier-et-taches");
				calendrierEtTaches.innerHTML += html;			
			}
			
			if(tache["taches"]) afficherListeTaches(tache["taches"], focal);	
		}
	}

	for(cleTheme in themes)
	{
		theme = themes[cleTheme];
		afficherListeTaches(theme, 1);
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
	