---
title: Secure Label Studio
type: guide
tier: all
order: 99
order_enterprise: 99
meta_title: Secure Label Studio
meta_description: About the security and hardening processes used by various Label Studio editions, and how you can configure a more secure data labeling project.
section: "Install & Setup"
---

Label Studio 提供了多种方法来保护对你的数据和部署架构的访问。

所有应用程序组件之间的交互都使用 TLS 协议进行加密。

<div class="enterprise-only">

基于角色的访问控制仅在 Label Studio Enterprise 中可用。

</div>

Label Studio 通过强制使用 HTTPS 和安全 cookie 来建立到 Web 应用程序的安全连接。

<div class="opensource-only">

如果你在生产环境中运行开源版本，请限制对 Label Studio 服务器的访问。
通过仅在服务器上打开 [所需端口](/guide/install.html#Port_Requirements) 来限制对服务器本身的访问。

</div>

## 保护用户对 Label Studio 的访问

保护用户对 Label Studio 的访问，以保护数据完整性，并只允许有权访问系统的人员进行更改。

每个用户必须创建一个密码长度在 8 到 128 个字符之间的账户，使你能够跟踪谁有权访问 Label Studio 以及他们执行了哪些操作。

<div class="opensource-only">

你可以将注册限制为仅限那些拥有注册页面链接的人，并且注册页面的邀请链接可以重置。有关更多信息，请参阅 [为 Label Studio 设置用户账户](/guide/signup.html)。

</div>

<div class="enterprise-only">

你可以将注册限制为仅限那些拥有注册页面链接的人，并且注册页面的邀请链接可以重置。有关更多信息，请参阅 [为 Label Studio 设置用户账户](/guide/manage_users.html#Signup)。

</div>

<div class="enterprise-only">

如果你使用的是 Label Studio Enterprise，你可以通过多种方式进一步增强用户访问的安全性：

- 将特定角色分配给特定的用户账户，以设置基于角色的访问控制。有关 Label Studio Enterprise 中不同角色和权限的更多信息，请参阅 [管理对 Label Studio 的访问](/guide/manage_users.html)。
- 设置组织、工作区和项目，以在不同的用户组之间分隔项目和数据。一个组织中的用户无法看到其他组织中的工作区或项目。有关如何使用组织、工作区和项目来保护访问的更多信息，请参阅 [在 Label Studio 中组织项目](/guide/manage_users.html#Roles-and-workspaces)。

</div>

## 保护对 Label Studio 的 API 访问

对 REST API 的访问受用户角色限制，并且需要特定于用户账户的访问令牌。访问令牌可以随时从 Label Studio UI 或使用 API 进行重置。

## 为生产环境启用 SSRF 保护

将 Label Studio 部署到生产环境时，请将 `SSRF_PROTECTION_ENABLED` 环境变量设置为 `true`。

默认情况下，此变量是禁用的，以支持在其本地环境中处理数据的用户。但是，它应在生产使用场景中启用。

## 保护对 Label Studio 中数据的访问

Label Studio 中的数据存储在一个或两个位置，具体取决于你的部署配置。

- 项目设置和配置详细信息存储在 Label Studio 的内部数据库中。
- 输入数据（文本、图像、音频文件）由外部数据存储托管，并使用 URI 链接提供给 Label Studio。数据不直接存储在 Label Studio 中，内容仅客户端检索。
- 项目标注存储在内部数据库中，并且可以选择存储在本地文件目录、Redis 数据库或 Amazon Web Services（AWS）、Google Cloud Platform（GCP）或 Microsoft Azure 上的云存储桶中。

!!! info 提示
    有几个针对 AWS 和 GCP 存储的高级安全选项，包括：
    * [GCP 存储的 IP 过滤](storage_gcp#IP-filtering-for-enhanced-security-for-GCS)
    * [S3 的 IP 过滤和 VPN](storage_s3#IP-filtering-and-VPN-for-enhanced-security-for-S3-storage)

### 保护数据库访问

Label Studio 不允许从应用程序直接访问内部数据库，以防止 SQL 注入攻击和其他数据泄露企图。

相反，应用程序使用 URI 来访问存储在数据库中的数据。这些 URI 只能由 Label Studio 标注界面和 API 访问，因为使用这些 URI 检索数据的请求会通过基本身份验证（Basic Authentication）标头进行验证和代理。

所有通过 REST API 暴露的特定对象属性都会添加到允许列表中。API 端点只能使用特定的 HTTP 动词访问，并且必须由实现了适当跨域资源共享（CORS）策略的基于浏览器的客户端访问。API 令牌是特定于用户的，并且可以随时重置。

PostgreSQL 数据库启用了 SSL 模式，并且需要有效的证书。

### 保护对云存储的访问

Label Studio 中的每个项目都可以链接到各种云存储选项，例如 AWS S3、Google Cloud Storage 等。用户主要通过 Label Studio 生成的预签名 URL 来访问云存储中的文件。你可以为每个项目配置多个具有不同凭证的云存储连接，以管理数据访问。了解如何设置 [云存储设置](storage)。

结合使用工作区、项目、用户和角色。这种方法有助于有效地配置和保护云存储访问。

#### 源存储逻辑与安全性

Label Studio 的云存储集成执行两个关键操作：
* **任务同步和导入**
* **媒体文件服务**

下面从安全角度对两者进行解释。

##### 任务同步和导入

将存储连接到项目后，你有几个选项可以将任务加载到项目中。根据选项的不同，你需要提供特定的权限：

* **同步媒体文件**（需要 **LIST** 权限）：当启用 **Tasks（任务）** 导入方法时，存储同步会根据你存储中的文件列表自动创建 Label Studio 任务。Label Studio 不会读取文件内容；它只是引用文件（例如 `{"image": "s3://bucket/1.jpg"}`）。

* **同步 JSON 任务文件**（需要 **LIST** 和 **GET** 权限）：当启用 **Tasks（任务）** 导入方法时，存储同步会从你存储桶中的 JSON 文件读取 Label Studio 任务，并将整个 JSON 内容加载到 Label Studio 数据库中。

* **不同步**（需要 **none** 权限）：你可以手动导入包含 Label Studio 任务的 JSON 文件，并在任务中引用存储 URI（例如 `{"image": "s3://bucket/1.jpg"}`）。

##### 媒体文件服务

创建 Label Studio 任务后，用户可以在其浏览器中查看和编辑任务。要访问存储在存储桶中的媒体，会发生以下步骤：

1. **预签名 URL 生成**：Label Studio 后端为存储桶中的文件生成预签名 URL。此步骤需要 **GET** 权限才能生成预签名 URL，但 Label Studio 不会下载你的数据。

2. **用户浏览器下载**：用户的浏览器在查看或标注任务时下载并显示媒体。这需要用户的浏览器直接访问预签名 URL。

#### 位于你的 VPC 之后的源存储

为了确保你的数据在 VPC 之后实现最大的安全性和隔离，只允许 Label Studio 后端和你内部网络内的用户访问。为此，你可以使用以下技术 —— 与 Label Studio SaaS（Cloud，`app.humansignal.com`）尤其有效：

1. 为你的存储设置 **IP 限制**，以 **允许 Label Studio 执行任务同步并为媒体文件服务生成预签名 URL**。IP 限制通过确保只有受信任的网络才能访问你的存储来增强安全性。需要 GET（`s3:GetObject` 对于 S3）和 LIST（`s3:ListBucket` 对于 S3）权限。<span class="enterprise-only">`app.humansignal.com` 的 IP 范围可以在文档 [此处](saas#IP-range) 找到。</span>

2. **在存储与用户的浏览器之间建立安全连接**：
    - 配置 VPC 私有端点并将 VPN 流量路由到该端点，以便用户的浏览器可以仅使用你的虚拟专用网络（VPN）安全地访问 S3 存储桶。
    - 或者将你的存储访问限制为某些 IP 或 VPC。

**配置示例：**
  - [AWS S3 存储：用于增强安全性的 IP 过滤和 VPN](storage_s3#IP-filtering-and-VPN-for-enhanced-security-for-S3-storage)。
  - [Google Cloud Storage：用于增强安全性的 IP 过滤](storage_gcp#IP-filtering-for-enhanced-security-for-GCS)。

<i>此图像展示了如何使用你的 VPC 和 IP 限制与 Label Studio 安全地配置源云存储</i>

<img width="49%" style="display: inline-block; margin-right: 5px;" src="/images/storages/cloud-storage-ip-restriction.jpg" alt="Label Studio + Cloud Storage IP Restriction" class="make-intense-zoom" />

<img width="49%" style="display: inline-block;" src="/images/storages/cloud-storage-vpn.jpg" alt="Label Studio + Cloud Storage VPC" class="make-intense-zoom" />

### 保护对 Redis 存储的访问

如果你使用 Redis 作为数据和标注的外部存储数据库，则该设置支持 TLS/SSL，并且需要 Label Studio 客户端使用有效证书向数据库进行身份验证。

<div class="enterprise-only">

## 审计日志

Label Studio Enterprise 会自动记录所有用户活动，以便你可以监控应用程序中正在执行的操作。

</div>

## Label Studio 收集的信息

Label Studio 收集使用统计信息，包括页面访问次数、标注数量以及你在标注配置中使用的数 据类型。我们收集的信息有助于我们改进在 Label Studio 中标注数据的体验，并帮助我们规划未来要支持的数据类型和标注配置。

<div class="opensource-only">

你可以通过将环境变量 `COLLECT_ANALYTICS` 设置为 `False` 来禁用数据收集。

</div>

## 将自签名证书添加到受信任的根存储

<div class="code-tabs">
  <div data-name="Docker Compose">

1. 将你的自签名证书作为卷挂载到 `app` 容器中：

```yaml
volumes:
  - ./my.cert:/tmp/my.cert:ro
```
2. 添加名为 `CUSTOM_CA_CERTS` 的环境变量，以逗号分隔的方式提及应添加到信任存储中的所有证书：

```yaml
CUSTOM_CA_CERTS=/tmp/my.cert
```
  </div>

  <div data-name="Kubernetes">

1. 将你的自签名证书作为 k8s secret 上传。
   将 `my.cert` 作为名称为 `test-my-root-cert` 的 secret 上传：

```yaml
kubectl create secret generic test-my-root-cert --from-file=file=my.cert
```

2. 将卷添加到你的 values.yaml 文件中，并在 `.global.customCaCerts` 中提及它们：

```yaml
global:
  customCaCerts:
   - /opt/heartex/secrets/ca_certs/file/file

app:
  extraVolumes:
    - name: foo
      secret:
        secretName: test-my-root-cert
  extraVolumeMounts:
    - name: foo
      mountPath: "/opt/heartex/secrets/ca_certs/file"
      readOnly: true

rqworker:
  extraVolumes:
    - name: foo
      secret:
        secretName: test-my-root-cert
  extraVolumeMounts:
    - name: foo
      mountPath: "/opt/heartex/secrets/ca_certs/file"
      readOnly: true
```
  </div>
</div>

### 为 S3 存储将自签名证书添加到受信任的根存储

Boto 库用于连接云存储 S3。`AWS_CA_BUNDLE` 必须设置为环境变量。
<div class="code-tabs">
  <div data-name="Docker Compose">

1. 将你的自签名证书作为卷挂载到 `app` 容器中：（必须是 .pem 文件类型）

```yaml
volumes:
  - ./ca.pem:/tmp/ca.pem:ro
```
2. 添加名为 `AWS_CA_BUNDLE` 的环境变量，以便被 boto 库信任。

```yaml
AWS_CA_BUNDLE=/tmp/ca.pem
```
