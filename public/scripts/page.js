window.addEventListener('DOMContentLoaded', function(e) {
  window.parent.document.querySelector('.header').textContent = document.title
  window.top.document.title = `${document.title} | ${window.top.data.document.title}`

  if (!location.pathname.startsWith('/login')) {
    window.parent.document.querySelector('.nav').removeAttribute('hidden')
  }
})

document.querySelectorAll('.input-parent, .textarea-parent, .select-parent').forEach(function(e, i) {
  checkIfValue(e)
  e.onkeyup = function(event) {
    checkIfValue(event.target)
  }
})

function checkIfValue(element) {
  if (element.value) event.target.parentNode.setAttribute('open', '')
  else element.parentNode.removeAttribute('open')
}

function goToPage(name) {
  location.href = `/${name}`
}