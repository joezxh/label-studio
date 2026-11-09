---
title: 使用 Plotly 进行数据可视化
type: plugins
category: Visualization
cat: visualization
order: 200
meta_title: 使用 Plotly 进行数据可视化
meta_description: 向标注人员显示 Plotly 图表
tier: enterprise
---

<img src="/images/plugins/plotly-thumb.png" alt="" class="gif-border" style="max-width: 552px !important;" />

!!! note
     有关修改此插件或创建自定义插件的信息，请参阅 [自定义并构建你自己的插件](custom)。

     有关常规插件信息，请参阅 [项目插件](/guide/plugins) 和 [插件常见问题](faq)。

## 关于

使用 [Plotly](https://plotly.com/) 将图表和图形插入到你的标注界面中。图表会在用户打开的每一个标注中渲染。

![Label Studio 中的 Plotly 图表截图](/images/plugins/plotly.png)

## 插件

!!! note
    Plotly 应首先从 CDN 加载：https://cdn.plot.ly/plotly-2.26.0.min.js。出于安全原因，最好使用哈希进行脚本完整性校验。

```javascript
await LSI.import('https://cdn.plot.ly/plotly-2.26.0.min.js', 'sha384-xuh4dD2xC9BZ4qOrUrLt8psbgevXF2v+K+FrXxV4MlJHnWKgnaKoh74vd/6Ik8uF',);

let data = LSI.task.data;
if (window.Plotly && data) {
  Plotly.newPlot("plot", [data.plotly]);
}
```

**相关的 LSI 实例方法：**

* [import(url, integrity)](custom#LSI-import-url-integrity)


## 标注配置

你需要将 `<View idAttr="plot"/>` 添加到你的配置中，以渲染 Plotly 图表。

例如：

```xml
<View>
  <Text name="function" value="Is it increasing?" />
  <Choices name="slope" toName="function">
    <Choice value="Increasing" />
    <Choice value="Decreasing" />
    <Choice value="Non-monotonic" />
  </Choices>
  <View idAttr="plot"/>
</View>
```

**相关标签：**

* [View](/tags/view.html)
* [Text](/tags/text.html)
* [Choices](/tags/choices.html)

## 示例数据

```json
[
  {
    "plotly": {
      "x": [1, 2, 3, 4],
      "y": [10, 15, 13, 17],
      "type": "scatter"
    }
  },
  {
    "plotly": {
      "x": [1, 2, 3, 4],
      "y": [16, 5, 11, 9],
      "type": "scatter"
    }
  }
]
```
