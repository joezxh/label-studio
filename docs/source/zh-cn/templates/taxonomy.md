---
title: 分类体系
type: templates
category: Natural Language Processing
cat: natural-language-processing
order: 210
meta_title: 分类体系数据标注模板
meta_description: 使用 Label Studio 对分类体系或层级结构进行分类的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/taxonomy.png" alt="" class="gif-border" width="552px" height="408px" />

在已定义的分类体系或选项层级结构的上下文中执行分类任务。

## 标注配置

你可以通过多种方式定义分类体系，包括：

* 用户自定义标签 - 使用 `Choice` 标签手动定义分类体系。这是模板中的默认配置。
* 外部分类体系 - 使用 JSON 格式的文件或 API 定义分类体系。这种方式在大规模分类体系下具有更好的性能。

两种方案都需要以下标签：

* 标注配置必须包裹在 [`View`](/tags/view.html) 标签中。
* 包含你正在处理的数据类型。示例模板是对文本进行分类，但 `Taxonomy` 标签也可以用于音频、图像、HTML、段落、时间序列和视频。
  
    ```xml
    <Text name="text" value="$text"/>
    ```
* 使用 [`Taxonomy`](/tags/taxonomy.html) 标签向用户呈现层级选项。
    ```xml
    <Taxonomy name="taxonomy" toName="text">
    ```

## 将分类体系用作标注工具

通常，`<Taxonomy>` 标签用于执行分类任务。但是，如果你设置 `labeling="true"`，就可以将分类体系的选择应用到文本中的区域（region）。这对于命名实体识别（NER）项目尤其有用。

注意，`labeling` 参数仅在使用 `<Text>` 或 `<HyperText>` 对象标签时受支持。

![分类体系用作 NER 的截图](/images/templates-misc/taxonomy_ner.png)

!!! info 提示
    你可以在分类体系的 [`<Choice>`](/tags/choice) 上使用 `color` 参数为文本中已选中的区域进行颜色编码。

## 使用嵌套 `Choice` 标签定义的分类体系

使用 [`Choice`](/tags/choice.html) 标签指定分类体系。将选项嵌套在 [`Choice`](/tags/choice.html) 标签下，以在分类体系中创建层级。

```html
<View>
  <Text name="text" value="$text"/>
  <Taxonomy name="taxonomy" toName="text">
    <Choice value="Archaea" />
    <Choice value="Bacteria" />
    <Choice value="Eukarya">
      <Choice value="Human" />
      <Choice value="Opossum" />
      <Choice value="Extraterrestrial" />
    </Choice>
  </Taxonomy>
</View>
```


## 使用远程源定义的分类体系

你可以修改模板以调用外部分类体系。外部分类体系有两种类型：

* [在 JSON 文件中定义的分类体系](#Flat-file-format)。
* [在 API 中定义的分类体系](#API-taxonomies)。

要调用外部分类体系，请移除 `Choice` 标签并指定 `apiUrl` 参数：

```xml
<Taxonomy name="taxonomy" toName="text" apiUrl="<YOUR_TAXONOMY_URL>" />
```

!!! todo 测试版功能
    通过 `apiUrl` 调用外部分类体系的功能目前处于测试阶段。

例如：

```html
<View>
  <Text name="text" value="$text"/>
  <Taxonomy name="taxonomy" toName="text" apiUrl="https://cities-nu.vercel.app/full" />
</View>
```

远程分类体系必须使用如下格式的 JSON（`items` 字段）：

| 属性 | 描述 |
| --- | --- |
| `items` | 必填。JSON 资源应结构化为一个以 `items` 为键的对象。示例见下文。 |
| `value` | 必填。这是用户看到的、可供选择的选项。如果不包含 `alias` 属性，则该值会导出到标注结果中。 |
| [`alias`] | 如果包含，`alias` 会替换标注结果中的 `value` 属性。`alias` 不会显示在标注界面中。当你为数据设置了内部标识符时，这会很有用。 |
| [`children`] | 分类体系层级中的嵌套值。当你在单个 JSON 格式文件中定义分类体系时使用。 |
| [`isLeaf`] | 布尔值。在使用 API 分类体系时，用它代替 `children`。默认值为 `true`。当显式设置为 false 时，该节点被视为父节点。[详见下文](#API-taxonomies)。 |
| [`hint`] | 当用户将光标悬停在值上时，该字符串会作为工具提示出现。 |

### 保护分类体系安全

`apiUrl` 必须能被 Label Studio 访问。你可以通过以下几种方式实现：
* URL 是公开的。
* URL 托管在本地服务器上。
* URL 中包含了用户名和密码，例如 `http://username:password@example.com/`。

    尽管在这种情况下分类体系本身不对公众开放，但任何有权查看项目标注配置的人都能够看到这些凭据。标注人员也可以通过浏览器开发者工具中的 Network（网络）标签页查看这些凭据。
* URL 指向你的私有云环境。这是最安全的选项。请参阅下文的 [将云存储与外部分类体系结合使用](#Using-cloud-storage-with-an-external-taxonomy)。

### 将云存储与外部分类体系结合使用
  
1. 将你的分类体系保存在与任务数据不同的存储桶中。

    如果无法为分类体系使用单独的存储桶，请参阅下文的变通方案。
2. [按照这些说明](/guide/storage) 为 Label Studio 配置云存储。这应当是与你其他存储连接相独立的连接。

    <div class="admonition note"><p class="admonition-title">note</p><p>请勿同步此存储连接。如果进行了同步，你将需要删除在同步分类体系时自动创建的任务。</p></div>

3. 在配置标注界面时，针对你的云服务提供商，使用相应的 URL 格式来格式化 `apiUrl`：`gs://`、`s3://`、`azure-blob://`，或者用于 Azure [服务主体](/guide/storage_azure#Azure-blob-storage-with-Service-Principal) 身份验证的 `azure-spi://`。


!!! warning 配置云存储的注意事项
    如果你对包含分类体系的存储连接执行了同步操作，那么整个分类体系都会被拉取进 Label Studio 作为一个任务。根据分类体系的大小，这可能会严重降低 Label Studio 的性能。当你使用云存储同步来填充 Label Studio 任务时，这会带来问题。
    
    针对此问题有几种变通方案：
    - 同步之后，直接删除该任务。
    - （推荐）建立两个源存储连接和两个外部云存储桶。一个存储桶可以包含你需要为标注任务同步的数据，另一个存储桶可以存放你的分类体系（不会被同步）。
    - 建立一个源存储连接和一个外部云存储桶。然后在配置存储连接时使用正则表达包含/排除该分类体系。



### 平面文件格式

基本要求是使用 JSON 格式、将分类体系结构包裹在 `items` 对象中，并为每个条目包含 `value` 属性。

在此示例中，你使用 `children` 来指定子节点。所有值会在单次请求中加载。


```json
{
    "items": [
        {
            "alias": "archaea01",
            "hint": "Single-celled organisms",
            "value": "Archaea"
        },
        {
            "alias": "bacteria01",
            "hint": "Prokaryotic microorganisms",
            "value": "Bacteria"
        },
        {
            "alias": "eukarya01",
            "hint": "Basically everything else",
            "value": "Eukarya",
            "children": [
                {
                    "alias": "eukarya01_b1",
                    "value": "Human"
                },
                {
                    "alias": "eukarya01_b2",
                    "value": "Opossum"
                },
                {
                    "alias": "eukarya01_b3",
                    "value": "Extraterrestrial"
                }
            ]
        }
    ]
}
```


### API 分类体系 - 测试版 🧪

使用这种格式时，子节点仅在被请求时才会加载。父节点通过 `"isLeaf": false` 指定，子节点则通过 `path` 参数调用。

例如，`taxonomy_api_url?path=node1`，其中 `node1` 是别名（如果指定了的话）或值（如果未指定别名）。因此你必须确保 API 支持 `path` 参数。


#### 分类体系 API 规范


`GET /?[path=value1]&[path=value2]&...&[path=valueN]`

返回一个 JSON 对象，其中包含 `items` 键，其对应的值为分类体系条目的列表。

如果提供了 `path` 查询参数，则返回 `valueN` 的直接子节点。注意，对于范围 `1..N-1` 内的 `i`，`value[i+1]` 必须是 `value[i]` 的子节点。


```json
{
  "items": [ <List of taxonomy values> ]
}
```

分类体系条目定义：

```json
{

  "alias": // Optional string, short name for use in output data and path values.
  "value": // Required string, the displayed text for the taxonomy value. 
           // Used same way as `alias` if alias is not specified (i.e., in output data and path values).
  "hint":  // Optional string, text displayed when user hovers over taxonomy item.
  "isLeaf": // Required boolean with default=false. Indicates whether this node has more children.
}
```

参见以下分类体系（https://cities-nu.vercel.app/labels2）作为示例：

```json
{
    "items": [
        {
            "alias": "AF",
            "value": "Africa",
            "hint": "AF",
            "isLeaf": false
        },
        {
            "alias": "AN",
            "value": "Antarctica",
            "hint": "AN",
            "isLeaf": false
        },
        {
            "alias": "AS",
            "value": "Asia",
            "hint": "AS",
            "isLeaf": false
        },
        {
            "alias": "EU",
            "value": "Europe",
            "hint": "EU",
            "isLeaf": false
        },
        {
            "alias": "NA",
            "value": "North America",
            "hint": "NA",
            "isLeaf": false
        },
        {
            "alias": "OC",
            "value": "Oceania",
            "hint": "OC",
            "isLeaf": false
        },
        {
            "alias": "SA",
            "value": "South America",
            "hint": "SA",
            "isLeaf": false
        }
    ]
}
```

当用户展开 "Africa" 选项时，会发送以下请求以检索子值：https://cities-nu.vercel.app/labels2?path=AF



## 相关标签

- [Text](/tags/text.html)
- [Taxonomy](/tags/taxonomy.html)
- [Choice](/tags/choice.html)
