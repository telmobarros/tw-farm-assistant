$( document ).ready(function() {
	// get village coords
	var coords = $("#content_value table tbody tr table:first-child tbody tr:nth-child(3) td:last-child").text();

	// inject button
	$("#content_value table tbody tr table:last-child tbody").append('<tr>' +
		'<td colspan="2">' +
		'<a id="addVillageButton" href=#><span class="action-icon-container">' +
		'<span class="icon header favorite_add"></span></span> Add village to farm assistant' +
		'</a>' +
		'</td>' +
		'</tr>');

	// add listener
	$( "#addVillageButton" ).click(function() {
		alert('Not implemented coords' + coords.substr(0,3) + '   ' + coords.substr(4,3));
		chrome.storage.sync.get({
			villagesArray: []
		}, function(items) {
			items.villagesArray.push([coords.substr(0,3), coords.substr(4,3)]);
			chrome.storage.sync.set({
				villagesArray: items.villagesArray
			}, function() {
				alert('done');
			});
		});
	});
});