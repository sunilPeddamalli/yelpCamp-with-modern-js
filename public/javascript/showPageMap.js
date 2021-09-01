
mapboxgl.accessToken = mapBoxToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());


const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
    `<h4>${campground.title}</h4><p>${campground.location}</p>`
    );

new mapboxgl.Marker({ color: 'red',classname:"apple-popup"})
    .setLngLat(campground.geometry.coordinates)
    .setPopup(popup)
    .addTo(map)

