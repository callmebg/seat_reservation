// miniprogram/pages/over/over.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ans: "查询中..."
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    console.log("成功onlad")
    var ttt = Date.parse(new Date()) / 1000
    wx.cloud.callFunction({
      name: 'queryOver',
      data: {
        now: ttt
      },
      success(res) {
        console.log("成功")
        console.log(res)
        var arr = []
        for (let i in res.result.data) {
          if (res.result.data[i].beginTime + res.result.data[i].setTime < ttt)
          arr.push(res.result.data[i]._openid); //属性
          //arr.push(obj[i]); //值
        }
        if(arr.length == 0) arr = "无"
        that.setData({
          //ans: JSON.stringify(res.result)
          ans: arr
        })
      },
      fail(res) {
        console.log("失败")
        console.log(res)
      }
    })

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

  }
})