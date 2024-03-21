var data = {
  document: {
    title: document.title, 
  }, 
  queryString: window.location.search, 
  params: {
    page: data.urlParms.get('page') || 'tracker',
  }
}
data.urlParams = new URLSearchParams(data.queryString)

// localStorage.setItem('data', JSON.stringify(data))

var appEle = document.getElementById('app')
appEle.src = `${appEle.src}?page=${data.params.page}`