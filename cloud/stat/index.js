// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
    var data = await db.collection("logs").aggregate()
    .match({
        is_delete:false,
        time:_.gte((new Date()).getTime()-24*60*60*1000*30)
    })
    .group({
        _id: '$_openid',
        count:$.sum(1),
        stars:$.sum($.cond({
            if: $.eq(['$ifstar',true]),
            then:1,
            else:0
        })),
    })
    .lookup({
            from: "mine",
            let: {logs_openid:"$_id"},
            pipeline: $.pipeline()
                .match(_.expr($.eq(["$_openid","$$logs_openid"])))
                .project({name:1})
                .done(),
            as: "name"
        })
        .sort({
            count:-1
        })
        .end()
    var res = data.list.map((item)=>{
        return {
            _openid:item._id,
            name:item.name[0].name,
            count:item.count,
            stars:item.stars
        }
    })
    return res
}