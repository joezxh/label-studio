---
title: Label Studio Python SDK 
short: Python SDK 
type: guide
tier: all
order: 404
order_enterprise: 404
meta_title: Label Studio Python SDK 
meta_description: Overview information for the Label Studio Python SDK.
section: "Integrate & Extend"

---

[**Label Studio Python SDK**](https://api.labelstud.io/api-reference/introduction/getting-started) 允许你将 Label Studio 无缝集成到你的数据科学和机器学习流水线中。

该 SDK 提供了一组预定义的类和方法，可直接从你的 Python 脚本中与 Label Studio API 进行交互，从而更轻松地管理项目、导入任务和处 理标注。

## 使用 Python SDK 的好处

- **简化的 API 交互**：SDK 通过用户友好的 Python 方法和类简化了 API 交互。
- **集成**：轻松将 Label Studio 操作集成到你现有的数据科学工作流中。
- **自动化**：自动化重复性任务，例如项目创建、任务导入和数据导出。
- **增强的数据准备**：使用过滤器和自定义配置来高效地准备和管理数据，确保高质量的标注。
- **异步操作**：执行异步数据操作，以获得更好的性能并处理大型数据集。

## 开始使用 Label Studio Python SDK

1. 安装 SDK：
   `pip install label-studio-sdk`
2. 在你的 Python 脚本中，执行以下操作：
   - 导入 SDK。
   - 定义你的 API 密钥/访问令牌和 Label Studio URL。你可以从你的 **Account & Settings（账户与设置）** 页面生成密钥。有关更多信息，请参阅 [访问令牌](access_tokens)。
   - 连接到 API。

```python
# Define the URL where Label Studio is accessible
LABEL_STUDIO_URL = 'YOUR_BASE_URL'

# API key can be either your personal access token or legacy access token
LABEL_STUDIO_API_KEY = 'YOUR_API_KEY'

# Import the SDK and the client module
from label_studio_sdk import LabelStudio
client = LabelStudio(base_url=LABEL_STUDIO_URL, api_key=LABEL_STUDIO_API_KEY)
```

## 资源与链接

* [**API 参考**](https://api.labelstud.io/api-reference/introduction/getting-started) - 这是我们所有可用 Label Studio API 请求和参数的参考。
* [**Label Studio Python Library README**](https://github.com/HumanSignal/label-studio-sdk) - 其中包含入门信息和更多代码示例。
* [**Label Studio 的 API 和 SDK 的 5 个技巧与诀窍**](https://labelstud.io/blog/5-tips-and-tricks-for-label-studio-s-api-and-sdk/) - 这提供了额外的用户指导和更多示例。
