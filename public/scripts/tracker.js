var map, infobox, watchId, Microsoft = null
var BingMapsKey = 'AkMdzF1Q7JCJCXj3415UZvH4JYRCJihZ_W7JEOnpx6eH5Hwtt1qie1LQqIrJ7-jS'

var agencies = {}
var allPins = []

var colors = ['Red', 'Blue', 'Orange', 'Brown', 'Pink', 'Yellow', 'Green', 'Purple', 'Maroon', 'Turquoise', 'Cyan', 'Navy', 'Tomato', 'Teal', 'Lime', 'Cyan', 'Salmon', 'Olive', 'Aqua', 'Violet', 'Chocolate', 'Azure', 'Bronze']

var positionInterval = setInterval(onMapLoad, 30000)
onMapLoad()
function onMapLoad() {
    makeRequest('gtfsoperators', [], function(res) {
        res.forEach(function(agency, i) {
            var cI = i
            if (cI >= colors.length) cI = cI - colors.length
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
                        pin.setLocation(vehicleLocation);
                    }
                    else {
                        pin = new Microsoft.Maps.Pushpin(vehicleLocation, {
                            text: route,
                            color: color, 
                            // icon: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20"><rect x="0" y="0" width="100%" height="100%" fill="${color}" /><text x="50%" y="50%" dy="2" textLength="${width-5}" lengthAdjust="spacing" font-family="sans-serif" dominant-baseline="middle" text-anchor="middle">${route}</text></svg>`,
                        });
                        pin.metadata = vehicleActivity;
                        Microsoft.Maps.Events.addHandler(pin, 'click', showVehicleInfo);
                        map.entities.push(pin);
                    }
                    aObj.vehicles.pins[vehicleRef] = pin
                })
    
                agencies[agency.Id] = aObj
            })
        })
    })
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
        infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
            visible: false
        });

        //Assign the infobox to a map instance.
        infobox.setMap(map);
        if (onMapLoad) onMapLoad()
    }
    else {
        window.addEventListener('DOMContentLoaded', GetMap)
    }
}


function showVehicleInfo(e) {
        //Make sure the infobox has metadata to display.
        if (e.target.metadata) {
            //Set the infobox options with the metadata of the pushpin.
            var isSmallScreen = window.matchMedia('(max-width: 915px)').matches
            if (isSmallScreen) {

            }

            var data = e.target.metadata
            var options = {
                title: `${data.LineRef}: ${data.PublishedLineName}`, 
                description: [
                    `Origin: ${data.OriginName}`,
                    `Destination: ${data.DestinationName}`,
                    `In Congestion: ${data.InCongestion ? true : false}`,
                    `Occupancy: ${data.Occupancy}`,
                ].join(', \n')
            }
            
            infobox.setOptions({
                location: e.target.getLocation(),
                title: options.title,
                description: options.description,
                visible: true
            });
        }
}