var map = null

window.addEventListener('DOMContentLoaded', GetMap)
function GetMap() {
    map = new Microsoft.Maps.Map('#myMap');
}

if ("geolocation" in navigator) {
    /* geolocation is available */
    const watchID = navigator.geolocation.watchPosition((position) => {
        setMapPosition('user', {lat: position.coords.latitude, lon: position.coords.longitude});
    }, { enableHighAccuracy: true });
}

function setMapPosition(entity, position) {
    switch(entity) {
        case 'user': 

    }
}