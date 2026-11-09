---
title: 发票的 NER 标注（BIO 格式）
type: templates
category: Community Contributions
cat: community
order: 1002
meta_title: 发票 NER 标注（BIO 格式）数据标注模板
meta_description: 用于使用 Label Studio 进行发票 NER 标注（BIO 格式）的模板
community: true
community_author: redeipirati
community_contributors: carly-bartel
community_repo: awesome-label-studio-config
github_repo: humanSignal/awesome-label-studio-config
report_bug_url: https://github.com/humanSignal/awesome-label-studio-config/issues/new?template=bug_report.yml&config-name=ner-tagging-invoices-bio-format&title=Bug%20in%20ner-tagging-invoices-bio-format&body=I%20found%20a%20bug%20in%20the%20ner-tagging-invoices-bio-format%20template.%0A%0A%23%23%20Steps%20to%20Reproduce%0A1.%20...%0A2.%20...%0A%0A%23%23%20Expected%20Behavior%0A...%0A%0A%23%23%20Actual%20Behavior%0A...%0A%0A%23%23%20Environment%0A-%20Label%20Studio%20Version:...%0A-%20Browser%20(if%20applicable):...%0A-%20Operating%20System:...%0A%0A%23%23%20Additional%20Context%0A...%0A
repo_url: https://github.com/HumanSignal/awesome-label-studio-config/tree/main/label-configs/ner-tagging-invoices-bio-format
---


<img src="/images/templates/ner-tagging-invoices-bio-format.jpg" alt="" class="gif-border" width="552px" height="408px" />

本标注配置使用 BIO（Beginning，开始；Inside，内部；Outside，外部）格式对发票文档执行命名实体识别（NER）。它将 OCR 文本识别与针对关键发票要素的实体标注结合在一起。

## 标注配置

```html
<View style="display: flex; align-items: flex-start; gap: 1em;">
  <!-- Left panel: labels + filter -->
  <View style="min-width: 250px; padding: 0.5em; background: #f7f7f7; border-radius: 4px;">
    <Header value="NER Tags" />
    <Labels name="ner" toName="text" showInline="false">
      <Label value="B-NIF"    background="#FF5733" />
      <Label value="B-FORN"   background="#33FF57" />
      <Label value="B-DATA"   background="#3375FF" />
      <Label value="B-VALOR"  background="#FF33A1" />
      <Label value="B-NUMFAT" background="#F3FF33" />
      <Label value="I-NIF"    background="#FF5733" />
      <Label value="I-FORN"   background="#33FF57" />
      <Label value="I-DATA"   background="#3375FF" />
      <Label value="I-VALOR"  background="#FF33A1" />
      <Label value="I-NUMFAT" background="#F3FF33" />
      <Label value="O"        background="#aaa"    />
    </Labels>
  </View>

  <!-- Right panel: text to annotate -->
  <View style="flex: 1; max-height: 80vh; overflow-y: auto;">
    <Text
      name="text"
      value="$ocr"
      granularity="word"
    />
  </View>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

本配置使用了以下标签：

- [Image](/tags/image.html)
- [TextArea](/tags/textarea.html)
- [Labels](/tags/labels.html)
- [View](/tags/view.html)

## 使用说明

- **Text（文本）**： 显示来自发票的已识别文本。
- **BIO 格式标签**：
  - B- 前缀：实体的开始
  - I- 前缀：实体的内部/延续
  - O：外部/不属于任何实体
- **实体类型**：
  - NIF：税务识别号
  - FORN：供应商信息
  - DATA：日期信息
  - VALOR：金额/数值
  - NUMFAT：发票编号
