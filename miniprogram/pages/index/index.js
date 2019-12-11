//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    honest: 80,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow: function(){
    this.setData({
      honest: app.globalData.userInfo.honest
    })
  },

  onLoad: function() {
    //开启云端功能
    wx.cloud.init({
      env: 'scut3666-jwx7l',
      traceUser: true
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    var that = this
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })

    wx.cloud.callFunction({
      name: 'queryUser',
      data: {
        name: e.detail.userInfo.nickName
      },
      success(res) {
        console.log("成功")
        console.log(res.result)

        if (res.result.data.length == 0) {
          wx.cloud.callFunction({
            name: 'addUser',
            data: {
              name: e.detail.userInfo.nickName
            }
          })
          app.globalData.userInfo.honest = 80
        } else {
          app.globalData.userInfo.honest = res.result.data[0].honest

          that.setData({
            honest: res.result.data[0].honest
          })
          console.log(that.data.honest)
        }

      },
      fail(res) {
        console.log("失败")
        console.log(res)
      }
    })
  }
})