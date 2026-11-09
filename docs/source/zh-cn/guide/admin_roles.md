---
title: 用户角色与权限
short: 角色与权限
tier: enterprise
type: guide
order: 0
order_enterprise: 375
meta_title: 用户角色与权限
meta_description: 对 Label Studio Enterprise 中可用的用户角色和权限的描述。 
section: "管理你的组织"
parent: "manage_users"
parent_enterprise: "manage_users"
date: 2024-02-05 17:19:21
---

你的用户角色决定了你在 Label Studio 中对操作和信息的访问级别。

* 标注者、审阅者和经理的访问权限基于他们有权访问的项目和工区受到限制。有关更多信息，请参阅 [项目设置](setup_project)。
* 所有者可以使用[权限页面](admin_permissions)进一步限制其组织内的权限。

## Label Studio Enterprise 中的角色

有关如何将用户分配到角色的信息，请参阅[管理用户账户](admin_manage_lse)。

| 角色          | 描述                                                                                                                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **所有者 (Owner)**         | 管理组织并在所有级别拥有完全权限。<br><br>这不是一个可分配的角色，每个组织只有一个所有者。默认情况下，所有者与创建 Label Studio 组织的账户绑定。要更改所有者，你需要[提交支持工单](https://support.humansignal.com/hc/en-us/requests/new)。                                                           |
| **管理员 (Administrator)** | 在大多数级别拥有完全权限。<br><br>可以访问和更新所有工区和项目，邀请成员加入组织，并设置大多数（[但并非全部](admin_usage)）组织设置。                            |
| **经理 (Manager)**       | 对他们创建或被添加为成员的项目和工区拥有完全的管理访问权限。 <br><br>经理无法访问组织页面。 |
| **审阅者 (Reviewer)**      | 审阅标注任务。<br><br>只能查看包含分配给他们的任务的项目。可以审阅和更新任务标注。                                                                              |
| **标注者 (Annotator)**     | 标注任务。<br><br>只能查看包含分配给他们的任务的项目，并在这些项目中标注任务。                                                                                               |


## Label Studio Enterprise 中的权限

<table>
  <tr>
    <th>操作</th>
    <th>标注者</th>
    <th>审阅者</th>
    <th>经理</th>
    <th>管理员</th>
    <th>所有者</th>
  </tr>
  <tr>
    <td colspan="6" style="text-align:center"><b>组织管理</b></td>
  </tr>
  <tr>
    <td>查看组织页面</td>
    <td></td>
    <td></td>
    <td style="text-align:center"></td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
    <tr>
    <td>分配成员角色</td>
    <td></td>
    <td></td>
    <td></td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td>邀请用户</td>
    <td></td>
    <td></td>
    <td></td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td>查看全系统活动日志</td>
    <td></td>
    <td></td>
    <td></td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td>为组织设置模型提供商</td>
    <td></td>
    <td></td>
    <td></td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
    <tr>
    <td>配置组织设置</td>
    <td></td>
    <td></td>
    <td></td>
    <td style="text-align:center">部分</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td colspan="6" style="text-align:center"><b>项目管理</b></td>
  </tr>
  <tr>
    <td>工区访问</td>
    <td style="text-align:center">R</td>
    <td style="text-align:center">R</td>
    <td style="text-align:center">CRUD[^1]</td>
    <td style="text-align:center">CRUD</td>
    <td style="text-align:center">CRUD</td>
  </tr>
  <tr>
    <td>项目访问</td>
    <td style="text-align:center">R</td>
    <td style="text-align:center">R</td>
    <td style="text-align:center">CRUD[^1]</td>
    <td style="text-align:center">CRUD</td>
    <td style="text-align:center">CRUD</td>
  </tr>
  <tr>
    <td>查看数据管理器</td>
    <td>取决于项目设置</td>
    <td>取决于项目设置</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td>配置项目设置</td>
    <td></td>
    <td></td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td>查看和配置项目插件</td>
    <td></td>
    <td></td>
    <td style="text-align:center">✅[^2]</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td>暂停标注者和审阅者</td>
    <td></td>
    <td></td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td colspan="6" style="text-align:center"><b>数据访问</b></td>
  </tr>
  <tr>
    <td>导入数据</td>
    <td></td>
    <td></td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td>导出数据</td>
    <td></td>
    <td></td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td colspan="6" style="text-align:center"><b>数据标注工作流</b></td>
  </tr>
  <tr>
    <td>将标注者分配给任务</td>
    <td></td>
    <td style="text-align:center"></td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td>访问标注工作流</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td>访问审阅工作流</td>
    <td></td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td>监控标注者一致性</td>
    <td></td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>

  <tr>
    <td>验证标注结果</td>
    <td></td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td>将审阅者分配给任务</td>
    <td></td>
    <td></td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td>执行批量标注</td>
    <td style="text-align:center">✅[^3]</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td colspan="6" style="text-align:center"><b>高级</b></td>
  </tr>
  <tr>
    <td>API 访问等效的 Label Studio 功能</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅[^1]</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td colspan="6" style="text-align:center"><b>分析</b></td>
  </tr>
  <tr>
    <td>查看项目仪表板和成员仪表板</td>
    <td></td>
    <td></td>
    <td style="text-align:center">工区和受邀项目</td>
    <td style="text-align:center">组织</td>
    <td style="text-align:center">组织</td>
  </tr>
  <tr>
    <td>查看标注者仪表板</td>
    <td style="text-align:center">✅[^4]</td>
    <td style="text-align:center">✅[^4]</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
    <td style="text-align:center">✅</td>
  </tr>
  <tr>
    <td colspan="6" style="text-align:center"><b>Prompts</b></td>
  </tr>
  <tr>
      <td>使用 Prompts（创建/评估/运行/应用到项目）</td>
      <td></td>
      <td></td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>在项目中查看 Prompts 生成的预测</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
</table>


[^1]: 针对他们创建或被邀请加入的工区或项目
[^2]: 所有者可以在组织设置中限制此权限
[^3]: 项目必须使用手动分发，且标注者必须被授予数据管理器访问权限
[^4]: 针对他们自己的工作/历史
