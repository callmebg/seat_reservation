// pages/scan/scan.wxml.js

// 在需要使用的js文件中，导入js
var util = require('../../utils/util.js');
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    queryNum: "",
    messges: "",
    choiceTime: false,
    setTime: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //console.log(app.globalData.userInfo)
    if (app.globalData.userInfo) {
      this.setData({
        hasUserInfo: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  clickQuery: function() {
    const db = wx.cloud.database()
    var that = this;
    var show;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        //this.show = "结果:" + res.result + "二维码类型:" + res.scanType + "字符集:" + res.charSet + "路径:" + res.path;
        //this.show = JSON.stringify(res);
        that.setData({
          messges: ""
        })

        //将结果放在queryNum里面
        if (res.scanType == "QR_CODE" && res.result.substr(0, 4) == "desk") {
          that.setData({
            queryNum: res.result.substr(5)
          })

          db.collection('desk').where({
            _openid: that.data.queryNum // 填入当前桌子 openid
          }).get({
            success: function(res) {
              console.log(res.data)
              if (res.data[0].isOccupied == false) {
                that.setData({
                  messges: "未被占座"
                })
              } else {
                //现在时间
                var nowTime = Date.parse(new Date());
                nowTime = nowTime / 1000;
                var leftOver = (res.data[0].beginTime + res.data[0].setTime) - nowTime;
                if (leftOver > 0) {
                  that.setData({
                    messges: "已被“" +
                      res.data[0].whoOccupied +
                      "”占座，还需" + leftOver + "秒结束"
                  })
                } else {
                  that.setData({
                    messges: "“" + res.data[0].whoOccupied + "“" + "占座超时，请联系管理员移走书籍"
                  })
                }
              }
            }
          })
        }

        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'success',
          duration: 2000
        })
      },
      complete: (res) => {}
    })
  },

  clickQueryOver: function() {
    wx.navigateTo({
      url: '../over/over',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function(data) {
          console.log(data)
        },
        someEvent: function(data) {
          console.log(data)
        }
      },
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: 'test'
        })
      }
    })
  },

  clickRelease: function() {
    const db = wx.cloud.database()
    var that = this;
    var show;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        //将结果放在queryNum里面
        if (res.scanType == "QR_CODE" && res.result.substr(0, 4) == "desk") {
          that.setData({
            queryNum: res.result.substr(5)
          })

          db.collection('desk').where({
            _openid: that.data.queryNum // 填入桌子 openid
          }).get({
            success(res) {
              console.log("fff")
              console.log(res.data)
              var ttt = Date.parse(new Date()) / 1000
              var point = Math.ceil((ttt - res.data[0].beginTime - res.data[0].setTime) / 600)

              console.log(point)
              console.log(app.globalData.userInfo.honest)

              if (res.data[0].isOccupied == true && point > 0) {
                app.globalData.userInfo.honest = app.globalData.userInfo.honest - point
                wx.cloud.callFunction({
                  name: 'deduct',
                  data: {
                    user_id: res.data[0].whoOccupiedId,
                    newHonest: app.globalData.userInfo.honest
                  },
                  success(res) {
                    console.log("成功扣分")
                    console.log(res)
                  },
                  fail(res) {
                    console.log(res)
                  }
                })
              }
              wx.cloud.callFunction({
                name: 'release',
                data: {
                  desk_id: that.data.queryNum
                },
                success(res) {
                  console.log("成功释放")
                  console.log(res)
                },
                fail(res) {
                  console.log(res)
                }
              })
            }
          })
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'success',
          duration: 2000
        })
      },
      complete: (res) => {}
    })
  },

  clickOccupied: function() {
    const db = wx.cloud.database();
    var that = this;
    var show;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
        //将结果放在queryNum里面
        if (res.scanType == "QR_CODE" && res.result.substr(0, 4) == "desk") {
          that.setData({
            queryNum: res.result.substr(5)
          })

          db.collection('desk').where({
            _openid: that.data.queryNum // 填入当前桌子 openid
          }).get({
            success: function(res) {
              if (res.data[0].isOccupied == false) {
                that.setData({
                  choiceTime: true
                })
              }else{
                that.setData({
                  messges: "已被占座",
                  choiceTime: false
                })
              }
            }
          })
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'success',
          duration: 2000
        })
      },
      complete: (res) => {}
    })
  },

  sliderChange: function(e) {
    this.setData({
      setTime: e.detail.value * 60
    })
  },

  up: function(e) {
    var that = this;
    that.setData({
      choiceTime: false,
      messges: "留座成功"
    })
    const db = wx.cloud.database();
    var ttt = Date.parse(new Date()) / 1000;
    console.log("woyao")
    console.log(app.globalData.userInfo)
    wx.cloud.callFunction({
      name: 'occupied',
      data: {
        desk_id: that.data.queryNum,
        setTime: that.data.setTime,
        beginTime: ttt,
        who: app.globalData.userInfo.nickName
      },
      success(res) {
        console.log("成功")
        console.log(res)
      },
      fail(res) {
        console.log("失败")
        console.log(res)
      }
    })
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    })
  }
})