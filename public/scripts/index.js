var queryString = window.location.search
var urlParams = new URLSearchParams(queryString)
var page = urlParams.get('page')

var data = {
  queryString: queryString, 
  urlParams: urlParams,
  params: {
    page: page || 'tracker',
  }
}

// alert(JSON.stringify(data))
localStorage.setItem('data', JSON.stringify(data))

var appEle = document.getElementById('app')
appEle.src = `${appEle.src}?page=${data.params.page}`