// pages/newGroup/newGroup.js
const app = getApp()
Page({
  

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    description:'',
    textcount : 0
  },
  openAlert: function () {
    wx.showModal({
      content: '弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    });
  },

  onInputName: function (e) {
    this.setData(
      {
        title: e.detail.value,
      });
  },

  onChangeCount: function(e){
    this.setData(
      {
        textcount: e.detail.value.length,
        description: e.detail.value,
      });
  },

  

  openConfirm: function () {
    if (this.data.title == '' && this.data.description=='')
    {
      wx.showModal({
        content: '群名称和群描述都不能为空哦',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    }
    else if (this.data.title == '')
    {
      wx.showModal({
        content: '群名称不能为空哦',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    }
    else if (this.data.description == '')
    {
      wx.showModal({
        content: '群描述不能为空哦',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    }
    else
    {
      let dtitle = this.data.title;
      let ddescription = this.data.description;
      wx.showModal({
        title: '创建群确认',
        content: '请问你是否确认创建这个群',
        confirmText: "确认",
        cancelText: "取消",
        success: function (res) {
          console.log(res);
          if (res.confirm) { 
            const db = wx.cloud.database();
            //console(dtitle,ddescription);
            db.collection('groups').add({
              data:{
                groupName: dtitle,
                groupDescription: ddescription,
                groupMembersNumber: 1,
                groupMembers: [{ "memberopenid": app.globalData.openid, "memberName": app.globalData.userName, "memberavatar": app.globalData.avatarUrl, "memberLevel": 2 }],
              },
              success: res => { console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id) },
              fail: err => { console.error('[数据库] [新增记录] 失败：', err) }
            });
            console.log('用户确认创建群');
            wx.showToast({
              title: '创建完成',
              icon: 'success',
              duration: 2000
            });
            setTimeout(function () {
              wx.reLaunch({
                url: '../trueindex/index',
              })
            }, 2000);
            
          } else {
            console.log('用户取消创建群')
          }
        }
      });
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
  onShareAppMessage: function () {

  }
})