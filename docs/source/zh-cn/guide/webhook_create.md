---
title: Create custom events for webhooks in Label Studio
short: Webhook development
type: guide
tier: all
order: 410
order_enterprise: 410
meta_title: Create Custom Webhooks in Label Studio
meta_description: Label Studio documentation for creating custom webhook event triggers to create custom integrations between Label Studio and your machine learning pipeline
section: "Integrate & Extend"
parent: "webhooks"
parent_enterprise: "webhooks"

---

如果你想在 Label Studio 中为 webhook 触发自定义事件，你可以扩展 webhook 事件模型。

## 创建自定义 webhook 事件

要创建自定义 webhook 事件，请将你自己的操作添加到 `WebhookActions` 模型中。

例如：

```python
class WebhookAction(models.Model):
    ...
    SOMETHING_HAPPENED = 'SOMETHING_HAPPENED'
    ...
    ACTIONS = {
        SOMETHING_HAPPENED: {
            'name': _('Something happened'),
            'description': _("A thing happened. We wanted to let you know."),
            'key': 'something',
        },
        ...
    ...
```

在 `WebhookAction` 类中声明了操作和关联的属性及有效负载详情后，在发生该事件的代码中调用该事件操作。例如：

```
...python
result = do_something()
emit_webhooks(organization, WebhookAction.SOMETHING_HAPPENED, {'something': [result]})
...
```

你可以使用 `Organization.objects.first()` 来检索组织详情。

### 使用 Python 函数调用事件操作

你可以使用多个函数来调用事件操作。请参考下表：

| Python 函数 | 何时使用 | 其他详情 |
| --- | --- | --- | 
| `get_active_webhooks()` | 获取所有活跃的 webhook。 | |
| `run_webhook()` | 运行一个 webhook 并传递一些有效负载。 | | 
| `emit_webhooks()` | 为某个操作发送所有 webhook 的请求。 | | 
| `emit_webhooks_for_instances()` | 将序列化实例与 webhook 请求一起发送。 | 你必须在 `WebhookAction.ACTIONS` 模型中声明一个 `serializer`。|
 

### 在 API 源代码中使用装饰器调用事件操作

你可以将装饰器与 CRUD REST 方法一起使用，以将事件操作发送到 webhook。你可以使用以下装饰器：

| 装饰器语法 | 何时使用 | 详情 |
| --- | --- | --- | 
| `@api_webhook()` | `POST`/`PUT`/`PATCH` 请求 | 期望带有 `id` 的响应，并在请求之后使用 `.get_object()` 函数发送该信息。 |
| `@api_webhook_for_delete()` | `DELETE` | 在成功删除操作后仅发送 `id` 字段。 | 
