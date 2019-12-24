
/* global $ */
/* global WeixinJSBridge */

document.addEventListener('WeixinJSBridgeReady', function () {
  WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
    document.getElementById('audio').play()
    // document.getElementById('audio').pause();
  })
}, false)

var audio = document.getElementById('audio')
audio.addEventListener('ended', function () {
  audio.play()
}, false)
var u = navigator.userAgent
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 // g
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
if (isIOS) {
  $('#answer').addClass('abs')
}
var isWeixin = u.indexOf('micromessenger') !== -1
if (!isWeixin) {
  // window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=888"
}

document.body.addEventListener('focusout', () => {
  if (isAndroid) return
  var currentPosition, timer
  var speed = 1// 页面滚动距离
  timer = setInterval(function () {
    currentPosition = document.documentElement.scrollTop || document.body.scrollTop
    currentPosition -= speed
    window.scrollTo(0, currentPosition)// 页面向上滚动
    currentPosition += speed // speed变量
    window.scrollTo(0, currentPosition)// 页面向下滚动
    clearInterval(timer)
  }, 1)
})
