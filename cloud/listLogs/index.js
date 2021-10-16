// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
//获取logs这个表单
const logs = cloud.database().collection('logs')
// const mine = cloud.database().collection("mine")

// 云函数入口函数
exports.main = async (event, context) => {
  var logs_lst = await logs.aggregate().lookup({
    from: "mine",
    localField: "_openid",
    foreignField: "_openid",
    as: "mine_info"
  }).match({
    is_delete: false
  }).end()

  return logs_lst
}