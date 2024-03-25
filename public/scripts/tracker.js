var BingMapsKey = 'AkMdzF1Q7JCJCXj3415UZvH4JYRCJihZ_W7JEOnpx6eH5Hwtt1qie1LQqIrJ7-jS'
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
    const watchID = navigator.geolocation.watchPosition((position) => {
        setMapPosition('user', {lat: position.coords.latitude, lon: position.coords.longitude});
    }, function(err) {
        assertError(err, 'Current Location')
    }, { enableHighAccuracy: true });
}

function setMapPosition(entity, position) {
    var icon = `/assets/icons/map/`
    switch(entity) {
        case 'user': 
            icon += 'user.svg'
    }
    var pin = new Microsoft.Maps.Pushpin(center, {
        icon: icon,
        anchor: new Microsoft.Maps.Point(position.lat, position.lon)
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
prompt('', url)

var xhr = new XMLHttpRequest()
xhr.open('GET', url)
xhr.addEventListener('load', function() {
    var res = this.responseText
    if ((res.startsWith('{') || res.startsWith('[')) && typeof res === 'string') res = JSON.parse(res)
    if (!!res.errorDetails) {
        assertError(res.errorDetails, 'Transit Route')
        return
    }
    alert(res)
    console.log(res)
})
xhr.send()