
# VMind Application Cases
Intelligence is the core future direction of VisActor. It can effectively reduce the cost of developers' integration and research and development, allowing them to focus their energy on areas other than visualization. VMind not only simplifies the process of chart creation, but also empowers non-professional technical users to create professional-level data visualization works through natural language interaction.

In this article, we will showcase the application of VMind in various scenarios, such as chart intelligent assistant, data video creator, and document assistant. Through these applications, we will show how VMind uses its unique intelligent features to start a new chapter in narrative visualization.

## Chart Intelligent Assistant
VMind can become a visualization agent of a large language model, responsible for tasks such as chart generation and chart editing, to create a "Chart Intelligent Assistant". This assistant can serve as an independent robot or be integrated into other products in the form of Copilot.

<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_chart_assistant-eng-1.jpeg" width="250">
<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_chart_assistant-eng-2.jpeg" width="250">
<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_chart_assistant-eng-3.jpeg" width="250">
<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_chart_assistant-eng-4.jpeg" width="250">

As a chart intelligent assistant, VMind can automatically generate corresponding charts based on the natural language description entered by the user. Regardless of whether you need to display a time-series line chart or a bar chart of different categories, VMind can respond quickly and help you select chart types and generate charts. With VMind, users can create beautiful and information-rich charts without a deep understanding of chart design, greatly improving work efficiency.
Experience address:
- [Coze](https://www.coze.com/s/Zs8MNnSod/)
- [Discord](https://discord.gg/sajqrVSP): Join the Discord channel, you can experience it by @VMind Chart Master robot in the chat

## Visualization Narrative - WordCloud Cube
VisActor has been committed to exploring the application of data visualization in narrative scenarios, and VMind will also launch the intelligent narrative function. We have combined VMind with the Coze platform to launch the WordCloud Cube robot. Users only need to upload the title and core words of the word cloud, and VMind can intelligently generate personalized word clouds of various themes for users.

<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/wordcloud_cube-1.png" width="350">
<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/wordcloud_cube-2.png" width="350">
<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/wordcloud_cube-4.png" width="450">

</br>
<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/wordcloud_cube-3.png" width="350">
<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/wordcloud_cube-5.jpeg" width="400">

Experience address:
- [Coze](https://www.coze.cn/s/iY7WbPQ2/)

## Data Video Creation
Data video is a form of video that displays and introduces data content through charts, animations, annotations, voice-overs, etc. It can make complex data more understandable and guide the audience to obtain useful information and insights. Data videos are widely used in areas such as business presentations, news reports, and education and training. They are an efficient way to present data and are loved by major short video platforms.

The traditional data video creation process requires the creator to use professional visualization software to draw data into charts after collecting data; or use various chart libraries to encode and draw charts and export them as videos. In the era of short videos, anyone can be a video creator. However, non-professional video creators often do not have the ability to visualize data into charts and export them as videos, which greatly increases the threshold for creating data videos.

Based on VMind combined with video editing tools, it can easily create rich and colorful data videos. After using the VMind chart intelligent generation module to generate animated charts, users can export them as videos or GIFs, import them into professional video editing software such as Pr, and create a complete data video.

<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/cut.png" width="700">

<iframe src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/data-video.mp4" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" width="500px" height="472px"> </iframe>

Integrating VMind into video editing tools will also form a complete closed loop for the creation of data videos.

<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/vmind_data_video.png" width="800">

## Document Assistant
When writing reports or documents, accurate and beautiful charts are essential. The document assistant created based on VMind can help users quickly generate charts from selected data and insert them into documents.

<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/vmind_doc_assistant-1-2.png" width="500">
<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/vmind_doc_assistant-2.png" width="600">
<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/vmind_doc_assistant-3.png" width="500">
<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/vmind_doc_assistant-4.png" width="600">

In addition, VMind will also introduce an intelligent insight function. This function can intelligently identify insights in chart data and automatically add annotations to it. These annotations can directly display specific data values, provide additional explanations and context information, and help readers better understand charts.

<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/vmind_doc_assistant_6.png" width="600">
<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/vmind_doc_assistant_5.png" width="800">


## VMind Open API
For some scenarios that are not suitable for introducing front-end SDK (such as Python Notebook or backend scenarios) or inconvenient for applying for LLM service, we also provide Open API service. Users can use VMind through HTTP requests to meet diverse chart visualization needs.

Open API request example:
```curl
curl --location 'VMind Open API service address' \
--header 'api-key: service key' \
--form 'data="[
{
\"product name\": \"Cola\",
\"region\": \"south\",
\"sales\": 2350
},
{
\"product name\": \"Cola\",
\"region\": \"east\",
\"sales\": 1027
},
{
\"product name\": \"Cola\",
\"region\": \"west\",
\"sales\": 1027
}
]"' \
--form 'model="skylark"' \
--form 'userPrompt="Show me the sales of various products in the north"' \
```

Return value:
```json
{
"chart": [
{
"chartSource": "skylark2-pro-4k-v1.2", //chart generation source
"chartType": "BAR CHART", //chart type
"spec": { //generated VChart Spec
"type": "bar",
"xField": [
"region",
"product name"
],
"yField": "sales",
"seriesField": "product name",
//...omit more spec content
},
"usage": { //LLM token consumption details
"completion_tokens": 19,
"prompt_tokens": 1109,
"total_tokens": 1128
},
"time": { //chart animation duration
"totalTime": 2000,
"frameArr": []
}
}
]
}
```

VMind Open API currently supports skylark2-pro model for intelligent data aggregation and chart generation, and chart-advisor for rule-based chart recommendation.
