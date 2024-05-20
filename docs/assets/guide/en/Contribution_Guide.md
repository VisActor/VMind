# VMind Open Source Code Contribution Guide

Firstly, thumbs up👍🏻 for choosing to join the rank of open source contribution. Additionally, we greatly appreciate you choosing to participate in the VisActor community and contributing to this open source project.

## VMind Contribution Guide

The VisActor team usually develops and maintains issues on Github. Please open the [Github website](https://github.com/), click the `Sign up` button in the upper right corner, register an account of your own, and start the first step of your open source journey.

If for some reason you can't open the Github site, you can still work on the project through [Gitee](https://gitee.com/VisActor/VChart).

In the [VMind repository](https://github.com/VisActor/VMind), we have a [guide](https://github.com/VisActor/VMind/blob/develop/CONTRIBUTING.zh-CN.md) for all open source contributors that introduces version management, branch management, etc. **Please take a few minutes to read and understand it**.

## Your First PullRequest

### Step0: Install Git

Git is a version control system used to track and manage changes in code in software development projects. It helps developers record and manage the history of code, making it easy for team collaboration, code version control, merging code, and more. With Git, you can track each version of each file and easily switch between and compare different versions. Git also provides branch management, so you can perform multiple parallel development tasks at the same time.

- Visit the official Git website: <https://git-scm.com/>
- Download the latest version of Git installer.
- Run the downloaded installer and follow the installation wizard's instructions to install.
- After installation, you can use the `git version` command on the command line to confirm successful installation.

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/git_version.png)

When using Git, you need to set your username and email address, as these will be used in every Git commit. Open the command line and input the following commands to set your Git username:

```bash
git config --global user.name "your_username"
git config --global user.email "your_email@example.com"
```

Please replace "your_username" and "your_email@example.com" with the username and email you want to use in Git.

### Step1: Fork the Project

- First, you need to fork this project. Go to the [VMind project page](https://github.com/VisActor/VMind), click the Fork button in the upper right corner.

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/fork_vmind.png)

- Your github account should now have a project named xxxx(your github username)/vmind.
- Use the following command on your local computer: you should get a VMind folder.

```
// ssh
git clone git@github.com:xxxx(your github username)/VMind.git
// https
git clone https://github.com/xxxx(your github username)/VMind.git
```

### Step2: Get the Project Code

- Enter the VMind folder and add the VMind remote address

```
git remote add upstream https://github.com/VisActor/VMind.git
```

- Get the VMind latest source code

```
git pull upstream develop
```

### Step3: Create a Branch

- Now we can start contributing our code. VMind default branch is the develop branch. Whether it is feature development, bug fixes, or document writing, please create a new branch and merge it to the develop branch. Use the following code to create the branch:

```
// Create feature development branch
git checkout -b feat/xxxx

// Create problem-fixing development branch
git checkout -b fix/xxxx

// Create document/demo branch
git checkout -b docs/xxxx
```

- Now we can modify code on the branch
- Let's assume we have added some code and made a commit to the stage
- git commit -a -m "new commit"

### Step4: Merge Changes

- A common problem is that there is new update in the remote upstream(@visactor/vmind) which can cause conflicts when we push the Pull Request. So, before submission, we can merge the commits from other developers with our commits. Use the following code to switch to develop branch:

```
git checkout develop
```

- Use the following code to pull the latest code from remote:

```
git pull upstream develop
```

- Switch back to your own development branch:

```
git checkout docs/add-funnel-demo
```

- Merge the develop commit to branch1:

```
git rebase develop
```

- Push the update code to your own branch:

```
git push upstream docs/add-funnel-demo
```

### Step5: Submit Pull Request

You can click the New pull request button on your github repo page.

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/create_pr.png)

Follow the template to write down the content modified in this submission:

- Check what type of modification this is

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/pr_template.png)

- Fill in the related issue

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/related_issue.png)

- If a complex change has been made, please provide background and solution

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/background_solution.png)

After completing all related information, click Create pull request to submit

## Mini Task Development Guides

"**good first issue**" is a common label in the open source community, aimed to help new contributors find ideal starter issues.

VMind's starter issues can be viewed on the [issue list](https://github.com/VisActor/VMind/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22), which currently includes two types:

- Demo use case creation
- Simple function development

If you currently **have time and are willing** to contribute to the community, look at the good first issue in the issue list, and pick one that interests you and suits your abilities.

I believe you are a student who finishes what you start, so once you understand and decide to take on an issue, please leave a message under the issue to let everyone know.

### Feature Task

We have prepared some simple and easy-to-master feature development tasks. If you have a basic understanding of Javascript/Typescript, you can take on this type of task.

You can learn more about VMind code architecture by implementing requirements. **You can leave a message under the issue and discuss your plan with everyone**.

1. Based on the develop branch, pull a new `feat/***` branch for development
1. (If you've already installed it, skip this step) Install [@microsoft/rush](https://rushjs.io/pages/intro/get_started/) globally: `npm i --global @microsoft/rush`
1. Run `rush update` in the root directory
1. Run `rush start` to test VMind code locally

![](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vmind_playground.png)

Click "Set API-Key and LLM URL" at top left corner to set LLM service url and key

5. Confirm all tests pass `rush test`
5. After completing development, run `rush change` to write changelog and submit changes
5. Commit all code, and create a Pull Request on Github, inviting others to review

## Embrace the VisActor Community

In addition to contributing code to VIsActor, we encourage you to participate in other activities that help the community thrive, such as:

1. Offering suggestions for project development, feature planning, and more
2. Creating articles and videos, hosting lectures to promote VisActor
3. Writing promotional plans and executing them with the team

VisActor is also working hard to help community builders grow together. We plan to (but are not limited to, and look forward to more suggestions from everyone) provide the following assistance:

1. Data visualization development training based on VIsActor, to help participants quickly grow in programming skills, visualization theory, architecture design, and other aspects.
2. Regularly selecting the "Code Contribution Award" and "Community Promotion Award"
3. Organizing community members to participate in open-source activities
