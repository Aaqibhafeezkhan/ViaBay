function openSelection(e) {
  while (!e.className.includes('select') ) e = e.parentNode
  document.querySelectorAll('.select').forEach(function(s, i) {
    s.classList.remove('open')
  })
  e.classList.add('open')
  e.setAttribute('onclick', 'closeSelection(this)')
}

function closeSelection(e) {
  while (!e.className.includes('select') ) e = e.parentNode
  e.classList.remove('open')
  e.setAttribute('onclick', 'openSelection(this)')
}

if (!!document.querySelector('.select')) {
  document.querySelectorAll('select-option').forEach(function(o, i) {
    o.onclick = function(e) {
      if (!!e.target.getAttribute('disabled') === false) {
        e.target.parentNode.style.setProperty('--num', i)
        var type = e.target.getAttribute('type')
        if (!!type) {
          document.querySelectorAll(`.select[type="fare"]`).forEach(function(s) {
            s.setAttribute('hidden', '')
          })
          var selector = document.querySelector(`.select[type="fare"][for="${type}"]`)
          selector.removeAttribute('hidden')
        }
      }
    }
  })
  document.querySelectorAll('select-options').forEach(function(e, i) {
    e.style.setProperty('--amt', e.querySelectorAll('select-option').length)
  })
}