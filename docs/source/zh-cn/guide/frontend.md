---
title: 前端构建
short: 前端构建
tier: all
order: 0
order_enterprise: 0
hide_menu: true
meta_title: 自定义用户界面
meta_description: Label Studio 文档，介绍如何将 Label Studio 前端界面集成到你自己的机器学习或数据标注应用工作流中。
section: "集成与扩展"
---

!!! attention
    从 [Label Studio 1.11.0](https://github.com/HumanSignal/label-studio/releases/tag/1.11.0) 开始，Label Studio 前端已弃用为单独的库，不再作为独立发行版受支持。有关在 Label Studio 中使用前端库的信息，请参阅 [README](https://github.com/HumanSignal/label-studio/blob/develop/web/libs/editor/README.md)。

    与其从头构建新的标注应用，AI 智能体可以通过将 [XML 标注配置构建技能](https://github.com/HumanSignal/create-xml-labeling-config-skill) 与 [Label Studio SDK/CLI](https://api.labelstud.io/api-reference/introduction/getting-started) 结合使用，在 Label Studio 之上构建强大的标注界面。这使智能体能够根据你的规范直接生成优化的标注配置，并以编程方式将它们接入项目。

[Label Studio Frontend](https://github.com/HumanSignal/label-studio-frontend)（LSF）是 Label Studio 中分发的主要标注界面，并通过 NPM 和 Unpkg 作为单独包提供。你可以将 LSF 集成到你的项目中，而无需 Label Studio，从而为你的用户提供数据标注能力。

LSF 可以自定义和扩展以满足你的需求，并且你可以使用自定义版本的 LSF 独立使用或在你的 LS 安装中使用。有关更多信息，请参阅[在 Label Studio 中的自定义 LSF](#在-label-studio-中的自定义-lsf)。

LSF 位于一个单独的 GitHub 仓库中：https://github.com/HumanSignal/label-studio-frontend

<br>
<img src="/images/frontend/lsf-in-ls.jpg" class="gif-border">

<i>图 1：Label Studio Frontend </i>


## 安装

安装 LSF 有两种方式：

1. 使用包管理器
2. 使用 Unpkg CDN

### 使用包管理器（推荐）

你可以使用 `npm` 或 `yarn` 安装 LSF。

```bash
npm install heartexlabs@label-studio@latest --save
```

```bash
yarn add heartexlabs@label-studio@latest
```

### 使用 Unpkg.com CDN

```xhtml
<!-- 引入 Label Studio 样式表 -->
<link href="https://unpkg.com/heartexlabs@label-studio@latest/build/static/css/main.css" rel="stylesheet">

<!-- 引入 Label Studio 库 -->
<script src="https://unpkg.com/heartexlabs@label-studio@latest/build/static/js/main.js"></script>
```

## 前端集成指南

LSF 可以与 Vanilla JS 或你选择的框架一起使用。以下示例涵盖了与 Vanilla 和 React 的基本集成。

### Vanilla JS 集成

你可以通过将其包含在 HTML 页面中，在自己的项目中单独使用 Label Studio Frontend。使用选择器为应成为编辑器的 div 实例化一个新的 Label Studio 对象。

要查看 LabelStudio 对象初始化的所有可用选项，请参阅 [Label Studio Frontend](frontend_reference.html)。

{% collapse "使用现代 JS 技术（推荐）" %}

本指南假设你正在使用像 Webpack 或 Rollup 这样的打包器来组装你的 JS 包，并且 LSF 是通过包管理器安装的。

在你的 HTML 中添加以下代码：
```xhtml
<div id="label-studio"></div>
```

现在要初始化 Label Studio Frontend，请将以下代码添加到你的 JS 文件中：
``` js
import LabelStudio from 'heartexlabs@label-studio@latest';
import 'heartexlabs@label-studio@latest/build/static/css/main.css';

const labelStudio = new LabelStudio('label-studio', {
  config: `
    <View>
      <Image name="img" value="$image"></Image>
      <RectangleLabels name="tag" toName="img">
        <Label value="Hello"></Label>
        <Label value="World"></Label>
      </RectangleLabels>
    </View>
  `,
  interfaces: [
    "panel",
    "update",
    "controls",
    "side-column",
    "annotations:menu",
    "annotations:add-new",
    "annotations:delete",
    "predictions:menu"
  ],
  user: {
    pk: 1,
    firstName: "James",
    lastName: "Dean"
  },
  task: {
    annotations: [],
    predictions: [],
    id: 1,
    data: {
      image: "https://htx-pub.s3.us-east-1.amazonaws.com/examples/images/nick-owuor-astro-nic-visuals-wDifg5xc9Z4-unsplash.jpg"
    }
  }
});

labelStudio.on("labelStudioLoad", (LS) => {
  // 当 Label Studio 加载时执行操作
  const c = LS.annotationStore.addAnnotation({
    userGenerate: true
  });
  LS.annotationStore.selectAnnotation(c.id);
});

labelStudio.on("submitAnnotation", (LS, annotation) => {
  // 以 JSON 格式检索标注
  console.log(annotation.serializeAnnotation())
});
```

{% endcollapse %}

{% collapse "使用纯 HTML 和 JS" %}

如果你不使用打包器，或者想在静态 HTML 页面中使用 LSF，此技术很有用。

```xhtml
<!-- 引入 Label Studio 样式表 -->
<link href="https://unpkg.com/heartexlabs@label-studio@latest/build/static/css/main.css" rel="stylesheet">

<div id="label-studio"></div>

<!-- 引入 Label Studio 库 -->
<script src="https://unpkg.com/heartexlabs@label-studio@latest/build/static/js/main.js"></script>

<script>
const root = document.querySelector('#label-studio');
const labelStudio = new LabelStudio(root, {
  // 所有配置选项相同
});
</script>
```

{% endcollapse %}

### React 集成

LSF 很灵活，可以与任意框架一起使用。本指南涵盖了 React 集成，但相同的原则可以应用于其他框架。

{% collapse "LSF 与 React" %}

准备新的自定义组件：
```jsx
// components/LabelStudio.js
import {useRef} from 'react';

const LabelStudioReact = (props) => {
  const labelStudioContainerRef = useRef();
  const labelStudioRef = useRef();

  useEffect(() => {
    if (labelStudioContainerRef.current) {
      labelStudioRef.current = new LabelStudio(
        labelStudioContainerRef.current,
        props
      );
    }
  }, []);

  return (
    <div
      id="label-studio"
      ref={function(el) {
        labelStudioContainerRef.current = el
      }}
    />
  );
}
```

在你的 React 应用中使用组件
```jsx
// App.js
import { render } from 'react-dom';
import LabelStudioReact from './components/LabelStudio';

const labelinConfig = `
  <View>
    <Image name="img" value="$image"></Image>
    <RectangleLabels name="tag" toName="img">
      <Label value="Hello"></Label>
      <Label value="World"></Label>
    </RectangleLabels>
  </View>
`

const task = {
  annotations: [],
  predictions: [],
  id: 1,
  data: {
    image: "https://htx-pub.s3.us-east-1.amazonaws.com/examples/images/nick-owuor-astro-nic-visuals-wDifg5xc9Z4-unsplash.jpg"
  }
}

const App = () => {
  return (
    <div class="app-root">
      <LabelStudioReact
        config={labelinConfig}
        task={task}
        interfaces={[
          "panel",
          "update",
          "controls",
          "side-column",
          "annotations:menu",
          "annotations:add-new",
          "annotations:delete",
          "predictions:menu"
        ]}
        user={{
          pk: 1,
          firstName: "James",
          lastName: "Dean"
        }}
      />
    </div>
  )
}

render(<App />, document.getElementById('root'));
```
{% endcollapse %}


## 前端开发

使用 Label Studio Frontend 进行开发时，请参阅 [前端参考](frontend_reference.html)。

### 手动构建

如果你想在 LSF 中构建新标签或更改默认组件的行为，那么你需要进入 LSF 仓库并查看 README 文件的 [开发部分](https://github.com/HumanSignal/label-studio-frontend#development)。进行任何更改都需要你具备良好的 React 和 Javascript 知识。

### GitHub Artifacts

使用 GitHub Artifacts 下载包含 LSF 构建的 zip 格式存档。官方 LSF 仓库的分支会自动构建并托管在 GitHub Artifacts 上。

请参阅 [LSF 仓库的 GitHub Actions](https://github.com/HumanSignal/label-studio-frontend/actions) 以访问它们。

你也可以配置 GitHub 令牌以自动获取 artifacts：
```
export GITHUB_TOKEN=<token>
cd label-studio/frontend
yarn download:lsf <branch-name-from-official-lsf-repo>
```


<div class="opensource-only">

## 在 Label Studio 中的自定义 LSF

LS Frontend（LSF）与 Backend（LSB）的集成类似于[前端集成指南](#前端集成指南)中所述。JavaScript 集成脚本位于 Label Studio Backend 中的 [lsf-sdk.js](https://github.com/HumanSignal/label-studio/blob/develop/label_studio/static/js/lsf-sdk.js)。此集成的主要思想基于 LSF 回调。

查看关于如何在 Label Studio 中使用自定义 LSF 的快速指南。

<iframe width="800" height="500" src="https://www.youtube.com/embed/QSGgiXie2SE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### 准备自定义 LSF 构建

1. 按照这些[说明](https://github.com/HumanSignal/label-studio-frontend#development)进行自定义 LSF 构建。
2. 使用 `npm run build:module` 完成你的开发以生成 `main.css` 和 `main.js` 文件。
3. 确认文件出现在 `build/static` 文件夹中。

### 将 LSF 集成到 Label Studio

所有与前端相关的文件都存储在 `label-studio/frontend` 目录下。你还会在那里找到 `dist/` 文件夹，其中包含外部前端库的最新构建。

在 `dist/` 文件夹下找到 `lsf/` 文件夹，并将其内容替换为你自定义 LSF 构建的内容。

!!! note
    在 `dist/` 下的每个文件夹中，你都会找到一个 `version.json` 文件。请勿修改或删除它。Label Studio 的运行需要它的存在。

1. **不要忘记** 从 LSB 中删除旧的构建：
    ```bash
    rm -rf label-studio/label_studio/frontend/dist/lsf/{js,css}
    ```

2. 将构建文件夹从 LSF 复制到 LS：
    ```bash
    cp -r label-studio-frontend/build/static/{js,css} label-studio/label_studio/frontend/dist/lsf/
    ```

    如果你将 LS 安装为 pip 包，请替换为 `<env-path>/lib/python<version>/site-packages/label_studio/frontend/dist/lsf/`

3. 像往常一样运行 LS 实例。它现在使用的是新的 LSF 构建：
    ```bash
    label-studio start <your-project>
    ```

</div>
