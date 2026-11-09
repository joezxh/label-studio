---
title: 网站评分
type: templates
category: Ranking and Scoring
cat: ranking-and-scoring
order: 410
meta_title: 网站评分数据标注模板
meta_description: 使用 Label Studio 对网站内容进行评分的模板，适用于你的机器学习和数据科学项目。
---

当你想要评估网站的质量，或评估网站的可信度并对其内容进行分类时，可以使用本模板。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <HyperText name="website" value="$website" inline="true"/>

  <Header value="Rate this website"/>
  <Rating name="rating" toName="website" maxRating="10" icon="star" size="medium" />

  <Choices name="choices" choice="single-radio" toName="website" showInline="true">
    <Choice value="Important article"/>
    <Choice value="Yellow press"/>
  </Choices>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

[HyperText](/tags/hypertext.html) 对象标签指定了待标注网站的位置，并指定在标注界面上以内联方式显示它：
```xml
<HyperText name="website" value="$website" inline="true"/>
```

你可以添加一个 [header](/tags/header.html) 来为标注人员提供说明：
```xml
<Header value="Rate this website"/>
```

[Rating](/tags/rating.html) 控制标签为标注人员提供一个满分 10 星的星级评分，用于为网站内容评分：
```xml
<Rating name="rating" toName="website" maxRating="10" icon="star" size="medium" />
```

[Choices](/tags/choices.html) 控制标签也让标注人员能够对网站内容进行分类：
```xml
  <Choices name="choices" choice="single-radio" toName="website" showInline="true">
    <Choice value="Important article"/>
    <Choice value="Yellow press"/>
  </Choices>
```

## 输入数据

有两种方式来组织使用本模板的输入数据：
- 使用 HTML 文件
- 在 JSON 格式文件中使用网站的链接

### 使用 HTML 文件
**推荐此方法。** 将你想要评分的网站内容另存为 HTML 文件，并导入到 Label Studio 中。

如果使用此方法，请将 HyperText 标签的 `inline` 参数改为 `false`。

### 使用网站的链接
此方法看似更简单，但由于出现在 HTML iframe 中的网站存在 CORS（跨域资源共享）限制，它仅适用于与你的 Label Studio 实例托管在同一域名下的网站。例如，如果你想评分托管在组织域名下的网站，且 Label Studio 也托管在同一域名下，那么你可能可以使用此选项。在大多数情况下，CORS 限制会导致网站无法显示。

如果此选项适用于你，可以使用以下示例 JSON：
一个任务可以格式化为如下形式：
```json
{
    "website": "<iframe src='https://heartex.com' width='100%' height='600px'/>"
}
```

或多个任务，如下所示：
```json
[
   {
      "data":{
         "website": "<iframe src='https://heartex.com' width='100%' height='600px'/>"
      }
   },
   {
      "data":{
         "website": "<iframe src='https://example.com' width='100%' height='600px'/>"
      }
   },
   {
      "data":{
         "website": "<iframe src='https://labelstud.io' width='100%' height='600px'/>"
      }
   }
]


```

## 相关标签
- [HyperText](/tags/hypertext.html)
- [Rating](/tags/rating.html)
- [Choices](/tags/choices.html)

## 相关模板
- [HTML 分类](html_classification.html)
