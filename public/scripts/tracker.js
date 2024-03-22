var BingMapsKey = 'AkMdzF1Q7JCJCXj3415UZvH4JYRCJihZ_W7JEOnpx6eH5Hwtt1qie1LQqIrJ7-jS'
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

var d = new Date();

var mon = d.getMonth()
if (mon < 10) mon = `0${mon}`
var day = d.getDate()
if (day < 10) day = `0${day}`
var yea = d.getFullYear()
if (yea < 1000) {
    if (year < 100) {
        if (year < 10) {
            yea = `000${yea}`
        }
        else {
            yea = `00${yea}`
        }
    }
    else {
        yea = `0${yea}`
    }
}

var date = `${mon}/${day}/${yea}`

var hur = d.getHours()
if (hur < 10) hur = `0${hur}`
var min = d.getMinutes()
if (min < 10) min = `0${min}`
var sec = d.getSeconds()
if (sec < 10) sec = `0${sec}`

var time = `${hur}:${min}:${sec}`

var places = [
    '200 Demi Lane, Redwood City CA', 
    'Milbrae BART', 
    'Fishermans Wharf', 
]
var newPlaces = places.slice(1, -1)

var options = {
    travelMode: 'Transit', 
    timeType: 'Departure', 
    dateTime: `${date} ${time}`, 
    maxSolutions: 3,
    distanceUnit: 'Mile',
}
var wayPointStr = ''
wayPointStr += `wayPoint.1=${places[0]}&`
newPlaces.forEach(function(p, i) {
    wayPointStr += `viaWaypoint.${i+2}=${p}&`
})
wayPointStr += `waypoint.${places.length}=${places.slice(-1)}&`

var xhr = new XMLHttpRequest()
xhr.open('GET', `http://dev.virtualearth.net/REST/v1/Routes/${options.travelMode}?${wayPointStr}${/*&optimize={optimize}*/''}&timeType=${options.timeType}&dateTime=${options.dateTime}&maxSolutions=${options.maxSolutions}&distanceUnit=${options.distanceUnit}&key=${BingMapsKey}`)
xhr.addEventListener('load', function() {
    var res = this.responseText
    if (res.startsWith('{') || res.startsWith('[') && typeof res === 'object') res = JSON.stringify(res)
    alert(res)
    console.log(res)
})
xhr.addEventListener('error', function() {
    alert(`Error: ${this.responseText}`)
    console.error(this.responseText)
})
xhr.send()