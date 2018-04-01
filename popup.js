/**
 *
 * Sends message to content script
 * @param message Message to be sent
 *
 */
function sendMessage(message) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {greeting: message}, function(response) {
		});
	});
};

function renderStatus(statusText) {
	document.getElementById('status').textContent = statusText;
}

function restore_options() {
	chrome.storage.sync.get({
		villagesArray: [],
		unitsArray: []
	}, function(items) {
		$.each(items.villagesArray, function( i, val ) {
			addVillage(val[0],val[1],items.unitsArray);
		});
	});
}

function addVillage(coord1, coord2, units){
	var table=document.getElementById('villagesTable');
	var tableLength = table.rows.length;
	var newRow = table.insertRow(tableLength);
	newRow.align = "center";

	// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
	var cell1 = newRow.insertCell(0);
	var cell2 = newRow.insertCell(1);

	// Add some text to the new cells:
	cell1.innerHTML = "(" + coord1 + "|" + coord2 + ")";
	cell1.className = "villagePadding"
	var  modelsButtons = getUnitsButton(coord1, coord2, units)
	$.each(modelsButtons, function( i, val ) {
		cell2.append(val);
	});
}

function getUnitsButton(coord1, coord2, units){
	var charsArray = "ABCDEFGHIJKLMOPQRSTUVWXYZ".split("");
	var buttons = [];
	$.each(units, function( i, val ) {
		var deleteButton = document.createElement("BUTTON");
		deleteButton.innerHTML = charsArray[i];
		deleteButton.className = "btn model-btn";
		deleteButton.addEventListener('click', function(){ addAttackToQueue(coord1, coord2, val) }, false);
		buttons.push(deleteButton);
	});
	return buttons;
}

function addAttackToQueue(coord1, coord2, val){
	var attack = [[coord1,coord2],val];

	chrome.storage.sync.get({
		attacksQueue: []
	}, function(items) {
		var attacksQueue = items.attacksQueue;
		attacksQueue.push(attack);
		chrome.storage.sync.set({
			attacksQueue: attacksQueue
		}, function() {
			console.log("Attack in queue");
		});
	});

}

document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("options_link").addEventListener("click", function(){chrome.tabs.create({'url': "/options.html"}); });
	restore_options();
});


