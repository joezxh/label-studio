---
title: NER labeling with Flair 
type: guide
tier: all
order: 75
hide_menu: true
hide_frontmatter_title: true
meta_title: Use Flair with Label Studio
meta_description: Tutorial on how to use Label Studio and Flair for faster NER labeling 
categories:
    - Natural Language Processing
    - Named Entity Recognition
    - Flair
image: "/guide/ml_tutorials/flair.png"
---

# Flair NER 示例

此示例演示了如何将 Flair NER 模型与 Label Studio 一起使用。

## 开始之前

在开始之前，你必须安装 [Label Studio ML 后端](https://github.com/HumanSignal/label-studio-ml-backend?tab=readme-ov-file#quickstart)。

本教程使用 [`flair` 示例](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/flair)。

## 快速开始

1. 在 `http://localhost:9090` 上构建并启动机器学习后端

```bash
docker-compose up
```

2. 验证后端是否正在运行

```bash
$ curl http://localhost:9090/health
{"status":"UP"}
```

3. 在 Label Studio 中创建一个项目。然后从项目设置的 **Model（模型）** 页面，[连接模型](https://labelstud.io/guide/ml#Connect-the-model-to-Label-Studio)。默认 URL 为 `http://localhost:9090`。

## 标注配置

```xml
<View>
  <Labels name="label" toName="text">
    <Label value="PER" background="red"/>
    <Label value="ORG" background="darkorange"/>
    <Label value="LOC" background="orange"/>
    <Label value="MISC" background="green"/>
  </Labels>

  <Text name="text" value="$text"/>
</View>
```

## 参数

- `FLAIR_MODEL_NAME`：要使用的 Flair 模型名称。默认值为 `ner`。请参阅 [此处](https://flairnlp.github.io/docs/tutorial-basics/tagging-entities#list-of-ner-models) 的所有选项。
