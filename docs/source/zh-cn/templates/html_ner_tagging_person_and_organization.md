---
title: HTML 命名实体识别标注
type: templates
category: Community Contributions
cat: community
order: 1001
meta_title: HTML 命名实体识别标注数据标注模板
meta_description: 用于使用 Label Studio 进行 HTML 命名实体识别标注的模板
community: true
community_author: luarmr
community_contributors: bmartel
community_repo: awesome-label-studio-config
github_repo: humanSignal/awesome-label-studio-config
report_bug_url: https://github.com/humanSignal/awesome-label-studio-config/issues/new?template=bug_report.yml&config-name=html-ner-tagging-person-and-organization&title=Bug%20in%20html-ner-tagging-person-and-organization&body=I%20found%20a%20bug%20in%20the%20html-ner-tagging-person-and-organization%20template.%0A%0A%23%23%20Steps%20to%20Reproduce%0A1.%20...%0A2.%20...%0A%0A%23%23%20Expected%20Behavior%0A...%0A%0A%23%23%20Actual%20Behavior%0A...%0A%0A%23%23%20Environment%0A-%20Label%20Studio%20Version:...%0A-%20Browser%20(if%20applicable):...%0A-%20Operating%20System:...%0A%0A%23%23%20Additional%20Context%0A...%0A
repo_url: https://github.com/HumanSignal/awesome-label-studio-config/tree/main/label-configs/html-ner-tagging-person-and-organization
---


<img src="/images/templates/html-ner-tagging-person-and-organization.jpg" alt="" class="gif-border" width="552px" height="408px" />

此标注配置使用 HyperText 元素对 HTML 内容执行命名实体识别。它会在带样式的 HTML 文本中高亮已识别的实体（人物、组织）。

## 标注配置

```html
<View>
  <HyperTextLabels name="ner" toName="text">
    <Label value="Person" background="green"/>
    <Label value="Organization" background="blue"/>
  </HyperTextLabels>

  <View style="border: 1px solid #CCC;
               border-radius: 10px;
               padding: 5px">
    <HyperText name="text" value="$text"/> 
              </View>
</View>

```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

此配置使用了以下标签：

- [HyperText](/tags/hypertext.html)
- [HyperTextLabels](/tags/hypertextlabels.html)
- [Label](/tags/label.html)
- [View](/tags/view.html)

## 使用说明

- **HyperText**：此配置使用 HyperText 工具来显示和标注 HTML。
- **Labels**：当前包含 "Person"（绿色）和 "Organization"（蓝色）。
