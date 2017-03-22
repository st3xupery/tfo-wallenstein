var mymap = L.map('mapid').setView([51.505, -0.09], 13)

var tfoGeoJson = {
	type: 'FeatureCollection',
	features: tfo.map(x => ({
		type: 'Feature',
		geometry: x
	}))
}

var tfoGeoJsonPoints = {
	type: 'FeatureCollection',
	features: tfo.map(x => ({
		type: 'Feature',
		geometry: {
			type: 'Point',
			coordinates: x.coordinates[0][0]
		}
	}))
}

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
		'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	id: 'mapbox.streets'
}).addTo(mymap);

var myIcon = new L.icon({
    iconUrl: 'map-marker.png',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

var _tfoGeoJson = L.geoJSON(tfoGeoJson, {
	style: feature => ({color: 'black'})
}).addTo(mymap);

L.geoJSON(tfoGeoJsonPoints, {
	pointToLayer: function(feature, latlng) {
		return L.marker(latlng, {icon: myIcon})
	}
}).addTo(mymap);

const eqIdToColor = {};

L.geoJSON(ls, {
	style: feature => {
		const color = eqIdToColor[feature.properties.equipmentId] = `#${Math.floor(Math.random()*16777215).toString(16)}`
		return { color, weight: 1, dashArray: '10, 3, 2, 3' }
	}
}).bindPopup(function (layer) {
    return layer.feature.properties.equipmentId;
}).addTo(mymap);

L.geoJSON(pt, {
	pointToLayer: function(feature, latlng) {
		return L.circleMarker(latlng, {radius: 1, color: eqIdToColor[feature.properties.equipmentId]})
	}
}).addTo(mymap);

mymap.fitBounds(_tfoGeoJson.getBounds(), {animate: true, padding: [10, 10]});
