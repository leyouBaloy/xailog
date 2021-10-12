// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

//获取logs这个表单
const logs = cloud.database().collection('logs')

// 云函数入口函数
exports.main = async (event, context) => {
  // 1，获取数据的总个数
  let count = await logs.count()
  count = count.total
  // 2，通过for循环做多次请求，并把多次请求的数据放到一个数组里
  let all = []
  for (let i = 0; i < count; i += 100) { //自己设置每次获取数据的量
    let list = await logs.skip(i).where({is_delete:false}).get()
    all = all.concat(list.data);
  }
  // 3,把组装好的数据一次性全部返回
  return all;
}
