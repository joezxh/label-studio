---
title: 配置标注界面
type: guide
tier: all
order: 107
order_enterprise: 107
meta_title: 设置标注配置界面
meta_description: 使用模板或自定义标签组合，为你的机器学习和数据科学项目定制数据标注与注释界面。
section: "创建与管理项目"
---

Label Studio 中的所有标注活动都是在项目的上下文中进行的。在[创建项目](setup_project.html#Create-a-project) 并[导入数据](tasks.html) 之后，为你的项目设置标注界面和标注配置。此设置过程对你的标注项目至关重要。

!!! error Enterprise
    你的项目是否需要完全自定义的界面？
    Label Studio 企业版的 UI 引擎可用于为 AI 和智能体创建可编程且可嵌入的界面。[了解更多](https://humansignal.com/programmable-ui/)。

## 为你的项目设置标注界面

使用 Label Studio 内置的模板，或定义你自己的标签组合，为标注人员配置标签和任务类型，从而设置项目的标注界面。

1. 从[可用模板](/templates) 中选择一个模板或对其进行自定义。
2. Label Studio 会根据你的数据自动选择要标注的字段。如果需要，请修改所选字段。
3. 在新行上添加标签名称。
4. （可选）点击标签名称并使用颜色选择器为其选择新颜色，以更改标签的颜色。
5. 配置与标注界面功能相关的其他设置。例如，在标注文本时，你可能可以选择 **Select text by words（按词选择文本）**。
6. 点击 **Save（保存）**。

<div class="opensource-only">

!!! error enterprise
    Label Studio 企业版提供了将插件作为标注界面一部分的选项。插件允许你使用 Javascript 扩展界面并自定义标注人员的工作流。有关更多信息，请参阅 [Plugins](https://docs.humansignal.com/guide/plugins)。

</div>

<div class="enterprise-only">

!!! info Tip
    你也可以将插件作为标注界面的一部分来实现。插件允许你使用 Javascript 扩展界面并自定义标注人员的工作流。有关更多信息，请参阅 [Plugins](plugins)。

</div>

### 修改标注界面

你可以在项目设置中更改标注界面和配置。

!!! note
    如果你正在修改一个已有进行中工作的项目，请注意以下事项：

    * 你无法删除标签或更改正在执行的标注类型，除非你删除了使用这些标签的任何现有标注。
    * 如果你对标注配置进行更改，你在数据管理器中创建的任何标签页都会被移除。

1. 在 Label Studio 中，打开你要修改的项目。
2. 点击 **Settings（设置）**。
3. 点击 **Labeling Interface（标注界面）**。
4. 浏览模板、更新可用标签，或使用 `Code（代码）` 选项通过[标签](/tags) 进一步自定义界面。

#### 代码视图自动补全

代码视图有一个在你输入时会出现的自动补全助手。

自动补全包含对标签以及所选标签可用参数的提示：

![代码自动补全的动画 gif](/images/label/autocomplete.gif)

在你输入左尖括号 `<` 之后会出现标签建议。在标签内添加一个空格之后会出现参数建议。

要接受建议，你可以点击选中它，或在建议高亮时按 Tab 键。

## 自定义模板

你可以自定义[标注配置模板](/templates)，或者使用通过[标签](/tags) 从头创建的自定义配置。如果你创建的自定义配置可能对其他 Label Studio 用户有用，请考虑[将该配置作为模板贡献出来](https://github.com/HumanSignal/label-studio/tree/develop/label_studio/annotation_templates)。

项目的标注配置是一个 XML 文件，其中包含三种 Label Studio 特有的标签类型。

| 标签类型 | 使用场景 |
| -------- | -------------------------------------------------------------------------------------- |
| Object（对象） | 指定数据集中的数据类型和输入数据源。 |
| Control（控件） | 配置要执行的标注类型以及标注结果的展示方式。 |
| Visual（视觉） | 定义用于标注的用户界面外观。 |

你可以组合这些标签来为你的数据集创建自定义标签配置。

<a class="button" href="/tags">查看所有可用标签</a>

### 标注配置示例

例如，要将数据中以 URL 引用的图像（`$image_url`）分类为 Cat 或 Dog 两个类别之一，请使用以下示例标注配置：

```xml
<View>
  <Image name="image_object" value="$image_url"/>
  <Choices name="image_classes" toName="image_object">
    <Choice value="Cat"/>
    <Choice value="Dog"/>
  </Choices>
</View>
```

此标注配置引用了 [Image](/tags/image.html) 对象标签中的图像资源，并指定了在 [Choices](/tags/choices.html) 控件标签中可供选择的标签。

如果你想自定义此示例，例如允许标注人员为单张图像同时选择 Cat 和 Dog 标签，请修改与 [Choices](/tags/choices.html) 控件标签一起使用的参数：

```xml
<View>
  <Image name="image_object" value="$image_url"/>
  <Choices name="image_classes" toName="image_object" choice="multiple">
    <Choice value="Cat"/>
    <Choice value="Dog"/>
  </Choices>
</View>
```

<div class="opensource-only">

### 从命令行添加标注配置

你可以在 `config.xml` 文件中定义标注配置，并使用该文件在 Label Studio 中初始化特定项目。

```bash
label-studio my_new_project start --label-config config.xml
```

</div>

### 使用 API 添加标注配置

你可以使用服务端 API 配置你的标注配置。有关更多详细信息，请参阅[后端 API](api.html) 文档。
