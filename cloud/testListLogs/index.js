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
  if (event.userInfo.is_admin) {
    // 排序并聚合
    var logs_lst = await logs.aggregate().sort({
      time: -1,
      create_time: -1
    }).lookup({
      from: "mine",
      localField: "_openid",
      foreignField: "_openid",
      as: "mine_info"
    }).match({
      is_delete: false,
      // is_public: true
    })
    // 分页
    logs_lst = await logs_lst.skip(event.skip_num).limit(20)
    // 取数据
    logs_lst = await logs_lst.end()
    return logs_lst
  } else {
    // 排序并聚合
    var logs_lst = await logs.aggregate().sort({
      time: -1,
      create_time: -1
    }).lookup({
      from: "mine",
      localField: "_openid",
      foreignField: "_openid",
      as: "mine_info"
    }).match({
      is_delete: false,
      is_public: true
    })
    // 分页
    logs_lst = await logs_lst.skip(event.skip_num).limit(20)
    // 取数据
    logs_lst = await logs_lst.end()
    return logs_lst
  }
}
