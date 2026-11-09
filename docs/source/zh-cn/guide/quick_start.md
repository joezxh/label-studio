---
title: 快速开始
short: 快速开始
tier: opensource
type: guide
order: 50
order_enterprise: 0
meta_title: Label Studio 快速开始指南
meta_description: 安装 Label Studio 并创建新项目的快速开始指南。
section: "安装与配置"
date: 2023-11-27 13:34:32
---

1. 安装 Label Studio：
```bash
pip install label-studio
```

2. 启动 Label Studio
```bash
label-studio start
```

1. 在浏览器中打开 `http://localhost:8080`。
2. 使用你创建的电子邮件地址和密码注册账户。
3. 点击 **Create（创建）** 创建一个项目并开始标注数据。
4. 为项目命名，并可选地填写描述并选择一种颜色。
5. 点击 **Data Import（数据导入）** 并上传你要使用的数据文件。如果你想使用本地目录、云存储桶或数据库中的数据，请暂时跳过此步骤。
6. 点击 **Labeling Setup（标注设置）** 并选择一个模板，根据你的使用场景自定义标签名称。
7. 点击 **Save（保存）** 保存你的项目。

你现在可以开始[标注和注释你的数据](/guide/labeling)了！

!!! info 提示
    如需包含演示数据的快速入门教程，请参阅 [Zero to One：Label Studio 入门](https://labelstud.io/blog/zero-to-one-getting-started-with-label-studio/)。
