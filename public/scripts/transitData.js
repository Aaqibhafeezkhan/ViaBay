var agencies = []

makeRequest('gtfsoperators', [], function(res) {
    res.forEach(function(agency, i) {
        makeRequest('VehicleMonitoring', [`agency=${agency.Id}`], function(vehicleData) {
            vehicleData = vehicleData.Siri.ServiceDelivery.VehicleMonitoringDelivery.VehicleActivity

            if (!vehicleData) vehicleData = []
            console.log(vehicleData)

            addVehicles({
                id: agency.id, 
                name: agency.name, 
                vehicles: vehicleData
            })

            agencies[i] = {
                id: agency.Id, 
                name: agency.name, 
                vehicles: vehicleData
            }
        })
    })
})

function addVehicles(data) {
    agencies.vehiclePins = []
    data.vehicles.forEach(function(vehicle, i) {
        var vehicleActivity = vehicle.MonitoredVehicleJourney
        vehicleLocation = vehicleActivity.VehicleLocation

        var color = ''

        console.log(vehicleActivity)

        agencies.vehiclePins[i] = new Microsoft.Maps.Pushpin(vehicleLocation, {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 30"><rect x="0" y="0" width="40" height="30" fill="${color ? color : 'black'}" /><text x="50%" y="50%" dy="2" textLength="35" lengthAdjust="spacing" font-family="sans-serif" dominant-baseline="middle" text-anchor="middle">${vehicleActivity.LineRef}</text></svg>`,
            // title: 'Microsoft',
            // subTitle: 'City Center',
            // text: vehicleActivity.LineRef
        });

        //Add the pushpin to the map
        map.entities.push(agencies.vehiclePins[i]);
    })
}