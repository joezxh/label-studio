---
title: User management overview
short: User management 
tier: enterprise
type: guide
order: 0
order_enterprise: 366
meta_title: User management overview
meta_description: User management options available in Label Studio Enterprise
section: "Manage Your Organization"
---

用户管理在你的数据标注工作流中可能是一个至关重要的组成部分。

数据标注通常涉及敏感或专有信息，控制谁可以访问这些数据对于保护其免受未授权访问或滥用至关重要。通过实施稳健的用户管理，你可以确保只有获得授权的用户账户才能访问特定的数据集。这在处理敏感数据的环境中尤为重要，例如医疗记录或个人信息的处理，这些场景可能适用 GDPR 或 HIPAA 等数据隐私法规。

此外，用户管理简化了工作流并提高了数据标注项目的效率。由于不同的用户可以拥有不同的角色，你可以定制你的项目，使每个用户都拥有执行其任务所需的适当工具和数据的访问权限。这不仅提高了数据标注过程的准确性和一致性，还最大限度地降低了由未授权访问或修改引起的错误或冲突的风险。

Label Studio Enterprise 的用户管理选项包括：

* **基于角色的访问控制（RBAC）**：角色规定了用户的访问级别以及他们能够完成的操作。有关这些角色的更多信息，请参阅 [角色与权限](admin_roles)。有关分配角色的信息，请参阅 [管理用户账户](admin_manage_lse)。

* **通过角色的用户工作流**：你还可以使用角色为你的用户设计标注工作流。例如，你可以使用项目设置来配置分别显示给审查者和标注者的不同说明。更多信息请参阅 [项目设置](setup_project)。

* **用户活动监控**：管理员可以通过活动日志跟踪用户活动，例如谁在何时标注了什么数据。更多信息请参阅 [活动日志](admin_logs)。

* **项目与工作区**：你可以使用工作区和项目成员资格来控制项目的可见性。具有经理、标注者或审查者角色的用户必须被添加为成员才能查看工作区或项目。工作区用于对项目进行分组，成员资格会向下级联到工作区内的项目。更多信息请参阅 [项目设置](setup_project)。

* **SSO/SAML 与 SCIM 集成**：对于企业使用单点登录（SSO）或跨域身份管理系统（SCIM）的情况，Label Studio Enterprise 允许在组织级和项目级将组映射到角色。更多信息请参阅 [SSO 与 SAML 设置](auth_setup) 和 [SCIM2 设置](scim_setup)。

* **定制化与可编程性**：你可以通过 API 端点以编程方式将角色分配给用户并管理用户账户，从而实现自动化以及与外部系统的集成。更多信息请参阅我们的 [API 参考](/api/#tag/Users)。
