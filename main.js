const satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGFuaWVsYWxrc25pcyIsImEiOiJMU1Zod0dFIn0.Fwq_Aulbw4iUAZ_9kitpuA', {
	maxZoom: 17
});

const streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGFuaWVsYWxrc25pcyIsImEiOiJMU1Zod0dFIn0.Fwq_Aulbw4iUAZ_9kitpuA', {
	maxZoom: 17
});

const baseMaps = {
	'Streets': streets,
	'Satellite+ Streets': satelliteStreets
};

var mymap = L.map('mapid', {
	layers: [streets]
}).setView([51.505, -0.09], 13)
L.control.layers(baseMaps).addTo(mymap);

var colorCode = {
	tfo: 'red',
	efo: 'green',
	obhecc: 'yellow'
}

var tfoGeoJson = {
	type: 'FeatureCollection',
	features: fences
}

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
		'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	id: 'mapbox.streets'
}).addTo(mymap);

var _tfoGeoJson = L.geoJSON(tfoGeoJson, {
	style: feature => ({color: colorCode[feature.properties.association], weight: 3})
}).bindPopup(function (layer) {
	const properties = layer.feature.properties;
	return `${properties.association}: ${properties.triggerId}`
}).addTo(mymap);

const eqIdToColor = {};

L.geoJSON(ls, {
	style: feature => {
		const color = eqIdToColor[feature.properties.equipmentId] = `#${Math.floor(Math.random()*16777215).toString(16)}`
		return { color, weight: 1, dashArray: '10, 3, 2, 3', opacity: 0.5 }
	}
}).bindPopup(function (layer) {
    return layer.feature.properties.equipmentId;
}).addTo(mymap);


const walGPS = L.geoJSON(pt, {
	pointToLayer: function(feature, latlng) {
		return L.circleMarker(latlng, {radius: 1, color: eqIdToColor[feature.properties.equipmentId]})
	}
}).addTo(mymap);

mymap.on('zoomend', function () {
	currentZoom = mymap.getZoom();
	if (currentZoom > 15) {
        walGPS.setStyle({weight: 10});
	} else if (currentZoom > 10) {
        walGPS.setStyle({weight: 5});
	} else {
        walGPS.setStyle({weight: 1});
    }
});

mymap.fitBounds(_tfoGeoJson.getBounds(), {animate: true, padding: [10, 10]});
