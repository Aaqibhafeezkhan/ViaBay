var authentication = localStorage.getItem('auth')

authentication = authentication ? JSON.parse(authentication) : {}

var username = authentication.username ? authentication.username : ''
var password = authentication.password ? atob(authentication.password) : ''

var isAuthenticated = checkAuthentication(username, password)

var pathname = location.pathname
if (!isAuthenticated && !pathname.startsWith('/login')) location.href = '/login'
else if (isAuthenticated && pathname === '/') location.href = '/tracker'

function checkAuthentication(u, p) {
    var a = false
    if (u && p) a = true
    return a
}

function setCredentials(username, password, dest) {
    authentication = JSON.stringify({
        username: username,
        password: btoa(password),
    })
    localStorage.setItem('auth', authentication)
    location.href = dest
}