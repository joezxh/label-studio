---
title: spaCy models for NER 
type: guide
tier: all
order: 70
hide_menu: true
hide_frontmatter_title: true
meta_title: Use spaCy models with Label Studio
meta_description: Tutorial on how to use Label Studio and spaCy for faster NER and POS labeling 
categories:
    - Natural Language Processing
    - Named Entity Recognition
    - SpaCy
image: "/guide/ml_tutorials/spacy.png"
---

此 ML 后端提供了一种使用 [spaCy](https://spacy.io/) 模型进行命名实体识别（NER）和词性（POS）标注的简单方法。

当前的实现包含以下模型：
- 命名实体识别（NER）
- [即将推出……] 词性（POS）标注

## 开始之前

在开始之前，你必须安装 [Label Studio ML 后端](https://github.com/HumanSignal/label-studio-ml-backend?tab=readme-ov-file#quickstart)。

本教程使用 [`spacy` 示例](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/spacy)。

## 快速开始

1. 在 `http://localhost:9090` 上构建并启动 ML 后端

```bash
docker-compose up
```

2. 验证后端是否正在运行

```bash
$ curl http://localhost:9090/health
{"status":"UP"}
```

3. 在 Label Studio 中创建一个项目。然后从项目设置的 **模型（Model）** 页面，[连接模型](https://labelstud.io/guide/ml#Connect-the-model-to-Label-Studio)。默认 URL 为 `http://localhost:9090`。

## 用法

### 标注配置

此模型与以下标注配置兼容：
```xml
<View>
    <Labels name="label" toName="text">
        <Label value="CARDINAL" background="#FFA39E"/>
        <Label value="DATE" background="#D4380D"/>
        <Label value="EVENT" background="#FFC069"/>
        <Label value="FAC" background="#AD8B00"/>
        <Label value="GPE" background="#D3F261"/>
        <Label value="LANGUAGE" background="#389E0D"/>
        <Label value="LAW" background="#5CDBD3"/>
        <Label value="LOC" background="#096DD9"/>
        <Label value="ORG" background="#ADC6FF"/>
        <Label value="PERSON" background="#9254DE"/>
        <Label value="TIME" background="#F759AB"/>
    </Labels>
    <Text name="text" value="$text"/>
</View>
```

你也可以使用 Label Studio 提供的 [命名实体识别模板](https://labelstud.io/templates/named_entity) 中的默认配置。

> 注意：如果你的标签与默认标签不同，文本跨度仍会高亮显示，但你必须手动将标签映射到你在模型中的标签。转到 `model.py` 并更改 `_custom_labels_mapping` 以从 SpaCy 实体映射到你的标签。在官方 SpaCy 文档中查看预定义的标签，例如 [en_core_web_sm](https://spacy.io/models/en#en_core_web_sm)。

## 参数
要更改默认参数，请指定以下环境变量：

- `PORT` - 服务器运行的端口，默认为 `9090`
- `WORKERS` - 运行服务器的 worker 数量，默认为 `2`
- `SPACY_MODEL` - 要使用的 spaCy 模型，默认为 `en_core_web_sm`
