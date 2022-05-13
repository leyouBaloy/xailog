const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

var newDate = new Date();

exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        "touser": event.touser,
        "page": 'pages/day/day',
        "lang": 'zh_CN',
        "data": {
          "time3": { // 时间
            "value": `${newDate.getMonth() + 1}月${newDate.getDate()}日`
          },
          "thing1": { // 来自
            "value": event.userInfo.name
          },
          "thing4": { // 留言内容
              "value": event.content
          }
        },
        "templateId": 'a5AX-3vtvGHxGXAGDhagAq-hE5Vp4d0w0sqm3o-bFII',
        "miniprogramState": 'trial'
      })
    return result
  } catch (err) {
    return err
  }
}