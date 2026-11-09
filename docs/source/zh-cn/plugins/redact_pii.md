---
title: 遮盖标注人员 PII
type: plugins
category: Visualization
cat: visualization
order: 230
meta_title: 遮盖标注人员 PII
meta_description: 匿名化标注人员以减少偏见
tier: enterprise
---

<img src="/images/plugins/redact-thumb.png" alt="" class="gif-border" style="max-width: 552px !important;" />

!!! note
     有关修改此插件或创建自定义插件的信息，请参阅 [自定义并构建你自己的插件](custom)。

     有关常规插件信息，请参阅 [项目插件](/guide/plugins) 和 [插件常见问题](faq)。

## 关于

隐藏标注人员信息有助于减少偏见。下面提供的示例标注配置包含一段 CSS，它会隐藏标注与审核流中的标注人员信息，例如：

![警告截图](/images/plugins/redact.png)

随后，该脚本会取消隐藏标注人员信息，但仅限于处于管理员（Administrator）角色的用户：

![警告截图](/images/plugins/redact-show.png)

!!! note
    标注配置中的 CSS 只会隐藏标注流和审核流中的信息，不会隐藏数据管理器（Data Manager）中的信息。不过，你可以使用[项目设置](/guide/project_settings_lse#Review) 来禁止标注人员和审核人员访问数据管理器。

## 插件

```javascript
/*
  Hide annotator personal information (PII) if the logged user is not an Admin
*/

/**
 * Fetch currently logged user via the HumanSignal API
 */
async function fetchUserInfo() {
  const whoamiUrl = "https://app.humansignal.com/api/current-user/whoami";

  const response = await fetch(whoamiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // No Auth `credentials` needed for `same-origin` given Session-Based Authentication is used in the API
    }
  });

  if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Give visibility to the given selector
 */
function displayEl(sel) {
  const els = document.querySelectorAll(sel);
  if (els) {
    els.forEach(function (el, idx) {
      el.style.display = "block";
    });
  }
}

/**
 * If the logged in user is an Admin, remove the styling added to the view that hides
 * the annotator identity
 */
async function hidePII() {
  let user, role
  try {
    const userInfo = await fetchUserInfo();
    user = userInfo.username || 'Unknown';
    role = userInfo.organization_membership.role || 'Unknown';
  } catch (error) {
    Htx.showModal(`Error fetching user information: ${error.message}`);
  }

  if (!user) {
      console.warn("Did not find a username and it was not 'Unknown'");
      return;
  }

  if (role === 'AD') {
    // console.log("Role is admin; displaying PII");

    // If admin, remove the nulled Style tag
    const firstChild = document.getElementById('noPII').firstChild;
    if (firstChild.tagName === 'STYLE') {
        firstChild.remove();
    }
  }
}

(async () => {
  await hidePII();
})();
```

## 标注配置

```xml
<View idAttr="noPII">
  <Style>
    .lsf-annotation-button__user { display: none; }
    .lsf-userpic { display: none; }
    .lsf-annotation-button__userpic { display: none; }
    .lsf-annotation-button__date { display: none; }
    .lsf-comment-item__name { display: none; }
    .lsf-comment-item__date { display: none; }
    .lsf-comment-item__userpic { display: none; }
    .lsf-history-item__name { display: none; }
    .lsf-history-item__date { display: none; }
  </Style>
  <Text name="text" value="$text" />
  <View style="box-shadow: 2px 2px 5px #999; padding: 20px; margin-top: 2em; border-radius: 5px;">
    <Header value="Choose text sentiment" />
    <Choices name="sentiment" toName="text" choice="single" showInLine="true">
      <Choice value="Positive" />
      <Choice value="Negative" />
      <Choice value="Neutral" />
    </Choices>
  </View>
</View>

```

**相关标签：**

* [View](/tags/view.html)
* [Style](/tags/style.html)
* [Text](/tags/text.html)
* [Header](/tags/header.html)
* [Choices](/tags/choices.html)


## 示例数据

```json
[
  {
    "data": {
      "text": "I recently purchased a portable Bluetooth speaker and have been impressed with its clear sound and long battery life. The speaker is compact and easy to use, making it perfect for outdoor adventures."
    }
  },
  {
    "data": {
      "text": "I bought a smartwatch from this vendor and it has exceeded my expectations. The device offers an intuitive user interface and tracks my daily activities accurately while looking very stylish on my wrist."
    }
  },
  {
    "data": {
      "text": "I ordered a pair of noise-cancelling headphones and they don't do anything to cancel out noise. Waste of money."
    }
  }
]
```
