var Microsoft = null
var BingMapsKey = 'AkMdzF1Q7JCJCXj3415UZvH4JYRCJihZ_W7JEOnpx6eH5Hwtt1qie1LQqIrJ7-jS'
var watchID = null
var map = null

var agencies = {}
var allPins = []

var colors = ['Red', 'Blue', 'Orange', 'Brown', 'Pink', 'Yellow', 'Green', 'Purple', 'Maroon', 'Turquoise', 'Cyan', 'Navy', 'Tomato', 'Teal', 'Lime', 'Cyan', 'Salmon', 'Olive', 'Aqua', 'Violet', 'Chocolate', 'Azure', 'Bronze']

function onMapLoad() {
    makeRequest('gtfsoperators', [], function(res) {
        res.forEach(function(agency, i) {
            var cI = i
            if (cI >= colors.length) cI = cI - colors.length
            // console.log(agency)
            makeRequest('VehicleMonitoring', [`agency=${agency.Id}`], function(vehicleData) {
                var vehicleData = vehicleData.Siri.ServiceDelivery.VehicleMonitoringDelivery.VehicleActivity
                if (!vehicleData || typeof vehicleData !== 'object') vehicleData = []
    
                var aObj = {
                    id: agency.Id, 
                    name: agency.name, 
                    vehicles: {
                        data: vehicleData, 
                        pins: {}, 
                    }
                }
    
                vehicleData.forEach(function(vehicle) {
                    var vehicleActivity = vehicle.MonitoredVehicleJourney
                    var vehicleRef = vehicleActivity.VehicleRef
                    var vehicleLocation = vehicleActivity.VehicleLocation
                    vehicleLocation = {
                        longitude: vehicleLocation.Longitude, 
                        latitude: vehicleLocation.Latitude, 
                        // altitude: 0, 
                        // altitudeReference: -1,
                    }
    
                    var color = colors[cI]
                    var route = vehicleActivity.LineRef
                    if (!route) route = '•'

                    var width = 30
                    if (route.length > 3) {
                        var exces = route.length-3
                        for (let i3 = 0; i3 < exces; i3++) {
                            width += 5
                        }
                    }
            
                    // Add the pushpin to the map
                    var pin = new Microsoft.Maps.Pushpin(vehicleLocation, {
                        text: route,
                        color: color, 
                        // icon: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20"><rect x="0" y="0" width="100%" height="100%" fill="${color}" /><text x="50%" y="50%" dy="2" textLength="${width-5}" lengthAdjust="spacing" font-family="sans-serif" dominant-baseline="middle" text-anchor="middle">${route}</text></svg>`,
                    });
                    map.entities.push(pin);
                    aObj.vehicles.pins[vehicleRef] = (pin)
                })
    
                agencies[agency.Id] = aObj
            })
        })
    })

    monitorVehiclePositions()
}

function monitorVehiclePositions() {
    positionInterval = setInterval(function() {
        makeRequest('gtfsoperators', [], function(res) {
            var cI = i
            if (cI >= colors.length) cI = cI - colors.length
            res.forEach(function(agency, i) {
                makeRequest('VehicleMonitoring', [`agency=${agency.Id}`], function(vehicleData) {
                    var vehicleData = vehicleData.Siri.ServiceDelivery.VehicleMonitoringDelivery.VehicleActivity
                    if (!vehicleData || typeof vehicleData !== 'object') vehicleData = []
        
                    var aObj = agencies[agency.Id]
                    if (!aObj) {
                        aObj = {
                            id: agency.Id, 
                            name: agency.name, 
                            vehicles: {
                                data: vehicleData, 
                                pins: {}, 
                            }
                        }
                    }
                    else {
                        aObj.vehicles.data = vehicleData
                    }
    
                    var goodPins = []
    
                    vehicleData.forEach(function(vehicle) {
                        var vehicleRef = vehicle.MonitoredVehicleJourney.VehicleRef
                        if (aObj.vehicles.pins[vehicleRef]) {
                            goodPins.push({
                                name: vehicleRef, 
                                content: aObj.vehicles.pins[vehicleRef]
                            })
                        }
                    })
                    aObj.vehicles.pins = {}
                    goodPins.forEach(function(pin) {
                        aObj.vehicles.pins[pin.name] = pin.content
                    })
    
                    vehicleData.forEach(function(vehicle) {
                        var vehicleActivity = vehicle.MonitoredVehicleJourney
                        var vehicleRef = vehicleActivity.VehicleRef
                        var vehicleLocation = vehicleActivity.VehicleLocation
                        vehicleLocation = {
                            longitude: vehicleLocation.Longitude, 
                            latitude: vehicleLocation.Latitude, 
                            // altitude: 0, 
                            // altitudeReference: -1,
                        }
        
                        var color = colors[cI]
                        var route = vehicleActivity.LineRef
                        if (!route) route = '•'
    
                        var width = 30
                        if (route.length > 3) {
                            var exces = route.length-3
                            for (let i3 = 0; i3 < exces; i3++) {
                                width += 5
                            }
                        }
                
                        // Add the pushpin to the map
                        var pin = aObj.vehicles.pins[vehicleRef]
                        if (pin) {
                            myPushpin.setLocation(vehicleLocation);
                        }
                        else {
                            pin = new Microsoft.Maps.Pushpin(vehicleLocation, {
                                text: route,
                                color: color, 
                                // icon: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20"><rect x="0" y="0" width="100%" height="100%" fill="${color}" /><text x="50%" y="50%" dy="2" textLength="${width-5}" lengthAdjust="spacing" font-family="sans-serif" dominant-baseline="middle" text-anchor="middle">${route}</text></svg>`,
                            });
                            map.entities.push(pin);
                        }
                        aObj.vehicles.pins[vehicleRef] = pin
                    })
        
                    agencies[agency.Id] = aObj
                })
            })
        })
    }, 30000)
}

function assertError(err, name) {
    err = `${name} Error: ${err}`
    alert(err)
    console.error(err)
}

GetMap()
function GetMap() {
    if (document.getElementById('myMap') && Microsoft) {
        map = new Microsoft.Maps.Map('#myMap');
        if (onMapLoad) onMapLoad()
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