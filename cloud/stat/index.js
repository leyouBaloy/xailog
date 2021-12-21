// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

var newdate = new Date()
var preDayStamp = new Date(newdate.getFullYear(),newdate.getMonth(),newdate.getDate()-1).getTime()
var preMonthStamp = new Date(newdate.getFullYear(),newdate.getMonth()-1,newdate.getDate()).getTime()

// 云函数入口函数
exports.main = async (event, context) => {
    var data = await db.collection("logs").aggregate()
    .match({
        is_delete:false,
        time:_.gte(preMonthStamp)
    })
    .group({
        _id: '$_openid',
        countByMonth:$.sum(1),
        countByDay:$.sum($.cond({
            if: $.gt(['$time',preDayStamp]),
            then:1,
            else:0
        })),
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
            countByMonth:-1
        })
        .end()
    var res = data.list.map((item)=>{
        return {
            _openid:item._id,
            name:item.name[0].name,
            countByMonth:item.countByMonth,
            countByDay:item.countByDay,
            stars:item.stars
        }
    })
    return res
}