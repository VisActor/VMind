# VMind开源代码贡献指南
首先为你选择加入开源贡献行列的行为点赞👍🏻。再者，十分感谢你选择参与到 VisActor 社区，为这个开源项目做出贡献。




## VMind贡献指南

VisActor 团队通常在 github 上进行开发和 issue 维护，请打开 [Github 网站](https://github.com/)，点击右上角 `Sign up` 按钮，注册一个自己的账号，开启你开源之旅的第一步。

如果因为特殊情况，你无法打开 Github 站点，也可以通过 [Gitee](https://gitee.com/VisActor/VChart) 进行项目开发。

在 [VMind 仓库](https://github.com/VisActor/VMind)中，我们有一份面向所有开源贡献者的[指南](https://github.com/VisActor/VMind/blob/develop/CONTRIBUTING.zh-CN.md)，介绍了有关版本管理、分支管理等内容，**请花几分钟时间阅读了解一下**。




## 你的第一个 PullRequest

### Step0：安装 Git

Git是一种版本控制系统，用于跟踪和管理软件开发项目中的代码变更。它帮助开发者记录和管理代码的历史记录，方便团队协作、代码版本控制、合并代码等操作。通过Git，您可以追踪每个文件的每个版本，并轻松地在不同版本之间进行切换和比较。Git还提供了分支管理功能，使得可以同时进行多个并行开发任务。

-   访问Git官方网站：<https://git-scm.com/>
-   下载最新版本的Git安装程序。
-   运行下载的安装程序，按照安装向导的提示进行安装。
-   安装完成后，你可以通过命令行使用 `git version` 命令确认安装成功。

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/git_version.png)


使用Git时，需要设置你的用户名和电子邮件地址，因为每次Git提交都会使用这些信息。打开命令行，输入以下命令来设置你的Git用户名：

```bash
git config --global user.name "your_username"
git config --global user.email "your_email@example.com"
```

请将 "your_username"和your_email@example.com替换为你想在Git中使用的用户名和邮箱。



### Step1：Fork 项目

-   首先需要 fork 这个项目，进入[VMind 项目页面](https://github.com/VisActor/VMind)，点击右上角的 Fork 按钮

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/fork_vmind.png)

-   你的 github 帐号中会出现 xxxx(你的github用户名)/vmind这个项目
-   在本地电脑上使用以下命令: 得到一个 VMind 文件夹

```
// ssh
git clone git@github.com:xxxx(你的github用户名)/VMind.git
// https
git clone https://github.com/xxxx(你的github用户名)/VMind.git
```




### Step2：获取项目代码

-   进入 VMind 文件夹，添加 VMind 的远程地址

```
git remote add upstream https://github.com/VisActor/VMind.git
```

-   获取 VMind 最新源码

```
git pull upstream develop
```




### Step3：创建分支

-   好了，现在可以开始贡献我们的代码了。VMind 默认分支为 develop 分支。无论是功能开发、bug 修复、文档编写，都请新建立一个分支，再合并到 develop 分支上。使用以下代码创建分支：

```
// 创建功能开发分支
git checkout -b feat/xxxx

// 创建问题修复开发分支
git checkout -b fix/xxxx

// 创建文档、demo分支
git checkout -b docs/xxxx
```

-   现在我们可以在分支上更改代码了
-   假设我们已经添加了一些代码，提交到代码库
-   git commit -a -m "new commit"




### Step4：合并修改

-   一个常见的问题是远程的 upstream (@visactor/vmind) 有了新的更新， 从而会导致我们提交的 Pull Request 时会导致冲突。 因此我们可以在提交前先把远程其他开发者的 commit 和我们的 commit 合并。使用以下代码切换到 develop 分支:

```
git checkout develop
```

-   使用以下代码拉出远程的最新代码:

```
git pull upstream develop
```

-   切换回自己的开发分支:

```
git checkout docs/add-funnel-demo
```

-   把 develop 的 commit 合并到 branch1:

```
git rebase develop
```

-   把更新代码提交到自己的分支中:

```
git push upstream docs/add-funnel-demo
```




### Step5：提交Pull Request

你可以在你的 github 代码仓库页面点击 New pull request 按钮。

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/create_pr.png)

按照模板填写本次提交的修改内容：

-   勾选这是什么类型的修改

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/pr_template.png)

-   填写关联的 issue

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/related_issue.png)



-   若有复杂变更，请说明背景和解决方案

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/background_solution.png)

相关信息填写完成后，点击 Create pull request 提交




## Mini Task 开发指南

"**good first issue**" 是一个在开源社区常见的标签，这个标签的目的是帮助新贡献者找到适合入门的问题。

VMind 的入门问题，你可以通过 [issue 列表](https://github.com/VisActor/VMind/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) 查看，目前包括两类：

-   Demo 案例制作
-   简单功能开发

如果你当前**有时间和意愿**参与到社区贡献，可以在 issue 里看一看 **good first issue**，选择一个感兴趣、适合自己的认领。

相信你一定是一个有始有终的同学，所以，当你了解并决定认领一个 issue 后，请在 issue 下留言告知大家。




### Feature Task

我们准备了一些简单、易上手的特性开发任务，如果你有一定的 Javascript / Typescript 基础，可以认领这类任务。

你可以通过需求开发，更快地了解 VMind 代码架构。**你可以在 issue 下留言，和大家讨论自己的方案**。

1.  请基于 develop 分支，新拉一个 `feat/***`分支进行开发
1.  （如果你已经安装，请跳过此步骤）全局安装 [@microsoft/rush](https://rushjs.io/pages/intro/get_started/)：`npm i --global @microsoft/rush`
1.  根目录下运行 `rush update`
1.  `rush start` 在本地运行 VMind 代码的测试页面

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind_playground.png)

点击左上角“Set API-Key and LLM URL”设置LLM服务url和key

5.  确认所有的测试都是通过的 `rush test`
5.  开发完成后，运行 `rush change` 命令，编写 changelog 并提交
5.  提交所有代码，并在 Github 创建 Pull Request，邀请其他人进行 review

## 拥抱VisActor社区

在你为VIsActor贡献代码之余，我们鼓励你参与其他让社区更加繁荣的事情，比如：

1.  为项目的发展、功能规划 等提建议
2.  创作文章、视频，开办讲座来宣传VisActor
3.  撰写推广计划，同团队一同执行

VisActor 也在努力帮助参与社区建设的同学一同成长，我们计划（但不限于，期待大家更多的建议）提供如下帮助：

1.  以VIsActor 为基础的数据可视化研发培训，帮助参与的同学在编程技能、可视化理论、架构设计等多个方面快速成长。
2.  定期评选“代码贡献奖”和“社区推广奖”
3.  组织社区成员参与开源活动
