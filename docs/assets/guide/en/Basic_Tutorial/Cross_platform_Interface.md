# Cross-platform Interface Usage

VRender provides a series of default interfaces to shield the impact of cross-platform. Currently, it supports environments such as `Browser`, `Node`, `feishu`, `tt`, and other environments can be supported through extensions.

## Global

Global is a static class that provides global cross-platform APIs. Users can directly use Global as the browser's window, and Global will automatically provide cross-platform compatibility.

Global needs to be manually set to env, and there is no need to add cross-platform methods yourself.

Note: For the node side, use node-canvas. Canopus will not automatically reference it, and you need to manually pass in the node-canvas package.

## GraphicUtil

Unlike Global, GraphicUtil provides cross-platform and graphic-related APIs, including Transform API, MeasureText API.