---
title: Vector
short: Vector
type: tags
order: 430
meta_title: 用于为图像添加向量的 Vector 标签
meta_description: 使用 Vector 标签为图像添加向量，用于分割的机器学习和数据科学项目。
---

`Vector` 标签用于在不选择标签的情况下向图像添加向量。当你只有一个标签要分配给向量时，这会很有用。

与以下数据类型配合使用：image（图像）。

![Screenshot](/images/tags/vector.png)

## 路径与点基础

| Action | Instruction |
|------------------------------|-------------|
| **添加点** | 点击空白处。 |
| **向路径段添加点** | 在两点之间的段上按住 <code>Shift</code> 并点击。 |
| **结束或退出路径** | 按 <code>Esc</code> 或双击你添加到路径的最后一个点。 |
| **移动点** | 直接点击某个点并拖动以重新定位。 |
| **删除点** | 按 <code>Alt</code> 或 <code>Option</code> 并点击已有的点。 |

!!! note
    <span id="region-note">有多个选项要求你先完成路径，然后将其作为区域重新选中。</span> 
    
    最简单的处理方式是，在标注设置中启用**创建后选中区域**（位于标注流和 Quick View 中标注界面下方）。 
    
    你也可以先退出路径，然后通过点击路径内的某一段，或在 **Regions**（区域）面板中点击它来重新选中。

    选中的路径会高亮显示为红色。因此，在为向量路径选择标签颜色时应避免使用红色。


## 高级

### 多选

使用多选，你可以拖动多个点以重新定位或调整其大小。

<video style="max-width: 600px;" class="gif-border" autoplay loop muted>
      <source src="/images/tags/vector-move.mp4">
</video>

| Action | Instruction |
|---------------------------|-------------|
| **选择多个点** | <ul><li>要选择路径中的所有点，按 <code>Cmd</code> 或 <code>Ctrl</code>，然后点击路径中的任意点。</li><li>要选择路径中的单个点，首先将路径作为区域选中（<a href="#region-note">见上方说明</a>）。然后在点击各点时按 <code>Cmd</code> 或 <code>Ctrl</code>。</li></ul> |
| **选择多个路径** | 使用移动工具（箭头）点击并拖动多个路径/形状。 |
| **调整多个路径大小** | 使用移动工具（箭头）选中多个路径，然后点击并拖动选框中的点 |
| **清除选择** | 点击任意点或按 <code>Esc</code>。 | 

### 闭合路径

你可以创建闭合路径以构成多边形形状。要创建闭合路径，请在你的标注配置中使用 `closable="true"` 参数。

![Screenshot](/images/tags/vector-closed.png)

| Action | Instruction |
|-------------------------|-----------------------------------------------------------------------------|
| **闭合路径** | 双击你的最后一个点。这会自动在你的第一个点和最后一个点之间添加一段。 |
| **断开闭合路径** | 按 `Alt` 或 `Option` 并点击闭合路径中的某个向量段以重新打开它。点击某个点可删除该点。 |


### 骨架

你可以在标注配置中使用 `skeleton="true"` 参数创建骨架向量。

启用后，新点会连接到活动点，而不是最后添加的点。

![Screenshot](/images/tags/vector-skeleton.png)


## 使用示例

### 基础向量路径

```html
<View>
 <Image name="image" value="$image" />
 <VectorLabels name="labels" toName="image">
   <Label value="Road" />
   <Label value="Boundary" />
 </VectorLabels>
</View>
```

### 闭合多边形

```html
<View>
 <Image name="image" value="$image" />
 <VectorLabels
   name="polygons"
   toName="image"
   closable="true"
   minPoints="3"
   maxPoints="20"
 >
   <Label value="Building" />
   <Label value="Park" />
 </VectorLabels>
</View>
```

### 用于分支路径的骨架模式

```html
<View>
 <Image name="image" value="$image" />
 <VectorLabels
   name="skeleton"
   toName="image"
   skeleton="true"
   closable="false"
 >
   <Label value="Tree" />
   <Label value="Branch" />
 </VectorLabels>
</View>
```


### 关键点标注工具

```html
<View>
 <Image name="image" value="$image" />
 <VectorLabels
   name="keypoints"
   toName="image"
   closable="false"
   minPoints="1"
   maxPoints="1"
 >
   <Label value="Eye" />
   <Label value="Nose" />
   <Label value="Mouth" />
 </VectorLabels>
</View>
```

### 点约束绘制

```html
<View>
 <Image name="image" value="$image" />
 <VectorLabels
   name="constrained"
   toName="image"
   closable="true"
   snap="pixel"
   minPoints="4"
   maxPoints="12"
 >
   <Label value="Region" />
 </VectorLabels>
</View>
```

## 标签参数

{% insertmd zh-cn/includes/tags/vectorlabels.md %}


### 结果参数

**Kind**: global typedef  
**Returns**: <code>VectorRegionResult</code> - Label Studio 格式的序列化向量区域数据  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| original_width | <code>number</code> | 原始图像宽度（像素） |
| original_height | <code>number</code> | 原始图像高度（像素） |
| image_rotation | <code>number</code> | 图像旋转角度（度） |
| value | <code>Object</code> |  |
| value.vertices | <code>Array.&lt;Object&gt;</code> | 包含坐标、贝塞尔曲线信息和点关系的点对象数组 |
| value.closed | <code>boolean</code> | 向量是否为闭合（多边形）或开放（折线） |
| value.vectorlabels | <code>Array.&lt;string&gt;</code> | 分配给此向量的标签名称数组 |

#### 结果 JSON 导出示例

```json
{
  "original_width": 1920,
  "original_height": 1280,
  "image_rotation": 0,
  "value": {
    "vertices": [
      { "id": "point-1", "x": 25.0, "y": 30.0, "prevPointId": null, "isBezier": false },
      { "id": "point-2", "x": 75.0, "y": 70.0, "prevPointId": "point-1", "isBezier": true,
        "controlPoint1": {"x": 50.0, "y": 40.0}, "controlPoint2": {"x": 60.0, "y": 60.0} }
    ],
    "closed": false
  }
}
```
