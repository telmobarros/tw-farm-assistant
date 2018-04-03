var currentVillage = [];

/**
 *
 * Sends message to content script
 * @param message Message to be sent
 *
 */
function sendMessage(type, data, callback) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {type: type, data: data}, callback);
	});
};

function renderStatus(statusText) {
	document.getElementById('status').textContent = statusText;
}

function restore_options(callback) {
	chrome.storage.sync.get({
		villagesArray: [],
		unitsArray: []
	}, callback);
}

function addVillage(coord1, coord2, dist, units){
	var table=document.getElementById('villagesTable');
	var tableLength = table.rows.length;
	var newRow = table.insertRow(tableLength);
	newRow.align = "center";

	// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
	var cell1 = newRow.insertCell(0);
	var cell2 = newRow.insertCell(1);
	var cell3 = newRow.insertCell(2);

	// Add village coordinates to the first cell
	cell1.innerHTML = "(" + coord1 + "|" + coord2 + ")";
	cell1.className = "villagePadding";

	cell2.innerHTML = dist;

	var  modelsButtons = getUnitsButton(coord1, coord2, units)
	$.each(modelsButtons, function( i, val ) {
		cell3.append(val);
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

function distanceBetweenVillages (coords11, coords12, coords21, coords22){
	var a = coords11 - coords21;
	var b = coords12 - coords22;
	var c = Math.sqrt( a*a + b*b );
	return Math.round( c * 10 ) / 10; // rounds to 1 decimal place
}

document.addEventListener('DOMContentLoaded', function() {
	// add click listener to options button (redirect to options page)
	document.getElementById("options_link").addEventListener("click", function(){chrome.tabs.create({'url': "/options.html"}); });

	//gets current village
	sendMessage('getCurrentVillage', null, function (response){
		currentVillage = response;
		console.log(currentVillage);

		// after receiving currentVillage get stored villages and units models and displays them
		restore_options(function(items) {
			var orderedVillages = items.villagesArray;

			// add distance to the current village parameter
			$.each(orderedVillages, function( i, val ) {
				val['dist'] = distanceBetweenVillages(val[0],val[1], currentVillage.coords1, currentVillage.coords2);
			});

			// sort by distance
			orderedVillages.sort(function(a, b){return a['dist']-b['dist']});

			// add villages to the table and display in popup
			$.each(orderedVillages, function( i, val ) {
				addVillage(val[0],val[1], val['dist'],items.unitsArray);
			});
		});
	});

});


