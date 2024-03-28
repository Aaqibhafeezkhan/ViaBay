function getNotifications(module, title, description, content, attatchmentInfo) {
    var notificationList = localStorage.getItem('notifications')
    if (!!notificationList === false) notificationList = []
    notificationList = JSON.parse(notificationList)

    notificationList.forEach(function(name, i) {
        var notification = localStorage.getItem(`NOTIFICATIONS://${name}`)
        addNotification(notificationList[name])
        notificationList.shift()
        localStorage.removeItem(`NOTIFICATIONS://${name}`)
    })

    notificationList = JSON.stringify(notificationList)
    localStorage.setItem('notifications', notificationList)
}

function addNotification() {

}

/*
    var nGroup = document.querySelector('.notifications')
    notifications.forEach(function(n, i) {
      var nIcon = n.icon
      var nTitle = n.title
      var nContent = n.content

      var nEle = document.createElement('item')

      var nEleIcon = document.createElement('img')
      nEleIcon.classList.add('icon')
      nEleIcon.src = `/icons/${nIcon}.svg`
      nEle.appendChild(nEleIcon)
      
      var nEleContent = document.createElement('item-content')
      nEleContent.textContent = nTitle
      nEle.appendChild(nEleContent)
      
      nGroup.appendChild(nEle)

      nEle.onclick = function(e) {
        if (!!nContent) {
          parent.showModal(nTitle, nContent)
        }
      }
    })
*/