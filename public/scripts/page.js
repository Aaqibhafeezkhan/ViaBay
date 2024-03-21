window.addEventListener('DOMContentLoaded', function(e) {
  var title = document.title
  if (title.includes(' | ')) {
    title = title.split(' | ')
    title.pop()
    title = title.join(' | ')
  }
  parent.document.querySelector('.header').textContent = title
  top.document.title = `${title} | ${JSON.parse(localStorage.getItem('data')).document.title}`

  if (!location.pathname.startsWith('/login')) {
    parent.document.querySelector('.nav').removeAttribute('hidden')
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