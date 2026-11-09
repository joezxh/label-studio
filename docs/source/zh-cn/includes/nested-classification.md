## 使用嵌套选项增强分类模板

你可以向任何分类模板添加条件式或嵌套式选项。如果你希望在某些条件满足时才显示分类选项（例如标注员选中了特定选项），可以借鉴这些条件式和嵌套式分类示例。

### 条件式分类

你可以使用 [View](/tags/view.html) 和 [Choices](/tags/choices.html) 标签提供的条件参数来创建条件式分类任务。在此示例中，你可以根据第一个文本样本的选项选择情况，显示额外的文本样本和分类任务。

首先为你要分类的数据类型添加一个对象标签。此示例使用 [Text](/tags/text.html) 对象标签作为文本分类示例，但你可以将其改造用于图像或音频分类任务：
```xml
<Text name="text1" value="$text1" />
```
使用 [Choices](/tags/choices.html) 控制标签来显示分类选项。`name` 参数标识这些选项的用途，`toName` 参数引用这些选项所适用的文本样本。
```xml
<Choices name="sentiment" toName="text1" showInline="true">
    <Choice value="Positive" />
    <Choice value="Negative" />
    <Choice value="Neutral" />
</Choices>
```
创建一个条件式 [View](/tags/view.html) 标签，它仅在选中某个选项时显示——`visibleWhen="choice-selected"`，并且具体当该选项作为 `name` 参数为 `sentiment` 的 Choices 标签的一部分被选中，且所选选项为 `Positive`（`whenChoiceValue="Positive"`）时显示。你必须将 `whenTagName` 与 `whenChoiceValue` 配合使用。
```xml
<View visibleWhen="choice-selected"
      whenTagName="sentiment" whenChoiceValue="Positive">
    <Header value="What about this text?" />
    <Text name="text2" value="$text2" />
</View>
```
在此示例中，view 标签包裹了第二个文本样本，并带有一个向标注员提供说明的 [header](/tags/header.html)。

第二个 [Choices](/tags/choices.html) 控制标签显示专门适用于第二段文本的分类选项，通过 `toName="text2"` 指定。这些选项与标题和文本样本具有相同的条件设置，即通过 `visibleWhen="choice-selected"`、`whenTagName="sentiment"` 和 `whenChoiceValue="Positive"` 指定。
```xml
<Choices name="sentiment2" toName="text2"
         choice="single" showInline="true"
         visibleWhen="choice-selected"
         whenTagName="sentiment"
         whenChoiceValue="Positive">
    <Choice value="Positive" />
    <Choice value="Negative" />
    <Choice value="Neutral" />
</Choices>
```

### 两级嵌套分类

你也可以在任务中无需第二组数据的情况下进行条件式分类。在这种情况下，你创建两组 [Choices](/tags/choices.html) 控制标签，第二组选项依赖于第一组。例如，一个分类任务，你想为标注员选中的特定选项收集额外详情。

首先为你要分类的数据类型添加一个对象标签。此示例使用 [Image](/tags/image.html) 对象标签作为图像分类示例，但你可以将其改造用于文本或音频分类任务：
```xml
<Image name="image" value="$image"/>
```

使用 [Choices](/tags/choices.html) 控制标签来显示分类选项。`name` 参数标识这些选项的用途，`toName` 参数引用这些选项所适用的数据。
```xml
<Choices name="content" toName="image">
    <Choice value="Adult content"/>
    <Choice value="Weapons" />
    <Choice value="Violence" />
</Choices>
```

在配置中添加第二个 [Choices](/tags/choices.html) 控制标签，以显示与分类任务相关的其他属性。在此示例中，当从先前的分类选项中选中任意选项时，这些选项会出现，由 `visibleWhen="choice-selected"` 和 `whenTagName="content"` 参数值指定。
```xml
<Choices name="other-props" toName="image"
         choice="single" showInline="true"
         visibleWhen="choice-selected"
         whenTagName="content">
    <Header value="Are there people or animals?" />
    <Choice value="Yes" />
    <Choice value="No" />
</Choices>
```

### 三级嵌套分类

你可以将分类选项嵌套到两级以上。在这种情况下，你可以创建三组 [Choices](/tags/choices.html) 控制标签。第二组选项依赖于第一组中的任意选项被选中，第三组选项依赖于第二组中某个特定选项被选中。你可以组合此处描述的参数选项，创建比此示例更复杂或更简单的嵌套式与条件式分类任务。

首先为你要分类的数据类型添加一个对象标签。此示例使用 [Audio](/tags/audio.html) 对象标签作为音频分类示例，但你可以将其改造用于文本或图像分类任务：
```xml
<Audio name="audio" value="$audio" />
```

使用 [Choices](/tags/choices.html) 控制标签来显示分类选项。`name` 参数标识这些选项的用途，`toName` 参数引用这些选项所适用的数据。
```xml
<Choices name="intent" toName="audio" showInline="true">
    <Choice value="Positive" />
    <Choice value="Negative" />
    <Choice value="Neutral" />
</Choices>
```

在配置中添加第二个 [Choices](/tags/choices.html) 控制标签，以显示与分类任务相关的其他属性。在此示例中，当从先前的分类选项中选中任意选项时，这些选项会出现，由 `visibleWhen="choice-selected"` 和 `whenTagName="intent"` 参数值指定。
```xml
<Choices name="other-props" toName="audio"
         choice="single" showInline="true"
         visibleWhen="choice-selected"
         whenTagName="intent">
    <Header value="Other properties of the audio clip" />
    <Choice value="Noisy" />
    <Choice value="Clear" />
</Choices>
```

添加第三个 [Choices](/tags/choices.html) 控制标签，提示标注员为某个特定选项添加额外详情。在此示例中，当标注员从上一组选项中选中 **Noisy** 时，这些选项会出现，由 `whenChoiceValue="Noisy"` 参数指定。`whenChoiceValue` 参数必须与 `whenTagName` 参数配合使用，在此示例中引用带有 `Noisy` 选项的 `Choices` 的 `name` 参数，即 `whenTagName="other-props"`。`visibleWhen="choice-selected"` 参数控制这些选项的可见性。
```xml
<Choices name="emotion" toName="text"
         choice="single" showInline="true"
         visibleWhen="choice-selected"
         whenTagName="other-props"
         whenChoiceValue="Noisy">
    <Header value="What type of noise?" />
    <Choice value="Crowd" />
    <Choice value="Machinery" />
    <Choice value="Traffic" />
    <Choice value="Unsure/Other" />
</Choices>
```
