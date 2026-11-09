---
title: 停用 Minio
short: 停用 Minio
meta_title: 停用 Minio
---

!!! warning
    停用 Minio 是一种危险操作，因为你可能会丢失使用直接文件上传上传的所有数据。如需更多信息或支持，请联系 [Heartex 团队](support@humansignal.com)。

要停用 Minio，请执行以下操作：

## 配置持久化存储

要配置持久化存储，请按照[设置持久化存储](persistent_storage.html)中的说明进行操作。

## 升级到最新的可用版本

1. 将 `MINIO_MIGRATION: true` 添加到你的 `ls-values.yaml` 文件的 `global.extraEnvironmentVars` 部分：
```shell
global:
  extraEnvironmentVars:
    MINIO_MIGRATION: true
```

2. 按照[升级 Label Studio Enterprise](install_enterprise_k8s.html#Upgrade-Label-Studio-using-Helm) 中的步骤重新部署版本。

## 运行迁移脚本

1. 在 `lse-app` Pod 中运行 shell：
```shell
kubectl exec -ti deploy/<YOUR_RELEASE_NAME>-lse-app -c lse-app -- bash
```

2. 将数据从 Minio 复制到持久化存储：
```shell
JSON_LOG=0 python3 $LSE_DIR/label_studio_enterprise/manage.py minio-migrate
```

## 确保数据迁移成功


!!! warning 
    Minio 服务将在下一步中被删除。 

- 尝试在你的项目中运行 `导出`。
- 通过 `project_id/export` 确保此数据出现在你的 `bucket/volume` 中。

!!! note 
    如需更多信息或支持，请联系 [Heartex 团队](support@humansignal.com)。

## 完全移除 Minio 服务

1. 将以下映射添加到你的 `ls-values.yaml` 文件：
```yaml
minio:
  enabled: false
```

2. 从你的 `ls-values.yaml` 文件的 `global.extraEnvironmentVars` 部分移除 `MINIO_MIGRATION: true`。

3. 按照[升级 Label Studio Enterprise](install_enterprise_k8s.html#Upgrade-Label-Studio-using-Helm) 中的步骤重新部署版本。
