//app.js
App({

  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    //this.globalData = "1";
    //console.log("我又来了")
  },
  globalData: 
  {
    openid: "1",
    mygroups: [],
    havegroups: 0,
    mygroupsMemberNumber: [],
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    userName: '请点击头像获取个人信息',
  }
})
