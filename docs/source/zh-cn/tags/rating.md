---
title: Rating
type: tags
order: 420
meta_title: 用于评分的 Rating 标签
meta_description: 使用 Rating 标签自定义 Label Studio，在机器学习和数据科学项目中为任务添加评分。
---

`Rating` 标签为标注界面添加评分选择。适用于涉及评分的标注任务。

与以下数据类型配合使用：audio（音频）、image（图像）、HTML、paragraphs（段落）、text（文本）、time series（时间序列）、video（视频）。

{% insertmd zh-cn/includes/tags/rating.md %}

### 示例

用于为一段文本内容评分的基础标注配置

```html
<View>
  <Text name="txt" value="$text" />
  <Rating name="rating" toName="txt" maxRating="10" icon="star" size="medium" />
</View>
```
