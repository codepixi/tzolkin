	var mois_courant = {"debut":1,"fin":31,"semaine":2};
		
	function genererMois(mois)
	{
		html = "";	
		for(jour = mois["debut"]; jour <= mois["fin"]; jour++)
		{
			conge = ((jour+mois.semaine-1)%7==6 || (jour+mois.semaine-1)%7==0);
			html += '<li class="jour '+((conge)?'conge':'travail')+'" id="'+jour+'"' +'><span>' + jour + '</span></li>';
		}
		return '<div id="calendrier-et-taches" onmousemove="deplacer(event)" onmouseup="deposer(event)"><ul id="mois">' + html + '</ul></div>';
	}
	
	document.getElementsByTagName("body")[0].innerHTML =  genererMois(mois_courant) + '<div id="message"></div>';
	

	///////////////////////////////////////////////////////////////////
	
	var couleur;
	var largeurJour = "200";
	var largeurInterstice = "2";
	var decalageVertical = 100;
	
	function calculerDecalage(tache)
	{
		debut = tache["debut"].split("-");
		fin = tache["fin"].split("-");
		jourDebut = parseInt(debut[2]);
		jourFin = parseInt(fin[2]);
		duree = jourFin - jourDebut + 1;
		tache.decalage = {};
		decalageVertical += 15;
		tache.decalage.vertical = decalageVertical;
		tache.decalage.horizontal = (jourDebut-1)*largeurJour + (jourDebut-1)*largeurInterstice;
		tache.width = duree*largeurJour + (duree-1)*largeurInterstice - 5;
		return tache;
	}
	
	var dernierDecalage = 0;
	function genererListeTaches(listeTaches, focal) 
	{
		focal--; // 0 is focus now
		html = '';
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
			
			if(0 == focal && tache["debut"])
			{
				tache = calculerDecalage(tache);
				derniereTache = tache;
				// TODO: serait mieux avec des noeuds
				html += '<div class="tache" onmouseover="briller(this)" onmousedown="attraper(event)" onmouseup="deposer(event)" style="width:'+tache.width+'px;background-color:'+couleur+';left:'+tache.decalage.horizontal+'px;top:'+tache.decalage.vertical+'px;">' + titre + '</div>';
			}
			//htmlTaches = '';
			//if(tache["taches"]) htmlTaches = genererListeTaches(tache["taches"], focal);
			
			if(1 == focal)
			{
				//html += '<div class="grande-tache" style="background-color:white;opacity:0.7;left:'+derniereTache.decalage.horizontal+'px;">';			
			}
			if(tache["taches"]) html += genererListeTaches(tache["taches"], focal);
			
			if(1 == focal)
			{
				//html += '</div>';	
			}

		}
		//alert(html);
		return html;			
	}


	
	var priorite = 100;
	function briller(objet)
	{
		objet.style.zIndex = priorite++;
	}
	
	var objetEnMouvement = null;
	
	function attraper(e)
	{
		objetEnMouvement = e.target;
	}
	
	function deplacer(e)
	{
		x = e.clientX;
		y = e.clientY;
		if(objetEnMouvement)
		{
			objetEnMouvement.style.left = x+'px';
			objetEnMouvement.style.top = y+'px';
			//document.querySelector("#message").innerHTML += objetEnMouvement.style.left+'('+x+','+y+')';
		}
	}
	
	function deposer(e)
	{
		objetEnMouvement = null;		
	}
	
	function chargerData(callback) {   
		var requete = new XMLHttpRequest();
		requete.overrideMimeType("application/json");
		requete.open('GET', 'data/data.json', true); 
		requete.onreadystatechange = function () {
			  if (requete.readyState == 4 && requete.status == "200") {
				callback(requete.responseText);
			  }
		};
		requete.send(null);  
	}
	
	var themes;
	function traiterData(data)
	{
		//alert(data);
		themes =  JSON.parse(data);
		for(cleTheme in themes)
		{
			theme = themes[cleTheme];
			calendrierEtTaches = document.getElementById("calendrier-et-taches");
			calendrierEtTaches.innerHTML += genererListeTaches(theme, 1);
		}
	}
	chargerData(traiterData);
