# 跨端接口使用

VRender提供了一系列默认的接口，用于屏蔽跨端的影响，目前会支持`Browser`、`Node`、`feishu`、`tt`等环境，其余环境可以通过扩展支持。

## Global

Global是一个静态类，提供了全局的跨端API，用户可以直接拿Global当浏览器的window用，Global会自动提供跨平台的兼容

Global需要手动设置env，不需要自行添加跨端方法

注意：node端使用node-canvas，Canopus不会自动引用，需要用户手动将node-canvas包传入

## GraphicUtil

与Global不同的是，GraphicUtil提供的是跨端方面以及图形方面的API，其中包括Transform API，MeasureText API