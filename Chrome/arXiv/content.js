var config = {endpoint : "babel-us-east-1.eigenfactor.org"};
var RECTYPE_LOOKUP = {
	ef_expert: "Expert Recommendations",
	ef_classic: "Classic Recommendations"
};

(function(){
  chrome.storage.local.get("auth", function(conf) {
		config.auth = conf.auth;
		search();
  });

  	var parent = document.querySelector("#abs > div.extra-services")

	var recsDiv = document.createElement("div");
	recsDiv.setAttribute("id", "recommendation_div");

	parent.appendChild(recsDiv);

	var header = document.createElement("div");
	header.setAttribute("class", "title2");
	header.innerHTML = '<span style="font-size: 16px;"><a href="http://babel.eigenfactor.org">Babel Recommends</a></span>';

	/*var logo = document.createElement("img");
	logo.setAttribute("id", "babel_logo");
	logo.src = chrome.extension.getURL("logo.png");

	recsDiv.appendChild(logo);
	*/
	recsDiv.appendChild(header);

})();

function search() {
	search_dom = document.URL.split("/")
	doc_id = search_dom.pop()
	area = search_dom.pop()
	if (area == "abs") {
		// A new style arXiv id: 1010.0951
		var arXiv_id = doc_id
	} else {
		// An old style arXiv id: hep-lat/0605012
		var arXiv_id = area + "/" + doc_id
	}
	get_recs(arXiv_id, "ef_expert")
	get_recs(arXiv_id, "ef_classic")
}

function get_recs(paper_id, type) {
	id = encodeURIComponent(paper_id);
	publisher = 'arxiv/';
	url = 'https://' + config.endpoint + '/recommendation/' + publisher + id + '?limit=5&algorithm=' + type;
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
    xmlHttp.send();
}


function get_metaData(recs, type) {
	var rec_type = document.createElement("div");
	rec_type.setAttribute("id", "babel_rec_type");
	rec_type.innerHTML = "<span style=\"padding-left: 12px;\">"+RECTYPE_LOOKUP[type]+"</span>";

	target = document.getElementById("recommendation_div");
	target.appendChild(rec_type);

	for (i=0; i<recs.length; i++) {
		id = encodeURIComponent(recs[i].paper_id);
		url = 'https://'+config.endpoint+'/metadata/'+recs[i].publisher+'/'+id;
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
    	xmlHttp.send();
	}
}

function build_title_link(metadata) {
	url = "https://arxiv.org/abs/" + metadata.paper_id;
	elem = document.createElement("a");
	elem.innerText = metadata.title;
	elem.href = url;
	return elem;
}

function build_rec_div(metadata) {

	metadata = JSON.parse(metadata);

	var newDiv = document.createElement("div");
	newDiv.setAttribute("class", "block-text");

	var entry = document.createElement("p");
	entry.setAttribute("class", "NEWFRside_rec");
	entry.insertAdjacentElement('beforeend', build_title_link(metadata))
	if (metadata.authors) {
		entry.insertAdjacentText('beforeend', " " + metadata.authors[0].trim())
	}

	if (metadata.date){
		entry.insertAdjacentText('beforeend', ". " + metadata.date.substring(0,4))
	}

	newDiv.appendChild(entry);

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
