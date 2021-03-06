//index.js
const app = getApp()


Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    userName:'请点击头像获取个人信息',
    logged: false,
    takeSession: false,
    requestResult: '',
    havegroups: 0,
    mygroups:[],
    mygroupsMemberNumber:[],
    mygroupssplit:[]
  },

  onnewGroup:function(){
    wx.navigateTo({
      url: '../newGroup/newGroup',
    })
  },
  
  ontest: function () {
    wx.navigateTo({
      url: '../invite/invite?id=XD4jRsDR1TiNksci',
    })
  },

  ongroupDetail:function(e){
    console.log(e.currentTarget.dataset.groupnumber+"号群组");
    wx.navigateTo({
      url: '../groupDetail/groupDetail?id='+e.currentTarget.dataset.groupnumber,
    })
  },

  onLoad: function () {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })

      return
    }
    
    // 获取用户信息
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
              db.collection('groups').where({ groupMembers: { memberopenid: app.globalData.openid } }).get({
                success: res => {
                  this.setData({ mygroups: res.data });
                  app.globalData.mygroups = res.data;
                  if (this.data.mygroups.length != 0) { 
                    this.setData({ havegroups: 1 });
                    app.globalData.havegroups = 1; 
                    }
                  console.log('[数据库] [查询记录] 成功: ', res)
                  console.log(this.data.mygroups);
                  //console.log(app.globalData.openid);
                  for(let i=0;i<this.data.mygroups.length;i++)
                  {
                    let tempnumber = this.data.mygroups[i].groupMembersNumber;
                    let trow = parseInt(tempnumber / 5);
                    let lastrow = tempnumber - 5 * trow;
                    let tempmembercount = 0;
                    let tempthisgroup = [];
                    console.log("row:"+trow+" last"+lastrow);
                    this.data.mygroupsMemberNumber.push({"row":trow,"last":lastrow});
                    app.globalData.mygroupsMemberNumber.push({ "row": trow, "last": lastrow });
                    console.log(this.data.mygroupsMemberNumber);
                    for (let j = 0; j < trow; j++) {
                      let temp = [];
                      for (let k = 0; k < 5; k++) {
                        //console.log(this.data.mygroups[i].groupMembers[tempmembercount].memberName)
                        temp.push({
                          "name": this.data.mygroups[i].groupMembers[tempmembercount].memberName,
                          "level": this.data.mygroups[i].groupMembers[tempmembercount].memberLevel,
                          "avatar": this.data.mygroups[i].groupMembers[tempmembercount].memberavatar,
                          "openid": this.data.mygroups[i].groupMembers[tempmembercount].memberopenid,
                        });
                        tempmembercount += 1;
                      }
                      //console.log('temp'+temp)
                      tempthisgroup.push({"id":j,"members":temp});
                    }
                    let temp = [];
                    for (let l = 0; l < lastrow; l++) {
                      console.log(this.data.mygroups[i].groupMembers[tempmembercount])
                      temp.push({
                        "name": this.data.mygroups[i].groupMembers[tempmembercount].memberName,
                        "level": this.data.mygroups[i].groupMembers[tempmembercount].memberLevel,
                        "avatar": this.data.mygroups[i].groupMembers[tempmembercount].memberavatar,
                        "openid": this.data.mygroups[i].groupMembers[tempmembercount].memberopenid,
                      });
                      console.log(temp)
                      tempmembercount += 1;
                    }
                    console.log('hi')
                    console.log('temp' + temp)
                    tempthisgroup.push({ "id": trow, "groups": temp });
                    
                    this.data.mygroupssplit.push({"groupid":i,"groups":tempthisgroup});
                  }
                  console.log(this.data.mygroupssplit);
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
          db.collection('groups').where({ groupMembers: { memberopenid: app.globalData.openid } }).get({
            success :res=>{
              this.setData({ mygroups: res.data});
              app.globalData.mygroups = res.data;
              if (this.data.mygroups.length != 0) { 
                this.setData({ havegroups: 1 });
                app.globalData.havegroups = 1;
                } 
              console.log('[数据库] [查询记录] 成功: ', res)
              console.log(this.data.mygroups.length);
              //console.log(app.globalData.openid);
              for (let i = 0; i < this.data.mygroups.length; i++) {
                let tempnumber = this.data.mygroups[i].groupMembersNumber;
                let tempmembercount = 0;
                let trow = parseInt(tempnumber / 5);
                let lastrow = tempnumber - 5 * trow;
                console.log("row:" + trow + " last" + lastrow);
                this.data.mygroupsMemberNumber.push({ "row": trow, "last": lastrow });
                app.globalData.mygroupsMemberNumber.push({ "row": trow, "last": lastrow });
                for(let j=0;j<trow;j++)
                {
                  temp = [];
                  for(let k=0;k<5;k++)
                  {
                    temp.push({ 
                      "name": this.data.mygroups[i].groupMembers[tempmembercount].memberName,
                      "level": this.data.mygroups[i].groupMembers[tempmembercount].memberLevel,
                      "avatar": this.data.mygroups[i].groupMembers[tempmembercount].memberavatar,
                      "openid": this.data.mygroups[i].groupMembers[tempmembercount].memberopenid,
                    });
                    tempmembercount += 1;
                  }
                  mygroupssplit.push(temp);
                }

                temp = [];
                for(let k=0;k<lastrow;k++)
                {
                  temp.push({
                    "name": this.data.mygroups[i].groupMembers[tempmembercount].memberName,
                    "level": this.data.mygroups[i].groupMembers[tempmembercount].memberLevel,
                    "avatar": this.data.mygroups[i].groupMembers[tempmembercount].memberavatar,
                    "openid": this.data.mygroups[i].groupMembers[tempmembercount].memberopenid,
                  });
                  tempmembercount += 1;
                }
                mygroupssplit.push(temp);
                console.log(mygroupsplit)

              }
            },
            fail :err=>{
              console.error('[数据库] [查询记录] 失败：', err)
            }
          });
          
          if(res.result.addornot == 1)
          {
            //const db = wx.cloud.database();
            db.collection('users').add({
              data:{
                userName: e.detail.userInfo.nickName,
                userGender: e.detail.userInfo.gender,
                userAvatarUrl: e.detail.userInfo.avatarUrl
              },
              success: res => {console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)},
              fail: err => {console.error('[数据库] [新增记录] 失败：', err)}
            })
            
          }
          else
          {
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

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
