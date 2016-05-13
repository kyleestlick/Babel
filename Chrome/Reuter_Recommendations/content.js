var config = {endpoint : "tr.eigenfactor.org"};
var RECTYPE_LOOKUP = {
	ef_expert: "Expert Recommendations",
	ef_classic: "Classic Recommendations"
};

(function(){
  chrome.storage.local.get("auth", function(conf) {
		config.auth = conf.auth;
		search();
  });

	var recsDiv = document.createElement("div");
	recsDiv.setAttribute("id", "recommendation_div");

	var target = document.getElementsByClassName("l-column-sidebar2")[0];
	target.appendChild(recsDiv);

	var header = document.createElement("div");
	header.setAttribute("id", "babel_header");
	header.innerHTML = 'Eigenfactor Recommends';

	var logo = document.createElement("img");
	logo.setAttribute("id", "babel_logo");
	logo.src = chrome.extension.getURL("logo.png");

	recsDiv.appendChild(logo);
	recsDiv.appendChild(header);
})();

function search() {
	search_dom = document.getElementsByClassName("FR_field");
	for (i=0; i < search_dom.length; i++) {
		value = search_dom[i].getElementsByTagName("value")[0];
		if (value !== undefined && value.innerHTML.substring(0, 4) == 'WOS:') {
			get_recs(value.innerHTML, "ef_expert", config);
			get_recs(value.innerHTML, "ef_classic", config);
			/*get_recs('WOS:000003907500002.11') <-- USE THIS TO TEST*/
		}
	}
}

function get_recs(paper_id, type) {
	id = encodeURIComponent(paper_id);
	publisher = 'wos/';
	url = 'http://' + config.endpoint + '/recommendation/' + publisher + id + '?limit=5&algorithm=' + type;
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			if ((JSON.parse(xmlHttp.responseText).results) === undefined) {
				no_recs(type);
			} else {
				get_metaData(JSON.parse(xmlHttp.responseText).results, type, config);
			}
		}
	};
	xmlHttp.open("GET", url, true);
	xmlHttp.setRequestHeader("Authorization","Basic " + btoa(config.auth.username+":"+config.auth.password));
    xmlHttp.send();
}


function get_metaData(recs, type) {
	var rec_type = document.createElement("div");
	rec_type.setAttribute("id", "babel_rec_type");
	rec_type.innerHTML = RECTYPE_LOOKUP[type];

	target = document.getElementById("recommendation_div");
	target.appendChild(rec_type);

	for (i=0; i<recs.length; i++) {
		id = encodeURIComponent(recs[i].paper_id);
		url = 'http://'+config.endpoint+'/metadata/'+recs[i].publisher+'/'+id;
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() {
			if (xmlHttp.readyState == 4) {
				if (xmlHttp.status == 200) {
					build_rec_div(xmlHttp.responseText);
				} else {
					console.log("error status: " + xmlHttp.status);
				}
			}
		};
		xmlHttp.open("GET", url, false);
		xmlHttp.setRequestHeader("Authorization","Basic " + btoa(config.auth.username+":"+config.auth.password));
    	xmlHttp.send();
	}
}


function build_rec_div(metadata) {

	metadata = JSON.parse(metadata);

	var newDiv = document.createElement("div");
	newDiv.setAttribute("id", "babel_rec_div");

	var title = document.createElement("div");
	title.setAttribute("id","babel_rec_item");
	title.innerHTML = "<span style='font-weight:bold'>TITLE:</span> " + metadata.title;

	var authors = document.createElement("div");
	authors.setAttribute("id","babel_rec_item");
	var auth_list = JSON.stringify(metadata.authors);
	authors.innerHTML = "<span style='font-weight:bold'>AUTHOR:</span> " + auth_list.substring(2, (auth_list.length - 2));

	var date = document.createElement("div");
	date.setAttribute("id","babel_rec_item");
	date.innerHTML = "<span style='font-weight:bold'>DATE:</span> " + metadata.date.substring(0,4);

	newDiv.appendChild(title);
	newDiv.appendChild(authors);
	newDiv.appendChild(date);

	target = document.getElementById("recommendation_div");
	target.appendChild(newDiv);
}

function no_recs(type) {
	var rec_type = document.createElement("div");
	rec_type.setAttribute("id", "babel_rec_type");
	rec_type.innerHTML = RECTYPE_LOOKUP[type];


	var newDiv = document.createElement("div");
	newDiv.setAttribute("id", "no_recs");
	newDiv.innerHTML = "No Recommendations Found";

	target = document.getElementById("recommendation_div");
	target.appendChild(rec_type);
	target.appendChild(newDiv);
}
