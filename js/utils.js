/**
 * Retrieves a boolean indicating if the village is already stored
 * @param coords Coordinates of the village to check
 * @returns {boolean} True or false, whether the village is already stored or not
 */
function villageIsAlreadyStored(coords, callback){ // TODO mudar para callback function
	chrome.storage.sync.get({
		villagesArray: []
	}, function(items) {
		var villageIsAlreadyStored = false;
		for (var i = 0; i < items.villagesArray.length; i++) {
			if (items.villagesArray[i].coords[0] == coords[0] && items.villagesArray[i].coords[1] == coords[1]) {
				villageIsAlreadyStored = true;
				break;
			}
		}
		return callback(villageIsAlreadyStored);
	});
}


/**
 * Gets distance between two villages given their coordinates
 * @param coords1 Coordinates of the first village
 * @param coords2 Coordinates of the second village
 * @returns {number} Distance between the villages rounded to 1 decimal place
 */
function distanceBetweenVillages (coords1, coords2){
	var a = coords1[0] - coords2[0];
	var b = coords1[1] - coords2[1];
	var c = Math.sqrt( a*a + b*b );
	return Math.round( c * 10 ) / 10; // rounds to 1 decimal place
}

/**
 * Adds a new village to the stored array
 * @param village Village to add
 * @param callback Function after store is executed
 */
function saveVillage(village, callback){
	chrome.storage.sync.get({
		villagesArray: []
	}, function(items) {
		items.villagesArray.push(village);
		chrome.storage.sync.set({
			villagesArray: items.villagesArray
		}, callback);
	});
}


function removeVillage(village, callback){
	chrome.storage.sync.get({
		villagesArray: []
	}, function(items) {
		for (var i = 0; i < items.villagesArray.length; i++) {
			if (items.villagesArray[i].coords[0] == village.coords[0] && items.villagesArray[i].coords[1] == village.coords[1]) {
				items.villagesArray.splice(i, 1);
				break;
			}
		}
		chrome.storage.sync.set({
			villagesArray: items.villagesArray
		}, callback);
	});
}