var data = {
  document: {
    title: document.title, 
  }, 
  queryString: window.location.search, 
  urlParms: new URLSearchParams(data.queryString),
  params: {
    page: data.urlParms.get('page') || 'tracker',
  }
}

localStorage.setItem('data', JSON.stringify(data))

var appEle = document.getElementById('app')
appEle.src = `${appEle.src}?page=${data.params.page}`