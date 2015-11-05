
var data = require("sdk/self").data;
var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");

var pop_up = require("sdk/panel").Panel({
	contentURL: data.url("popup.html"),
	width: 300,
	height: 200
});


var button = require("sdk/ui/button/action").ActionButton({
	id: "pop_up",
	label: "Babel",
	icon: {
		"16": "./logo_icon.png",
		"32": "./logo_icon.png"
	},
	//disable: true,
	onClick: handleClick
});

function handleClick(state) {
	pop_up.show({
		position: button
	});
};

pageMod.PageMod({
	include: "https://scholar.google.com/scholar*",
	contentStyleFile: data.url("ef_icon.css"),
	contentScriptFile: [data.url("spin.js"), data.url("swagger-client.js"), data.url("content.js")],
	contentScriptOptions: {
		pngUrl: data.url("logo_icon.png")
	}
})
