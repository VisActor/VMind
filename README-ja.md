<div align="center">
   <a href="https://github.com/VisActor#gh-light-mode-only" target="_blank">
    <img alt="VisActor Logo" width="200" src="https://github.com/VisActor/.github/blob/main/profile/logo_500_200_light.svg"/>
  </a>
  <a href="https://github.com/VisActor#gh-dark-mode-only" target="_blank">
    <img alt="VisActor Logo" width="200" src="https://github.com/VisActor/.github/blob/main/profile/logo_500_200_dark.svg"/>
  </a>
</div>

<div align="center">
  <h1>VMind</h1>
</div>

<div align="center">

自動だけでなく、素晴らしい。インテリジェントなビジュアライゼーションのためのオープンソースソリューション。

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

<div align="center">

英語 | [簡体字中国語](readme-zh.md)

</div>

## 紹介

`@visactor/vmind`は、[VisActor](https://www.visactor.io/)が提供するLLMに基づいたインテリジェントなチャートコンポーネントであり、対話式のチャート生成および編集機能を含んでいます。自然言語のインタラクションインターフェースを提供し、たった一文で`@visactor/VMind`を使ってチャートナラティブ作品を簡単に作成し、継続的な対話を通じて編集することができ、データビジュアライゼーション作品を作成する効率を大幅に向上させます。

`@visactor/vmind`の主な特徴は以下の通りです：

- **使いやすさ**：表示したいデータと表示したい情報を説明する一文を提供するだけで、`@visactor/vmind`が自動的にチャートを生成します。既存のチャートに基づいて、チャートに加えたい変更を一文で説明すると、`@visactor/VMind`が望む効果を実現するのに役立ちます。
- **強力な拡張性**：`@visactor/VMind`のコンポーネントは簡単に拡張およびカスタマイズでき、必要に応じて新しい機能や特徴を追加できます。デフォルトではOpenAI GPTモデルを使用しており、任意のLLMサービスに簡単に置き換えることができます。
- **簡単なナラティブ**：`@visactor/vchart`の強力なチャートナラティブ能力に基づいて、`@visactor/VMind`はさまざまなタイプのチャートの生成をサポートしており、折れ線グラフ、棒グラフ、円グラフなどを含み、動的な棒グラフなどの動的なチャートも生成できます。これにより、データを簡単にナラティブ化できます。さらに多くのチャートタイプが追加されています。また、対話式の編集機能を使用して、チャートスタイルやアニメーション効果を簡単に変更できるため、ナラティブを簡単に作成できます。
- **ワンクリックでエクスポート**：`@visactor/VMind`にはチャートエクスポートモジュールが付属しており、作成したチャートナラティブをビデオやGIFとしてエクスポートして表示できます。

## 開発ガイド

### ドキュメントページ

VMindリポジトリに入り、以下を実行します：

```bash
# 依存関係のインストール
$ rush update
# デモページの開始
$ rush docs
```

### 開発ページの開始

VMindリポジトリに入り、以下を実行します：

```bash
# 依存関係のインストール
$ rush update
# VMind開発ページの開始
$ rush vmind
```

これで、vmind開発ページを開始できます。
正常に使用するには、LLMサービスのURLとAPIキーを設定する必要があります。packages/vmind/\_\_tests\_\_/browser/src/pages/DataInput.tsxでLLMを呼び出す際のヘッダーを変更できます。
packages/vmindフォルダに新しい.env.localファイルを作成し、その中に以下を書き込むことができます：

```bash
VITE_SKYLARK_URL="Your service url of skylark model"
VITE_GPT_URL="Your service url of gpt model"
VITE_SKYLARK_KEY="Your api-key of skylark model"
VITE_GPT_KEY="Your api-key of gpt model"
VITE_PROXY_CONFIG="Your Vite proxy config for forwarding requests. Must be in JSON string format and is optional. Example: {"proxy": {"/v1": {"target": "https://api.openai.com/","changeOrigin": true},"/openapi": {"target": "https://api.openai.com/","changeOrigin": true}}}"
```

これらの設定は、開発環境を開始する際に自動的に読み込まれます。

### プロジェクト構造

- \_\_tests\_\_: 開発用のプレイグラウンド
- src/common: 共通のデータ処理、チャート推奨方法、チャート生成パイプライン
- src/gpt: gptに関連するインテリジェントチャート生成コード
- src/skylark: skylarkに関連するインテリジェントチャート生成コード
- src/chart-to-video: ビデオ、GIFのエクスポートに関連するコード

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

VMindは現在、OpenAI GPT-3.5、GPT-4モデルおよびskylark-proシリーズモデルをサポートしています。ユーザーは、VMindオブジェクトを初期化する際に呼び出すモデルタイプを指定し、LLMサービスのURLを渡すことができます。次に、モデルタイプとモデルurlを渡してVMindインスタンスを初期化します：

```typescript
import { Model } from '@visactor/vmind';

const vmind = new VMind({
  url: LLM_SERVICE_URL, //LLMサービスのURL
  model: Model.SKYLARK, //現在、gpt-3.5、gpt-4、skylark proモデルをサポートしています。後続のチャート生成で指定されたモデルが呼び出されます
  headers: {
    'api-key': LLM_API_KEY
  } //headersはLLMリクエストのリクエストヘッダーとして直接使用されます。モデルのapiキーをヘッダーに入れることができます
});
```

サポートされているモデルのリストはこちらです：

```typescript
//VMindがサポートするモデル
//より多くのモデルが開発中です
export enum Model {
  GPT3_5 = 'gpt-3.5-turbo',
  GPT4 = 'gpt-4',
  SKYLARK = 'skylark-pro',
  SKYLARK2 = 'skylark2-pro-4k'
}
```

VMindはCSV形式とJSON形式のデータセットをサポートしています。

後続のプロセスでCSVデータを使用するには、データ処理メソッドを呼び出してフィールド情報を抽出し、構造化されたデータセットに変換する必要があります。VMindは、フィールド情報を取得するためのルールベースのメソッド`parseCSVData`を提供しています：

```typescript
// CSV文字列を渡して、fieldInfoとJSON構造のデータセットを取得します
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

#### 大模型リクエスト方法のカスタマイズ

VMindオブジェクトを初期化する際にパラメータを渡します：

```typescript
import VMind from '@visactor/vmind';
const vmind = new VMind(openAIKey:string, params:{
url?: string;//大模型サービスのURL
/** gptリクエストヘッダー、優先度が高い */
headers?: Record<string, string> ;//リクエストヘッダー
method?: string;//リクエストメソッド POST GET
model?: string;//モデル名
max_tokens?: number;
temperature?: number;//0に設定することを推奨
})
```

urlで大模型サービスのurlを指定します（デフォルトはhttps://api.openai.com/v1/chat/completions）
後続の呼び出しで、VMindはparamsのパラメータを使用して大模型サービスのurlにリクエストします。

#### データ集約
📢 注意：データ集約機能はGPTシリーズモデルのみをサポートしています。より多くのモデルが近日中に提供される予定です。

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

#### 対話式編集

開発中、乞うご期待

### 効果表示

#### 動的棒グラフ

![Alt text](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VChart-Video-2.gif)

#### 棒グラフ

![Alt text](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VChart-Video-1.gif)

#### 円グラフ

![Alt text](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VChart-Video-3.gif)
