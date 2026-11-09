---
title: Compare Label Studio Editions
short: Compare editions
type: guide
tier: all
order: 28
order_enterprise: 28
section: "Discover & Learn"
meta_title: Label Studio Community and Enterprise Features
meta_description: Compare the features of Label Studio Community Edition with the paid versions so that you can choose the best option for your data labeling and annotation projects.
---

Label Studio 作为开源软件（Label Studio Community Edition，社区版）对所有人开放。此外还有两个付费版本：Starter Cloud 和 Enterprise。

<a class="Button" href="#Feature-comparison" target="_blank" style="margin-bottom: 2em;">查看完整功能对比</a>

## 一目了然

![ls compare](../images/ls_compare.png)

<a class="Button" href="https://humansignal.com/" target="_blank" style="margin-bottom: 2em;">了解 Enterprise</a>

## 功能对比

<table>
<thead>
  <tr>
    <th>功能</th>
    <th>社区版</th>
    <th>Starter Cloud</th>
    <th>Enterprise</th>
  </tr>
  </thead>
  <tr>
    <td colspan="4" style="text-align:center"><b>用户管理</b></td>
  </tr>
  
  <tr>
    <td><b>基于角色的工作流</b><br/><a href="https://docs.humansignal.com/guide/project_settings_lse#Annotation">为标注者和审查者提供的基于角色的自动化工作流。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">有限</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>基于角色的访问控制</b><br/><a href="https://docs.humansignal.com/guide/admin_roles">对工作区和项目进行基于角色的访问控制：管理员、经理、审查者、标注者。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>可定制的权限</b><br/><a href="https://docs.humansignal.com/guide/admin_permissions">对哪些角色可以执行特定操作的细粒度控制，例如邀请成员、管理云存储、删除任务等。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td colspan="4" style="text-align:center"><b>数据管理</b></td>
  </tr>
  <tr>
    <td><b>数据管理视图</b><br/><a href="manage_data.html">通过数据管理器（Data Manager）视图查看和管理项目中的数据集和任务。</a></td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>多种数据格式</b><br/><a href="https://labelstud.io/playground/"> 标注任何数据类型，从文本、图像、音频、视频、时间序列数据到多模态。</a></td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>导入数据</b><br/><a href="tasks.html">引用存储在你的数据库、云存储桶或本地存储中的数据，并在浏览器中进行标注。</a></td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
    <tr>
    <td><b>高级云存储集成</b><br/><a href="storage.html">Databricks Unity Catalog、AWS S3 的 IAM、使用服务主体的 Azure Blob Storage 以及 Google Cloud Storage 连接的 WIF。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>导入预标注数据</b><br/><a href="predictions.html">将预标注数据（predictions）导入 Label Studio 以进行进一步的完善和评估。</a></td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>导出数据</b><br/><a href="export.html">将标注导出为常见格式，如 JSON、COCO、Pascal VOC 等。</a></td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>同步数据</b><br/><a href="storage.html">在项目与外部数据存储之间同步新的和已标注的数据。</a></td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>Chat</b><br/><a href="/tags/chat.html">生成并标注对话数据。与你选择的 LLM 实时交互。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">有限</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td colspan="4" style="text-align:center"><b>项目管理</b></td>
  </tr>
  <tr>
    <td><b>在项目中组织数据</b><br/><a href="setup_project.html">用项目管理数据标注活动。</a></td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>在工作区中组织项目</b><br/><a href="https://docs.humansignal.com/guide/workspaces">按团队、部门或产品组织相关项目。用户只能访问他们关联的工作区。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>个人沙箱工作区</b><br/><a href="https://docs.humansignal.com/guide/workspaces">用于项目测试和实验的个人沙箱工作区。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>模板</b><br/><a href="/templates">用于更快设置数据标注项目的模板。</a></td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>AI 助手</b><br/><a href="https://docs.humansignal.com/guide/ask_ai">使用由 HumanSignal 训练的 LLM 来帮助你创建和完善模板。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>项目成员资格</b><br/><a href="https://docs.humansignal.com/guide/project_settings_lse#Members">只有被添加为项目成员的用户才能查看它。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>项目级角色</b><br/><a href="https://docs.humansignal.com/guide/project_settings_lse#Members">可以将标注者和审查者分配到每个项目的标注者/审查者角色。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>项目级用户设置</b><br/><a href="https://docs.humansignal.com/guide/project_settings_lse#Annotation">关于标注者和审查者如何与任务交互以及他们能看到什么信息的多种配置选项。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">有限</td>
    <td style="text-align:center">✅</td>
  </tr>

<tr>
    <td colspan="4" style="text-align:center"><b>数据标注工作流</b></td>
  </tr>
  <tr>
    <td><b>分配任务</b><br/><a href="https://docs.humansignal.com/guide/manage_data#Assign-annotators-to-tasks">将任务分配给特定的标注者或审查者。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>自动分配任务</b><br/><a href="https://docs.humansignal.com/guide/setup_project#Configure-high-impact-settings">设置规则并自动化任务分发给标注者的方式。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>面向标注者的简化界面</b><br/>仅显示已分配任务的标注者专用标注视图。</td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>批量标注</b><br/><a href="https://docs.humansignal.com/guide/labeling_bulk">成批地对数据进行分类。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
  </tr>
   <tr>
    <td colspan="4" style="text-align:center"><b>定制化与开发</b></td>
  </tr>
 <tr>
    <td><b>可编程且可嵌入的界面</b><br/><a href="https://docs.humansignal.com/tags/reactcode">使用 React 构建完全自定义的标注和评估界面。嵌入到你自己的应用程序中。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>标签库</b><br/><a href="/tags">使用我们的标签库，通过修改预构建模板或构建你自己的模板来自定义标注界面。</a></td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>白标（White labeling）</b><br/>使用你公司的颜色和 logo，为你的团队提供一致的体验。（额外收费）</td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>插件</b><br/><a href="https://docs.humansignal.com/guide/plugins">使用 JavaScript 进一步增强和自定义你的标注界面。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>API/SDK 与 webhooks</b><br/><a href="api.html"> 用于以编程方式访问和管理 Label Studio 的 API、SDK 和 webhooks。</a></td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td colspan="4" style="text-align:center"><b>Prompts</b></td>
  </tr>
   <tr>
    <td><b>自动化预标注</b><br/><a href="https://docs.humansignal.com/guide/prompts_overview">使用 LLM 快速预标注任务。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">限量试用</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>LLM 微调与评估</b><br/><a href="https://docs.humansignal.com/guide/prompts_draft">针对真实数据集评估和微调 LLM prompts。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">限量试用</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>运行基准测试</b><br/><a href="https://docs.humansignal.com/guide/prompts_draft#Evaluation-results">将模型输出与真实数据或评分标准（rubric）准则进行比较。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">限量试用</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td colspan="4" style="text-align:center"><b>机器学习</b></td>
  </tr>
  <tr>
    <td><b>自定义 ML 后端</b><br/><a href="ml.html">将机器学习模型连接到项目的后端。</a></td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>主动学习循环</b><br/><a href="https://docs.humansignal.com/guide/active_learning.html">通过主动学习循环加速标注。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>来自已连接模型的预测</b><br/><a href="ml.html#Pre-annotations-predictions">使用 ML 模型后端自动标注任务并按预测分数排序。</a></td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td colspan="4" style="text-align:center"><b>分析与报告</b></td>
  </tr>
  <tr>
    <td><b>项目仪表板</b><br/><a href="https://docs.humansignal.com/guide/dashboards">用于监控项目进度的仪表板。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>标注者性能仪表板</b><br/><a href="https://docs.humansignal.com/guide/dashboard_annotator">用于审查和监控单个标注者性能的仪表板。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>活动日志</b><br/><a href="https://docs.humansignal.com/guide/admin_logs">用于按项目审计标注活动的活动日志。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>标注历史</b><br/>从标注界面查看标注历史。</td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td colspan="4" style="text-align:center"><b>质量工作流</b></td>
  </tr>
  <tr>
    <td><b>分配审查者</b><br/><a href="https://docs.humansignal.com/guide/quality.html">分配审查者以审查、修复和更新标注。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>自动重新分配任务</b><br/><a href="https://docs.humansignal.com/guide/quality.html">将一致性分数低的任务重新分配给新的标注者。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>一致性指标</b><br/><a href="https://docs.humansignal.com/guide/stats.html">使用预定义的一致性指标定义如何计算标注者共识。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">有限</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>自定义一致性指标</b><br/><a href="https://docs.humansignal.com/guide/custom_metric.html">编写你自己的自定义一致性指标。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>评论与通知</b><br/><a href="https://docs.humansignal.com/guide/comments_notifications.html">团队协作用功能，如标注任务上的评论和通知。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>识别真实标签（Ground truths）</b><br/><a href="https://docs.humansignal.com/guide/quality.html">标记哪些标注应包含在真实标签数据集中。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>重叠配置</b><br/><a href="https://docs.humansignal.com/guide/project_settings_lse#Quality">设置必须有多少标注者标注每个样本。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>暂停标注者</b><br/><a href="https://docs.humansignal.com/guide/quality#Pause-an-annotator">根据预定义行为手动或自动暂停单个标注者的进度。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>标注限制</b><br/><a href="https://docs.humansignal.com/guide/project_settings_lse#annotation-limit">设置用户在项目内可以提交多少标注的限制，超过后其工作将被暂停。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>标注者共识矩阵</b><br/><a href="https://docs.humansignal.com/guide/quality#Review-annotator-agreement-matrix">用于比较不同标注者标注结果的矩阵。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>标签分布图表</b><br/><a href="https://docs.humansignal.com/guide/dashboard_distribution">识别数据集分布可能存在的問題，例如不平衡的数据集。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td colspan="4" style="text-align:center"><b>安全与支持</b></td>
  </tr>
  <tr>
    <td><b>SSO</b><br/><a href="https://docs.humansignal.com/guide/auth_setup.html">通过 SAML SSO 或 LDAP 安全访问和认证用户。</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
   </tr>
  <tr>
    <td><b>SOC2</b><br/><a href ="https://heartex.com/security"> 符合 SOC2 的托管云服务或本地部署可用性</a></td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>支持门户</b><br/>访问专用的支持门户。</td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>正常运行时间 SLA</b><br/>99.9% 正常运行时间 SLA</td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td><b>客户成功经理</b><br/>专门的客户成功经理，支持入职、培训和升级处理。</td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">❌</td>
    <td style="text-align:center">✅</td>
  </tr>
</table>
