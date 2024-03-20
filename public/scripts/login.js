var queryString = window.location.search
var urlParms = new URLSearchParams(queryString)
var page = urlParms.get('page') || 'tracker'

function login() {
  goToPage(page)
}