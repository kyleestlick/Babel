//CREATE VARIABLE TO STORE GOOGLE SCHOLAR SEARCH RESULT OBJECTS. PARTICULARLY
//LOOKING TO ACCESS TITLES RETURNED BY GOOGLE SCHOLAR
var SEARCH_RESULT = {};

//CREATE VARIABLE TO STORE COUNTER WHICH IS USED TO TRACK HOW MANY TIMES
//REQUESTS ARE MADE TO THE SERVER BEFORE ALERTING THE USER AN ERROR HAS OCCURED
var TRYS = 0;


//INITIATE A SPINNER TO LET THE USER KNOW THAT EXTENSION IS LOOKING FOR 
//RECOMMENDATIONS. SCRAPE EACH TITLE IN THE GOOGLE SCHOLAR SEARCH RESULTS
//AND PASS THEM ALONG TO THE CHECK TITLE FUNCTION 
(function() {
	//UPDATE OBJECT WITH GOOGLE SCHOLAR SERACH RESULT OBJECTS
	SEARCH_RESULT = document.getElementsByClassName("gs_rt");

	//CREATE SPINNER HTML ELEMENT
	var spinnerDiv = document.createElement("div");
	spinnerDiv.setAttribute("id", "spinner_container");

	//CREATE SPINNER HTML MESSAGE ELEMENT
	var message = document.createElement("p");
	message.setAttribute("id", "spinner_message");
	message.innerHTML = "Babel is looking for related papers...";

	//APPEND SPINNER OBJECT IN APPROPRIATE PLACE ON GOOGLE SCHOLAR PAGE
	var target = document.getElementById("gs_ccl");
	spinnerDiv.appendChild(message);
	target.insertBefore(spinnerDiv, target.childNodes[0]);

	//INITAITE THE SPINNER AND CREATE VARIABLES TO STORE SEARCH RESULT TITLES AND REGEX
	var spinner = new Spinner().spin(spinnerDiv),
		formatted_names = [],
		regex_brackets = /\s*\[.*?\]\s*/ig;
	
	//LOOP THROUGH SERACH RESULTS AND INSURT TITLES INTO ARRAY VARIABLE WHICH IS PASSED 
	//AS AN ARGUMENT TO CHECK_TITLES FUNCTION
	for (i = 0; i < SEARCH_RESULT.length; i++) {
		var name = SEARCH_RESULT[i].textContent;
		formatted_names.push(name.replace(regex_brackets, ""));
	}
	checkTitle(formatted_names);
})();





//FUNCTION FOR BUILDING REQUEST TO GET BABEL RECOMMENDATIONS FOR EACH TITLE 
//PROVIDED IN THE ARRAY ARGUMENT TITLES
function checkTitle(titles) {
	//INTIALIZE SWAGGER WITH PROMISE TO CATCH ERROR	
	var swaggerPromise = new SwaggerClient({
		url: "https://babel-us-east-1.eigenfactor.org/swagger.json",
		scheme: "https",
		usePromise: true
	//FUNCTION TO USE BULK FIND METHOD
	}).then(function(swagger) {
		swaggerPromise = swagger;
		return swaggerPromise.default.application_bulk_find({body:titles}, {responseContentType: 'application/json'});
	//FUNCTION FOR PASSING RESULTS OF BULK FIND REQUEST TO CREATE_ICON FUNCTION
	}).then(function(recs) {
		createIcon(recs.obj);
	//FUNCTION FOR CATCHING ERROR. IF ERROR IN REQUEST TRY TWO MORE TIMES BEFORE 
	//ALERTING THE USER AND ERROR HAS OCCURED 
	
	}).catch(function(error) {
		console.log(error);
		if(TRYS < 2) {
			TRYS += 1;
			console.log('try number ', TRYS);
			checkTitle(titles);
		} else {
			document.getElementById("spinner_container").remove();
			alert('Babel recommendations unavailable\nstatus returned: ' + String(error.status));
		}
	});
}





//FUNCTION FOR CREATING HYPERLINKED ICONS FOR EACH GOOGLE SCHOLAR SEARCH RESULT THAT HAS 
//RECOMMENDATIONS FROM BABEL. ICONS HPYPERLINK TO BABEL PAGE IN NEW TAB
function createIcon(response) {
	//FOR EACH RESPONSE GIVEN BY THE BULK FIND REQUEST SEE IF THE RECS ELEMENT IS TRUE 
	//INDICATING THAT BABEL HAS RECOMMENDATIONS FOR THAT TITLE
	for (i = 0; i < response.length; i++) {
		if(response[i].recs === true) {

			//IF RECOMMENDATIONS ARE FOUND, CREATE THE NECESSARY HTML ELEMENTS TO INSERT
			//BABEL ICON WITH HYPERLINK TO BABEL SITE THAT IS INITIALIZED IN NEW TAB
			var id = response[i].paper_id,
				publisher = response[i].publisher,
				newItem = document.createElement("img"),
				link = document.createElement("a");
			newItem.src = self.options.pngUrl;
			newItem.setAttribute("class", "ef_icon");
			link.href = "http://babel.eigenfactor.org/?rq=" + id + "&rp=" + publisher;
			//OPEN HYPERLINK IN NEW TAB
			link.target = "_blank";
			link.appendChild(newItem);

			//PLACE NEW IMAGE ITEM BEFORE THE APPROPRIATE TTILE IN GOOGLE SCHOLAR SEARCH RESULTS
			SEARCH_RESULT[i].insertBefore(link, SEARCH_RESULT[i].childNodes[0]);
		};

	};
	//REMOVE SPINNER SO UNSER KNOWS THAT THE EXTENSION IS NO LONGER LOOKING FOR RECOMMENDATIONS
	document.getElementById("spinner_container").remove();
}

