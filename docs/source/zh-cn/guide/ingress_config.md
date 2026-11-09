---
title: 为 Label Studio Kubernetes 部署设置入口控制器
short: 设置入口控制器
type: guide
tier: all
order: 70
order_enterprise: 70
meta_title: 为 Label Studio Kubernetes 部署设置入口控制器
meta_description: 设置入口控制器以管理对 Label Studio Kubernetes 部署的负载均衡和访问，用于你的数据科学和机器学习项目。
section: "安装与设置"
parent: "install_k8s"
parent_enterprise: "install_enterprise_k8s"
---

设置入口控制器以管理 Ingress，即 Kubernetes 资源，它将来自 Kubernetes 集群外部的 HTTP 和 HTTPS 路由暴露给集群内的服务，例如 Label Studio rqworkers 和其他服务。  

为你的部署选择最佳选项：
- 用于 Amazon Elastic Kubernetes Service (EKS) 的 Ingress
- 用于 Google Kubernetes Engine (GKE) 的 Ingress
- 用于 Microsoft Azure Kubernetes Service (AKS) 的 Ingress
- 使用 nginx 的 Ingress（与云无关）
- 在负载均衡器上终止 TLS（与云无关）

在设置[持久化存储](persistent_storage.html) 之前或之后配置 ingress，但在部署 Label Studio 之前。

!!! note 
    只有当你计划在 Kubernetes 上部署 Label Studio 时，才需要设置入口控制器。 

## 为 Amazon EKS 配置 ingress

如果你计划在 Amazon EKS 上部署 Label Studio，请配置 ingress。 

1. 安装 AWS Load Balancer Controller 以使用默认选项安装入口控制器。请参阅 Amazon EKS 用户指南中的 [AWS Load Balancer Controller](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html) 文档。
2. 安装 AWS Load Balancer Controller 后，使用 AWS Certificate Manager (ACM) 配置 SSL 证书。请参阅 ACM 用户指南中的[请求公有证书](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request-public.html)。
3. 使用类似于以下示例的 ingress 详细信息更新你的 `ls-values.yaml` 文件。将 `"your_domain_name"` 替换为你的主机名。
```yaml
app:
  ingress:
    enabled: true
    path: /*
    host: "your_domain_name"
    className: alb
    annotations: 
      alb.ingress.kubernetes.io/scheme: internet-facing
      alb.ingress.kubernetes.io/target-type: ip
```

!!! note
    如果你想为负载均衡器配置在 ACM 中创建的证书，请将此注解（针对你的证书更新）添加到你的 `ls-values.yaml` 文件中：  
```
alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:region:account-id:certificate/aaaa-bbbb-cccc
```

有关你可以使用 ingress 配置的注解的更多详细信息，请参阅 GitHub 上 AWS Load Balancer Controller 文档中的 [Ingress 注解](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/ingress/annotations/) 指南。

## 为 GKE 配置 ingress

Google Kubernetes Engine (GKE) 包含两个预安装的 Ingress 类：
- `gce` 类部署外部负载均衡器
- `gce-internal` 类部署内部负载均衡器

Label Studio 被视为外部服务，因此你想使用 `gce` 类来部署外部负载均衡器。

1. 使用类似于以下示例的 ingress 详细信息更新你的 `ls-values.yaml` 文件。将 `"your_domain_name"` 替换为你的主机名。
```yaml
app:
  service:
    type: nodePort
  ingress:
    enabled: true
    path: /*
    host: "your_domain_name"
    className: gce
```

!!! note 
    你也可以请求 Google 管理的 SSL 证书以在负载均衡器上使用。请参阅 Google Kubernetes Engine 操作指南中的[使用 Google 管理的 SSL 证书](https://cloud.google.com/kubernetes-engine/docs/how-to/managed-certs) 详细信息。如果你使用托管证书，请将类似于以下示例的注解添加到你的 `ls-values.yaml` 文件中，将 `"managed-cert"` 替换为你的 ManagedCertificate 对象名称：
```yaml
"networking.gke.io/managed-certificates": "managed-cert"
```

有关 GKE 中注解和 ingress 的更多详细信息，请参阅 Google Kubernetes Engine 操作指南中的[为外部负载均衡配置 Ingress](https://cloud.google.com/kubernetes-engine/docs/how-to/load-balance-ingress)。

## 为 Microsoft Azure Kubernetes Service 配置 ingress

为 Microsoft Azure Kubernetes Service (AKS) 配置 ingress。

1. 使用新的 Application Gateway 部署 Application Gateway Ingress Controller (AGIC)。请参阅 Microsoft Azure AKS 操作指南中的[如何使用新的 Application Gateway 安装 Application Gateway Ingress Controller (AGIC)](https://docs.microsoft.com/en-us/azure/application-gateway/ingress-controller-install-new)。 
2. 使用类似于以下示例的 ingress 详细信息更新你的 `ls-values.yaml` 文件。将 `"your_domain_name"` 替换为你的主机名。
```yaml
app:
  ingress:
    enabled: true
    host: "your_domain_name"
    className: azure/application-gateway
```

!!! note 
    你可以创建一个自签名证书以在 AGIC 中使用。按照 Microsoft Azure 网络教程中的步骤[创建自签名证书](https://docs.microsoft.com/en-us/azure/application-gateway/create-ssl-portal#create-a-self-signed-certificate)：使用 Azure 门户配置带有 TLS 终止的应用程序网关。 

有关在 Microsoft Azure 中使用 AGIC 的更多详细信息，请参阅 Microsoft Azure Application Gateway 文档中的[什么是 Application Gateway Ingress Controller？](https://docs.microsoft.com/en-us/azure/application-gateway/ingress-controller-overview) 和 [Application Gateway Ingress Controller 的注解](https://docs.microsoft.com/en-us/azure/application-gateway/ingress-controller-annotations)。

## 设置与云无关的 ingress 配置

对于高级 Kubernetes 管理员，你可以使用 NGINX Ingress Controller 设置与云无关的入口控制器。

1. 按照你的云部署的相关步骤部署 NGINX Ingress Controller。请参阅 NGINX Ingress Controller 安装指南中的 [Cloud deployments](https://kubernetes.github.io/ingress-nginx/deploy/#cloud-deployments)。 
2. 为了在 ingress 控制器中终止 SSL 证书，请安装 cert-manager。请参阅 cert-manager 文档站点上的[安装](https://cert-manager.io/docs/installation/)。  
3. 你必须将 ingress 主机与 DNS 同步。安装 [ExternalDNS](https://github.com/kubernetes-sigs/external-dns#readme) 并为你的部署选择相关的云提供商。
4. 最后，使用类似于以下示例的 ingress 详细信息更新你的 `ls-values.yaml` 文件。将 `"your_domain_name"` 替换为你的主机名，并将 `<CERTIFICATE_NAME>` 替换为你使用 ExternalDNS 创建的资源的名称。
```yaml
app:
  ingress:
    enabled: true
    host: "your_domain_name"
    className: nginx
    tls:
      - secretName: <CERTIFICATE_NAME>
        hosts:
          - "your_domain_name"
```

## 在负载均衡器上终止 TLS

如果 SSL 终止发生在流量转发到 Ingress 之前的负载均衡器上，你需要设置 LABEL_STUDIO_HOST 环境变量。

使用类似于以下示例的 LABEL_STUDIO_HOST 环境变量更新你的 `ls-values.yaml` 文件。将 `"your_domain_name"` 替换为你的主机名。
```yaml
global:
  extraEnvironmentVars:
    LABEL_STUDIO_HOST: https://your_domain_name
```


## 使用 NGINX ingress 处理大文件上传

当通过 NGINX ingress 控制器上传大文件时，你可能会遇到 "413 Request Entity Too Large" 错误。这是因为 NGINX 对客户端请求正文的大小有 1MB 的默认限制。

要处理大文件上传，你可以在 ingress 配置中配置 `proxy-body-size` 注解。更新你的 `ls-values.yaml` 文件以包含此注解：
```yaml
app:
  ingress:
    annotations:
      nginx.ingress.kubernetes.io/proxy-body-size: "200m"
```

如果你使用不同的 ingress 控制器，请查阅该特定控制器的文档，了解如何配置请求正文大小限制。例如：

- 对于 HAProxy Ingress Controller，使用 `haproxy.org/client-max-body-size` 注解
- 对于 Traefik，配置 `maxRequestBodyBytes` 中间件
- 对于 AWS ALB Ingress Controller，最大请求正文大小由 ALB 设置控制

确切的配置取决于你的 ingress 控制器类型和版本。请参阅你的控制器的文档以获取所需的特定注解或配置。
