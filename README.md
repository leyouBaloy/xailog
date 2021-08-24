# 数据库

### logs表

| 字段 |     _id      | _openid          | content  | fileIDs              | time     |
| ---- | :----------: | ---------------- | -------- | -------------------- | -------- |
| 说明 | 区别一条记录 | 用户的唯一身份码 | 日志内容 | 附件在云存储中的链接 | 日志时间 |
| 类型 |     str      | str              | str      | array，元素为str     | num      |
| 备注 |   自动生成   |                  |          |                      | 时间戳   |

| is_delete        |ifread      |ifstar      |      |      |      |
| ---------------- | ---- | ---- | ---- | ---- | ---- |
| 是否删除         |是否已读      |是否有星      |      |      |      |
| boolean          |boolean      |boolean      |      |      |      |
| 1表示删除，0反之 | 1表示删除，0反之| 1表示删除，0反之|      |      |      |

### comment表
| 字段 |     _id      | _openid          | content  |target              | time          |origin|
| ---- | :----------: | ---------------- | -------- | -------------------- | ------------- |------|
| 说明 | 区别一条记录 | 用户的唯一身份码 | 评论内容 | 回复的哪条评论 | 评论时间      |哪条日志下的评论|
| 类型 |     str      | str              | str      | str     | date         |str|
| 备注 |   自动生成   |                  |          |                      | 例如“8月23日” |      |

### mine表



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

效果：

![./readmeimgs/1.png](C:\Users\华为\Desktop\XAIlog\1.png)