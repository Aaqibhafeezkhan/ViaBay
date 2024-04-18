var authentication = localStorage.getItem('auth')

authentication = authentication ? JSON.parse(authentication) : {}

alert(JSON.stringify(authentication))

var username = authentication.username ? authentication.username : ''
var password = authentication.password ? atob(authentication.password) : ''

var isAuthenticated = false
if (username && password) isAuthenticated = true

var pathname = location.pathname
if (!isAuthenticated && !pathname.startsWith('/login')) location.href = '/login'
else if (isAuthenticated && pathname === '/') location.href = '/tracker'

function setCredentials(username, password, dest) {
    authentication = JSON.stringify({
        username: username,
        password: btoa(password),
    })
    localStorage.setItem('auth', authentication)
    location.href = dest
}