# 数据库

### logs表

| 字段 |     _id      | _openid          | content  | fileIDs              | time     |
| ---- | :----------: | ---------------- | -------- | -------------------- | -------- |
| 说明 | 区别一条记录 | 用户的唯一身份码 | 日志内容 | 附件在云存储中的链接 | 日志时间 |
| 类型 |     str      | str              | str      | array，元素为str     | num      |
| 备注 |   自动生成   |                  |          |                      | 时间戳   |

| is_delete        |ifread      |ifstar      | create_time | is_public |      |
| ---------------- | ---- | ---- | ---- | ---- | ---- |
| 是否删除         |是否已读      |是否有星      | 提交日志的时间 | 是否公开 |      |
| boolean          |boolean      |boolean      | number | boolean |      |
| 1表示删除，0反之 | 1表示已读，0反之| 1表示有星，0反之 | 时间戳 | true表示公开，false反之 |      |

### comment表
| 字段 |     _id      | _openid          | content  |target              | time          |origin|
| ---- | :----------: | ---------------- | -------- | -------------------- | ------------- |------|
| 说明 | 区别一条记录 | 用户的唯一身份码 | 评论内容 | 回复的哪条评论 | 评论时间      |哪条日志下的评论|
| 类型 |     str      | str              | str      | str     | date         |str|
| 备注 |   自动生成   |                  |          |                      | 例如“8月23日” |      |

### mine表

第一次授权登录时，如果mine表里没有用户的openid，就写入。

| 字段 | _id | _openid  |  name  | avator                   |is_admin      |
| ---- | ---- | -------- | :----: | ------------------------ | ------------ |
| 说明 | 不解释了 | 不解释了 |  名字  | 头像                     |是不是管理员    |
| 类型 |      |          |  str   | str                      |boolean      |
| 备注 |      |          | 第一次获取微信名 | 头像的链接 |1表示已读，0反之      |



# 模板

在wxml里面引用:
```html
<view class="bottom_bar" style="height: {{safeArea}}px;">
    <view class="bottom_menu">
        <view class="bottom_menu_value"><image class="bottom_menu_img" mode="widthFix" src="../../images/comment.png"></image></view>
        <view class="bottom_menu_value"><image class="bottom_menu_img" mode="widthFix" src="../../images/good.png"></image></view>
        <view class="bottom_menu_value"><image class="bottom_menu_img" mode="widthFix" src="../../images/share.png"></image></view>
    </view>
</view>
```

加到当前页面js的data里面:

```javascript
safeArea: (app.globalData.screenHeight-app.globalData.safeBottom+44)
```
# 从缓存中获取用户的openid
`wx.getStorageSync('openid')`

# 卡片组件

github地址：https://github.com/katherine0325/wx-cards

使用方法详情请见/components/wx-cards-master/README.md

另外，leyoubaloy修改源码文件，在card中增加了`isImg`属性，表示是否显示图片