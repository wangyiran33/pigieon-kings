// miniprogram/pages/groupDetail/groupDetail.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    thisgroup:'',
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    userName: '请点击头像获取个人信息',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("进入第" +options.id+"号详情页面")
    console.log(app.globalData.mygroups[options.id] )
    this.setData({
      thisgroup: app.globalData.mygroups[options.id],
      avatarUrl: app.globalData.avatarUrl,
      userName: app.globalData.userName
    })
    console.log(this.data.thisgroup._id);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return{
      title: '邀请你加入群',
      path: '/pages/invite/invite?id=' + this.data.thisgroup._id,
    }

  }
})