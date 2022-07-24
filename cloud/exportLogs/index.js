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
    const countLogs = logs.where(matchInfo).count()
    const total = countLogs.total
    const MAX_LIMIT = 20
    const total_times = Math.ceil(total / MAX_LIMIT)
    // 分页查询
    var logs_lst = []
    let p = new Promise((resolve) => {
        for (let i = 0; i < total_times; i++) {
            logs.aggregate().sort({
                    // time: -1,
                    create_time: -1
                }).lookup({
                    from: "mine",
                    localField: "_openid",
                    foreignField: "_openid",
                    as: "mine_info"
                }).match(matchInfo)
                .skip(i * MAX_LIMIT).limit(MAX_LIMIT)
                .end()
                .then(res => {
                    console.log("loglst", logs_lst)
                    logs_lst = logs_lst.concat(res.list)
                })
        }
        resolve(logs_lst)
    })
    p.then((logs_lst) => {
        var jsonStr = JSON.stringify(logs_lst)
        let buffer = new Buffer(jsonStr, "utf-8");
        //上传文件
        const upload = await cloud.uploadFile({
            cloudPath: 'testTxt.txt',
            fileContent: buffer,
        })


    })

    return {
        upload,
        openid: wxContext.OPENID,
        logs: res,
        total: total,
    }


}