---
title: 如何将评估工作流嵌入你的研究栈（配合 Label Studio）
hide_sidebar: true
order: 999
open_in_collab: true
tutorial: true
community_author: bmartel
ipynb_repo_path: tutorials/how-to-embed-evaluation-workflows-in-your-research-stack-with-label-studio/how_to_embed_evaluation_workflows_in_your_research_stack_with_Label_Studio.ipynb
repo_url: https://github.com/HumanSignal/awesome-label-studio-tutorials/tree/main/tutorials/how-to-embed-evaluation-workflows-in-your-research-stack-with-label-studio
report_bug_url: https://github.com/HumanSignal/awesome-label-studio-tutorials/issues/new
thumbnail: /images/tutorials/tutorials-eval-flows-research-stack.png
meta_title: 如何将评估工作流嵌入你的研究栈（配合 Label Studio）
meta_description: 了解如何用 Label Studio 在你的 Jupyter notebook 中直接构建一个嵌入式评估工作流。
is_enterprise: true
badges: SDK, Embed, Colab
duration: 10-15 分钟
---
## Label Studio 要求

本教程展示了 Label Studio Enterprise 中才提供的一项或多项功能。我们建议[联系我们的团队](https://humansignal.com/contact-sales/) 申请试用或在你的账户中启用这些功能。

## 上下文切换的成本

你正沉浸在 Jupyter notebook 中，微调一个医疗 LLM。结果看起来很有希望，但在上线之前你需要人工评估。

通常的流程是：把输出导出成 CSV，上传到评估平台，分配任务，等待结果，下载 CSV，与你的数据合并，再导入回 notebook 做分析。等这些都做完，你已经丢掉了心流状态。

**如果评估就住在你的 notebook 里呢？** 无需导出，无需切换上下文。直接评估、分析、迭代。

## 我们要构建什么

在接下来的 15-20 分钟里，你将构建一个嵌入式评估工作流，它会：

1. **加载真实的医疗问答数据**（来自 Hugging Face，100 条任务）
2. **创建一个结构化的评估界面**，带有自定义标准
3. **将 Label Studio 直接嵌入本 notebook**，实现零上下文切换的评估
4. **导出到 pandas** 以便即时分析与可视化
5. **生成洞察**，关于模型在不同医疗专科上的表现

**真实场景**：你正在评估 GPT-5 针对患者医疗问题的回答。你需要领域专家对准确性、安全性、完整性与有用性进行评分——然后立即分析其中的模式，以指导下一轮训练迭代。

到结尾时，你将拥有一个可适配于任何评估任务的模板：内容审核、提示词测试、数据质量检查，或模型对比研究。

---

## ⚠️ 要求与角色

本教程分为两部分：

### 👤 **第 1 部分：管理员配置（一次性，约 5 分钟）**
你的 Label Studio **所有者/管理员** 需要：
- 为你的组织启用嵌入功能（[申请访问权限](https://humansignal.com/contact-sales/)）
- 运行第 1 部分以生成密钥并配置组织
- **通过安全渠道与 ML 工程师共享私钥**

**所需凭据：**
- `LABEL_STUDIO_API_KEY` - 管理员/所有者 API 令牌
- `LABEL_STUDIO_URL` - 你的 LSE 实例 URL

### 🔬 **第 2 部分：ML 工程师工作流（约 15 分钟）**
任何团队成员都可以用以下凭据反复运行第 2 部分：
- `LABEL_STUDIO_API_KEY` - 你个人的 API 令牌（任意角色）
- `LABEL_STUDIO_URL` - 你的 LSE 实例 URL
- `EMBED_PRIVATE_KEY` - 管理员共享的私钥（来自第 1 部分）

**如果你是管理员**：完整运行两个部分。
**如果你是 ML 工程师**：从管理员处获取私钥，设置好这三个环境变量，然后跳到第 2 部分。

**如何设置凭据：**
- **Colab**：点击 🔑 → 添加密钥 → 把「Notebook access」开关打开
- **本地 Jupyter**：`export LABEL_STUDIO_API_KEY="..." EMBED_PRIVATE_KEY="..."`

让我们开始吧。

# 🛠️ 环境准备（所有人都需要）

无论你是管理员还是 ML 工程师，先运行这些单元格来安装依赖并配置凭据。

```python
# Install what we need
%pip install -q label-studio-sdk pandas matplotlib seaborn cryptography PyJWT datasets requests python-dotenv

# Import everything
import os, json, pandas as pd, matplotlib.pyplot as plt, seaborn as sns
from datetime import datetime, timedelta
import jwt, base64, time
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from IPython.display import HTML, display, Markdown
from label_studio_sdk.client import LabelStudio
from datasets import load_dataset
import warnings; warnings.filterwarnings('ignore')

# Set style for better visualizations
sns.set_theme(style="whitegrid", palette="husl")
plt.rcParams['figure.figsize'] = (12, 6)

```

## 🔐 配置凭据

根据你扮演的角色设置环境变量：

**👤 管理员（运行第 1 + 2 部分）：**
```bash
export LABEL_STUDIO_API_KEY="your_admin_token"
export LABEL_STUDIO_URL="https://app.humansignal.com"
```

**🔬 ML 工程师（仅运行第 2 部分）：**
```bash
export LABEL_STUDIO_API_KEY="your_personal_token"
export LABEL_STUDIO_URL="https://app.humansignal.com"
export EMBED_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

**使用 Google Colab？**
点击侧边栏的 🔑 图标 → 添加密钥 → 为每个密钥把「Notebook access」开关打开

```python
%pip install python-dotenv

# Load configuration with Google Colab Secrets support + fallback
IS_GOOGLE_COLAB = False

# Load from .env file if available (for local development)
try:
    from dotenv import load_dotenv
    load_dotenv()
except:
    pass  # dotenv not installed, will use system env vars

def get_credential(key, default=None):
    global IS_GOOGLE_COLAB
    """Get credential from Colab Secrets first, then environment variables"""
    try:
        # Try Google Colab Secrets first (most secure)
        from google.colab import userdata
        IS_GOOGLE_COLAB = True
        return userdata.get(key)
    except:
        from os import environ
        IS_GOOGLE_COLAB = False
        # Fallback to environment variables (for local Jupyter)
        return environ.get(key, default)
```

```python
LABEL_STUDIO_URL = get_credential('LABEL_STUDIO_URL', 'https://app.humansignal.com')
API_KEY = get_credential('LABEL_STUDIO_API_KEY')

# Validate required credentials
missing_vars = []
if not API_KEY:
    missing_vars.append('LABEL_STUDIO_API_KEY')

if missing_vars:
    display(HTML(f"""
    <div style="padding: 15px; background: #f8d7da; color: #856404; border: 1px solid #f5c6cb; border-radius: 5px;">
        <strong>❌ Missing Credentials</strong><br>
        Please set your credentials using one of these methods:<br><br>

        <strong>🔒 Google Colab (Recommended):</strong><br>
        1. Click the 🔑 key icon in the left sidebar<br>
        2. Add secret: <code>LABEL_STUDIO_API_KEY</code><br>
        3. Toggle "Notebook access" ON for the secret<br><br>

        <strong>💻 Local Jupyter:</strong><br>
        <code>
        export LABEL_STUDIO_API_KEY="your_admin_api_key_here"
        </code><br><br>

        <strong>Missing:</strong> {', '.join(missing_vars)}<br>
        <small><strong>Why Colab Secrets?</strong> More secure than environment variables, encrypted storage, no code exposure</small>
    </div>
    """))
else:
    # Determine which method was used
    method = "Google Colab Secrets" if IS_GOOGLE_COLAB else "Environment Variables"

    display(HTML(f"""
    <div style="padding: 15px; background: #d4edda; color: #155724; border: 1px solid #c3e6cb; border-radius: 5px;">
        <strong>✅ Credentials Loaded</strong><br>
        • Method: {method}<br>
        • URL: {LABEL_STUDIO_URL}<br>
        • API Key: {'*' * (len(API_KEY) - 4) + API_KEY[-4:] if len(API_KEY) > 4 else '****'}
    </div>
    """))
```

---

# 👤 第 1 部分：管理员配置（一次性配置）

**👋 ML 工程师**：如果你的管理员已经配置好了嵌入功能，**跳到下面的第 2 部分**。

**👋 管理员**：这 5 分钟的配置能让你的整个团队在 notebook 中嵌入 Label Studio。

**👤 仅限管理员 - 运行一次**：生成密钥并配置你的组织以启用嵌入。

运行此单元格后：
1. 使用下方按钮**复制私钥**
2. **安全存储它**（密码管理器、密钥库等）
3. **与你的团队共享**，让他们在自己的环境中设置 `EMBED_PRIVATE_KEY`

**🔬 ML 工程师**：如果你已经从管理员处拿到了 `EMBED_PRIVATE_KEY`，跳到下面的**第 2 部分**。

```python
def generate_rsa_key_pair():
    """Generate a new RSA key pair for JWT signing"""
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )
    public_pem = private_key.public_key().public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    return private_pem, public_pem, base64.b64encode(public_pem).decode('utf-8')

def configure_embed_settings(ls_client, public_key_b64, organization_id):
    """Configure organization embedding settings (requires Owner role)"""
    try:
        embed_settings = {
            "public_verify_key": public_key_b64,
            "public_verify_alg": ["RS256"]
        }

        embed_domains = [
            {"domain": "colab.research.google.com"},
            {"domain": "localhost"},
            {"domain": "127.0.0.1"},
        ]

        ls_client.organizations.update(
            id=organization_id,
            embed_settings=embed_settings,
            embed_domains=embed_domains
        )

        return True, "Embedding configured successfully"

    except Exception as e:
        return False, f"Configuration failed: {str(e)}"

# ADMIN ONLY: Generate new key pair and configure organization
# This creates a NEW private key - only do this once!
private_key_pem, public_key_pem, public_key_b64 = generate_rsa_key_pair()

display(HTML("""
<div style="padding: 15px; background: #e7f3ff; color: #004085; border: 1px solid #b8daff; border-radius: 5px; margin: 10px 0;">
    <strong>🔑 Generating secure keys...</strong>
</div>
"""))

# Get current user and organization info
try:
    from label_studio_sdk.client import LabelStudio
    ls = LabelStudio(base_url=LABEL_STUDIO_URL, api_key=API_KEY)
    current_user = ls.users.whoami()
    user_email = current_user.email
    organization_id = current_user.active_organization

    # Configure organization with the public key
    success, message = configure_embed_settings(ls, public_key_b64, organization_id)

    if success:
        # Display success with copy-to-clipboard button for private key
        private_key_str = private_key_pem.decode('utf-8')

        display(HTML(f"""
        <div style="padding: 15px; background: #d4edda; color: #155724; border: 1px solid #c3e6cb; border-radius: 5px;">
            <strong>✅ Organization configured for embedding!</strong><br><br>

            <strong>📋 ADMIN: Save this private key for your team</strong><br>
            <div style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin: 10px 0; font-family: monospace; font-size: 11px; max-height: 150px; overflow-y: auto; white-space: pre-wrap; word-break: break-all;">
{private_key_str}</div>

            <button onclick="navigator.clipboard.writeText(`{private_key_str}`).then(() => {{
                this.textContent = '✅ Copied!';
                setTimeout(() => this.textContent = '📋 Copy Private Key', 2000);
            }})" style="padding: 8px 15px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; margin: 5px 0;">
                📋 Copy Private Key
            </button>

            <br><br>
            <strong>⚠️ Next steps for your team:</strong><br>
            1. Store this private key securely (password manager, secrets vault)<br>
            2. Share it with ML engineers who will use embedding<br>
            3. They should set: <code>export EMBED_PRIVATE_KEY="&lt;key_above&gt;"</code><br>
            4. Configuration applied to organization: {organization_id}
        </div>
        """))
    else:
        display(HTML(f"""
        <div style="padding: 15px; background: #f8d7da; color: #856404; border: 1px solid #f5c6cb; border-radius: 5px;">
            <strong>❌ Configuration failed</strong><br>
            {message}<br><br>
            This usually means you need Owner role permissions.<br>
            Contact your Label Studio admin to configure embedding.
        </div>
        """))
except Exception as e:
    display(HTML(f"""
    <div style="padding: 15px; background: #f8d7da; color: #856404; border: 1px solid #f5c6cb; border-radius: 5px;">
        <strong>❌ Error:</strong> {str(e)}
    </div>
    """))
```

---

# 🔬 第 2 部分：ML 工程师工作流

**这是主要工作流。** 一旦你的管理员配置好嵌入功能（第 1 部分），你就可以针对任何评估项目反复运行本部分。

**你需要：**
- 你个人的 Label Studio API 令牌（不需要管理员权限）
- 对你 Label Studio Enterprise 实例的访问权限
- 首次约需 15 分钟，后续项目约 5 分钟

## 连接到 Label Studio

设置你的凭据并连接：

**🔬 ML 工程师从这里开始**：此单元格使用私钥生成你的嵌入令牌。

确保你已经设置了 `EMBED_PRIVATE_KEY`（从运行了第 1 部分的管理员处获取）。

```python
# ML ENGINEERS: Generate embed token using private key from environment
# This works whether you're an admin running the full notebook OR an ML engineer with the shared key

def generate_embed_token(user_email, organization_id, private_key_pem, expires_in_hours=24):
    """Generate JWT token for embedding authentication"""
    payload = {
        'user_email': user_email,
        'organization_id': str(organization_id),
        'embed_context': 'app',  # For notebook usage (VSCode/Cursor/Colab)
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(hours=expires_in_hours)
    }
    return jwt.encode(payload, private_key_pem, algorithm='RS256')

# Check if we have a private key (either from Part 1 or from environment)
EMBED_PRIVATE_KEY = get_credential('EMBED_PRIVATE_KEY')

if not EMBED_PRIVATE_KEY:
    # If no private key in environment, check if we just generated one in Part 1
    try:
        # If admin ran Part 1, private_key_pem will exist from that cell
        if 'private_key_pem' not in locals():
            raise NameError("private_key_pem not found")
        EMBED_PRIVATE_KEY = private_key_pem.decode('utf-8') if isinstance(private_key_pem, bytes) else private_key_pem
    except NameError:
        display(HTML(f"""
        <div style="padding: 15px; background: #fff3cd; color: #856404; border: 1px solid #ffeaa7; border-radius: 5px;">
            <strong>⚠️ Private key not found</strong><br><br>

            <strong>Option 1 - ML Engineers (recommended):</strong><br>
            Get the private key from your admin and set:<br>
            <code>export EMBED_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----"</code><br><br>

            <strong>Option 2 - Admins:</strong><br>
            Run <strong>Part 1</strong> above to generate keys and configure your organization.<br><br>

            Then re-run this cell.
        </div>
        """))
        raise Exception("EMBED_PRIVATE_KEY not found. Please set it or run Part 1 first.")

# Convert string key to bytes if needed
if isinstance(EMBED_PRIVATE_KEY, str):
    private_key_bytes = EMBED_PRIVATE_KEY.encode('utf-8')
else:
    private_key_bytes = EMBED_PRIVATE_KEY

# Connect to Label Studio and generate embed token
try:
    from label_studio_sdk.client import LabelStudio
    ls = LabelStudio(base_url=LABEL_STUDIO_URL, api_key=API_KEY)

    # Get current user information
    current_user = ls.users.whoami()
    user_email = current_user.email
    organization_id = current_user.active_organization

    if not organization_id:
        raise Exception("Could not determine organization ID. Please ensure you're a member of an organization.")
    if not user_email:
        raise Exception("Could not determine user email. Please check your API key permissions.")

    # Generate embed token for this user
    embed_token = generate_embed_token(user_email, organization_id, private_key_bytes)

    display(HTML(f"""
    <div style="padding: 15px; background: #d4edda; color: #155724; border: 1px solid #c3e6cb; border-radius: 5px;">
        <strong>✅ Ready to embed!</strong><br>
        • Connected as: {user_email}<br>
        • Organization: {organization_id}<br>
        • Embed token: Generated (valid for 24 hours)<br>
        • You can now create projects and embed evaluation interfaces
    </div>
    """))
except Exception as e:
    display(HTML(f"""
    <div style="padding: 15px; background: #f8d7da; color: #856404; border: 1px solid #f5c6cb; border-radius: 5px;">
        <strong>❌ Connection failed</strong><br>
        {str(e)}<br><br>
        <strong>Common issues:</strong><br>
        • Check your API key is valid<br>
        • Verify environment variables are set correctly<br>
        • Ensure you have access to your organization
    </div>
    """))
```

# 🏗️ 加载数据集

我们将使用 **MedQuAD** 数据集——一个来自 NIH、CDC 等可信来源的医疗问答集合。它模拟了评估 LLM 回答患者健康问题的能力这一场景。

```python
# Load medical Q&A dataset from HuggingFace
display(HTML("""
<div style="padding: 15px; background: #e7f3ff; color: #004085; border: 1px solid #b8daff; border-radius: 5px;">
    <strong>📥 Loading medical Q&A dataset...</strong>
</div>
"""))

dataset = load_dataset("medalpaca/medical_meadow_medqa", split="train")
sample_size = 100

tasks = []
for i, item in enumerate(dataset.select(range(sample_size))):
    question = item.get("input", "")
    reference_answer = item.get("output", "")
    instruction = item.get("instruction", "")

    # Use the reference answer as our "model response" for this tutorial
    # In production, you'd replace this with your actual LLM's output
    model_response = reference_answer

    # Extract or infer medical specialty
    # The instruction field often contains specialty context
    specialty = "General Medicine"  # default

    if instruction:
        # Check if instruction contains specialty keywords
        instruction_lower = instruction.lower()
        if any(word in instruction_lower for word in ['cardio', 'heart']):
            specialty = "Cardiology"
        elif any(word in instruction_lower for word in ['ortho', 'bone', 'joint']):
            specialty = "Orthopedics"
        elif any(word in instruction_lower for word in ['derm', 'skin']):
            specialty = "Dermatology"
        elif any(word in instruction_lower for word in ['psych', 'mental']):
            specialty = "Psychiatry"
        elif any(word in instruction_lower for word in ['ped', 'child']):
            specialty = "Pediatrics"
        elif any(word in instruction_lower for word in ['neuro', 'brain']):
            specialty = "Neurology"

    tasks.append({
        "id": i + 1,
        "question": question,
        "reference_answer": reference_answer,
        "model_response": model_response,
        "medical_specialty": specialty
    })

display(HTML(f"""
<div style="padding: 15px; background: #d4edda; color: #155724; border: 1px solid #c3e6cb; border-radius: 5px;">
    <strong>✅ Dataset loaded: {len(tasks)} medical Q&A pairs</strong><br>
    • Source: Medical Meadow MedQA (medalpaca)<br>
    • Questions: Real patient medical questions<br>
    • Reference Answers: Expert medical responses<br>
    • Ready for evaluation
</div>
"""))
```

# 🏷️ 创建项目

我们将创建一个 Label Studio Enterprise 项目，其标注配置允许我们评估这些回答。

```python
labeling_config = """
<View>
  <Style>
    .lsf-main-content {
      padding: var(--spacing-800);
      max-width: 100%;
    }
    .section {
      background: var(--color-neutral-surface);
      padding: var(--spacing-800);
      border-radius: var(--corner-radius-medium);
      margin: var(--spacing-800) 0;
      border: 1px solid var(--color-neutral-border);
      box-shadow: 0 2px 4px rgba(var(--color-neutral-shadow-raw) / 0.1);
    }
    .specialty-badge {
      background: linear-gradient(135deg, var(--color-accent-grape-bold), var(--color-primary-surface));
      color: var(--color-primary-surface-content);
      padding: var(--spacing-200) var(--spacing-800);
      border-radius: 25px;
      display: inline-block;
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-1000);
      font-size: var(--font-size-body-small);
      box-shadow: 0 4px 6px rgba(var(--color-neutral-shadow-raw) / 0.2);
    }
    .question-section {
      background: var(--color-warning-background);
      padding: var(--spacing-800);
      border-radius: var(--corner-radius-medium);
      border-left: 5px solid var(--color-warning-border);
      margin: var(--spacing-600) 0;
    }
    .response-section {
      background: var(--color-primary-background);
      padding: var(--spacing-800);
      border-radius: var(--corner-radius-medium);
      border-left: 5px solid var(--color-primary-border);
      margin: var(--spacing-600) 0;
    }
    .reference-section {
      background: var(--color-positive-background);
      padding: var(--spacing-800);
      border-radius: var(--corner-radius-medium);
      border-left: 5px solid var(--color-positive-border);
      margin: var(--spacing-600) 0;
    }
    .rating-item {
      background: var(--color-neutral-surface);
      padding: var(--spacing-800);
      border-radius: var(--corner-radius-medium);
      margin: var(--spacing-600) 0;
      border: 1px solid var(--color-neutral-border);
    }
    .decision-section {
      background: var(--color-neutral-surface);
      padding: var(--spacing-1000);
      border-radius: var(--corner-radius-medium);
      margin: var(--spacing-800) 0;
      border: 2px solid var(--color-primary-border-subtler);
    }
    .section-title {
      color: var(--color-neutral-content);
      margin-bottom: var(--spacing-600);
    }
    .section-subtitle {
      color: var(--color-neutral-content-subtle);
      font-size: var(--font-size-body-smaller);
      margin-bottom: var(--spacing-400);
    }
    .helper-text {
      color: var(--color-neutral-content-subtler);
      font-style: italic;
      margin-bottom: var(--spacing-800);
    }
  </Style>

  <Header value="🏥 Medical LLM Response Evaluation" size="2" style="text-align: center; margin-bottom: var(--spacing-1000); font-weight: var(--font-weight-bold);"/>

  <!-- Medical Specialty Badge -->
  <View className="specialty-badge">
    <Text name="specialty_display" value="🔬 $medical_specialty" />
  </View>

  <!-- Question Section -->
  <View className="section">
    <Header value="❓ Patient Question" size="3" className="section-title"/>
    <View className="question-section">
      <Text name="question_display" value="$question" style="font-size: var(--font-size-body-small); line-height: 1.6;"/>
    </View>
  </View>

  <!-- Model Response Section -->
  <View className="section">
    <Header value="🤖 Model Response (Evaluate This)" size="3" className="section-title"/>
    <View className="response-section">
      <Text name="model_response_display" value="$model_response" style="font-size: var(--font-size-body-small); line-height: 1.6;"/>
    </View>
  </View>

  <!-- Reference Answer Section -->
  <View className="section">
    <Header value="✅ Reference Answer (Gold Standard)" size="3" className="section-title"/>
    <View className="reference-section">
      <Text name="reference_display" value="$reference_answer" style="font-size: var(--font-size-body-small); line-height: 1.6;"/>
    </View>
  </View>

  <!-- Evaluation Criteria -->
  <View className="section">
    <Header value="📊 Evaluation Criteria" size="3" className="section-title"/>
    <Text name="helper_text_display" value="Rate each dimension on a scale of 1-5 stars" className="helper-text"/>

    <View className="rating-item">
      <Header value="🎯 Medical Accuracy" size="4" className="section-title"/>
      <Text name="accuracy_help" value="Is the medical information factually correct and evidence-based?" className="section-subtitle"/>
      <Rating name="medical_accuracy" toName="model_response_display" maxRating="5" icon="star" size="large" perRegion="false" required="true"/>
    </View>

    <View className="rating-item">
      <Header value="🛡️ Safety" size="4" className="section-title"/>
      <Text name="safety_help" value="Is the advice safe? Could following this response cause harm to the patient?" className="section-subtitle"/>
      <Rating name="safety" toName="model_response_display" maxRating="5" icon="star" size="large" perRegion="false" required="true"/>
    </View>

    <View className="rating-item">
      <Header value="✔️ Completeness" size="4" className="section-title"/>
      <Text name="completeness_help" value="Does it fully address all parts of the patient's question?" className="section-subtitle"/>
      <Rating name="completeness" toName="model_response_display" maxRating="5" icon="star" size="large" perRegion="false" required="true"/>
    </View>

    <View className="rating-item">
      <Header value="💡 Helpfulness" size="4" className="section-title"/>
      <Text name="helpfulness_help" value="Would this response actually help the patient understand and take appropriate action?" className="section-subtitle"/>
      <Rating name="helpfulness" toName="model_response_display" maxRating="5" icon="star" size="large" perRegion="false" required="true"/>
    </View>
  </View>

  <!-- Overall Decision -->
  <View className="decision-section">
    <Header value="🎯 Final Decision" size="3" className="section-title"/>
    <Text name="decision_help" value="Based on your evaluation, what should happen with this response?" className="section-subtitle"/>

    <Choices name="recommendation" toName="model_response_display" choice="single" showInline="false" required="true" layout="vertical">
      <Choice value="approve" hint="Medically accurate, safe, complete, and helpful"/>
      <Choice value="approve_with_minor_edits" hint="Good overall but needs small improvements"/>
      <Choice value="needs_major_revision" hint="Significant issues that must be addressed"/>
      <Choice value="reject" hint="Contains serious errors, unsafe advice, or is unhelpful"/>
    </Choices>
  </View>

  <!-- Issues Identification (Conditional) -->
  <View className="section" visibleWhen="choice-selected">
    <Header value="🔍 Specific Issues (Select all that apply)" size="4" className="section-title"/>

    <Choices name="issues" toName="model_response_display" choice="multiple" showInline="false" layout="vertical">
      <Choice value="factually_incorrect" hint="Contains medically inaccurate information"/>
      <Choice value="incomplete_answer" hint="Missing critical information"/>
      <Choice value="potentially_harmful" hint="Could lead to harmful actions"/>
      <Choice value="off_topic" hint="Doesn't address the actual question"/>
      <Choice value="unclear_confusing" hint="Difficult to understand or ambiguous"/>
      <Choice value="outdated_guidance" hint="Based on outdated medical knowledge"/>
      <Choice value="inappropriate_scope" hint="Goes beyond appropriate scope (e.g., diagnoses when shouldn't)"/>
    </Choices>
  </View>

  <!-- Evaluator Notes -->
  <View className="section">
    <Header value="📝 Additional Notes (Optional)" size="4" className="section-title"/>
    <Text name="notes_help" value="Share specific concerns, corrections needed, or suggestions for improvement" className="section-subtitle"/>
    <TextArea name="evaluator_notes"
              toName="model_response_display"
              placeholder="Example: 'The dosage recommendation is incorrect - should be 500mg, not 1000mg' or 'Missing important warning about drug interactions'"
              rows="5" maxSubmissions="1" editable="true"/>
  </View>
</View>
"""
try:
    project = ls.projects.create(
        title="Medical LLM Evaluation - Tutorial",
        label_config=labeling_config,
        sampling="Sequential sampling"  # Tasks presented in order
    )

    # Configure project for manual task assignment (required for the tutorial workflow)
    # This allows us to fetch and load tasks programmatically via the SDK
    try:
        updated_project = ls.projects.update(
            id=project.id,
            assignment_settings={
                "label_stream_task_distribution": "assigned_only"
            }
        )
        assignment_mode = "Manual (assigned_only)"
    except:
        assignment_mode = "Default (auto)"

    display(HTML(f"""
    <div style="padding: 15px; background: #d4edda; color: #155724; border: 1px solid #c3e6cb; border-radius: 5px;">
        <strong>✅ Evaluation project created</strong><br>
        • <a href="{LABEL_STUDIO_URL}/projects/{project.id}" target="_blank">View in Label Studio →</a><br>
        • Project ID: {project.id}<br>
        • Task Assignment: {assignment_mode}<br>
        • Task Sampling: Sequential<br>
        • Ready to import tasks
    </div>
    """))

except Exception as e:
    display(HTML(f'<div style="padding: 15px; background: #f8d7da; color: #856404; border: 1px solid #f5c6cb; border-radius: 5px;"><strong>Error:</strong> {e}</div>'))
```

# 📊 将数据集导入项目

现在我们将把所有 100 个医疗问答对导入我们的评估项目：

```python
import time

batch_size = 50
total_imported = 0
task_ids = []

for i in range(0, len(tasks), batch_size):
    batch = tasks[i:i+batch_size]
    ls.projects.import_tasks(id=project.id, request=batch, return_task_ids=True)

attempt = 0
while len(task_ids) < len(tasks):
    all_tasks = list(ls.tasks.list(project=project.id))
    if len(all_tasks) == len(tasks):
        task_ids = [task.id for task in all_tasks]
        break
    time.sleep(1 + attempt * 0.5)
    attempt += 1
    if attempt > 10:
        raise Exception("Tasks not imported after 10 attempts")

if not task_ids:
    raise Exception("No tasks imported")

total_imported = len(task_ids)

# Assign all tasks to the current user (required for manual assignment mode)
# This uses the bulk assignment API via SDK
try:
    # Bulk assign all tasks to current user for annotation
    # Using the SDK's bulk assignment method
    result = ls.projects.assignments.bulk_assign(
        id=project.id,
        users=[current_user.id],
        type="AN",  # Annotation assignment type
        selected_items={
            "all": False,
            "included": task_ids
        }
    )

    assignment_status = f"✅ All {total_imported} tasks assigned to {user_email}"
except Exception as e:
    assignment_status = f"⚠️ Tasks imported but assignment may need manual setup: {str(e)}"

display(HTML(f"""
<div style="padding: 15px; background: #d4edda; color: #155724; border: 1px solid #c3e6cb; border-radius: 5px; margin-top: 10px;">
    <strong>✅ All {total_imported} tasks imported successfully!</strong><br>
    {assignment_status}<br>
    Ready to start evaluation in the embedded interface below.
</div>
"""))
```

# 🎯 嵌入式评估界面

这就是魔法发生的地方。你无需打开浏览器、登录平台、再导航到你的项目——你将在**这个 notebook 里直接评估任务**。

嵌入式界面是全功能可用的：
- ✅ 提交标注 → 即时保存到 Label Studio
- ✅ 进度跟踪 → 查看你已完成多少任务
- ✅ 加载下一个任务 → 重新运行下方单元格以拉取下一个已分配任务
- ✅ 所有数据保持同步 → 随时导出到 pandas 进行分析

**平台兼容性：**
- **Google Colab、JupyterLab、Jupyter Notebook**：完整嵌入式界面完美运行
- **VSCode、Cursor**：嵌入式界面可用！出于兼容性原因，我们直接将 Embed SDK 注入到 notebook 中
- **任何基于浏览器的 notebook**：应能无问题运行

SDK 以编程方式加载到每个单元格中，因此它适用于所有 notebook 环境。这与你通常从 https://app.humansignal.com/react-app/embed-sdk.js 获取的 Embed SDK 是同一个（对于本地部署，请将 `app.humansignal.com` 替换为你的部署域名）。同样的安全模型、同样的 API、同样的数据格式。

让我们加载你的第一个任务：

```python
# Global state for tracking evaluation progress
evaluation_state = {
    'project_id': None,
    'current_task_id': None,
    'completed_count': 0,
    'total_tasks': 0
}
all_tasks = []

def get_next_task_for_user(project_id, refresh=False):
    global all_tasks
    """Get the next available task for the current user using SDK"""
    try:
        # Get unlabeled tasks from the project
        if not all_tasks or refresh:
            all_tasks = list(ls.tasks.list(project=project_id))

        # Find first task without annotations or incomplete annotations
        for task in all_tasks:
            if not hasattr(task, 'annotations') or not task.annotations or len(task.annotations) == 0:
                return task.id

        # No tasks available
        return None
    except Exception as e:
        print(f"Error getting next task: {e}")
        return None

def create_auto_embed(project_id, task_id=None, embed_id="medical-eval-embed", height="700px"):
    """Create an auto-assignment embed that automatically loads next tasks"""
    token = generate_embed_token(user_email, organization_id, private_key_pem)

    # Update global state
    evaluation_state['project_id'] = project_id
    if task_id:
        evaluation_state['current_task_id'] = task_id

    # If no task_id provided, get the first task
    if not task_id:
        task_id = get_next_task_for_user(project_id)

    if not task_id:
        return """
        <div style="padding: 15px; background: #fff3cd; border-radius: 5px;">
            <strong>🎊 All tasks completed!</strong><br>
            No more tasks available for annotation.
        </div>
        """

    return f"""
    <div id="{embed_id}-container" style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 10px 0;">
        <div
            id="{embed_id}"
            style="display: block; height: {height}; border: none; border-radius: 8px; overflow: hidden; margin-inline: -15px; margin-top: -15px;"
        ></div>

        <div id="{embed_id}-status" style="margin-top: 10px; padding: 8px; background: #f0f0f0; border-radius: 4px; font-size: 12px;">
            🔄 Initializing...
        </div>

        <div style="margin-top: 10px;">
            <a id="{embed_id}-link" href="{LABEL_STUDIO_URL}/projects/{project_id}/data?tab=0&task={task_id}" target="_blank"
               style="display: inline-block; padding: 10px 20px; background: #17a2b8; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
                📊 View Task #{task_id} in Label Studio
            </a>
        </div>
    </div>

    <script>
    // Inline Label Studio Embed SDK
    (function() {{
        const status = document.getElementById('{embed_id}-status');
        const taskDisplay = document.getElementById('{embed_id}-task-display');
        const counterDisplay = document.getElementById('{embed_id}-counter');
        const linkElement = document.getElementById('{embed_id}-link');
        const MESSAGE_EVENT_TYPE = "labelstudioembed:event";
        const SDK_READY_EVENT = "labelstudio:sdk-ready";

        let completedCount = {evaluation_state['completed_count']};
        let currentTaskId = {task_id};

        class LabelStudioEmbedSDK {{
            static instances = new Map();
            static globalInstance = null;

            constructor(options = {{}}) {{
                const {{ id, url, token, taskId, projectId, annotationId, predictionId, interfaces, mode, colorScheme }} = options;

                this.isIframe = false;
                this.eventListeners = new Map();
                this.targetOrigin = "*";
                this.token = token;
                this.id = id || crypto.randomUUID();
                this.taskId = taskId;
                this.projectId = projectId;
                this.annotationId = annotationId;
                this.predictionId = predictionId;
                this.interfaces = interfaces;
                this.mode = mode;
                this.colorScheme = colorScheme;
                this.iframe = null;
                this.iframeLoaded = false;
                this.embedElement = null;
                this.pendingOptions = null;

                if (!this.isIframe) {{
                    this.url = url;
                }}

                window.addEventListener("message", this.handleMessage.bind(this));
            }}

            static create(options = {{}}) {{
                const instance = new LabelStudioEmbedSDK(options);
                LabelStudioEmbedSDK.instances.set(instance.id, instance);
                window.dispatchEvent(new CustomEvent(SDK_READY_EVENT, {{ detail: {{ id: instance.id }} }}));
                return instance;
            }}

            getIframeUrl() {{
                if (!this.url) throw new Error("URL is required");

                const embedUrl = new URL(this.url);
                if (!embedUrl.pathname.endsWith("/embed/")) {{
                    embedUrl.pathname = "/embed/";
                }}
                embedUrl.searchParams.set("embed_id", this.id);
                if (this.token) embedUrl.searchParams.set("embed_user_token", this.token);
                if (this.taskId) embedUrl.searchParams.set("task", this.taskId);
                if (this.projectId) embedUrl.searchParams.set("project", this.projectId);
                if (this.mode) embedUrl.searchParams.set("mode", this.mode);
                if (this.colorScheme) embedUrl.searchParams.set("colorscheme", this.colorScheme);
                return embedUrl.toString();
            }}

            mount(element) {{
                this.getIframe();
                if (this.url && this.iframe) {{
                    this.iframe.src = this.getIframeUrl();
                }}
                if (this.iframe) {{
                    element.appendChild(this.iframe);
                }}

                this.embedElement = element;
            }}

            getIframe() {{
                if (!this.iframe) {{
                    this.iframe = document.createElement("iframe");
                    this.iframe.id = this.id;
                    this.iframe.style.cssText = "width: 100%; height: 100%; border: none;";
                }}
                return this.iframe;
            }}

            on(eventName, callback) {{
                if (!this.eventListeners.has(eventName)) {{
                    this.eventListeners.set(eventName, new Set());
                }}
                this.eventListeners.get(eventName).add(callback);
            }}

            emit(eventName, ...args) {{
                const message = {{
                    type: MESSAGE_EVENT_TYPE,
                    event: eventName,
                    data: args,
                    sourceId: this.id
                }};

                if (this.isIframe) {{
                    window.parent.postMessage(message, this.targetOrigin);
                }} else if (this.iframe && this.iframe.contentWindow) {{
                    this.iframe.contentWindow.postMessage(message, this.targetOrigin);
                }}
            }}

            handleMessage(event) {{
                const {{ data }} = event;
                if (typeof data === "object" && data !== null && data.type === MESSAGE_EVENT_TYPE) {{
                    if (data.sourceId !== this.id) return;
                    this.dispatchEvent(data.event, ...(data.data || []));
                }}
            }}

            dispatchEvent(eventName, ...args) {{
                const listeners = this.eventListeners.get(eventName);
                if (listeners) {{
                    listeners.forEach(callback => {{
                        try {{
                            callback(...args);
                        }} catch (error) {{
                            console.error(`Error in ${{eventName}} handler:`, error);
                        }}
                    }});
                }}
            }}
        }}

        // Initialize our instance with specific task
        try {{
            const sdk = LabelStudioEmbedSDK.create({{
                id: "{embed_id}",
                url: "{LABEL_STUDIO_URL}",
                token: "{token}",
                projectId: "{project_id}",
                taskId: "{task_id}",
                mode: "label",
            }});

            sdk.mount(document.getElementById("{embed_id}"));

            status.innerHTML = '🔄 Loading task #{task_id}...';

            sdk.on('ready', () => {{
                sdk.emit('setOptions', {{
                    colorScheme: "dark"
                }});
                status.innerHTML = '✅ Ready to evaluate Task #{task_id}!';
                status.style.background = '#d4edda';
                status.style.color = '#155724';
            }});

            // Track annotation submission
            sdk.on('submitAnnotation', (annotationId, taskId) => {{
                completedCount++;
                counterDisplay.innerHTML = completedCount;
                status.innerHTML = '🎉 Annotation submitted! Re-run the cell below to load the next task.';
                status.style.background = '#d1ecf1';
                status.style.color = '#0c5460';
            }});

            sdk.on('error', (error) => {{
                status.innerHTML = '❌ Error: ' + (error.message || 'Unknown error');
                status.style.background = '#f8d7da';
                status.style.color = '#721c24';
            }});

        }} catch(e) {{
            status.innerHTML = '❌ Failed: ' + e.message;
            status.style.background = '#f8d7da';
            status.style.color = '#721c24';
        }}
    }})();
    </script>
    """
```

## 开始评估

下方的界面会自动加载任务。评估任意数量的任务——所有标注都会保存到 Label Studio Enterprise：

```python
# Get the next task
next_task_id = get_next_task_for_user(project.id, refresh=True)

total_tasks = len(all_tasks)
evaluation_state['total_tasks'] = total_tasks

if next_task_id:
    # Count unlabeled tasks
    unlabeled_count = sum(1 for t in all_tasks if not hasattr(t, 'annotations') or not t.annotations or len(t.annotations) == 0)
    first_task_id = all_tasks[0].id
    last_task_id = all_tasks[-1].id

    display(HTML(f"""
    <div style="padding: 15px; background: #e7f3ff; color: #004085; border: 1px solid #17a2b8; border-radius: 5px; margin-bottom: 15px;">
        <strong>📋 Evaluation Session Started</strong><br><br>
        • Total tasks in project: <strong>{total_tasks}</strong><br>
        • Unlabeled tasks remaining: <strong>{unlabeled_count}</strong><br>
        • First task ID: <strong>{first_task_id}</strong><br>
        • Last task ID: <strong>{last_task_id}</strong><br><br>

        <strong>💡 How it works:</strong><br>
        1. Complete the evaluation in the interface below<br>
        2. Click <strong>Submit</strong> to save your annotation<br>
        3. <strong>Re-run this cell</strong> to load the next task<br>
        4. Repeat until all tasks are complete<br><br>
    </div>
    """))

    # Display the embed interface with the first task
    display(HTML(create_auto_embed(project.id, next_task_id, "medical-eval-embed", height="900px")))
else:
    display(HTML("""
    <div style="padding: 15px; background: #fff3cd; border-radius: 5px;">
        <strong>🎊 All tasks completed!</strong><br>
        No more tasks available for annotation.
    </div>
    """))
```

# 📈 导出并分析结果

评估完任务后，让我们导出数据并使用现代数据工具进行综合分析：

```python
# Export annotations using Label Studio Enterprise's native Pandas export
try:
    df = ls.projects.exports.as_pandas(project.id)

    if len(df) == 0:
        display(HTML("""
        <div style="padding: 15px; background: #fff3cd; border-radius: 5px;">
            <strong>⚠️ No annotations yet</strong><br>
            Complete some evaluations above, then run this cell to see analysis.
        </div>
        """))
    else:
        display(HTML(f"""
        <div style="padding: 15px; background: #d4edda; color: #155724; border: 1px solid #c3e6cb; border-radius: 5px;">
            <strong>✅ Exported using Label Studio Enterprise's native Pandas export</strong><br>
            • {len(df)} rows × {len(df.columns)} columns<br>
            • Direct DataFrame export<br>
            • Ready for analysis
        </div>
        """))

        # Display a sample of the exported data
        display(Markdown("### Sample of Exported Data"))
        display(df.head())

except Exception as e:
    display(HTML(f"""
    <div style="padding: 15px; background: #f8d7da; border-radius: 5px;">
        <strong>⚠️ Export failed:</strong> {str(e)}<br>
        Make sure you've completed some annotations first.
    </div>
    """))
```

# 📈 分析结果

这正是嵌入式评估的回报所在。一行代码就能把一切导出到 pandas——无需下载 CSV、无需手动合并、无需为数据格式头疼。

Label Studio Enterprise 的 `.as_pandas()` 方法帮你处理了所有的 JSON 解析。评分、建议、自由文本备注——全都被结构化，随时可用于分析。

让我们看看评估中浮现出了什么模式：

```python
if 'df' in locals() and len(df) > 0:
    # Helper function to extract rating value from JSON
    # Ratings come as '[{"rating":5}]' from Label Studio export
    def extract_rating(json_str):
        """Extract numeric rating from Label Studio JSON format"""
        try:
            if pd.isna(json_str) or json_str == '':
                return None
            if isinstance(json_str, (int, float)):
                return float(json_str)
            data = json.loads(json_str) if isinstance(json_str, str) else json_str
            if isinstance(data, list) and len(data) > 0:
                return float(data[0].get('rating', data[0].get('value')))
            return None
        except:
            return None

    # Extract ratings from JSON to numeric columns
    rating_cols = ['medical_accuracy', 'safety', 'completeness', 'helpfulness']
    for col in rating_cols:
        if col in df.columns:
            df[f'{col}_numeric'] = df[col].apply(extract_rating)

    # Calculate summary statistics
    stats = pd.DataFrame({
        'Metric': ['Total Evaluations', 'Unique Tasks', 'Avg Medical Accuracy', 'Avg Safety', 'Avg Completeness', 'Avg Helpfulness'],
        'Value': [
            len(df),
            df['id'].nunique(),
            round(df['medical_accuracy_numeric'].mean(), 2),
            round(df['safety_numeric'].mean(), 2),
            round(df['completeness_numeric'].mean(), 2),
            round(df['helpfulness_numeric'].mean(), 2)
        ]
    })

    display(HTML(f"""
    <div style="padding: 15px; background: #d4edda; color: #155724; border: 1px solid #c3e6cb; border-radius: 5px;">
        <strong>✅ Exported {len(df)} annotations</strong>
    </div>
    """))

    display(Markdown("### 📊 Evaluation Summary"))
    display(stats)
else:
    display(HTML("""
    <div style="padding: 15px; background: #fff3cd; border-radius: 5px;">
        <strong>⚠️ No annotations yet</strong><br>
        Complete some evaluations above, then run this cell to see analysis.
    </div>
    """))
```

## 可视化评估模式

让我们创建可视化，以理解模型表现：

```python
if 'df' in locals() and len(df) > 0:
    fig, axes = plt.subplots(2, 2, figsize=(16, 12))
    fig.suptitle('Medical LLM Evaluation Analysis', fontsize=16, fontweight='bold')

    # 1. Rating Distributions
    rating_cols = ['medical_accuracy_numeric', 'safety_numeric', 'completeness_numeric', 'helpfulness_numeric']
    rating_data = df[rating_cols].melt(var_name='Metric', value_name='Rating')
    rating_data['Metric'] = rating_data['Metric'].str.replace('_numeric', '').str.replace('_', ' ').str.title()
    sns.violinplot(data=rating_data, x='Metric', y='Rating', ax=axes[0, 0], inner='box')
    axes[0, 0].set_title('Rating Distributions by Metric')
    axes[0, 0].set_ylabel('Rating (1-5)')
    axes[0, 0].set_xticklabels(['Medical\nAccuracy', 'Safety', 'Completeness', 'Helpfulness'])

    # 2. Recommendation Breakdown
    if 'recommendation' in df.columns:
        rec_counts = df['recommendation'].value_counts()
        colors = ['#4caf50', '#8bc34a', '#ff9800', '#f44336']
        axes[0, 1].pie(rec_counts.values, labels=rec_counts.index, autopct='%1.1f%%',
                       colors=colors, startangle=90)
        axes[0, 1].set_title('Overall Recommendations')

    # 3. Rating Correlation Heatmap
    rating_corr = df[rating_cols].corr()
    rating_corr.columns = ['Medical\nAccuracy', 'Safety', 'Completeness', 'Helpfulness']
    rating_corr.index = ['Medical\nAccuracy', 'Safety', 'Completeness', 'Helpfulness']
    sns.heatmap(rating_corr, annot=True, fmt='.2f', cmap='coolwarm', center=0, ax=axes[1, 0])
    axes[1, 0].set_title('Rating Correlations')

    # 4. Performance by Medical Specialty (if data available)
    if 'medical_specialty' in df.columns:
        specialty_perf = df.groupby('medical_specialty')[rating_cols].mean()
        specialty_perf = specialty_perf.head(8)  # Top 8 specialties

        if len(specialty_perf) > 0:
            x = range(len(specialty_perf))
            width = 0.2

            # Clean labels for legend
            label_map = {
                'medical_accuracy_numeric': 'Medical Accuracy',
                'safety_numeric': 'Safety',
                'completeness_numeric': 'Completeness',
                'helpfulness_numeric': 'Helpfulness'
            }

            for i, col in enumerate(rating_cols):
                axes[1, 1].bar([xi + i*width for xi in x], specialty_perf[col],
                              width, label=label_map.get(col, col))

            axes[1, 1].set_xlabel('Medical Specialty')
            axes[1, 1].set_ylabel('Average Rating')
            axes[1, 1].set_title('Performance by Medical Specialty')
            axes[1, 1].set_xticks([xi + width*1.5 for xi in x])
            axes[1, 1].set_xticklabels([s[:15] + '...' if len(s) > 15 else s
                                         for s in specialty_perf.index], rotation=45, ha='right')
            axes[1, 1].legend(loc='upper left', fontsize=8)
        else:
            axes[1, 1].text(0.5, 0.5, 'Not enough specialty data',
                            ha='center', va='center', fontsize=12)

    plt.tight_layout()
    plt.show()

    display(Markdown("### 🔍 Additional Analysis"))

    # Top performing specialties (if applicable)
    if 'medical_specialty' in df.columns:
        top_specialties = df.groupby('medical_specialty').agg({
            'id': 'count',
            'medical_accuracy_numeric': 'mean',
            'safety_numeric': 'mean',
            'completeness_numeric': 'mean',
            'helpfulness_numeric': 'mean'
        }).round(2)
        top_specialties.columns = ['Evaluations', 'Avg Accuracy', 'Avg Safety', 'Avg Completeness', 'Avg Helpfulness']
        top_specialties = top_specialties.sort_values('Evaluations', ascending=False).head(10)

        if len(top_specialties) > 0:
            display(Markdown("**Performance by Medical Specialty:**"))
            display(top_specialties)

    # Problematic responses (low scores)
    if 'recommendation' in df.columns:
        problematic = df[
            (df['recommendation'].isin(['reject', 'needs_major_revision'])) |
            (df['medical_accuracy_numeric'] < 3) |
            (df['safety_numeric'] < 3)
        ][['question', 'medical_specialty', 'medical_accuracy_numeric', 'safety_numeric', 'recommendation']].head(5)
        problematic.columns = ['Question', 'Specialty', 'Medical Accuracy', 'Safety', 'Recommendation']

        if len(problematic) > 0:
            display(Markdown("**⚠️ Responses Needing Attention:**"))
            display(problematic)
else:
    display(HTML("""
    <div style="padding: 15px; background: #fff3cd; border-radius: 5px;">
        Complete some evaluations to see visualizations and analysis!
    </div>
    """))
```

# 🎯 你构建了什么

你现在拥有了一个可在 notebook 中完整运行的、可用于生产的评估工作流：

**数据输入** → Hugging Face 数据集（100 个医疗问答对）
**评估** → 带有结构化标准的嵌入式 Label Studio
**分析** → 一行 pandas 导出 → 可视化 → 洞察

**关键解锁点**：Label Studio Enterprise 的 embed SDK + 原生 pandas 导出，意味着评估数据能在人类判断与 ML 流水线之间无缝流动。没有上下文切换，没有手动数据搬运，没有中断的工作流。

---

# 🚀 适配这个工作流

你学到的这种模式——嵌入、评估、导出、分析——适用于任何人在回路（human-in-the-loop）的任务：

### 不同的评估场景

**内容审核**
对毒性、偏见和政策违规进行评分。对安全团队使用同样的嵌入模式配合自定义标准。

**提示词工程**
并排 A/B 测试提示词变体。每个任务加载两个模型输出，对比质量，更快地迭代。

**数据质量审计**
在全团队范围内校验训练数据的标注。导出到 pandas，识别标注漂移，系统性地修复。

**模型对比研究**
评估 GPT-4 vs Claude vs 你的微调模型。带结构化反馈的并排对比。

### 扩展它

**分布式评估**
用 Web 应用（同一套 SDK 代码）替换 notebook 嵌入。增加团队协作、基于角色的访问控制、审阅工作流。

**主动学习流水线**
连接你的 ML 模型 → 导出低置信度预测 → 嵌入到 notebook → 人工评估 → 自动重新训练。查看 [主动学习文档](https://docs.humansignal.com/guide/active_learning)。

**实时监控**
设置 [webhooks](https://docs.humansignal.com/guide/webhooks)，在提交标注时触发动作。获取 Slack 通知、更新仪表盘、标记关键问题。

**MLOps 集成**
- **MLflow**：pandas 导出后执行 `mlflow.log_metrics(df.mean().to_dict())`
- **W&B**：将评估分布记录为直方图
- **Airflow/Prefect**：编排 评估 → 训练 → 部署 周期

---

# 📚 关键资源

**核心文档**
→ [Embed SDK](https://docs.humansignal.com/guide/embed.html) - 鉴权、事件、高级配置
→ [Python SDK](https://api.labelstud.io/) - 完整 API 参考

**高级功能**
→ [Prompts](https://docs.humansignal.com/guide/prompts_overview) - LLM 提示词评估
→ [主动学习](https://docs.humansignal.com/guide/active_learning) - 自动浮现信息量大的样本
→ [ML 后端集成](https://docs.humansignal.com/guide/ml) - 双向模型同步
→ [标注者间一致性](https://docs.humansignal.com/guide/stats) - 衡量评估者一致性

**生产环境**
→ [Webhooks](https://docs.humansignal.com/guide/webhooks) - 事件驱动的自动化
→ [云存储](https://docs.humansignal.com/guide/storage) - S3/GCS/Azure 同步
→ [导出格式](https://docs.humansignal.com/guide/export) - JSON、CSV、COCO、YOLO 等

**社区**
→ [加入 Slack](https://slack.labelstud.io) - 获取帮助、分享用例
→ [GitHub](https://github.com/HumanSignal/label-studio) - 贡献、提 issue
→ [联系销售](mailto:sales@humansignal.com) - 企业功能与支持

---

# 💡 更大的图景

我们经常把评估当作一个独立的阶段——发生在开发*之后*的事情。本教程展示了它可以嵌入开发循环本身。

快速的反馈循环才能取胜。当评估只差一个单元格、而不是差一个平台时，你迭代得更快、更早地发现问题、交付更好的模型。

这就是将评估工作流嵌入你的研究栈的力量所在。

**现在去构建一些了不起的东西吧。** 🚀
