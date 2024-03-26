var BingMapsKey = 'AkMdzF1Q7JCJCXj3415UZvH4JYRCJihZ_W7JEOnpx6eH5Hwtt1qie1LQqIrJ7-jS'
var watchID = null
var map = null

function assertError(err, name) {
    err = `${name} Error: ${err}`
    alert(err)
    console.error(err)
}

window.addEventListener('DOMContentLoaded', GetMap)
function GetMap() {
    map = new Microsoft.Maps.Map('#myMap');
}

if ("geolocation" in navigator) {
    /* geolocation is available */
    window.addEventListener('DOMContentLoaded', function(e) {
        watchID = navigator.geolocation.watchPosition((position) => {
            var errorMargin = 10;
            var obj = {
                latitude: position.coords.latitude - errorMargin, 
                longitude: position.coords.longitude - errorMargin, 
                altitude: position.coords.altitude, 
                altitudeReference: position.coords.altitudeReference
            }
            setMapPosition('user', obj);
        }, function(err) {
            assertError(err, 'Current Location')
        }, { enableHighAccuracy: true });
    })
}

function setMapPosition(entity, position) {
    var icon = ''
    switch(entity) {
        case 'user': 
            icon += `<svg class="map-icon user" version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 864 864" width="64" height="64">
    <g class="outer-group" fill="#4a86e8" style="filter: url(#shadow)">
        <circle class="outer" cx="432" cy="432" r="340"/>
    </g>
    <g fill="#ffffff">
        <circle cx="432" cy="432" r="332"/>
    </g>
    <g fill="#4a86e8">
        <circle cx="432" cy="432" r="300"/>
    </g>
    <g fill="#4a86e8">
        <circle cx="432" cy="432" r="296"/>
    </g>
    <filter id='shadow' color-interpolation-filters="sRGB">
        <feDropShadow dx="0" dy="0" stdDeviation="40" flood-opacity="1" flood-color="#bcd2f7"/>
    </filter>
</svg>`
    }
    console.log(position)
    var pSize = 17
    var pin = new Microsoft.Maps.Pushpin(position, {
        icon: icon,
        anchor: new Microsoft.Maps.Point(pSize, pSize)
    });

    //Add the pushpin to the map
    map.entities.push(pin);
}

var d = new Date();

var mon = d.getMonth()
var day = d.getDate()
var yea = d.getFullYear()
var date = `${mon}/${day}/${yea}`

var time = 'AM'
var hur = d.getHours()
if (hur > 12) {
    hur -= 12
    time = 'PM'
}
var min = d.getMinutes()
var sec = d.getSeconds()
var time = `${hur}:${min}:${sec}${time}`

var places = [
    // '220 Demi Lane, Redwood City CA', 
    'Milbrae BART', 
    'Fishermans Wharf', 
]
places.forEach(function(p, i) {
    places[i] = encodeURIComponent(p)
})
var newPlaces = places.slice(1, -1)

var options = [
    'travelMode', 
    'timeType', 
    'dateTime', 
    'maxSolutions',
    'distanceUnit',
]

var optionData = {
    travelMode: 'Transit', 
    timeType: 'Departure', 
    dateTime: `${date}${''/* ${time}*/}`, 
    maxSolutions: 3,
    distanceUnit: 'Mile',
}
options.forEach(function(o, i) {
    optionData[o] = encodeURIComponent(optionData[o])
})
var wayPointStr = ''
wayPointStr += `wayPoint.1=${places[0]}&`
newPlaces.forEach(function(p, i) {
    wayPointStr += `viaWaypoint.${i+2}=${p}&`
})
wayPointStr += `waypoint.${places.length}=${places.slice(-1)}`

var url = `https://dev.virtualearth.net/REST/v1/Routes/${optionData.travelMode}?${wayPointStr}${/*&optimize={optimize}*/''}&timeType=${optionData.timeType}&dateTime=${optionData.dateTime}${/*&maxSolutions=${optionData.maxSolutions}*/''}&distanceUnit=${optionData.distanceUnit}&key=${BingMapsKey}`

var routes = []

var xhr = new XMLHttpRequest()
xhr.open('GET', url)
xhr.addEventListener('load', function() {
    var res = this.responseText
    if ((res.startsWith('{') || res.startsWith('[')) && typeof res === 'string') res = JSON.parse(res)
    if (!!res.errorDetails) {
        assertError(res.errorDetails, 'Transit Route')
        return
    }
    if (!!res.resourceSets) {
        res = res.resourceSets
        res.forEach(function(s, i) {
            if (!!s.resources) {
                s = s.resources
                s.forEach(function(r, i2) {
                    routes.push(r)
                    addRouteItems(routes);
                })
            }
        })
    }
    else {
        alert(res)
        console.log(res)
    }
})
xhr.send()

function addRouteItems(rS) {

}