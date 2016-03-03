		
	function genererMois(mois, actif)
	{
		html = "";	
		for(jour = mois["debut"]; jour <= mois["fin"]; jour++)
		{
			html += '<li'+ ((actif)?' id="'+jour+'"':'') +'><span>' + jour + '</span></li>';
		}
		return '<ul>' + html + '</ul>';
	}
	function genererTrio()
	{
		html = '';
		html += '<li id="mois-dernier">'+ genererMois(mois_dernier, false) + '</li>';
		html += '<li id="mois-courant">'+ genererMois(mois_courant, true) + '</li>';
		html += '<li id="mois-suivant">'+ genererMois(mois_suivant, false) + '</li>';
		return '<div id="calendrier-et-taches"><ol id="calendrier">'+html+'</ol></div>';
	}
	document.getElementsByTagName("body")[0].innerHTML = genererTrio();
	

	///////////////////////////////////////////////////////////////////
	
	var couleur;
	var largeurJour = "9.6";// 10.4 - 2*.3 - 2*.1
	var largeurInterstice = "1.2";
	
	function calculerDecalage(tache)
	{
		debut = tache["debut"].split("-");
		fin = tache["fin"].split("-");
		jourDebut = parseInt(debut[2]);
		jourFin = parseInt(fin[2]);
		duree = jourFin - jourDebut + 1;
		jour = jourDebut + (mois_dernier.fin - mois_dernier.debut + 1);
		tache.decalage = {};
		tache.decalage.vertical = ((((jour - 1)/7) >> 0)*7.8 + 1) + 1.5; // 1.5 for date
		tache.decalage.horizontal = ((jour - 1)%7)*10.8 + 2.55;
		tache.width = duree*largeurJour + (duree-1)*largeurInterstice;
		return tache;
	}
	
	function afficherListeTaches(listeTaches, focal) 
	{
		focal--; // 0 is focus now
		for(titre in listeTaches)
		{
			tache = listeTaches[titre];
			
			if(tache["focus"])
			switch(tache["focus"])
			{
				case "enfants": focal=1; break;
				case "petits-enfants": focal=2; break;
				default:focal = parseInt(tache["debut"]); // for deep tree, focus can be specified as a number
			}
			couleur = tache["couleur"]?tache["couleur"]:couleur;
			if(0 == focal)
			{
				tache = calculerDecalage(tache);
				html = '<p style="width:'+tache.width+'em;background-color:'+couleur+';left:'+tache.decalage.horizontal+'em;top:'+tache.decalage.vertical+'em;">' + titre + '</p>';
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

