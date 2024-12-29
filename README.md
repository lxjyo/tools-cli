### 自定义脚手架

基本的步骤，也就下面几步：

1、用户交互选择对应的模板

2、通过 git 下载对应的模板到本地，并根据用户交互完成配置更新与相关依赖安装

3、美化

还可以将自定义脚手架可以发布到 npm，可以像 vue-cli 一样全局安装之后直接使用

#### 细节点

1. 需要支持命令行交互;比如 `tools-cli` 可输出命令选项;`tools-cli -v` 可查看版本; `tools-cli create test`可创建项目 等
2. 需要根据用户的不同选择去下载模板
3. 判断是否存在同名文件夹，需要提供用户是否删除选项
4. 更新下载后工程的 package.json
5. 自动执行安装依赖

#### 需要用到的第三方工具

- [download-git-repo](https://www.npmjs.com/package/download-git-repo)：下载并提取 git 仓库
- [commander](https://www.npmjs.com/package/commander)：解析命令和参数，处理命令行输入的命令
- [inquirer](https://www.npmjs.com/package/inquirer)：常见交互式命令行用户界面的集合
- [shelljs](https://www.npmjs.com/package/shelljs)：基于 Node.js API 的 Unix shell 命令的可移植**(Windows/Linux/OS X)实现**
- [fs-extra](https://www.npmjs.com/package/fs-extra)：fs 的扩展，提供了非常多的便利 API，并且继承了 fs 所有方法和为 fs 方法添加了 promise 的支持
- [chalk](https://www.npmjs.com/package/chalk)：美化终端输出，提供了多种终端输出颜色选择
- [figlet](https://www.npmjs.com/package/figlet)：终端标题美化
- [ora](https://www.npmjs.com/package/ora)：终端显示下载动画
- [table](https://www.npmjs.com/package/table)：在终端用表格形式展示数据
