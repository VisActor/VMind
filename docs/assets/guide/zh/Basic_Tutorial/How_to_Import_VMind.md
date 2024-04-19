# 如何在项目中引用 VMind

在[如何获取 VMind](./How_to_Get_VMind)章节中我们介绍了获取 VMind 的方式，本章节会一一介绍这些获取方式下如何引用 VMind

## cdn 使用

我们从 [cdn](./How_to_Get_VMind#cdn-获取) 获取到 VMind 文件后，就可以将其添加到 HTML 文件的 `<script>` 标签中：

** 说明：cdn 方式引入的时候，VMind 的引用方式需要注意：**

```typescript
const vmind = new VMind.default({
  url,
  model,
  headers: {
    'api-key': apiKey
  }
});
```

```html
<!-- 引入 VMind -->
<script src="https://unpkg.com/@visactor/vmind/build/index.min.js"></script>

<script>
  const vmind = new VMind.default({
  url,
  model,
  headers: {
    'api-key': apiKey
  }
  });
  const { spec } = await vmind.generateChart(userInput, fieldInfo, dataset);
</script>
```

## npm 使用

我们通过 [npm](./How_to_Get_VMind#npm-获取) 的方式将 `@visactor/vmind` 安装到项目之后，就可以通过如下方式进行使用了：

```ts
import VMind, { Model } from '@visactor/vmind'

const vmind = new VMind({
  url, //default is https://api.openai.com/v1/chat/completions
  model: Model.GPT3_5,
  headers: {
    'api-key': apiKey //Your LLM API Key
  }
})
```
