---
title: 如何用 Label Studio 审阅 Langfuse 追踪
hide_sidebar: true
order: 1008
open_in_collab: true
tutorial: true
community_author: nass600
ipynb_repo_path: tutorials/how-to-review-langfuse-traces-with-label-studio/how_to_review_langfuse_traces_with_label_studio.ipynb
repo_url: https://github.com/HumanSignal/awesome-label-studio-tutorials/tree/main/tutorials/how-to-review-langfuse-traces-with-label-studio
report_bug_url: https://github.com/HumanSignal/awesome-label-studio-tutorials/issues/new
thumbnail: /images/tutorials/tutorials-review-langfuse-traces.png
meta_title: 如何用 Label Studio 审阅 Langfuse 追踪
meta_description: 学习如何将 Langfuse 的 LLM 追踪拉取到 Label Studio Enterprise，并使用自定义 ReactCode UI 进行标注。
is_enterprise: true
badges: SDK, Langfuse, LLM Observability, Eval, Agents, Colab
duration: 10-15 分钟
---

## 0. Label Studio 要求

本教程使用 **ReactCode 模板**，这是一项**仅限 Label Studio Enterprise** 的功能。ReactCode 允许你构建完全自定义的、基于 React 的标注界面——在本例中，是一个三栏式追踪审阅 UI。我们建议[联系我们的团队](https://humansignal.com/contact-sales/) 申请试用或在你的账户中启用它们。

在第 2 节之后，你需要一个运行中的 Label Studio Enterprise 实例，以及从账户设置中获取的 API 密钥。

## 1. 安装与配置

首先，安装所需的依赖：

```python
!pip -q install requests label-studio-sdk python-dotenv langfuse langchain langchain-anthropic anthropic langgraph
```

### 环境配置

在仓库根目录（或本 notebook 所在目录）创建一个 `.env` 文件，包含以下变量：

```bash
# Label Studio Enterprise
LABEL_STUDIO_HOST=http://localhost:8080       # 或你的 LS Enterprise 实例 URL
LABEL_STUDIO_API_KEY=your_label_studio_api_key

# Langfuse
LANGFUSE_BASE_URL=https://cloud.langfuse.com  # 或你的自托管 Langfuse URL
LANGFUSE_PUBLIC_KEY=your_langfuse_public_key
LANGFUSE_SECRET_KEY=your_langfuse_secret_key
LANGFUSE_PROJECT=your_project_name            # 项目名称（用于在 Label Studio 中显示）

# Anthropic（仅第 3a 节生成示例追踪时需要）
ANTHROPIC_API_KEY=your_anthropic_api_key
```

> **注意：** Langfuse 的 API 密钥（公钥 + 私钥对）已经限定在特定项目范围内，因此 `LANGFUSE_PROJECT` 仅用作显示名称——无需解析项目 ID。

**Langfuse 配置**：访问 [Langfuse 文档](https://langfuse.com/docs) 创建账户、生成 API 密钥对，并记录你项目的 base URL。

**Label Studio 配置**：访问 [Label Studio 文档](https://labelstud.io/guide/access_tokens) 获取安装说明，以及如何从账户设置生成 API 令牌。

```python
import os
from dotenv import load_dotenv

load_dotenv(override=True)
load_dotenv(os.path.join(os.path.dirname(os.getcwd()), '.env'), override=True)

# Label Studio Enterprise
LABEL_STUDIO_HOST = os.getenv('LABEL_STUDIO_HOST', 'http://localhost:8080')
LABEL_STUDIO_API_KEY = os.getenv('LABEL_STUDIO_API_KEY', '')

# Langfuse
LANGFUSE_BASE_URL = os.getenv('LANGFUSE_BASE_URL', 'https://cloud.langfuse.com')
LANGFUSE_PUBLIC_KEY = os.getenv('LANGFUSE_PUBLIC_KEY', '')
LANGFUSE_SECRET_KEY = os.getenv('LANGFUSE_SECRET_KEY', '')
LANGFUSE_PROJECT = os.getenv('LANGFUSE_PROJECT', '')

# Anthropic（仅第 3a 节生成示例追踪时需要）
ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY', '')

print('LABEL_STUDIO_HOST:', LABEL_STUDIO_HOST)
print('LANGFUSE_BASE_URL:', LANGFUSE_BASE_URL)
print('LANGFUSE_PROJECT:', LANGFUSE_PROJECT or '(未设置 — 将拉取全部追踪)')
print('Has LABEL_STUDIO_API_KEY?', bool(LABEL_STUDIO_API_KEY))
print('Has LANGFUSE keys?', bool(LANGFUSE_PUBLIC_KEY and LANGFUSE_SECRET_KEY))
print('Has ANTHROPIC_API_KEY?', bool(ANTHROPIC_API_KEY))
```

## 配置：评估流水线

本教程将 Langfuse 以工程为中心的观测工具与 Label Studio 以专家为中心的评估界面连接起来：

**第 1 步：在 Langfuse 中采集追踪**
- Langfuse 将 LLM 追踪捕获为带类型的 observation（`GENERATION`、`TOOL`、`SPAN`、`CHAIN`）
- 以工程师为中心的界面，用于调试、评分与迭代
- 项目范围的 API 密钥让鉴权变得简单——无需查找项目 ID

**第 2 步：在 Label Studio 中进行专家评估**
- 将 Langfuse 的追踪作为结构化标注任务导入 Label Studio
- 领域专家使用自定义 ReactCode UI 评估每一轮
- 协作式工作流：多个 SME 可以标注同一批追踪
- 结构化输出直接汇入质量报告、提示词改进，以及 LLM-as-a-Judge 流水线

## 2. Label Studio ReactCode 配置

> **跳过配置——直接克隆项目**
>
> 下面这个预先配置好的项目包含了可直接使用的完整三栏式 ReactCode 标注界面。点击按钮将其克隆到你的 Label Studio Enterprise 账户，并直接跳到第 4 节导入你的 Langfuse 追踪。
>
> <a href="https://app.humansignal.com/b/MTY1MQ==?p=e"
>   target="_blank" rel="noopener" aria-label="Open in Label Studio" style="all:unset;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;border-radius:4px;border:1px solid rgb(109,135,241);padding:8px 12px;background:rgb(87 108 193);color:white;font-weight:500;font-family:sans-serif;gap:6px;transition:background 0.2s ease;" onmouseover="this.style.background='rgb(97 122 218)'" onmouseout="this.style.background='rgb(87 108 193)'">
>   <svg style="width:20px;height:20px" viewBox="0 0 26 26" fill="none"><path fill="#FFBAAA" d="M3.5 4.5h19v18h-19z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M25.7 7.503h-7.087V5.147H7.588V2.792h11.025V.436H25.7v7.067Zm-18.112 0H5.225v10.994H2.863V7.503H.5V.436h7.088v7.067Zm0 18.061v-7.067H.5v7.067h7.088ZM25.7 18.497v7.067h-7.088v-2.356H7.588v-2.355h11.025v-2.356H25.7Zm-2.363 0V7.503h-2.363v10.994h2.363Z" fill="#FF7557"/></svg>
>   <span style="font-size:14px">Open in Label Studio</span>
>   <svg style="width:16px;height:16px" viewBox="0 0 24 24"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" fill="white"/></svg>
> </a>
>
> 如果你希望通过编程方式配置项目，请遵循本节其余部分。

本教程使用 **ReactCode** 标注配置——这是 Label Studio Enterprise 的一项功能，允许你将自定义的 React 组件作为标注界面嵌入。

该 UI 包含三个面板：

| 面板 | 用途 |
|---|---|
| **轮次（Turns）**（左） | 所有轮次的可滚动列表。按角色筛选、按内容搜索。每张卡片显示角色、工具徽章、延迟，以及标注后的判定结果。 |
| **轮次详情（Turn Details）**（中） | 完整内容、工具调用输入/输出、token 用量、延迟，以及 Claude 的扩展思考（如有）。 |
| **标注（Annotation）**（右） | 用于评估每一轮的结构化表单——参见下方的标注模型。 |

**标注模型——每一轮你采集的内容：**
- **判定（Verdict）** —— 通过（Pass）或失败（Fail）
- **问题标签（Issue tags）** —— 跨越 5 个类别的分类体系：准确性与忠实度、工具与检索、推理与规划、回复质量、安全与合规
- **严重程度（Severity）** —— 严重 / 主要 / 次要 / 建议
- **预期行为（Expected behavior）** —— 自由文本：agent 本应该怎么做？
- **评论（Comments）** —— 任何其他备注

底部栏中的**追踪级判定**（通过 / 失败 / 混合）用于捕捉整体对话质量，独立于各轮次的判定。

<div style="text-align: center; margin: 20px 0;">
  <img src="https://hs-sandbox-pub.s3.us-east-1.amazonaws.com/blogs-draft/tutorial-llm-reactcode-langfuse.png" alt="Langfuse 的三栏式 ReactCode 追踪审阅 UI" style="max-width: 1000px; width: 100%; height: auto; border: 1px solid #ddd; border-radius: 8px;">
</div>

```python
# ReactCode 三栏式追踪标注配置（自包含——无需外部文件）
# 完整的 ~40KB React 组件以 _TEMPLATE_JS 内联（完整代码见 notebook）。

_TEMPLATE_JS = r"""function TraceAnnotator({ React, addRegion, regions, data }) {
  // 736 行的 React 组件，定义了三栏式追踪审阅 UI。
  // 面板：轮次列表（左） | 轮次详情（中） | 标注表单（右）
  // 底部栏：轮次统计 + 追踪级判定（Pass / Fail / Mixed）
  // ... 完整实现见 notebook ...
}"""

LABEL_CONFIG_XML = (
    '<View>\n'
    '  <ReactCode style="height: 95vh" name="trace" toName="trace"'
    ' outputs=\'{"trace_id":"string","turn_id":"string","turn_role":"string",'
    '"verdict":"string","failure_modes":"array","severity":"string",'
    '"expected_behavior":"string","comments":"string"}\'>\n'
    '    <![CDATA[\n    '
) + _TEMPLATE_JS + (
    '\n    ]]>\n'
    '  </ReactCode>\n'
    '</View>'
)
print(LABEL_CONFIG_XML[:300] + '\n...')
```

## 3. 生成示例追踪（可选）

如果你在 Langfuse 中已经有追踪，**请跳过本节**——将 `GENERATE_TRACES = False` 并直接跳到第 4 节。

否则，本单元格会创建一个具备多种工具的 ReAct agent，并使用**启用了扩展思考（extended thinking）的 Claude** 运行 4 段多轮对话，从而在你的 Langfuse 项目中生成真实的追踪。需要 `ANTHROPIC_API_KEY`。

扩展思考让 Claude 在回复前，逐步对复杂、模糊的问题进行推理。思考内容会被捕获到追踪中，并在 Label Studio UI 里可见。

```python
GENERATE_TRACES = True  # 如果 Langfuse 中已有追踪，设为 False

if GENERATE_TRACES:
    from langchain_core.tools import tool
    from langchain_core.messages import HumanMessage
    from langchain_anthropic import ChatAnthropic
    from langchain.agents import create_agent
    from langfuse.langchain import CallbackHandler
    from langfuse import get_client

    if not ANTHROPIC_API_KEY:
        raise RuntimeError('ANTHROPIC_API_KEY is required. Set it in your .env or set GENERATE_TRACES=False.')

    langfuse = get_client()

    @tool
    def calculator(expression: str) -> str:
        """Evaluate a math expression."""
        try:
            return str(eval(expression))
        except Exception as e:
            return f"Error: {e}"

    @tool
    def search_knowledge_base(query: str) -> str:
        """Search an internal knowledge base for company policies, products, or procedures."""
        kb = {
            "refund": "Refund policy: Full refund within 30 days. After 30 days, store credit only. Damaged items: full refund at any time with photo evidence.",
            "shipping": "Standard (5-7 days, free over $50), Express (2-3 days, $12.99), Overnight ($24.99).",
            "warranty": "1-year limited warranty. 2-year extended warranty available for $29.99.",
            "pricing": "Base $99/mo (10 users), Pro $249/mo (50 users), Enterprise custom. Annual billing saves 20%.",
        }
        results = [v for k, v in kb.items() if k in query.lower()]
        return results[0] if results else f"No results found for: {query}"

    @tool
    def get_weather(city: str) -> str:
        """Get current weather for a city."""
        weather_data = {
            "new york": "New York: 72°F, Partly Cloudy, Humidity 65%, Wind 8 mph SW",
            "london": "London: 58°F, Overcast, Humidity 80%, Wind 12 mph W",
            "tokyo": "Tokyo: 82°F, Clear, Humidity 55%, Wind 5 mph NE",
            "paris": "Paris: 63°F, Light Rain, Humidity 75%, Wind 10 mph NW",
        }
        return weather_data.get(city.lower(), f"Weather data not available for {city}")

    # Claude with extended thinking — produces richer traces that surface the model's reasoning
    llm = ChatAnthropic(
        model='claude-sonnet-4-5-20250929',
        max_tokens=16000,
        thinking={'type': 'enabled', 'budget_tokens': 5000},
    )
    agent = create_agent(llm, [calculator, search_knowledge_base, get_weather])

    # 4 multi-turn conversations designed to elicit extended thinking
    conversations = [
        ["I bought a product 37 days ago with a manufacturing defect and an extended warranty. What are all my options?",
         "The item costs $289. Can I use store credit toward a new extended warranty while keeping the original warranty claim open?"],
        ["We have 60 employees — 40 need full access, 20 need read-only. How do we minimize cost?",
         "If we commit to annual billing and add 15 more full-access users next quarter, what's our 12-month total?"],
        ["I'm planning a 20-person client retreat. Compare Tokyo, London, and New York on weather and logistics.",
         "12 attendees are in New York, 8 in London. Re-evaluate the three options for minimal travel disruption."],
        ["I ordered 3 items for $180 with express shipping. One arrived damaged — I need a replacement urgently.",
         "If I return the damaged item and pay for express shipping on the replacement, what's my net out-of-pocket?"],
    ]

    # Langfuse instruments each conversation via a CallbackHandler passed to the agent
    for i, conv_messages in enumerate(conversations, 1):
        print(f"\n--- Conversation {i} ---")
        handler = CallbackHandler()
        chat_history = []
        for msg_text in conv_messages:
            print(f"  User: {msg_text[:80]}...")
            chat_history.append(HumanMessage(content=msg_text))
            result = agent.invoke({'messages': chat_history}, config={'callbacks': [handler]})
            chat_history = result['messages']
            reply = result['messages'][-1].content
            if isinstance(reply, list):
                reply = ' '.join(b.get('text', '') for b in reply if isinstance(b, dict) and b.get('type') == 'text')
            print(f"  Assistant: {str(reply)[:100]}...")
        langfuse.flush()

    print(f'\n✓ Generated {len(conversations)} traces. Proceed to Section 4.')
else:
    print('Skipped trace generation. Proceed to Section 4.')
```

## 4. Langfuse API 客户端

通过 Langfuse REST API 拉取追踪与 observation。你的 API 密钥已经限定在特定 Langfuse 项目范围内，因此返回的所有追踪都属于该项目。

```python
import base64
from typing import Any, Dict, List, Optional
import requests


def _basic_auth(public_key: str, secret_key: str) -> str:
    token = base64.b64encode(f'{public_key}:{secret_key}'.encode('utf-8')).decode('utf-8')
    return f'Basic {token}'


class LangfuseClient:
    def __init__(self, base_url: str, public_key: str, secret_key: str):
        self.base_url = base_url.rstrip('/')
        self.s = requests.Session()
        self.s.headers.update({
            'Authorization': _basic_auth(public_key, secret_key),
            'Content-Type': 'application/json'
        })

    def list_traces(self, limit: int = 20, page: int = 1,
                    from_ts: Optional[str] = None, to_ts: Optional[str] = None) -> Dict[str, Any]:
        url = f'{self.base_url}/api/public/traces'
        params: Dict[str, Any] = {'limit': limit, 'page': page, 'fields': 'core'}
        if from_ts: params['fromTimestamp'] = from_ts
        if to_ts: params['toTimestamp'] = to_ts
        r = self.s.get(url, params=params, timeout=60)
        r.raise_for_status()
        return r.json()

    def get_trace(self, trace_id: str) -> Dict[str, Any]:
        r = self.s.get(f'{self.base_url}/api/public/traces/{trace_id}', timeout=60)
        r.raise_for_status()
        return r.json()

    def list_observations_v2(self, trace_id: str, limit: int = 200) -> List[Dict[str, Any]]:
        """Fetch observations for a trace via v1 API (avoids v2 parseIoAsJson 400)."""
        url = f'{self.base_url}/api/public/observations'
        out: List[Dict[str, Any]] = []
        page, page_size = 1, min(max(limit, 1), 100)
        while True:
            r = self.s.get(url, params={'traceId': trace_id, 'page': page, 'limit': page_size}, timeout=60)
            r.raise_for_status()
            data = r.json().get('data') or []
            out.extend(data)
            if len(data) < page_size: break
            page += 1
        return out


lf = LangfuseClient(LANGFUSE_BASE_URL, LANGFUSE_PUBLIC_KEY, LANGFUSE_SECRET_KEY)
print('Langfuse client ready')
```

## 5. 将 Langfuse 追踪规范化为统一 Schema

Langfuse 将追踪存储为带类型的 observation（`GENERATION`、`TOOL`、`SPAN`、`CHAIN`）。本单元格提取相关的 observation 类型，并将它们映射为一个扁平的轮次序列——与三个平台集成使用的相同 schema——这样 ReactCode UI 就无需关心追踪来自哪个平台。

每个轮次包含：`role`、`content`、`tool_name`、`tool_input`、`tool_calls`、`model`、`usage`（token 计数）、`duration_ms`，以及 `thinking`（Claude 扩展思考块，如有）。

```python
import json as _json


def _to_str(x):
    if x is None: return ''
    if isinstance(x, str): return x
    try: return _json.dumps(x, indent=2, default=str)
    except: return str(x)


def _extract_content(obj):
    if obj is None: return ''
    if isinstance(obj, str): return obj
    if isinstance(obj, dict):
        for key in ('content', 'text', 'input', 'output', 'result'):
            if isinstance(obj.get(key), str) and obj[key].strip():
                return obj[key]
        return _to_str(obj)
    if isinstance(obj, list):
        parts = [_extract_content(item) for item in obj if _extract_content(item).strip()]
        return '\n'.join(parts) if parts else _to_str(obj)
    return str(obj)


def _normalize_usage(obs):
    """Extract token usage from a Langfuse observation."""
    raw = obs.get('usageDetails') or obs.get('usage')
    if not isinstance(raw, dict): return None
    return {
        'input_tokens': raw.get('inputTokens') or raw.get('input_tokens') or raw.get('input') or 0,
        'output_tokens': raw.get('outputTokens') or raw.get('output_tokens') or raw.get('output') or 0,
    }


def _duration_ms(start_str, end_str):
    if not start_str or not end_str: return None
    try:
        from datetime import datetime
        def _parse(s): return datetime.fromisoformat(str(s).replace('Z', '+00:00'))
        return int((_parse(end_str) - _parse(start_str)).total_seconds() * 1000)
    except: return None


def _split_thinking(content):
    """Split Anthropic extended-thinking content blocks into (text, thinking)."""
    if isinstance(content, str): return content, None
    if isinstance(content, list):
        text_parts, thinking_parts = [], []
        for block in content:
            if isinstance(block, dict):
                if block.get('type') == 'thinking': thinking_parts.append(block.get('thinking', ''))
                elif block.get('type') == 'text': text_parts.append(block.get('text', ''))
            elif isinstance(block, str): text_parts.append(block)
        return '\n\n'.join(text_parts), '\n\n'.join(thinking_parts) or None
    return str(content) if content else '', None


def normalize_langfuse_trace(trace, observations):
    """Convert a Langfuse trace + observations into the unified schema.

    Observation types:
      - GENERATION → extract user messages from input + assistant response from output
      - TOOL       → extract tool execution as a tool turn
      - CHAIN, SPAN, AGENT → skip (structural wrappers)
    """
    trace_id = trace.get('id') or trace.get('traceId')
    obs_sorted = sorted(observations, key=lambda o: o.get('startTime') or o.get('createdAt') or '')
    turns = []
    turn_counter = 0
    seen_user_messages = set()

    def add_turn(role, content, **kwargs):
        nonlocal turn_counter
        if not content or not content.strip(): return
        turn = {'turn_id': f'turn_{turn_counter}', 'role': role, 'content': content.strip(),
                'timestamp': kwargs.get('timestamp', '')}
        for k in ('model', 'usage', 'tool_calls', 'tool_name', 'tool_input', 'duration_ms', 'thinking'):
            if kwargs.get(k) is not None: turn[k] = kwargs[k]
        turns.append(turn)
        turn_counter += 1

    for obs in obs_sorted:
        otype = (obs.get('type') or '').upper()
        ts = obs.get('startTime') or obs.get('createdAt') or ''
        duration = _duration_ms(obs.get('startTime') or obs.get('createdAt'), obs.get('endTime'))
        inp, out = obs.get('input'), obs.get('output')

        if otype == 'GENERATION':
            if isinstance(inp, list):
                for msg in inp:
                    if isinstance(msg, dict) and msg.get('role') == 'user':
                        content = msg.get('content', '')
                        if isinstance(content, list):
                            content = ' '.join(p.get('text', '') if isinstance(p, dict) else str(p) for p in content)
                        if content and content.strip():
                            msg_key = content[:200]
                            if msg_key not in seen_user_messages:
                                seen_user_messages.add(msg_key)
                                add_turn('user', content, timestamp=ts)

            if isinstance(out, dict):
                raw_content = out.get('content', '')
                tool_calls = []
                for tc in out.get('tool_calls', []):
                    if isinstance(tc, dict):
                        tool_calls.append({'tool_name': tc.get('name', 'unknown'),
                                           'input': _to_str(tc.get('args', tc.get('input', ''))),
                                           'call_id': tc.get('id', '')})

                assistant_content, thinking = _split_thinking(raw_content)
                if assistant_content and assistant_content.strip():
                    add_turn('assistant', assistant_content, timestamp=ts,
                             model=obs.get('model') or obs.get('providedModelName'),
                             usage=_normalize_usage(obs),
                             tool_calls=tool_calls if tool_calls else None,
                             duration_ms=duration, thinking=thinking)

        elif otype == 'TOOL':
            tool_name = obs.get('name') or 'unknown'
            tool_output = _extract_content(out) if out else ''
            if tool_output:
                add_turn('tool', tool_output, timestamp=ts, tool_name=tool_name,
                         tool_input=_to_str(inp) if inp else '', duration_ms=duration)

    if not turns:
        if trace_input := _extract_content(trace.get('input')):
            add_turn('user', trace_input, timestamp=trace.get('timestamp') or '')
        if trace_output := _extract_content(trace.get('output')):
            add_turn('assistant', trace_output, timestamp=trace.get('timestamp') or '')

    return {
        'trace_id': str(trace_id),
        'session_id': str(trace.get('sessionId') or trace_id),
        'metadata': {
            'name': trace.get('name'),
            'source': 'langfuse',
            'tags': trace.get('tags') or [],
            'start_time': trace.get('timestamp') or trace.get('createdAt') or '',
        },
        'turns': turns,
    }


print('✓ Normalization functions defined')
```

## 6. 拉取、规范化并导入 Label Studio

从 Langfuse 拉取追踪，对其进行规范化，使用 ReactCode 配置创建 Label Studio 项目，并导入任务。

```python
from label_studio_sdk import LabelStudio
from label_studio_sdk.core.request_options import RequestOptions
from typing import Any, Dict, List

_REQUEST_OPTS = RequestOptions(timeout_in_seconds=120)


def create_project(ls_host: str, api_key: str, title: str, label_config: str) -> int:
    client = LabelStudio(base_url=ls_host, api_key=api_key)
    project = client.projects.create(title=title, label_config=label_config, request_options=_REQUEST_OPTS)
    return int(project.id)


def import_tasks(ls_host: str, api_key: str, project_id: int, tasks: List[Dict[str, Any]]) -> Any:
    client = LabelStudio(base_url=ls_host, api_key=api_key)
    return client.projects.import_tasks(id=project_id, request=tasks, return_task_ids=True)


if not LABEL_STUDIO_API_KEY:
    raise RuntimeError('Missing LABEL_STUDIO_API_KEY — set it in your .env file.')

# 1) Fetch traces from Langfuse
traces_payload = lf.list_traces(limit=20, page=1)
traces_list = traces_payload.get('data') or traces_payload.get('traces') or []

if not traces_list:
    raise RuntimeError('No traces returned. Run Section 3 to generate sample traces.')

print(f'Fetched {len(traces_list)} traces from Langfuse')

# 2) Normalize each trace
tasks: List[Dict[str, Any]] = []
for t in traces_list:
    tid = t.get('id') or t.get('traceId')
    if not tid:
        continue
    full_trace = lf.get_trace(str(tid))
    obs = lf.list_observations_v2(str(tid))
    normalized = normalize_langfuse_trace(full_trace, obs)
    if normalized['turns']:
        tasks.append({'data': normalized})
        print(f"  + Trace {tid[:12]}... -> {len(normalized['turns'])} turns "
              f"({sum(1 for t in normalized['turns'] if t['role']=='user')} user, "
              f"{sum(1 for t in normalized['turns'] if t['role']=='assistant')} assistant, "
              f"{sum(1 for t in normalized['turns'] if t['role']=='tool')} tool)")

print(f'\nPrepared {len(tasks)} tasks for import')

# 3) Create project and import
project_id = create_project(
    ls_host=LABEL_STUDIO_HOST,
    api_key=LABEL_STUDIO_API_KEY,
    title=f'Langfuse Trace Review ({LANGFUSE_PROJECT})',
    label_config=LABEL_CONFIG_XML,
)
print(f'Created project: {project_id}')

resp = import_tasks(LABEL_STUDIO_HOST, LABEL_STUDIO_API_KEY, project_id, tasks)
print(f'Imported {len(tasks)} tasks')
print(f'\nDone! Open your project: {LABEL_STUDIO_HOST.rstrip("/")}/projects/{project_id}')
```

## 下一步

- **开始标注**：打开上面的项目链接，在三栏式 ReactCode UI 中逐条浏览追踪
- **与 SME 共享**：邀请领域专家加入你的 Label Studio 项目进行协作评估
- **增量同步**：定期重新运行第 4–6 节，拉取新的追踪
- **导出标注**：使用 Label Studio SDK 或 REST API 拉取结构化标注，用于下游分析或微调
- **自定义分类体系**：编辑标注配置单元格中的 `_TEMPLATE_JS` 变量，添加你所在领域特有的失败模式
- **Braintrust / LangSmith**：参见其他可观测性平台的姊妹教程

## 总结

本教程演示了从 Langfuse 追踪到专家评估的完整工作流：

1. ✓ 配置 Langfuse 与 Label Studio Enterprise 环境
2. ✓ 定义了基于 ReactCode 的三栏式标注 UI（企业版功能）
3. ✓ 运行了具备多种工具、启用 Claude 扩展思考的 ReAct agent —— Langfuse 通过 `CallbackHandler` 捕获追踪
4. ✓ 使用 Basic Auth 的 REST API 从 Langfuse 拉取追踪
5. ✓ 将带类型的 observation（`GENERATION`、`TOOL`）规范化为统一的追踪 schema
6. ✓ 创建了 Label Studio 项目并将追踪作为标注任务导入

### 核心要点

Langfuse 在开发期间擅长带类型的 observation 存储与项目范围的 API 访问。Label Studio Enterprise 提供了协作式的、由专家驱动的评估框架——ReactCode 界面让领域专家获得直观的逐轮审阅体验。这两种工具在 AI 开发生命周期中相互补充。

## 参考资料

- [Langfuse](https://langfuse.com/docs)
- [Label Studio](https://docs.humansignal.com/guide/)
- [Label Studio ReactCode 模板](https://docs.humansignal.com/guide/react_code)
- [Label Studio SDK](https://labelstud.io/sdk/)
- [姊妹教程：Braintrust](how_to_review_braintrust_traces_with_label_studio.html) | [LangSmith](how_to_review_langsmith_traces_with_label_studio.html)
