export default {
  createNew (obj) {
    let ServerList = localStorage.getItem('serverList')
    if (ServerList === null) {
      ServerList = []
    } else {
      ServerList = JSON.parse(ServerList)
    }
    ServerList.push({
      serverName: obj.serverName,
      baseUrl: obj.baseUrl,
      url: obj.url
    })
    localStorage.setItem('serverList', JSON.stringify(ServerList))
  },
  getServerList () {
    const ServerList = localStorage.getItem('serverList')
    return ServerList === null ? [] : JSON.parse(ServerList)
  },
  getAllServer () {
    return JSON.parse(localStorage.getItem('serverList') || '[]')
  },
  saveAllServer (ServerList) {
    localStorage.setItem('serverList', JSON.stringify(ServerList))
  }
}
