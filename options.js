var charsArray = "ABCDEFGHIJKLMOPQRSTUVWXYZ".split("");

// Saves options to chrome.storage
function save_options() {
	var villagesArray = [];

	$("table#villagesTable tr").not(":first-child,:last-child").each(function() {
		var arrayOfThisRow = [];
		var tableData = $(this).find('td').not(":last-child");
		if (tableData.length > 0) {
			tableData.each(function() { arrayOfThisRow.push(parseInt($(this).text())); });
			villagesArray.push(arrayOfThisRow);
		}
	});

	var unitsArray = [];

	$("table#unitsTable tr").not(":first-child,:last-child").each(function() {
		var arrayOfThisRow = [];
		var tableData = $(this).find('td').not(":first-child,:last-child");
		console.log(tableData);
		if (tableData.length > 0) {
			tableData.each(function() { arrayOfThisRow.push(parseInt($(this).text())); });
			unitsArray.push(arrayOfThisRow);
		}
	});

	chrome.storage.sync.set({
		villagesArray: villagesArray,
		unitsArray: unitsArray
	}, function() {
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Configuration saved.';
		setTimeout(function() {
			status.textContent = '';
		}, 750);
	});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	chrome.storage.sync.get({
		villagesArray: [],
		unitsArray: []
	}, function(items) {
		$.each(items.villagesArray, function( i, val ) { addVillageRow(val[0],val[1]); });
		$.each(items.unitsArray, function( i, val ) { addUnitsRow(val); });
	});
}

document.addEventListener('DOMContentLoaded', function(){
		restore_options();
		document.getElementById('save').addEventListener('click',save_options);
		$("#addVillageButton").click(addVillage);
		$("#addUnitsButton").click(addUnits);
	}
);

function deleteVillageRow(row){
	var i=row.parentNode.parentNode.rowIndex;
	document.getElementById('villagesTable').deleteRow(i);
	save_options();
}

function addVillage(){
	var coord1Value = parseInt($("#coord1Input").val());
	var coord2Value = parseInt($("#coord2Input").val());

	if (isValidCoord(coord1Value) && isValidCoord(coord2Value)){
		$("#coord1Input").val("");
		$("#coord2Input").val("");
		addVillageRow(coord1Value, coord2Value);
		save_options();
	} else {
		alert("Enter valid coordinates");
		return false;
	}
}

function addVillageRow(coord1, coord2){
	var table=document.getElementById('villagesTable');
	var tableLength = table.rows.length;
	var newRow = table.insertRow(tableLength - 1);
	newRow.align = "center";

	// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
	var cell1 = newRow.insertCell(0);
	var cell2 = newRow.insertCell(1);
	var cell3 = newRow.insertCell(2);

	// Add some text to the new cells:
	cell1.innerHTML = coord1;
	cell2.innerHTML = coord2;
	var deleteButton = document.createElement("img");
	deleteButton.src = "https://dspt.innogamescdn.com/8.69/32045/graphic/delete.png";
	deleteButton.addEventListener('click', function(){deleteVillageRow(this);}, false);
	cell3.appendChild(deleteButton);
}

function isValidCoord(coord){
	return (coord > 0 && coord < 1000);
}

function deleteUnitsRow(row){
	var i=row.parentNode.parentNode.rowIndex;
	document.getElementById('unitsTable').deleteRow(i);
	save_options();
}

function addUnits(){
	var unitsArray = [];
	$(".unitInput").each(function() {
		var unitValue = parseInt($(this).val());
		if(isNaN(unitValue)){
			unitValue = 0;
		}
		unitsArray.push(unitValue);
		$(this).val("");
	});
	console.log(unitsArray);
	addUnitsRow(unitsArray);
	save_options();
}

function addUnitsRow(unitsArray){
	var table=document.getElementById('unitsTable');
	var tableLength = table.rows.length;
	var newRow = table.insertRow(tableLength - 1);
	newRow.align = "center";


	$.each(unitsArray, function( i, val ) {
		var cell = newRow.insertCell(i);
		cell.innerHTML = val;
	});

	var deleteButtonCell = newRow.insertCell(unitsArray.length);
	var deleteButton = document.createElement("img");
	deleteButton.src = "https://dspt.innogamescdn.com/8.69/32045/graphic/delete.png";
	deleteButton.addEventListener('click', function(){deleteUnitsRow(this);}, false);
	deleteButtonCell.appendChild(deleteButton);

	var modelButtonCell = newRow.insertCell(0);
	var modelButton = document.createElement("BUTTON");
	modelButton.innerHTML = charsArray[tableLength - 2];
	modelButton.className = "btn model-btn";
	modelButtonCell.appendChild(modelButton);
}
