$( document ).ready(function() {

	// get village coords
	var coords = $("#content_value table tbody tr table:first-child tbody tr:nth-child(3) td:last-child").text();
	coords = [parseInt(coords.substr(0, 3)), parseInt(coords.substr(4, 3))]; //parse to array
	// get village coords
	var isAbandoned = $("#content_value table tbody tr table:first-child tbody tr:nth-child(5) td:last-child").is(":empty");

	villageIsAlreadyStored(coords, function(villageIsAlreadyStored) {
		if (!villageIsAlreadyStored) {

			// inject button
			$("#content_value table tbody tr table:last-child tbody").append('<tr>' +
				'<td colspan="2" id="injectedTd">' +
				'<a id="addVillageButton" href=#><span class="action-icon-container">' +
				'<span class="icon header favorite_add"></span></span> Add to farm assistant' +
				'</a>' +
				'<input type="text" id="nameInput" placeholder="Name">' +
				'</td>' +
				'</tr>');

			$("#nameInput").val($("#content_value table tbody tr table:first-child tbody tr:nth-child(5) td:last-child").text());

			// add listener
			$("#addVillageButton").click(function () {
				var newVillage = {
					isAbandoned: isAbandoned,
					name: $("#nameInput").val(),
					coords: coords
				};

				saveVillage(newVillage, function () {
					$('#injectedTd').remove()
				});
			});
		}
	});
});