import { makeAutoObservable } from "mobx"
import { http } from '@/utils'
class ChannelStore {
  channelList = []
  constructor() {
    makeAutoObservable(this)
  }

  // article 与 publish 组件均需要用到 去公共的layout中调用
  loadChannelList = async () => {
    const res = await http.get('/channels')
    this.channelList = res.data.channels
  }
}

export default ChannelStore