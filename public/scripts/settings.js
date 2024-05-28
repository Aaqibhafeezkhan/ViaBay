var settingEles = document.querySelectorAll('setting-option')
var selectEles = document.querySelectorAll('setting-option select')

addEventListener('DOMContentLoaded', function() {
    if (location.pathname.startsWith('/settings')) {
        settingEles.forEach(function(s, i) {
            s.querySelector('select').onchange = function(e) {
                setSetting(s.getAttribute('module-name'), e.target.value)
            }
        })    
    }
})

var setTheme = function(t) {
    document.documentElement.setAttribute('data-theme', t || 'system')
}
var settingsKey = 'settings'

var settingFunctions = {
    theme: function(theme) {
        setTheme(theme)
    }
}
applySettings()

function getSettings() {
    alert('getSettingsCalled')
    var settings = localStorage.getItem(settingsKey) || '[]'
    settings = JSON.parse(settings)
    return settings
}

function applySettings() {
    var settings = getSettings()
    settings.forEach(function(s, i) {
        var sName = s.name
        var sContent = s.content
        settingFunctions[sName](sContent)
    })

    if (location.pathname.startsWith('/settings')) {
        settingEles.forEach(function(s, i) {
            var setting = settings.fiter(setting => setting.name === s.getAttribute('module-name'))[0].content
            s.querySelector('select').value = setting
        })    
    }
}

function setSetting(name, value, type, key) {
    alert('setSettingCalled')
    var settings = getSettings()

    var index = settings.indexOf(settings.fiter(setting => setting.name === s.getAttribute('module-name'))[0])

    if (index < 0) {
        var settingsLength = settings.length
        settings.push({name: name})
        sIndex = settingsLength
    }

    var setting = settings[sIndex]
    var content = setting.content
    if (!!content === false) {
        switch(type) {
            case 'object': 
                content = {}
                break
            case 'list': 
                content = []
                break
            default: 
                content = ''
                break
        }
    }

    switch(type) {
        case 'object': 
            content[key] = value
            break
        case 'list': 
            content.push(value)
            break
        default: 
            content = value
            break
    }

    setting.content = content
    settings[sIndex] = setting
    settings = JSON.stringify(settings)
    localStorage.setItem(settingsKey, settings)
}