"use strict";

var M;
var Marqueurs; 

document.addEventListener('init', function(event) 
{
    var page = event.target;

    if (page.id === 'tab1') 
    {                                    
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'massifs.php');
        xhr.onload = function() {
            var massifs = JSON.parse(xhr.response);
			var list = page.querySelector("ion-list");
			
			for (let massif of massifs)
			{
				let item = document.createElement("ion-list-item");
				item.textContent = massif.drapeau + ' ' + massif.nom;
				item.setAttribute("modifier", "chevron");
                item.setAttribute("tappable"); 
				item.dataset.massif = massif.id; 
				item.dataset.nom = massif.nom; 

				item.addEventListener("click", function() { 
					document.querySelector('#myNavigator').pushPage('page2.html',
						{ data: 
							{ 
								massif: this.dataset.massif ,
								nom: this.dataset.nom
							} 
						});
				});

				let span = document.createElement("span");
                span.setAttribute("class", "notification counter");
                span.textContent = massif.stations;
				item.appendChild(span);
				
				list.appendChild(item);
			}
			
		}
        xhr.send();
	}
	else if (page.id === 'page2')
	{
		page.querySelector('ion-toolbar .center').innerHTML = page.data.nom;
		M = page.data.massif;
	}
	else if (page.id === 'tab2')
	{
		let xhr = new XMLHttpRequest();
        xhr.open('GET', 'stations.php?massif=' + M);
        xhr.onload = function() {
            var stations = JSON.parse(xhr.response);
			var list = page.querySelector("ion-list");

			Marqueurs = [];

			for (let station of stations)
            {
				let marker = L.marker([station.lat, station.lng], 
					    {id: station.id, nom: station.nom});
				Marqueurs.push(marker);

                var item = document.createElement("ion-list-item");

                var row = document.createElement("ion-row");

                var col = document.createElement("ion-col");
                col.textContent = station.nom;
                col.dataset.id = station.id; 
                col.dataset.nom = station.nom;  
				row.appendChild(col);

				col = document.createElement("ion-col");
                col.textContent = station.pistes;
                col.setAttribute("width", "50px");
                col.setAttribute("class", "right");
                row.appendChild(col);
                
                col = document.createElement("ion-col");
                col.textContent = station.remontee;
                col.setAttribute("width", "50px");
                col.setAttribute("class", "right");
                row.appendChild(col);
                
                item.appendChild(row)
                list.appendChild(item);
			}
		}
		xhr.send();
	}
	else if (page.id === 'page4')
	{

	}
	else if (page.id === 'tab3')
	{
        let carte = L.map('carte').setView([51.505, -0.09], 13);
	
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
			{
            	minZoom: 2,
            	maxZoom: 18,
            	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,',
            	id: 'openstreetmap'
			}).addTo(carte);
			
			for (let marqueur of Marqueurs)
			{
				marqueur.bindPopup(marqueur.options.nom);
				marqueur.addTo(carte)
			}

			let groupe = new L.featureGroup(Marqueurs);
            carte.fitBounds(groupe.getBounds(), { maxZoom: 14 });
			
	}
});
