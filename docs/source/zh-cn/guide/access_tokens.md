---
title: 访问令牌
short: 访问令牌
tier: all
type: guide
order: 381
order_enterprise: 359
meta_title: 访问令牌
meta_description: 用于与 Label Studio API 和 SDK 交互的访问令牌。 
section: "管理你的组织"
date: 2025-02-18 12:03:59
parent_enterprise: "admin_settings"
---

Label Studio 有个人访问令牌和传统令牌。这些令牌也称为你的"API 密钥"。

<table>
<thead>
  <tr>
    <th>个人访问令牌</th>
    <th>传统令牌</th>
  </tr>
  </thead>
  <tr>
  <td>
    <ul>
        <li>具有可在组织级别设置的 TTL（生存时间）。（仅 Label Studio Enterprise）</li>
        <li>仅在生成时对用户可见一次</li>
        <li>JWT 刷新令牌</li>
        <li>可手动撤销</li>
        <li>与 HTTP API 一起使用时需要<a href="#HTTP-API">额外步骤</a></li>
        <li> <code>-H 'Authorization: Bearer &lt;token&gt;'</code> 用于 HTTP API 请求</li>
        <li>与 SDK 一起使用时只需设置一次</li>
    </ul>
  </td>
  <td>
    <ul>
        <li>不会过期</li>
        <li>保留列在你的账户设置中并可用</li>
        <li>可手动撤销</li>
        <li>与 HTTP API 一起使用时无需刷新</li>
        <li> <code>-H 'Authorization: Token  &lt;token&gt;'</code> 用于 HTTP API 请求</li>
        <li>与 SDK 一起使用时只需设置一次</li>
    </ul>
  </td>
  </tr>
</table>

## 查找你的访问令牌

你可以通过点击右上角的用户图标并选择 **账户与设置** 来访问你的 API 密钥/访问令牌。

如果你没有看到 **Personal Access Tokens**（个人访问令牌）或 **Legacy Tokens**（传统令牌）页面，这意味着你首先需要在组织级别启用它们。

## 为组织启用访问令牌

用户在 **账户与设置** 页面看到的选项取决于你在组织级别的设置。

在 **组织** 页面，选择 **设置 > 访问令牌设置**。

<div class="enterprise-only">

!!! note
     **组织** 页面仅对具有管理员和所有者角色的用户可用。

</div>

从这里你可以启用和禁用令牌类型。

* 当某个令牌类型被禁用时，现有令牌将无法向 Label Studio 平台进行认证。

* 使用个人访问令牌的生存时间（Time-to-Live）来设置个人访问令牌的过期日期。（仅 Enterprise）

<div class="enterprise-only">

<img src="/images/admin/token-settings.png" style="max-width: 668px" alt="Screenshot of Access Token window">

</div>

<div class="opensource-only">

<img src="/images/admin/token-settings-lso.png" style="max-width: 475px" alt="Screenshot of Access Token window">

</div>

## "API 密钥"与"访问令牌"

在 Label Studio 中，**"access tokens"**（访问令牌）和 **"API keys"**（API 密钥）含义相同，可互换使用。

## 个人访问令牌

### SDK

个人访问令牌可以直接在脚本中设置，或设置为 `LABEL_STUDIO_API_KEY` 环境变量。

```python
# Define the URL where Label Studio is accessible and the API key for your user account
LABEL_STUDIO_URL = 'http://localhost:8080'

# API key can be either your PAT or legacy access token
LABEL_STUDIO_API_KEY = 'your-token'

# Import the SDK and the client module
from label_studio_sdk import LabelStudio

# Connect to the Label Studio API 
client = LabelStudio(base_url=LABEL_STUDIO_URL, api_key=LABEL_STUDIO_API_KEY)

```

### HTTP API

由于这是 JWT 刷新令牌，你必须使用你的 PAT（个人访问令牌）生成短期访问令牌。然后该访问令牌用于 API 认证。

要生成此访问令牌，请使用 JSON 正文中的个人访问令牌发出 POST 请求。例如：
     
```bash
curl -X POST <your-label-studio-url>/api/token/refresh \
-H "Content-Type: application/json" \
-d '{"refresh": "your-personal-access-token"}'
```

作为响应，你将收到类似于以下的 JSON 负载：
     
```json
{
    "access": "your-new-access-token"
}
```

通过在 API 请求中包含此访问令牌，使用 `Authorization: Bearer` 标头。例如：
     
```http
curl -X <method> <Label Studio URL>/api/<endpoint> -H 'Authorization: Bearer your-new-access-token'
```

当该访问令牌过期（约 5 分钟后）时，你将收到 401 响应，需要再次使用你的个人访问令牌来获取新的访问令牌。这增加了一层安全性。

你还可以使用以下脚本检查令牌的过期时间：

```python
# pip install pyjwt
from datetime import datetime, timezone
import jwt

decoded = jwt.decode(token)
exp = decoded.get("exp")
token_is_expired = (exp <= datetime.now(timezone.utc).timestamp())
```


## 传统令牌

一般来说，传统令牌不如个人访问令牌安全，因为它们必须手动撤销。

### SDK

在 Python SDK 中，使用传统令牌和个人访问令牌的方式没有区别。请参阅上面的示例。


### HTTP API

通过在 API 请求中包含此访问令牌，使用 `Authorization: Token` 标头（这与个人访问令牌使用的 `Authorization: Bearer` 标头不同）。

例如：
     
```bash
curl -X <method> <Label Studio URL>/api/<endpoint> -H 'Authorization: Token <token>
```
