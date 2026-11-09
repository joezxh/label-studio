---
title: 为本地部署的 Label Studio Enterprise 创建备份
short: 备份 Label Studio
tier: enterprise
type: guide
order: 0
order_enterprise: 78
meta_title: 备份本地部署的 Label Studio Enterprise
meta_description: 如何备份你的本地部署 Label Studio Enterprise 环境
section: "安装"
parent_enterprise: "install_enterprise"
date: 2024-01-22 15:54:30
---

备份你的 Label Studio Enterprise 本地部署安装涉及的不仅仅是数据库备份，尽管那是关键组成部分。以下是你应该采取的步骤来备份你的 Label Studio Enterprise 本地部署安装：

1. **备份你的数据库（开发和生产）。** 这至关重要，因为它包含你所有的项目数据和配置。如果你使用的是 PostgreSQL，可以使用 **pg_dump** 等工具来创建数据库备份。
   
2. **备份你的文件存储。** 如果你使用的是本地文件存储，或者文件存储在已与 Label Studio 同步的云存储中，请确保备份这些文件。这包括你为标注上传的任何媒体文件（图像、音频、视频）。

3. **备份包含环境变量的配置文件。** 这包括你的 `label-studio` 配置文件（可能包含你的数据库连接设置和其他配置）以及你与 Label Studio 集成的任何自定义脚本或机器学习模型。

4. **备份你的环境变量。** 如果你使用环境变量来配置 Label Studio（可能包括数据库凭据、密钥等），请确保也备份这些变量。

5. **备份你的 Docker 卷。** 如果你在 Docker 容器中运行 Label Studio 并且有数据卷，请备份这些卷。Docker 卷可能包含你的数据库数据、媒体上传和其他持久化数据。

6. **记录你当前的设置。** 确保记录 Label Studio 和任何你正在使用的其他依赖项的版本，以及你所做的任何特定配置或自定义。如果你需要从备份恢复，这将很有帮助。

7. **定期测试你的备份。** 通过定期测试你可以从备份恢复 Label Studio 实例，确保你的备份过程正常工作。


记得将你的备份存储在安全的位置，理想情况下与生产环境位于不同的物理位置，以防站点范围的问题，例如自然灾害或停电。加密备份中的敏感数据以防止未经授权的访问也是一个好习惯。
