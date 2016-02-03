function fakeDiv() {
	var recsDiv = document.createElement("div");
	recsDiv.setAttribute("id", "recommendation_div");

	var target = document.getElementById("figshare-related-container");
	target.insertBefore(recsDiv, target.childNodes[0]);


	getRecs("recommendation_div", "pubmed", "20403314");

}




function getRecs(divID, passedPublisher, id) {
	var recsDiv = document.getElementById(divID);

	var header = document.createElement("div");
	header.setAttribute("id", "babel_header");
	header.innerHTML = 'BABEL RECOMMENDATIONS';

	var logo = document.createElement("img")
	logo.setAttribute("id", "babel_logo");
	logo.src = chrome.extension.getURL("logo.png");

	recsDiv.appendChild(logo);
	recsDiv.appendChild(header);

	var swagger = new SwaggerClient({
		url: "https://babel-us-east-1.eigenfactor.org/swagger.json" ,
		usePromise: true
	}).then(function(swagger) {
		swaggerPromise = swagger;
		console.log(swaggerPromise);
		console.log("getRecs worked");
		return swaggerPromise.default.application_get_recommendation({publisher:passedPublisher,paper_id:id,limit:10});
	}).then(function(recs) {
		successDiv(divID, recs.obj.results);
	}).catch(function(error) {
		failureDiv(divID, error);
		console.log("getRecs didnt work");
	});
}





function successDiv(divID, recs) {
	var swagger = new SwaggerClient({
		url: "https://babel-us-east-1.eigenfactor.org/swagger.json",
		usePromise: true,
		scheme: "http"
	}).then(function(swagger) {
		swaggerPromise = swagger
		return swaggerPromise.default.application_bulk_get_metadata({body:recs});
	}).then(function(recs) {
		console.log(recs.obj);
		for (i = 0; i < recs.obj.length; i++) {

			console.log(JSON.stringify(recs.obj[i].authors));
			console.log(JSON.stringify(recs.obj[i].label));

			var newDiv = document.createElement("div");
			newDiv.setAttribute("id", "babel_rec_div");
			
			var count = document.createElement("div");
			count.setAttribute("id", "babel_rec_count");
			count.innerHTML = (i + 1).toString();

			var publisher = document.createElement("div");
			publisher.setAttribute("id", "babel_rec_publisher");
			publisher.innerHTML = recs.obj[i].publisher;		

			var title = document.createElement("div");
			title.setAttribute("id","babel_rec_title");
			title.innerHTML = recs.obj[i].title;

			var authors = document.createElement("div");
			authors.setAttribute("id","babel_rec_authors");
			authors.innerHTML = JSON.stringify(recs.obj[i].authors);

			var date = document.createElement("div");
			date.setAttribute("id","babel_rec_date");
			date.innerHTML = recs.obj[i].date;

			var label = document.createElement("div");
			label.setAttribute("id","babel_rec_label");
			label.innerHTML = recs.obj[i].label;		

			newDiv.appendChild(count);
			newDiv.appendChild(publisher);
			newDiv.appendChild(title);
			newDiv.appendChild(authors);
			newDiv.appendChild(date);
			newDiv.appendChild(label);
			target = document.getElementById(divID);
			target.appendChild(newDiv);

		}

	}).catch(function(error) {
		console.log(error);
		failureDiv(divID, error);
	});
}





function failureDiv(divID, error) {
	console.log(error);
}

fakeDiv();




