var stopsArea = document.querySelector('.stops-area')
var stops = stopsArea.querySelector('.stops')
var closeButtons = document.querySelectorAll('.close')

var directionsElement = document.querySelector('#directions')

var places = [
    // '220 Demi Lane, Redwood City CA', 
    'Milbrae BART', 
    'Fishermans Wharf', 
]

window.addEventListener('DOMContentLoaded', function(e) {
    // setTimeout(function() {
        addDirections()
    // }, 1000)
})
function addDirections() {
    // Load the directions module.
    Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
        // Create an instance of the directions manager.
        var directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
        
        // // Calculate a date time that is 1 hour from now.
        var date = new Date();
        // date.setMinutes(date.getHours() + 1);

        // Set Route Mode to transit.
        directionsManager.setRequestOptions({
            routeMode: Microsoft.Maps.Directions.RouteMode.transit,
            time: date,
            timeType: Microsoft.Maps.Directions.TimeTypes.departure,
        });

        // Add waypoints.
        places.forEach(function(p, i) {
            var waypoint = new Microsoft.Maps.Directions.Waypoint({ address: p });
            directionsManager.addWaypoint(waypoint);
        })

        // Set the element in which the itinerary will be rendered.
        directionsManager.setRenderOptions({ itineraryContainer: directionsElement });

        // Calculate directions.
        directionsManager.calculateDirections();
    });
}

document.querySelector('.add-stop').addEventListener('click', function(e) {
    var stopsAmt = stops.querySelectorAll('.stop').length

    var stopContainer = document.createElement('div')
    stopContainer.classList.add('stop-container')

    var stopParent = document.createElement('div')
    stopParent.classList.add('stop-parent')

    var stop = document.createElement('input')
    stop.classList.add('stop')
    stop.placeholder = `Stop #${stopsAmt+1}`
    stop.title = `Stop #${stopsAmt+1}`
    stop.onchange = function(e) {
        stopChange(e, stopsAmt-1)
    }
    stopParent.appendChild(stop)

    var closeButton = document.createElement('button')
    closeButton.classList.add('close')
    closeButton.onclick = function(e) {
        onCloseClick(e, stopsAmt-1)
    }

    var closeIcon = document.createElement('img')
    closeIcon.src = '/icons/close.svg'
    closeIcon.alt = 'X Icon'
    closeButton.appendChild(closeIcon)

    stopParent.appendChild(closeButton)
    stopContainer.appendChild(stopParent)

    var options = document.createElement('div')
    options.classList.add('options')
    stopContainer.appendChild(options)
    
    stops.appendChild(stopContainer)
})

closeButtons.forEach(function(b, i) {
    b.onclick = function(e) {
        onCloseClick(e, i)
    }
})

function onCloseClick(e, i) {
    stops.querySelectorAll('.stop-container')[i].remove();
    reorderStops()
}

function reorderStops() {
    stops.querySelectorAll('.stop').forEach(function(s, i) {
        s.placeholder = `Stop #${i+1}`
    })
}

stops.querySelectorAll('.stop').forEach(function(s, i) {
    s.onchange = function(e) {
        stopChange(e, i)
    }
})

function stopChange(e, i) {
    var finalValue = e.target.getAttribute('final-value')
    var searchText = e.target.value

    var optionsEle = stops.querySelectorAll('.options')[i]
    
    optionsEle.querySelectorAll('.option').forEach(function(o) {
        o.remove()
    })

    if (finalValue !== searchText) {
        Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
            var searchManager = new Microsoft.Maps.Search.SearchManager(map);
            var requestOptions = {
                bounds: map.getBounds(),
                where: searchText,
                callback: function (answer, userData) {
                    // map.setView({ bounds: answer.results[0].bestView });
                    // map.entities.push(new Microsoft.Maps.Pushpin(answer.results[0].location));
                    var adds = []
                    answer.results.forEach(function(r, i) {
                        adds.push(r.address.formattedAddress)
                    })
    
                    adds.forEach(function(a) {
                        var aEle = document.createElement('div')
                        aEle.classList.add('option')
                        aEle.textContent = a
                        aEle.onclick = function(e) {
                            selectOption(e, i)
                        }
                        optionsEle.appendChild(aEle)
                    })

                    var aEle = document.createElement('div')
                    aEle.classList.add('option')
                    aEle.textContent = searchText
                    aEle.onclick = function(e) {
                        selectOption(e, i)
                    }
                    optionsEle.appendChild(aEle)
                }
            };
            searchManager.geocode(requestOptions);
        });
    }
}

function selectOption(e, i) {
    var place = e.target.textContent
    var optionsEle = stops.querySelectorAll('.options')[i]

    optionsEle.querySelectorAll('.option').forEach(function(o) {
        o.remove()
    })

    var stop = stops.querySelectorAll('.stop')[i]
    stop.value = place
    stop.setAttribute('final-value', place)
}