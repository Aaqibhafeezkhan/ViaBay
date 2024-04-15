var agencies = []

makeRequest('gtfsoperators', [], function(res) {
    res.forEach(function(agency, i) {
        makeRequest('VehicleMonitoring', [`agency=${agency.Id}`], function(vehicleData) {
            vehicleData = vehicleData.Siri.ServiceDelivery.VehicleMonitoringDelivery.VehicleActivity

            if (!vehicleData) vehicleData = []
            console.log(vehicleData)

            addVehicles({
                agency: {
                    id: agency.id, 
                    name: agency.name, 
                }, 
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