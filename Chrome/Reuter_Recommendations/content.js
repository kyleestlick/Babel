
(function(){
	var recsDiv = document.createElement("div");
	recsDiv.setAttribute("id", "recommendation_div");

	var target = document.getElementsByClassName("l-column-sidebar2")[0];
	target.appendChild(recsDiv);

	var header = document.createElement("div");
	header.setAttribute("id", "babel_header");
	header.innerHTML = 'BABEL RECOMMENDATIONS';

	var logo = document.createElement("img")
	logo.setAttribute("id", "babel_logo");
	logo.src = chrome.extension.getURL("logo.png");

	recsDiv.appendChild(logo);
	recsDiv.appendChild(header);



	search_dom = document.getElementsByClassName("FR_field");

	for (i=0; i < search_dom.length; i++) {
		value = search_dom[i].getElementsByTagName("value")[0];
		if (value !== undefined && value.innerHTML.substring(0, 4) == 'WOS:') {
			get_recs(value.innerHTML);
			/*get_recs('WOS:000003907500002.11') <-- USE THIS TO TEST*/ 
		};
	}
})();


function get_recs(paper_id) {
	id = encodeURIComponent(paper_id)
	publisher = 'wos/'
	url = 'http://52.73.252.5/recommendation/' + publisher + id + '?limit=5'
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			if ((JSON.parse(xmlHttp.responseText).results) == undefined) {
				no_recs();
			} else {
				get_metaData(JSON.parse(xmlHttp.responseText).results);	
			}
		}
	}
	xmlHttp.open("GET", url, true);
	xmlHttp.setRequestHeader("Authorization","Basic " + btoa("USERNAME"+":"+"PASSWORD"));
    xmlHttp.send();
};


function get_metaData(recs) {
	for (i=0; i<recs.length; i++) {
		id = encodeURIComponent(recs[i].paper_id)
		url = 'http://52.73.252.5/metadata/'+recs[i].publisher+'/'+id
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() {
			if (xmlHttp.readyState == 4) {
				if (xmlHttp.status == 200) {
					build_rec_div(xmlHttp.responseText);
				} else {
					console.log("error status: " + xmlHttp.status);
				}
			}
		}
		xmlHttp.open("GET", url, false); 
		xmlHttp.setRequestHeader("Authorization","Basic " + btoa("thompson"+":"+"ef16tr"));
    	xmlHttp.send();
	}
};


function build_rec_div(metadata) {
	metadata = JSON.parse(metadata);

	var newDiv = document.createElement("div");
	newDiv.setAttribute("id", "babel_rec_div");

	var publisher = document.createElement("div");
	publisher.setAttribute("id", "babel_rec_item");
	publisher.innerHTML = "<span style='font-weight:bold'>PUBLISHER:</span> " + metadata.publisher;

	var title = document.createElement("div");
	title.setAttribute("id","babel_rec_item");
	title.innerHTML = "<span style='font-weight:bold'>TITLE:</span> " + metadata.title;

	var authors = document.createElement("div");
	authors.setAttribute("id","babel_rec_item");
	var auth_list = JSON.stringify(metadata.authors);
	authors.innerHTML = "<span style='font-weight:bold'>AUTHORS:</span> " + auth_list.substring(2, (auth_list.length - 2));

	var date = document.createElement("div");
	date.setAttribute("id","babel_rec_item");
	date.innerHTML = "<span style='font-weight:bold'>DATE:</span> " + metadata.date.substring(0,10);	

	newDiv.appendChild(publisher);
	newDiv.appendChild(title);
	newDiv.appendChild(authors);
	newDiv.appendChild(date);

	target = document.getElementById("recommendation_div");
	target.appendChild(newDiv);
}

function no_recs() {
	var newDiv = document.createElement("div");
	newDiv.setAttribute("id", "no_recs");

	newDiv.innerHTML = "No Recommendations Found";

	target = document.getElementById("recommendation_div");
	target.appendChild(newDiv);
}










