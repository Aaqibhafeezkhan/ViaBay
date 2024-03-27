var map
var directionsElement = document.querySelector('#directions')

var places = [
    // '220 Demi Lane, Redwood City CA', 
    'Milbrae BART', 
    'Fishermans Wharf', 
]

function additionalFunctions() {
    addDirections()
}


function addDirections() {
    //Load the directions module.
    Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
        //Create an instance of the directions manager.
        var directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
        
        //Calculate a date time that is 1 hour from now.
        var departureTime  = new Date();
        departureTime.setMinutes(departureTime.getHours() + 1);

        //Set Route Mode to transit.
        directionsManager.setRequestOptions({
            routeMode: Microsoft.Maps.Directions.RouteMode.transit,
            time: departureTime,
            timeType: Microsoft.Maps.Directions.TimeTypes.departure,
        });

        //Add waypoints.
        places.forEach(function(p, i) {
            var waypoint = new Microsoft.Maps.Directions.Waypoint({ address: p });
            directionsManager.addWaypoint(waypoint);
        })

        //Set the element in which the itinerary will be rendered.
        directionsManager.setRenderOptions({ itineraryContainer: directionsElement });

        //Calculate directions.
        directionsManager.calculateDirections();
    });
}