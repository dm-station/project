
/* global $ */
/* global _czc */
$(function () {
  var mousedown = 'mousedown'// 鼠标按下
  var mousemove = 'mousemove'// 鼠标移动
  var mouseup = 'mouseup'// 鼠标抬起
  var mouseout = 'mouseout'// 鼠标移除
  var mouse = 'PC'
  if (document.hasOwnProperty('ontouchstart') || 'ontouchstart' in window) {
    mousedown = 'touchstart'// 手指按下
    mousemove = 'touchmove'// 手指移动
    mouseup = 'touchend'// 手指抬起
    mouseout = 'touchcancel'// 手指移除
    mouse = 'YD'
  }

  const test = '1111'

  function getRequestParams (strname) {
    var url = location.search // 获取url中"?"符后的字串
    var theRequest = new Object()
    if (url.indexOf('?') !== -1) {
      var str = url.substr(1)
      var strs = str.split('&')
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1])
      }
    }
    return theRequest[strname]
  }
  var token = getRequestParams('token') || 'testToken'
  var params = ''

  console.log(token, 'token', test)

  $('.start').on('mousedown', function () {
    params = getNVCVal()
    console.log('点击开始', 'params', params)
    _czc.push(['_trackEvent', '首页', '点击按钮', '点击开始'])
    $('#bgDiv').addClass('none')
    $('#answer').removeClass('none')
    // $('.bg_copy').removeClass('none');
    // $('.start').addClass('none');

    // setTimeout(function(){
    //     drawImage();
    // },300)
  })

  var starArr = [// 1-5星选项
    { name: 'star1', val: 0 },
    { name: 'star2', val: 0 },
    { name: 'star3', val: 0 },
    { name: 'star4', val: 0 },
    { name: 'star5', val: 0 },
    { name: 'star6', val: 0 },
    { name: 'star7', val: 0 },
    { name: 'star8', val: 0 }
  ]

  var waterArr = [// 单选题
    { name: 'water1', val: 0, desc: '' },
    { name: 'water2', val: 0, desc: '' },
    { name: 'water3', val: 0, desc: '' },
    { name: 'water4', val: 0, desc: '' },
    { name: 'water5', val: 0, desc: '' },
    { name: 'water6', val: 0, desc: '' }
  ]
  var descArr = [// 单选题索引转文字
    { name: 'water1', desc: ['1天', '3天', '1周', '2周', '1月'] },
    { name: 'water2', desc: ['100', '200', '300', '500', '1000'] },
    { name: 'water3', desc: ['00后', '90后', '80后', '70后', '其他'] },
    { name: 'water4', desc: ['3000', '5000', '10000', '20000', '20000+'] },
    { name: 'water5', desc: ['男', '女', '喵'] },
    { name: 'water6', desc: ['是', '否'] }
  ]

  var box1 = ''
  var box1s = ''

  for (var i = 0; i < 8; i++) {
    box1 += '<div data-star=' + i + ' class="answer' + i + '">' +
        '<div class="fl star"></div>' +
        '<div class="fl star"></div>' +
        '<div class="fl star"></div>' +
        '<div class="fl star"></div>' +
        '<div class="fl star"></div>' +
        '</div>'
    box1s += '<img class="fl star' + i + '" src="img/star' + starArr[i].val + '.png">'
  }
  $('.box1').append(box1)
  $('.box1s').append(box1s)

  $('.star').on('mousedown', function (e) {
    var parentData = $(this).parent().data('star')
    var val = $(this).index()
    starArr[parentData].name = 'star' + (parentData + 1)
    starArr[parentData].val = val + 1
    // console.log($(e.target))

    $('.star' + parentData).attr('src', 'img/star' + (val + 1) + '.png')

    console.log('name:' + parentData, 'val:' + val, starArr)
  })

  $('.btn_type').on('mousedown', function (e) {
    var parent = $(this).parent()// 父级
    var val = $(this).index()// 当前索引
    var parentData = $(this).parent().data('water')// 父级的data

    waterArr[parentData].name = 'water' + (parentData + 1)
    waterArr[parentData].val = val
    waterArr[parentData].desc = descArr[parentData].desc[val]

    parent.children().attr('src', 'img/btn_type2.png')
    $(this).attr('src', 'img/btn_type1.png')

    console.log('parentData:', parentData, 'val:' + val, waterArr)
  })

  var isUp = true
  $('.answer_btn').on('mousedown', function (e) {
    console.log(starArr, waterArr, $('.message_textarea').val())
    if (!isUp) return
    for (var k1 = 0; k1 < starArr.length; k1++) {
      // console.log(starArr[k1])
      if (starArr[k1].val <= 0 || starArr[k1].val > 5) {
        alert('请对第' + (k1 + 1) + '题选择1-5星！')
        return
      }
    }

    for (var k2 = 0; k2 < waterArr.length; k2++) {
      // console.log(waterArr[k2])
      if (waterArr[k2].desc === '') {
        alert('请选择第' + (k2 + 1) + '题的答案！')
        return
      }
    }

    // 校验通过
    isUp = false
    console.log('校验成功！')
    _czc.push(['_trackEvent', '上传信息', '点击按钮', '校验成功'])
    if (!params) {
      $('#answer').addClass('none')
      $('#no').removeClass('none')
    }
    $.ajax({
      type: 'post',
      async: true,
      url: '//api.slb.moneplus.cn/api/web/pet/add',
      data: {
        token: token,
        star_1: starArr[0].val,
        star_2: starArr[1].val,
        star_3: starArr[2].val,
        star_4: starArr[3].val,
        star_5: starArr[4].val,
        star_6: starArr[5].val,
        star_7: starArr[6].val,
        star_8: starArr[7].val,
        star_9: '',
        select_1: waterArr[0].desc,
        select_2: waterArr[1].desc,
        select_3: waterArr[2].desc,
        select_4: waterArr[3].desc,
        select_5: waterArr[4].desc,
        select_6: waterArr[5].desc,
        msg: $('.message_textarea').val(),
        afs: params
      },
      dataType: 'json',
      success: function (res) {
        console.log(res)
        if (res.code == 0) {
          if (res.data.money == 0) {
            $('#answer').addClass('none')
            $('#no').removeClass('none')
          } else {
            $('.red_text').html('恭喜中了' + res.data.money + '元红包')
            $('#answer').addClass('none')
            $('#red,.save').removeClass('none')
          }
        } else {
          isUp = true
          alert(res.msg)
        }
      },
      error: function (msg) {
        isUp = true
        // alert(msg);
      }
    })
  })

  function drawImage () {
    var cntElem = $('#bgDiv')[0]

    var shareContent = cntElem// 需要截图的包裹的（原生的）DOM 对象
    var width = shareContent.offsetWidth // 获取dom 宽度
    var height = shareContent.offsetHeight // 获取dom 高度
    var canvas = document.createElement('canvas') // 创建一个canvas节点
    canvas.id = 'save'
    console.log(canvas)
    var scale = window.devicePixelRatio // 定义任意放大倍数 支持小数
    // var scale = 2; //定义任意放大倍数 支持小数
    canvas.width = width * scale // 定义canvas 宽度 * 缩放
    canvas.height = height * scale // 定义canvas高度 *缩放
    canvas.getContext('2d').scale(scale, scale) // 获取context,设置scale
    var opts = {
      scale: scale, // 添加的scale 参数
      canvas: canvas, // 自定义 canvas
      // logging: true, //日志开关，便于查看html2canvas的内部执行流程
      width: width, // dom 原始宽度
      height: height
      // useCORS: true // 【重要】开启跨域配置
    }
    html2canvas(shareContent, opts).then(function (canvas) {
      // var context = canvas.getContext('2d');
      // 【重要】关闭抗锯齿
      // context.mozImageSmoothingEnabled = false;
      // context.webkitImageSmoothingEnabled = false;
      // context.msImageSmoothingEnabled = false;
      // context.imageSmoothingEnabled = false;

      var image = canvas.toDataURL('image/jpeg', 1.0)
      $('.save').attr('src', image)
    })
  }
})
