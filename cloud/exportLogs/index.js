// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const logs = cloud.database().collection('logs')
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    // 匹配条件
    const matchInfo = {
        _openid: wxContext.OPENID,
        is_delete: false,
    }
    // 日志数量和分页数量
    const countLogs = await logs.where(matchInfo).count()
    const total = countLogs.total
    const MAX_LIMIT = 100
    const total_times = Math.ceil(total / MAX_LIMIT)
    // 分页查询
    var logs_lst = []
    var task = []
    for (let i = 0; i < total_times; i++) {
        const p = logs.aggregate().match(matchInfo).sort({
                // time: -1,
                create_time: -1
            })
            .skip(i * MAX_LIMIT).limit(MAX_LIMIT)
            .lookup({
                from: "mine",
                localField: "_openid",
                foreignField: "_openid",
                as: "mine_info"
            })
            .lookup({
                from: "comment",
                localField: "_id",
                foreignField: "orign",
                as: "comment"
            })
            .end()
            .then(res => {
                // console.log("loglst", logs_lst)
                logs_lst = logs_lst.concat(res.list)
            })
        task.push(p)
    }
    await Promise.all(task)
    var fileid = ""
    await new Promise((resolve) => {
        var jsonStr = JSON.stringify(logs_lst)
        // console.log("查到的日志", jsonStr)
        let buffer = new Buffer(jsonStr, "utf-8");
        //上传文件
        cloud.uploadFile({
            cloudPath: wxContext.OPENID+'.json',
            filePath: '',
            fileContent: buffer,
        }).then(res => {
            fileid = res.fileID
            resolve()
        }).catch(err => {
            console.log("err",err)
        })
    })
    

    return {
        fileID: fileid,
        openid: wxContext.OPENID,
        logs: logs_lst,
        total: total,
    }


}