mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
	container: "map", // the id of the <div>
	style: "mapbox://styles/mapbox/streets-v12",
	center: coordinates, // [lng, lat]
	zoom: 9,
});

// Add marker
new mapboxgl.Marker({ color: "red" })
	.setLngLat(coordinates)
	.setPopup(
		new mapboxgl.Popup({ offset: 25 }).setHTML(
			"<h6><p>Exact Loaction provided after booking!</p></h6>"
		)
	)
	.addTo(map);
