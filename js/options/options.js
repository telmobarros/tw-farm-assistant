var charsArray = "ABCDEFGHIJKLMOPQRSTUVWXYZ".split("");

// Saves options to chrome.storage
function save_units() {
	/*var villagesArray = [];

	$("table#villagesTable tr").not(":first-child,:last-child").each(function() {
		var arrayOfThisRow = [];
		var tableData = $(this).find('td').not(":last-child");
		if (tableData.length > 0) {
			arrayOfThisRow = {
				name: $(tableData[0]).children().text(), // access input of isAbandoned
				isAbandoned: $(tableData[1]).children().is(":checked"), // access input of isAbandoned
				coords:[parseInt($(tableData[2]).text()), parseInt($(tableData[3]).text())]
			};
			//arrayOfThisRow['isAbandoned'] = $(tableData[0]).children().is(":checked"); // access input of isAbandoned
			//arrayOfThisRow['coords'] = [parseInt($(tableData[1]).text()), parseInt($(tableData[2]).text())];
			console.log(arrayOfThisRow);
			villagesArray.push(arrayOfThisRow);
		}
	});
	console.log(villagesArray);*/

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
		/*villagesArray: villagesArray,*/
		unitsArray: unitsArray
	}, showSuccessStatus());
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	chrome.storage.sync.get({
		villagesArray: [],
		unitsArray: []
	}, function(items) {
		console.log(items.villagesArray);
		$.each(items.villagesArray, function( i, val ) { addVillageRow(val); });
		$.each(items.unitsArray, function( i, val ) { addUnitsRow(val); });
	});
}

document.addEventListener('DOMContentLoaded', function(){
		restore_options();
		$("#addVillageButton").click(addVillage);
		$("#addUnitsButton").click(addUnits);

		$("#exportButtonAll").click(exportConfigurationAll);
		$("#exportButtonWorld").click(exportConfigurationWorld);
		$("#importButton").click(importConfiguration);
	}
);

function deleteVillageRow(row){
	var i= row.parentNode.parentNode.rowIndex;
	document.getElementById('villagesTable').deleteRow(i);
}

function addVillage(){
	var newVillage = {
		isAbandoned: $("#isAbandonedInput").is(":checked"),
		name: $("#nameInput").val(),
		coords: [parseInt($("#coord1Input").val()), parseInt($("#coord2Input").val())]
	};

	if (isValidCoords(newVillage.coords)){
		villageIsAlreadyStored(newVillage.coords, function(villageIsAlreadyStored) {
			if (!villageIsAlreadyStored) {
				$('#nameInput').val('');
				$('#isAbandonedInput').prop('checked', true);
				$('#coord1Input').val('');
				$('#coord2Input').val('');
				addVillageRow(newVillage);
				saveVillage(newVillage, showSuccessStatus());
				return true;
			} else {
				alert('The village you are trying to input is already registered');
				return false;
			}
		});
	} else {
		alert('Enter valid coordinates');
		return false;
	}
}

function addVillageRow(village){
	var table=document.getElementById('villagesTable');
	var tableLength = table.rows.length;
	var newRow = table.insertRow(tableLength - 1);
	newRow.align = "center";
	if(village.isAbandoned){
		newRow.className = 'abandonedVillage'; // class to change css if the village is abandoned
	}

	// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
	var cell0 = newRow.insertCell(0);
	var cell1 = newRow.insertCell(1);
	var cell2 = newRow.insertCell(2);
	var cell3 = newRow.insertCell(3);
	var cell4 = newRow.insertCell(4);

	// Add some text to the new cells:
	cell0.innerHTML = village.name;
	cell1.innerHTML = '<input type="checkbox" disabled ' + (village.isAbandoned ? 'checked/>' : '/>');
	cell2.innerHTML = village.coords[0];
	cell3.innerHTML = village.coords[1];
	var deleteButton = document.createElement("img");
	deleteButton.src = "https://dspt.innogamescdn.com/8.69/32045/graphic/delete.png";
	deleteButton.addEventListener('click', function(){
		deleteVillageRow(this);
		removeVillage(village);
	}, false);
	cell4.appendChild(deleteButton);
}

function isValidCoords(coords){
	return ((coords[0] > 0 && coords[0] < 1000) && (coords[1] > 0 && coords[1] < 1000));
}

function deleteUnitsRow(row){
	var i=row.parentNode.parentNode.rowIndex;
	document.getElementById('unitsTable').deleteRow(i);
	save_units();
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
	save_units();
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

function showSuccessStatus(){
	// Update status to let user know options were saved.
	var status = document.getElementById('status');
	status.textContent = 'Configuration saved.';
	setTimeout(function() {
		status.textContent = '';
	}, 1000);
}

function exportConfigurationAll(){
	chrome.storage.sync.get({
		villagesArray: [],
		unitsArray: []
	}, function(items) {

		var newDate = new Date();
		var filename = newDate.getFullYear()+'_'+parseInt(newDate.getMonth()+1)+'_'+newDate.getDate()+'__'+newDate.getHours()+'_'+newDate.getMinutes() + '.tw';

		var a = document.createElement('a');
		a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(JSON.stringify(items)));
		a.setAttribute('download', filename);
		a.click();

	});
}

function exportConfigurationWorld(){
	chrome.storage.sync.get({
		villagesArray: [],
		unitsArray: []
	}, function(items) {

		var newDate = new Date();
		var filename = newDate.getFullYear()+'_'+parseInt(newDate.getMonth()+1)+'_'+newDate.getDate()+'__'+newDate.getHours()+'_'+newDate.getMinutes() + '.tw';

		var a = document.createElement('a');
		a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(JSON.stringify(items)));
		a.setAttribute('download', filename);
		a.click();

	});
}
function importConfiguration(){
	var files = document.getElementById('selectFiles').files;
	console.log(files);
	if (files.length <= 0) {
		alert('Please select a file to import below.');
		return false;
	}

	var fr = new FileReader();

	fr.onload = function(e) {
		console.log(e);
		var result = JSON.parse(e.target.result);
		//var formatted = JSON.stringify(result, null, 2);
		console.log(result);
		chrome.storage.sync.set(result, showSuccessStatus());
		location.reload();
	};

	fr.readAsText(files.item(0));
}