---
title: 插件常见问题
short: 插件 FAQ
type: plugins
category: Overview
cat: overview
order: 5
meta_title: 插件常见问题
tier: enterprise
---

### 什么是插件？

插件允许你在标注界面中直接运行自定义的 JavaScript 代码。

此功能使你能够扩展和定制 Label Studio 的行为。例如，你可以添加数据校验、动态 UI 增强，或集成外部库，从而将标注工作流定制为符合你的具体需求。通过利用 [LSI（Label Studio 接口）对象](custom#Label-Studio-Interface-LSI)，你可以管理事件、导入额外的脚本，并实时访问任务和标注数据，确保你的自定义逻辑在每次渲染标注时都能执行。

插件是在项目级别进行配置的，入口位于 **项目 > 设置 > 标注界面**。

![插件面板截图](/images/plugins/plugin-panel.png)


### 我如何获取插件？

插件仅面向 Label Studio Enterprise 用户开放，并且必须申请才能启用。

你可以联系你的客户经理、提交[支持工单](mailto:support@humansignal.com)，或者从 **项目 > 设置 > 标注界面** 下的插件面板中点击 **申请访问权限（Request Access）**。

### 为什么在使用插件之前需要先启用它们？

由于插件在标注人员的浏览器中实时运行，它们涉及[重要的安全注意事项](/guide/plugins#Security-notes-constraints-and-limitations)，因此仅在申请时才被启用。


### 插件是否对 Starter Cloud 用户开放？

不可以，它们仅在 Label Studio Enterprise 中可用。

### 谁可以访问插件？

默认情况下，只有处于 Admin（管理员）、Owner（所有者）或 Manager（经理）角色的用户才能访问项目设置，以查看、添加和编辑插件。
    
你可以选择性地添加一个限制，使得只有 Admin 或 Owner 角色的用户才能添加或编辑插件。如需申请此限制，请联系你的客户经理或[提交支持工单](mailto:support@humansignal.com)。


### 我可以自定义插件吗？

可以！开箱即用的插件旨在作为起点，可以根据你的需求进行修改。

你对所提供插件所做的更改仅保留在项目的上下文中。要更新插件源码，你需要向 [Plugins 仓库](https://github.com/HumanSignal/label-studio-plugins) 提交一个 pull request。


### 我可以自己编写插件吗？

可以！你可以不选择修改开箱即用的插件，而是从零开始编写自己的插件。请参阅 [构建你自己的自定义插件](custom)。

!!! note
    如果你构建的插件愿意与其他 Label Studio Enterprise 用户分享，我们欢迎你将其提交到 [Plugins 仓库](https://github.com/HumanSignal/label-studio-plugins)。

### 我可以插入多个插件吗？

可以，它们会叠加生效。


### 在哪里可以了解更多？

* [Label Studio 接口参考](custom#Label-Studio-Interface-LSI)
* [项目插件](/guide/plugins)
* [Plugins 仓库](https://github.com/HumanSignal/label-studio-plugins)
* [Label Studio 前端参考](/guide/frontend_reference.html#Available-events)
