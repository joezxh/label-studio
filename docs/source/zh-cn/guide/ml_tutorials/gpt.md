---
title: Chatbot response generation with HuggingFace's GPT2 model
type: guide
hide_menu: true
tier: all
order: 50
meta_title: Chatbot response generation with HuggingFace's GPT2 model
meta_description: Label Studio tutorial for Chatbot response generation with HuggingFace's GPT2 model
section: "Machine learning"
parent: "ml_tutorials"
parent_enterprise: "ml_tutorials"
parent_page_extension: "html"
---

如果你想构建一个新的聊天机器人，或者只是想试验基于 GPT 的文本生成器，那么这个 [机器学习后端](/guide/ml.html) 示例适合你！它由 [HuggingFace 的 Transformers 库](https://github.com/huggingface/transformers) 提供支持，将类 GPT2 的语言模型连接到 Label Studio UI，让你可以基于聊天记录探索不同的文本响应。

按照本安装指南操作，然后玩转结果。通过编辑、删除或添加新短语，生成你的下一个超级强大的聊天机器人数据集！

<div style="margin:auto; text-align:center; width:100%"><img src="/images/ml-backend-chatbot.png" style="opacity: 0.7"/></div>

## 开始使用

1. 安装 ML 后端：
    ```bash
    pip install -r label_studio_ml/examples/huggingface/requirements.txt
    label-studio-ml init my-ml-backend --from label_studio_ml/examples/huggingface/gpt.py
    label-studio-ml start my-ml-backend
    ```

2. 启动 Label Studio 并创建一个新项目。
   
3. 在项目 **Settings（设置）** 中，设置 **Labeling Interface（标注界面）**。
   
4. 选择 **Browse Templates（浏览模板）** 并选择 Conversational AI **Response Generation（响应生成）** 模板。

5. 打开 **Machine Learning（机器学习）** 设置并点击 **Add Model（添加模型）**。

6. 添加 URL `http://localhost:9090` 并将该模型保存为 ML 后端。

你可以以 [`<Paragraphs>` 对象标签](/tags/paragraphs.html) 的输入格式导入你的聊天对话，或者使用示例任务导入只是为了试一试。

导入数据后，你会看到带有生成答案的文本框。

## 调整参数

你可以在启动 ML 后端时控制一些模型参数：

例如，你可以指定要使用的模型以及模型返回的响应数量：
```bash
label-studio-ml start my-ml-backend --with \
model=microsoft/DialoGPT-small \
num_responses=5
```

#### model
来自 [HuggingFace 模型中心](https://huggingface.co/models?filter=gpt2) 的模型名称

#### num_responses
生成的响应数量
