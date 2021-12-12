// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
  })
cloud.init()

const logs = cloud.database().collection('logs')

// 云函数入口函数
exports.main = async (event, context) => {
  var timeSeries = logs.where({
    _openid:event.openid,
    is_delete:false,
  })
  .field({time:true})
  .orderBy('time','desc')
  .skip(0)
  .limit(50)
  .get()
  return timeSeries
}