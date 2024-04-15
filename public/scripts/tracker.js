var BingMapsKey = 'AkMdzF1Q7JCJCXj3415UZvH4JYRCJihZ_W7JEOnpx6eH5Hwtt1qie1LQqIrJ7-jS'
var watchID = null
var map = null

function assertError(err, name) {
    err = `${name} Error: ${err}`
    alert(err)
    console.error(err)
}

GetMap()
function GetMap() {
    if (document.getElementById('myMap')) {
        map = new Microsoft.Maps.Map('#myMap');
    }
    else {
        window.addEventListener('DOMContentLoaded', GetMap)
    }
}


// if ("geolocation" in navigator) {
//     /* geolocation is available */
//     window.addEventListener('DOMContentLoaded', function(e) {
//         watchID = navigator.geolocation.watchPosition((position) => {
//             var errorMargin = 0;
//             var obj = {
//                 latitude: position.coords.latitude + errorMargin, 
//                 longitude: position.coords.longitude + errorMargin, 
//             }
//             setMapPosition('user', obj);
//         }, function(err) {
//             assertError(err, 'Current Location')
//         }, { enableHighAccuracy: true });
//     })
// }

// function setMapPosition(entity, position) {
//     var icon = ''
//     switch(entity) {
//         case 'user': 
//             icon += `<svg class="map-icon user" version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 864 864" width="64" height="64">
//     <g class="outer-group" fill="#4a86e8" style="filter: url(#shadow)">
//         <circle class="outer" cx="432" cy="432" r="340" />
//     </g>
//     <g fill="#ffffff">
//         <circle cx="432" cy="432" r="332" />
//     </g>
//     <g fill="#4a86e8">
//         <circle cx="432" cy="432" r="300" />
//     </g>
//     <g fill="#4a86e8">
//         <circle cx="432" cy="432" r="296" />
//     </g>
//     <filter id='shadow' color-interpolation-filters="sRGB">
//         <feDropShadow dx="0" dy="0" stdDeviation="40" flood-opacity="1" flood-color="#bcd2f7" />
//     </filter>
// </svg>`
//     }
//     console.log(position)
//     var pSize = 17
//     var pin = new Microsoft.Maps.Pushpin(position, {
//         icon: icon,
//         anchor: new Microsoft.Maps.Point(pSize, pSize)
//     });

//     //Add the pushpin to the map
//     map.entities.push(pin);
// }