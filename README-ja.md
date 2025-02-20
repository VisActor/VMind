# @visactor/vmind

<div align="center">

[English](README.md) | [简体中文](readme-zh.md) | 日本語

</div>

<div align="center">

自動化だけでなく、素晴らしい。オープンソースのインテリジェントな可視化ソリューション。

<p align="center">
  <a href="https://www.visactor.io/vmind">紹介</a> •
  <a href="https://www.visactor.io/vmind/example">デモ</a> •
  <a href="https://www.visactor.io/vmind/guide/Intro_to_VMind">チュートリアル</a> •
  <a href="https://www.visactor.io/vmind/api/VMind_Instance">API</a>•
  <a href="https://www.visactor.io/vmind/openapi">OpenApi</a>
</p>

![](https://github.com/visactor/vmind/actions/workflows/bug-server.yml/badge.svg)
![](https://github.com/visactor/vmind/actions/workflows/unit-test.yml/badge.svg)
[![npm Version](https://img.shields.io/npm/v/@visactor/vmind.svg)](https://www.npmjs.com/package/@visactor/vmind)
[![npm Download](https://img.shields.io/npm/dm/@visactor/vmind.svg)](https://www.npmjs.com/package/@visactor/vmind)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/VisActor/VMind/blob/main/CONTRIBUTING.md#your-first-pull-request)

![](https://img.shields.io/badge/language-TypeScript-red.svg) [![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/visactor/vmind/blob/main/LICENSE)

</div>

## 紹介

`@visactor/vmind` は [VisActor](https://www.visactor.io/) によって提供される、LLM に基づくインテリジェントなチャートコンポーネントで、対話型のチャート生成と編集機能を含んでいます。自然言語インターフェースを提供し、1文で `@visactor/vmind` を使用してチャートナラティブ作品を簡単に作成し、連続した対話を通じて編集することで、データ可視化作品の作成効率を大幅に向上させます。

`@visactor/vmind` の主な特徴は以下の通りです：

- **使いやすい**：表示したいデータと表示したい情報を説明する1文を提供するだけで、`@visactor/vmind` が自動的にチャートを生成します。既存のチャートに基づいて、チャートに加えたい変更を1文で説明すると、`@visactor/vmind` が望む効果を実現します。
- **強力な拡張性**：`@visactor/vmind` のコンポーネントは簡単に拡張およびカスタマイズでき、必要に応じて新しい機能や特徴を追加できます。デフォルトでは OpenAI GPT モデルを使用し、任意の LLM サービスに簡単に置き換えることができます。
- **簡単なナラティブ**：`@visactor/vchart` の強力なチャートナラティブ能力に基づき、`@visactor/vmind` は折れ線グラフ、棒グラフ、円グラフなど、さまざまなタイプのチャートの生成をサポートし、動的な棒グラフやその他の動的なチャートも生成できます。これにより、データを簡単にナレーションできます。さらに、対話型の編集機能を使用して、チャートのスタイルやアニメーション効果を簡単に変更し、ナラティブを作成できます。
- **ワンクリックエクスポート**：`@visactor/vmind` にはチャートエクスポートモジュールが付属しており、作成したチャートナラティブをビデオや GIF としてエクスポートして表示できます。

## 開発ガイド

### ドキュメントページ

VMind リポジトリに入り、以下を実行します：

```bash
# 依存関係をインストール
$ rush update
# デモページを開始
$ rush docs
```

### 開発ページを開始

VMind リポジトリに入り、以下を実行します：

```bash
# 依存関係をインストール
$ rush update
# VMind 開発ページを開始
$ rush vmind
```

これで vmind 開発ページを開始できます。
正常に使用するには、LLM サービスの URL と API キーを設定する必要があります。packages/vmind/\_\_tests\_\_/browser/src/pages/DataInput.tsx で LLM を呼び出すときのヘッダーを変更できます。
packages/vmind フォルダーに新しい .env.local ファイルを作成し、次の内容を書き込みます：

```bash
VITE_GPT_URL="Your service url of gpt model"
VITE_GPT_KEY="Your api-key of gpt model"
VITE_DEEPSEEK_URL="https://api.deepseek.com/chat/completions"
VITE_DEEPSEEK_KEY="Your api-key of deepseek model"
VITE_CUSTOM_URL="Your service url of custom model"
VITE_CUSTOM_KEY="Your api-key of custom model"
VITE_CUSTOM_MODEL="Your Custom Model Name"
VITE_PROXY_CONFIG="Your Vite proxy config for forwarding requests. Must be in JSON string format and is optional. Example: {"proxy": {"/v1": {"target": "https://api.openai.com/","changeOrigin": true},"/openapi": {"target": "https://api.openai.com/","changeOrigin": true}}}"
```

開発環境を開始するときにこれらの設定が自動的に読み込まれます。

## 使用方法

### 📦 インストール

```bash
# npm
$ npm install @visactor/vmind

# yarn
$ yarn add @visactor/vmind
```

### 📊 使用例

#### インテリジェントチャート生成

まず、プロジェクトにVMindをインストールする必要があります：

```bash
# npmでインストール

npm install @visactor/vmind

# yarnでインストール

yarn add @visactor/vmind
```

次に、JavaScriptファイルの先頭でimportを使用してVMindをインポートします

```typescript
import VMind from '@visactor/vmind';
```

VMind は現在、GPT、deepseek、doubao などの API キーを持つ任意のモデルをサポートしています。VMind オブジェクトを初期化するときに呼び出すモデルタイプを指定し、LLM サービスの URL を渡すことができます。次に、VMind インスタンスを初期化し、モデルタイプとモデル URL を渡します：

```typescript
import { Model } from '@visactor/vmind';

const vmind = new VMind({
  url: LLM_SERVICE_URL, // LLM サービスの URL
  model: Model.GPT4o, // 使用するモデル
  headers: {
    'api-key': LLM_API_KEY
  } // ヘッダーは LLM リクエストのリクエストヘッダーとして直接使用されます。モデルの API キーをヘッダーに入れることができます
});
```

サポートされているモデルのリストは次のとおりです：

```typescript
// VMind がサポートするモデル
export enum Model {
  GPT3_5 = 'gpt-3.5-turbo',
  GPT3_5_1106 = 'gpt-3.5-turbo-1106',
  GPT4 = 'gpt-4',
  GPT_4_0613 = 'gpt-4-0613',
  GPT_4o = 'gpt-4o-2024-08-06',
  DOUBAO_LITE = 'doubao-lite-32K',
  DOUBAO_PRO = 'doubao-pro-128k',
  CHART_ADVISOR = 'chart-advisor',
  DEEPSEEK_V3 = 'deepseek-chat',
  DEEPSEEK_R1 = 'deepseek-reasoner'
}
```
また、他のモデルを使用することもできます：
```typescript
import { Model } from '@visactor/vmind';

const vmind = new VMind({
  url: LLM_SERVICE_URL,
  model: LLM_MODEL_NAME, // 選択したモデル
  headers: {
    'api-key': LLM_API_KEY
  }
});
```

VMind は CSV および JSON 形式のデータセットをサポートしています。

CSV データを後続のプロセスで使用するには、データ処理メソッドを呼び出してフィールド情報を抽出し、構造化されたデータセットに変換する必要があります。VMind はルールベースのメソッド `parseCSVData` を提供してフィールド情報を取得します：

```typescript
// CSV 文字列を渡して、フィールド情報と JSON 構造のデータセットを取得
const { fieldInfo, dataset } = vmind.parseCSVData(csv);
```

また、JSON形式のデータセットを渡して`getFieldInfo`メソッドを呼び出し、fieldInfoを取得することもできます：

```typescript
// JSON形式のデータセットを渡して、fieldInfoを取得します
const dataset=[
{
"Product name": "Coke",
"region": "south",
"Sales": 2350
},
{
"Product name": "Coke",
"region": "east",
"Sales": 1027
},
{
"Product name": "Coke",
"region": "west",
"Sales": 1027
},
{
"Product name": "Coke",
"region": "north",
"Sales": 1027
}
]
const fieldInfo = vmind.getFieldInfo(dataset);
```

「様々な車ブランドの販売ランキングの変化」を示したいとします。generateChartメソッドを呼び出し、データと表示内容の説明を直接VMindに渡します：

```typescript
const userPrompt = 'show me the changes in sales rankings of various car brand';
//チャート生成インターフェースを呼び出して、specとチャートアニメーションの時間を取得します
const { spec, time } = await vmind.generateChart(userPrompt, fieldInfo, dataset);
```

このようにして、対応する動的チャートのVChart specを取得します。このspecに基づいてチャートをレンダリングできます：

```typescript
import VChart from '@visactor/vchart';

<body>
<!-- vchart用にサイズ（幅と高さ）を持つDOMを用意します。もちろん、specの設定で指定することもできます -->
<div id="chart" style="width: 600px;height:400px;"></div>
</body>

// vchartインスタンスを作成します
const vchart = new VChart(spec, { dom: 'chart' });
// 描画します
vchart.renderAsync();
```

大言語モデルの能力のおかげで、ユーザーは自然言語でより多くの要求を記述し、「料理」を「カスタマイズ」することができます。
ユーザーは異なるテーマスタイルを指定することができます（現在、gptチャート生成のみがこの機能をサポートしています）。例えば、ユーザーはテックスタイルのチャートを生成することを指定することができます：

```typescript
//userPromptは日本語でも英語でも構いません
//テックスタイルのチャートを生成することを指定します
const userPrompt = 'show me the changes in sales rankings of various car brand,tech style';
const { spec, time } = await vmind.generateChart(userPrompt, fieldInfo, dataset);
```

VMindがサポートするチャートタイプ、フィールドマッピングなども指定することができます。例えば：

```typescript
//折れ線グラフを生成し、自動車メーカーをx軸にすることを指定します
const userPrompt =
  'show me the changes in sales rankings of various car brands,tech style.Using a line chart, Manufacturer makes the x-axis';
const { spec, time } = await vmind.generateChart(userPrompt, fieldInfo, dataset);
```

#### データ集約

グラフライブラリを使用して棒グラフ、折れ線グラフなどを描画する際、データが集約されていない場合、視覚化効果に影響を与えます。同時に、フィールドのフィルタリングやソートが行われていないため、一部の視覚化意図を満たすことができません。例えば：最もコストがかかるトップ10の部門を表示してください、北のさまざまな製品の販売を表示してくださいなど。

VMindはバージョン1.2.2以降、インテリジェントなデータ集約機能をサポートしています。この機能は、ユーザーが入力したデータをデータテーブルとして使用し、ユーザーのコマンドに従ってLLMを使用してSQLクエリを生成し、データテーブルからデータをクエリし、GROUP BYおよびSQL集約メソッドを使用してデータをグループ化、集約、ソート、フィルタリングします。サポートされているSQLステートメントには、SELECT、GROUP BY、WHERE、HAVING、ORDER BY、LIMITが含まれます。サポートされている集約メソッドには、MAX()、MIN()、SUM()、COUNT()、AVG()が含まれます。サブクエリ、JOIN、条件ステートメントなどの複雑なSQL操作はサポートされていません。

VMindオブジェクトの`dataQuery`関数を使用してデータを集約します。このメソッドには3つのパラメータがあります：
- userInput：ユーザー入力。generateChartと同じ入力を使用できます
- fieldInfo：データセットのフィールド情報。generateChartと同じで、parseCSVDataによって取得されるか、ユーザーによって構築されます。
- dataset：データセット。generateChartと同じで、parseCSVDataによって取得されるか、ユーザーによって構築されます。

```typescript
const { fieldInfo, dataset } = await vmind?.dataQuery(userInput, fieldInfo, dataset);
```

このメソッドによって返されるfieldInfoとdatasetは、データ集約後のフィールド情報とデータセットであり、チャート生成に使用できます。
`generateChart`関数は、デフォルトでチャートを生成する前に、同じユーザー入力を使用してデータ集約を実行します。第4パラメータを渡すことでデータ集約を無効にすることができます：
```typescript
const userInput = 'show me the changes in sales rankings of various car brand';
const { spec, time } = await vmind.generateChart(userInput, fieldInfo, dataset, false); //第4パラメータとしてfalseを渡すことで、チャートを生成する前にデータ集約を無効にします。
```

#### データインサイト
[チュートリアル](https://visactor.io/vmind/guide/Basic_Tutorial/Chart_Insight)

#### データ抽出：テキストからチャートへ
[チュートリアル](https://visactor.io/vmind/guide/Basic_Tutorial/Data_Extraction)

#### 対話型編集

開発中、乞うご期待

### 効果表示

#### 動的棒グラフ

![Alt text](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VChart-Video-2.gif)

#### 棒グラフ

![Alt text](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VChart-Video-1.gif)

#### 円グラフ

![Alt text](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VChart-Video-3.gif)
