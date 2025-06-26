
mapToken.accessToken = mapToken;

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 6 // starting zoom
});


const marker = new mapboxgl.Marker({ color: 'red', rotation: 0 })
    .setLngLat(coordinates)  // Listing.geometry.coordinates
    .addTo(map);