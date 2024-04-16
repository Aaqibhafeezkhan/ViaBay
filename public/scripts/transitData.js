var agencies = []

setTimeout(getData, 1000)

function getData() {
    makeRequest('gtfsoperators', [], function(res) {
        res.forEach(function(agency, i) {
            // console.log(agency)
            makeRequest('VehicleMonitoring', [`agency=${agency.Id}`], function(vehicleData) {
                var vehicleData = vehicleData.Siri.ServiceDelivery.VehicleMonitoringDelivery.VehicleActivity
    
                if (!vehicleData) vehicleData = []
    
                var aObj = {
                    id: agency.Id, 
                    name: agency.name, 
                    vehicles: {
                        data: vehicleData, 
                    }
                }
    
                var pins = addVehicles(aObj)
                aObj.vehicles.pins = pins, 
    
                agencies.push(aObj)
            })
        })
    })
}

function addVehicles(data, i) {
    var pins = []
    data.vehicles.data.forEach(function(vehicle) {
        // console.log(vehicle)
        var vehicleActivity = vehicle.MonitoredVehicleJourney
        var vehicleLocation = vehicleActivity.VehicleLocation

        var color = 'black'
        var route = vehicleActivity.LineRef

        
        pin = new Microsoft.Maps.Pushpin(vehicleLocation, {
            text: route,
            // icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 30"><rect x="0" y="0" width="40" height="30" fill="${color}" /><text x="50%" y="50%" dy="2" textLength="35" lengthAdjust="spacing" font-family="sans-serif" dominant-baseline="middle" text-anchor="middle">${route}</text></svg>`,
            // title: 'Microsoft',
            // subTitle: 'City Center',
            // text: vehicleActivity.LineRef
        });
        
        // Add the pushpin to the map
        console.log(map)
        map.entities.push(pin);
        // console.log(pin)
        pins.push(pin)
    })
    return pins
}