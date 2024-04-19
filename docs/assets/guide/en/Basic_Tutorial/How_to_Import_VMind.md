# How to Reference VMind in Your Project

In the [How to Get VMind](./How_to_Get_VMind) section, we introduced how to get VMind. This section will introduce how to reference VMind under these acquisition methods one by one.

## Using cdn

After we get the VMind file from [cdn](./How_to_Get_VMind#cdn-获取), we can add it to the `<script>` tag in the HTML file:

** Note: When introducing VMind in the cdn way, you need to pay attention to the reference method of VMind:**

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
<!-- Introduce VMind -->
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

## Using npm

After we install `@visactor/vmind` into the project through [npm](./How_to_Get_VMind#npm-获取), we can use it in the following way:

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
