<template>

    <view class="bg" id="conter">



        

    </view>

</template>

<script>

export default {
  data () {
    return {
      motto: 'Hello ，拒绝强迫症！',
      savaArr: [],
      model: '',
      telValue: '',
      result: '',
      isPlay: true,
      time: 'Go！！！'
    }
  },
  // 调用应用实例的方法获取全局数据
  created () {

  },
  // 生命周期函数--监听页面加载--一个页面只会调用一次
  onLoad: function (options) {
    this.savaArr = wx.getStorageSync('key') || []
    if (this.savaArr.length > 0) {
      this.motto = this.savaArr.join('，')
    }
  },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function (res) {

  },
  // 生命周期函数--监听页面显示--每次打开页面都会调用一次
  onShow: function () {

  },

  // 生命周期函数--监听页面隐藏
  onHide: function () {

  },

  // 生命周期函数--监听页面卸载
  onUnload: function () {

  },

  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {

  },

  // 页面上拉触底事件的处理函数
  onReachBottom: function () {

  },

  // 用户点击右上角分享
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '燃烧我的卡路里，逆生长实锤就是我！',
      path: 'pages/index/main'
    }
  },

  methods: {
    change (e) {
      console.log('change：', this.motto)
      this.motto = '我叫数据绑定！'
    },
    submit () {
      if (this.telValue === '') {
        ExchangeData.showToast('选项不能为空！', 2000)
        return false
      }
      this.savaArr.push(this.telValue)
      this.telValue = ''
      this.motto = this.savaArr.join('，')

      console.log(this.savaArr, 'this.savaArr')
    },
    go () {
      if (this.time !== 'Go！！！') return
      if (this.savaArr.length <= 0) {
        ExchangeData.showToast('选项不能为空！', 2000)
        return
      }
      wx.setStorage({
        key: 'key',
        data: this.savaArr
      })

      let random = Math.floor(Math.random() * this.savaArr.length)
      this.result = this.savaArr[random]

      console.log(this.result, 'this.result')
      var that = this
      var time = 3
      var tm = setInterval(function () {
        time--
        console.log(time, that.time)
        // that.time = time
        if (time <= 0) {
          clearInterval(tm)
        }
      }, 100)
    },
    clear () {
      wx.clearStorage()
      this.savaArr = []
      this.telValue = ''
      this.motto = 'Hello ，拒绝强迫症！'
      this.result = ''
    },
    onInputChange: function (e) {
      let inputChange = e.mp.detail.value
      // console.log(e.mp.detail.value, 'onInputChange', inputChange.length, 'onInputChange.lenght')
      // console.log(this.model, 'model')
      this.telValue = inputChange
    }
  }
}
</script>

<style scoped>
#conter {
  /* text-align: center */
}
.tips {
  padding: 30rpx 0;
  background-color: #ffffff;
  font-size: 30rpx;
  color: #353535;
  width: 646rpx;
  margin: 0 auto;
  overflow: hidden;
}
.tips_l {
  width: 200rpx;
}
.tips_r {
  width: 446rpx;
}
.text_center {
  text-align: center;
}
.red {
  color: firebrick;
}
input {
  width: 646rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
  color: #000;
  border: 2rpx solid gray;
  border-radius: 12rpx;
  margin: 0 auto;
  padding: 0 10rpx;
  /* background:rgba(0, 0, 0, 0.3); */
}
#button {
  width: 646rpx;
  margin: 50rpx auto 0 auto;
  overflow: hidden;
}
.btn {
  width: 200rpx;
  height: 80rpx;
  font-size: 28rpx;
  line-height: 80rpx;
}
.go {
  /* position: fixed; */
  width: 400rpx;
  height: 80rpx;
  font-size: 28rpx;
  line-height: 80rpx;
  margin: 100rpx auto 0 auto;
}
</style>
