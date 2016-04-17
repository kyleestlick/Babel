//ADD LISTENER TO SEE IF THE URL HAS CHANGED, IF SO CALL FUNCTION TO CHECK URL
chrome.tabs.onUpdated.addListener(function(id, info, tab){
	if (info.status === "complete") {
		show_icon(tab);
	}
});

//CHECK URL TO SEE IF ITS FROM GOOGLE SCHOLAR, IF SO ADD ICON TO SEARCH BAR
function show_icon(tab) {
	if (tab.url.toLowerCase().indexOf("https://scholar.google.com/scholar") > -1) {
		chrome.pageAction.show(tab.id);
	}
};

//THIS IS FOR USING PAGE ACTION ICON TO INJECT SCRIPTS ON CLICK
/*
var toggle = false;
chrome.pageAction.onClicked.addListener(function(tab) {
	toggle = !toggle;
	if(toggle){
		chrome.tabs.insertCSS(tab.id, {file: "ef_icon.css"})
		chrome.tabs.executeScript(tab.id, {file: "spin.js"}, function() {
			chrome.tabs.executeScript(tab.id, {file: "swagger-client.js"}, function() {
				chrome.tabs.executeScript(tab.id, {file: "content.js"}, function() {
					//all injected
				});
			});
		});
	}
	else {
		chrome.tabs.executeScript(tab.id, {code: "alert()"})
	}
});
*/