---
title: Label Studio 概述
short: 关于 Label Studio
type: guide
tier: all
order: 2
order_enterprise: 2
section: "发现与学习"
meta_title: Label Studio 概述
meta_description: 通过创建项目来标注和注释数据，用于机器学习和数据科学模型，从而开始使用 Label Studio。
---

## 什么是 Label Studio？

Label Studio 是一款开源的数据标注工具，支持在一个平台上管理多个项目、多个用户以及多种数据类型。它允许你执行以下操作：

- 使用多种数据格式执行不同类型的标注。

- 将 Label Studio 与机器学习模型集成，为标签提供预测（预标注），或执行持续的主动学习。请参阅[将机器学习接入你的标注流程](/guide/ml)。

<div class="enterprise-only">

- 使用 [Label Studio Enterprise 云端服务](https://humansignal.com/platform/)。

</div>

<div class="opensource-only">

Label Studio 还提供 [Enterprise 云端服务](https://humansignal.com/platform/)，具备增强的安全性（SSO、RBAC、SOC2）、团队管理功能、数据发现、分析与报告以及支持 SLA。[免费试用](https://humansignal.com/free-trial) 可帮助你快速上手并体验企业版云端产品。

</div>

## 界面

<div class="opensource-only">

<br>
<center><i>项目列表截图</i></center>
<img class="make-intense-zoom" src="/images/terms/os/projects-min.png">
<br><br>
<center><i>数据管理器截图</i></center>
<img class="make-intense-zoom" src="/images/terms/os/project--data-manager-min.png">
<br><br>
<center><i>快速预览截图</i></center>
<img class="make-intense-zoom" src="/images/terms/os/project--data-manager--quick-view-min.png">

</div>

<div class="enterprise-only">

<br>
<center><i>项目列表截图</i></center>
<img class="make-intense-zoom" src="/images/terms/ent/workspace-min.png">
<br><br>
<center><i>数据管理器截图</i></center>
<img class="make-intense-zoom" src="/images/terms/ent/project--data-manager-min.png">
<br><br>
<center><i>快速预览截图</i></center>
<img class="make-intense-zoom" src="/images/terms/ent/project--data-manager--quick-view-min.png">

</div>

## 标注工作流

通过以下步骤在 Label Studio 中开始并完成一个标注项目：

<div class="opensource-only">

1. [安装 Label Studio](/guide/install)。
2. [启动 Label Studio](/guide/start)。
3. [为 Label Studio 创建账户](/guide/signup)。创建一个账户以管理和设置标注项目。
4. [设置标注项目](/guide/setup_project)。定义要在数据集上执行的标注类型并配置项目设置。
5. [设置标注界面](/guide/setup)。添加你希望标注人员使用的标签并自定义标注界面。
6. [导入数据作为标注任务](/guide/tasks)。
7. [标注并注释数据](/guide/labeling)。
8. [导出已标注数据或注释](/guide/export)。

</div>

<div class="enterprise-only">

1. [为 Label Studio 创建账户](/guide/manage_users#Signup)。创建一个账户以管理和设置标注项目。
2. [限制项目访问](/guide/manage_users)。设置基于角色的访问控制。仅在 Label Studio Enterprise 版本中可用。
3. [设置标注项目](/guide/setup_project)。定义要在数据集上执行的标注类型并配置项目设置。
4. [设置标注界面](/guide/setup)。添加你希望标注人员使用的标签并自定义标注界面。
5. [导入数据作为标注任务](/guide/tasks)。
6. [标注并注释数据](/guide/labeling)。
7. [审核已标注的任务](/guide/quality)。仅在 Label Studio Enterprise 版本中可用。
8. [导出已标注数据或注释](/guide/export)。

</div>

## 引用 Label Studio

如果你想引用 Label Studio，可以将以下信息添加到你的参考文献部分：

```
@misc{Label Studio,
  title={{Label Studio}: Data labeling software},
  url={https://github.com/HumanSignal/label-studio},
  note={Open source software available from https://github.com/HumanSignal/label-studio},
  author={
    Maxim Tkachenko and
    Mikhail Malyuk and
    Andrey Holmanyuk and
    Nikolai Liubimov},
  year={2020-2025},
}
```

## 架构

<div class="opensource-only">

!!! error Enterprise
    你可以在自己的工具中使用任何 Label Studio 组件，或根据需要进行自定义。在进行大规模自定义之前，你可能需要先了解 Label Studio Enterprise 版本，看看它是否已经包含你想要构建的相关功能。更多信息请参阅 [Label Studio 功能对比](https://labelstud.io/guide/label_studio_compare.html)。

</div>

Label Studio 的各个组成部分以模块化、可扩展的包形式提供，你可以将其集成到现有的机器学习和工具流程中。

| 模块 | 技术 | 描述 |
| --------------- | ----------------------------- | ------------------------------------------------------------- |
| [Label Studio 主应用](https://github.com/HumanSignal/label-studio/)     | Python 与 [Django](https://www.djangoproject.com/)    | Label Studio 的主应用，包含大部分后端代码，用于执行数据标注。    |
| [Label Studio 前端](/guide/frontend_reference)       | 使用 [React](https://reactjs.org/) 和 [MST](https://github.com/mobxjs/mobx-state-tree) 的 JavaScript Web 应用 | 位于主应用仓库中。`web/apps/labelstudio` 是所有前端元素的中央集成点。`web/libs/editor` 是前端库。              |
| 数据管理器      | 使用 [React](https://reactjs.org/) 的 JavaScript Web 应用     | 管理用于标注的数据和任务。位于主应用仓库的 `web/libs/datamanager` 下。                         |
| [机器学习后端](https://github.com/HumanSignal/label-studio-ml-backend) | Python   | 在标注流程的各个环节预测数据标签。 |

<br>
<div style="margin:auto; text-align:center;"><img src="/images/ls-modules-scheme.png"/></div>
