// miniprogram/pages/invite /invite.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    thisgroup: '',
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    userName: '请点击头像获取个人信息后再进行操作哦',
    logged: false,
    takeSession: false,
    requestResult: '',
    existgroup: 1,
    ingroup: 0,
    mygroups: [],
    inviteInfo: '邀请您加入群组'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("进入第" + options.id + "号群组邀请页面")

    //查询这个群
    const db = wx.cloud.database();
    const _ = db.command;
    db.collection('groups').where({ _id: options.id }).get({
      success: res => {
        if (res.data.length != 0) {
          this.setData({ thisgroup: res.data[0],existgroup:1 });
          //console.log("existgroup:"+this.data.existgroup)
        }
        else{
          this.setData({existgroup:0})
        }
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }
    });



    //获取用户登录信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              app.globalData.avatarUrl = res.userInfo.avatarUrl;
              app.globalData.userName = res.userInfo.nickName;
              app.globalData.userInfo = res.userInfo;
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userName: res.userInfo.nickName,
                userInfo: res.userInfo,
              })
            }
          })

          wx.cloud.callFunction({
            name: 'add_user',
            data: {},
            success: res => {
              console.log('[云函数] [add_user] 调用成功')
              //设置全局openid
              app.globalData.openid = res.result.openid;
              const db = wx.cloud.database();
              const _ = db.command
              db.collection('groups').where({ _openid: app.globalData.openid }).get({
                success: res => {
                  this.setData({ mygroups: res.data });
                  app.globalData.mygroups = res.data;
                  if (this.data.mygroups.length != 0) {
                    this.setData({ havegroups: 1 });
                    app.globalData.havegroups = 1;
                  }
                  console.log('[数据库] [查询记录] 成功: ', res)
                  console.log(app.globalData.mygroups);
                  console.log(app.globalData.openid);
                },
                fail: err => {
                  console.error('[数据库] [查询记录] 失败：', err)
                }
              });
            },
            fail: err => {
              console.error('[云函数] [add_user] 调用失败', err)
            }
          })

        }
      }
    });

    //检查是否已经在群里:
    db.collection('groups').where({ _id:this.data.thisgroup._id,groupMembers: {memberopenid:app.globalData.openid }}).get({
      success: res => {
        //console.log(res.data)
        console.log('是否在群里[数据库] [查询记录] 成功: ', res)
        if(res.data.length==1)
          this.setData({ ingroup: 1, inviteInfo:'您已经在这个群里了'});

        //console.log(app.globalData.mygroups);
        //console.log(app.globalData.openid);
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }
    });
    
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

  },

  backtoindex: function() {
    wx.reLaunch({
      url: '../trueindex/index',
    })
  },

  accept:function(e){
    let dusername = this.data.userName;
    let davatar = this.data.avatarUrl;
    let dthisgroup = this.data.thisgroup
    wx.showModal({
      title: '加入群确认',
      content: '请问你是否确认加入这个群',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          const db = wx.cloud.database();
          const _ = db.command;
          //console(dtitle,ddescription);
          //console.log(this.data.thisgroup.groupDescription);
          
          db.collection('groups').doc(dthisgroup._id).update({
            data: {
              groupMembers: _.push({ "memberopenid": app.globalData.openid, "memberName": dusername, "memberavatar": davatar, "memberLevel": 0}),
              groupMembersNumber:_.inc(1)
            },
            success: res => { console.log('[数据库] [更新记录] 成功', res.data) },
            fail: err => { console.error('[数据库] [更新记录] 失败：', err) }
          });
          console.log('用户确认加入群');
          wx.showToast({
            title: '加入成功',
            icon: 'success',
            duration: 2000
          });
          setTimeout(function () {
            wx.reLaunch({
              url: '../trueindex/index',
            })
          }, 2000);

        } else {
          console.log('用户取消加入群')
        }
      }
    });
  },

  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      wx.cloud.callFunction({
        name: 'add_user',
        data: {},
        success: res => {
          console.log('[云函数] [add_user] 调用成功')
          //设置全局openid
          app.globalData.openid = res.result.openid;
          const db = wx.cloud.database();
          const _ = db.command;
          db.collection('groups').where({ _openid: app.globalData.openid }).get({
            success: res => {
              this.setData({ mygroups: res.data });
              app.globalData.mygroups = res.data;
              if (this.data.mygroups.length != 0) {
                this.setData({ havegroups: 1 });
                app.globalData.havegroups = 1;
              }
              console.log('[数据库] [查询记录] 成功: ', res)
            },
            fail: err => {
              console.error('[数据库] [查询记录] 失败：', err)
            }
          });

          if (res.result.addornot == 1) {
            //const db = wx.cloud.database();
            db.collection('users').add({
              data: {
                userName: e.detail.userInfo.nickName,
                userGender: e.detail.userInfo.gender,
                userAvatarUrl: e.detail.userInfo.avatarUrl
              },
              success: res => { console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id) },
              fail: err => { console.error('[数据库] [新增记录] 失败：', err) }
            })

          }
          else {
            console.log(res.result.addornot)
            console.log('用户已存在')
          }
        },
        fail: err => {
          console.error('[云函数] [add_user] 调用失败', err)
        }
      })
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userName: e.detail.userInfo.nickName,
        userInfo: e.detail.userInfo
      });
      app.globalData.avatarUrl = e.detail.userInfo.avatarUrl;
      app.globalData.userName = e.detail.userInfo.nickName;
      app.globalData.userInfo = e.detail.userInfo;
    }
  },
})