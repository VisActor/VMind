# VMind OpenAPI

在VMind图表生成工具的基础上，VisActor团队全新推出了VMind Agent，提升了智能生成的准确性和效率，并新增了多轮编辑能力。目前VMind Agent提供了OpenAPI接口，你可以通过调用这些接口来实现更高级的智能生成能力。[VMind Agent Playground](/vmind/playground)提供了一个简单的测试环境，方便体验VMind Agent的能力。

## VSeed

VSeed是一个面向分析领域的DSL, 封装了该领域常用的图表能力, 极大地提升分析式报表平台的搭建效率。一般情况下, 给定数据集和图表类型, 即可直接出图，每类图表类型存在大量的默认约定逻辑。

VSeed是VChart和VTable的子集，配置相比VChart和VTable大幅简化，配置项更适合大模型理解，是专为LLM生成封装的图表库。

VSeed 项目仓库：[https://github.com/VisActor/VSeed](https://github.com/VisActor/VSeed)

VSeed 能力展示：[https://visactor.github.io/VSeed/galley/chartType/line.html](https://visactor.github.io/VSeed/galley/chartType/line.html)

VMind Agent优先推荐使用VSeed进行代码生成，生成效果更加优秀，也同时支持VChart和VTable的原生代码生成。

## VMind Agent

VMind Agent的整体技术方案如下：

用户输入的指令和代码块，输入VMind Agent后，Agent会基于LLM主动调用工具，开始逐步进行 生成/编辑 -> 检查 -> 编辑 -> 检查 ...... 任务流，最终完成用户的要求，输出对应的代码块和文本解释说明。

相比传统的图表生成工具，VMind Agent在一下方面有优势：
- 🤖 ReAct 架构: 基于 LangGraph 实现的推理-行动循环
- 🛠️ 多样化工具: 支持多种图表生成和编辑工具
- 📊 图表类型: 支持多种图表类型和表格类型
- 🎨 模板系统: 预置多种图表模板
- 🔧 图表编辑: 支持对现有图表进行修改
- 💬 自然语言: 支持纯自然语言输入生成图表

### VMind Agent 架构

VMind Agent 主要由Coordinator调度器和若干工具组成，基于`@langchain/langgraph库`完成Agent的实现。主要模块如下：

<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_Agent_Design_1.png" >

#### Coordinator

调度器主要工作是：基于当前状态，判断下一步应该调用哪一个工具，或结束任务。

#### Generate Tool

生成工具在用户没有输入代码，或指令要求重新生成代码时调用。如果没有指定图表类型，工具会基于数据推荐适合的图表类型。每一种图表/表格类型都会提供基础的模版，LLM会基于用户的数据和模版生成最简单的代码块，供进一步编辑使用。

#### Edit Tool

编辑工具是VMind Agent的核心部分，LLM会基于当前的代码和用户的目标，将任务拆分为多个简单的步骤并逐一完成。在执行每次编辑任务前，工具会基于本次步骤的任务要求，在知识库中召回对应的资料，辅助LLM进行编辑。

#### Check Tool

检查工具在每一步编辑操作后执行，用来检查当次编辑操作是否会引起恶性错误，或是否没有达到当次步骤的目标。如果检查不通过，会回退上一次编辑操作。

#### 短期记忆

每一次对话会记录当前的sessionId，方便同一个用户进行多轮对话时，找回之前轮次的对话所记录的状态，方便用户进行多轮编辑操作。

### VMind Agent 知识库

为了避免LLM在编辑代码时出现幻觉，VMind Agent将编辑范围严格限制在每次编辑操作提供的知识库片段中。知识库主要分为两部分：

#### RAG

教程文档、示例Demo和Q&A问答内容，内容独立性强，适合使用RAG方案。相应片段进行向量化后，存入向量数据库。每次进行编辑操作时，会召回对应的若干文本及代码片段，供大模型参考。
大模型进行编辑时，如果召回有非常接近的内容，会已经对应的代码片段准确进行相应的编辑。

#### Type Docs

图表和表格的配置Schema，按照不同的图表/表格类型，以及不同的模块（例如坐标轴、图例等）进行拆分，组织成一个个类型说明片段。每个片段中有该部分对应的属性名称、属性类型和属性说明，不同的片段使用不同的TopKey进行索引。使用LLM将每个每个片段进行归纳总结，生成对应的说明Markdown片段，存储在数据库中。每一个TopKey也依据对应的Markdown片段，使用LLM总结一段简单的说明，介绍这个TopKey下的功能范围。

每次编辑时，首先依据编辑指令召回对应的若干TopKey，之后将TopKey对应的Markdown文本片段，作为知识库加入prompt中，大模型的编辑操作会被严格限制在本次召回的知识库的范围，避免幻觉影响编辑结果。

## VMind Agent 应用

### Playground

VMind Agent Playground提供了一个简单的测试环境，方便体验VMind Agent的能力。你可以在Playground中输入指令和代码块，查看Agent的生成和编辑结果。

[VMind Agent Playground](/vmind/playground)

### 抖音小程序

基于VMind Agent的，我们开发了一个示例小程序，抖音小程序搜索 数据智能洞察助手 对话小程序，用户可以在小程序中输入需要进行智能洞察的文本，体验Agent的生成和编辑结果。

<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/VMind_Agent_Demo.jpeg" >

## VMind OpenAPI 使用咨询

加入飞书群欢迎联系我们，咨询VMind OpenAPI的使用方案。

<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind/tutorials/open_api_lark_group.png" >
