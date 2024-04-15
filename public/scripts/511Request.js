var apiKey = '6e4e4158-72bd-424d-85a3-2678e0a9854e'

function makeRequest(moduleName, params=[], callback) {
    if (params.length > 0) {
        params = `&${params.join('&')}`
    }
    else {
        params = ''
    }

    var url = `https://api.511.org/transit/${moduleName}?api_key=${apiKey}${params}`

    var xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.addEventListener('load', function() {
        var res = this

        var xmlDocument = new DOMParser().parseFromString(res.text, 'text/xml')

        res.document = xmlDocument
        callback(res)
    })
    xhr.send()
}