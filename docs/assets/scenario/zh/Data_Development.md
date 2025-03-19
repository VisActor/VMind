# 数据开发
在数据开发等python Notebook场景中，适合在SQL查询结束后，调用VMind Open API进行图表生成，配合py-vchart渲染图表，在Notebook中集成智能可视化能力。

<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/Dorado-2.png" width="400">
<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/Dorado-3.png" width="450">
<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/Dorado-1.png" width="450">

## 示例代码
```python
'''
在Notebook场景下，可在SQL查询后调用VMind Open API进行图表生成，并结合py-vchart进行图表渲染
VMind支持基于大模型的图表生成和基于规则的图表生成
图表生成过程不会将明细数据传给大模型，尽可放心食用
'''

import requests
import pandas as pd
from pyvchart import render_chart

url = "" #VMind OPen API url

# 查询出的数据集：
print('sql查询结果：')
display(sales_data_df)

sales_data_json =sales_data_df.to_json(orient="records", force_ascii=False)

userPrompt = "帮我展示不同区域各商品销售额"  # 用户的展示意图

print()
print('输入展示意图：')
print(userPrompt)
print()

body = {
    "data": sales_data_json,
    "userPrompt": userPrompt,
    "model": "doubao"  # 使用豆包模型
}

# 调用VMind open api进行图表生成
response = requests.post(url, headers=headers, json=body)

chart = response.json().get('chart')[0]
spec = chart.get('spec')
chartType = chart.get('chartType')

# print(spec)
print('生成的图表类型: '+chartType)

# 调用py-vchart渲染图表
render_chart(spec)
```

## 相关阅读
- [VMind Open API](./Open_API)
- [py-vchart](https://visactor.io/vchart/guide/tutorial_docs/Cross-terminal_and_Developer_Ecology/python)
