// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
//获取logs这个表单
const logs = cloud.database().collection('logs')
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  // 筛选条件
  var match_con = {}  // 筛选条件
  if (event.type=="mine"){
    match_con = {
      is_delete: false,
      _openid: event.userInfo._openid
    }
  }
  else{
    if (event.userInfo.is_admin){
      match_con = {
        is_delete: false,
      }
    }
    else{
      match_con = {
        is_delete: false,
        is_public: true,
      }
    }
  }
  // 排序并聚合
  var logs_lst = await logs.aggregate().sort({
    // time: -1,
    create_time: -1
  }).lookup({
    from: "mine",
    localField: "_openid",
    foreignField: "_openid",
    as: "mine_info"
  }).match(match_con)
  // 分页
  logs_lst = await logs_lst.skip(event.skip_num).limit(20)
  // 取数据
  logs_lst = await logs_lst.end()
  return logs_lst
}
