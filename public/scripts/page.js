window.addEventListener('DOMContentLoaded', function(e) {
  window.parent.document.querySelector('.header').textContent = document.title
  window.top.document.title = `${document.title} | ${window.top.data.document.title}`

  if (!location.pathname.startsWith('/login')) {
    window.parent.document.querySelector('.nav').removeAttribute('hidden')
  }
})

document.querySelectorAll('.input-parent, .textarea-parent, .select-parent').forEach(function(e, i) {
  e.onkeyup = function(event) {
    if (event.target.value) event.target.parentNode.setAttribute('open', '')
    else event.target.parentNode.removeAttribute('open')
}
})
  
function goToPage(name) {
  location.href = `/${name}`
}