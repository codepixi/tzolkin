		
	function genererMois(mois)
	{
		html = "";	
		for(jour = mois["debut"]; jour <= mois["fin"]; jour++)
		{
			html += '<li class="jour" id="'+jour+'"' +'><span>' + jour + '</span></li>';
		}
		return '<div id="calendrier-et-taches"><ul id="mois">' + html + '</ul></div>';
	}
	
	document.getElementsByTagName("body")[0].innerHTML = genererMois(mois_courant);
	

	///////////////////////////////////////////////////////////////////
	
	var couleur;
	var largeurJour = "100";
	var largeurInterstice = "2";
	
	function calculerDecalage(tache)
	{
		debut = tache["debut"].split("-");
		fin = tache["fin"].split("-");
		jourDebut = parseInt(debut[2]);
		jourFin = parseInt(fin[2]);
		duree = jourFin - jourDebut + 1;
		tache.decalage = {};
		tache.decalage.vertical = 100;
		tache.decalage.horizontal = (jourDebut-1)*largeurJour + (jourDebut-1)*largeurInterstice;
		tache.width = duree*largeurJour + (duree-1)*largeurInterstice - 5;
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
				html = '<div><p style="width:'+tache.width+'px;background-color:'+couleur+';left:'+tache.decalage.horizontal+'px;top:'+tache.decalage.vertical+'px;">' + titre + '</p></div>';
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

