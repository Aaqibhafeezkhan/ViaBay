window.addEventListener('DOMContentLoaded', function(e) {
  var title = document.title
  if (title.includes(' | ')) {
    title = title.split(' | ')
    title.pop()
    title = title.join(' | ')
  }
  document.querySelector('.header > .title').textContent = title

  if (!location.pathname.startsWith('/login')) {
    document.querySelectorAll('.nav').forEach(function(n, i) {
      n.removeAttribute('hidden')
    })
  }

  document.querySelectorAll('.input-parent, .textarea-parent, .select-parent').forEach(function(e, i) {
    var classes = e.className
    if (classes.includes(' ')) classes = classes.split(' ')
    else classes = [classes]
  
    var element = ''
    classes.forEach(function(c, i) {
      if (c.endsWith('-parent')) element = c.slice(0, -7)
    })
  
    checkIfValue(e.querySelector(element))
    e.onkeyup = function(event) {
      checkIfValue(event.target)
    }
  })
  
})

function checkIfValue(element) {
  if (element.value) event.target.parentNode.setAttribute('open', '')
  else element.parentNode.removeAttribute('open')
}

function goToPage(name) {
  location.href = `/${name}`
}

function assertError(err, name) {
  var aErr = `${name} Error: ${err}`
  var cErr = `Error with ${name}: ${err}`
  alert(aErr)
  console.error(cErr)
}