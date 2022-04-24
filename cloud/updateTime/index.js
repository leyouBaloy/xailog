// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
    var data = await db.collection('logs')
    .where({
      time:null
    })
    .field({
      id: true,
      create_time: true
    })
    .get()

    var data_lst = data['data']
    for(var i=0;i<data_lst.length;i++){
        db.collection('logs').doc(data_lst[i]['_id'])
        .update({
            data: {
            time: data_lst[i]['create_time']
            }
  })
    }
    

    return {
        "data":data
    }
}