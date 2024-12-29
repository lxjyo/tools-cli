/**
 * 处理create命令
 */
import shell from "shelljs"; // 用于执行shell命令
import chalk from "chalk";
import fs from "fs-extra";
import logSymbols from "./logSymbols.js";
import {
  inquirerChoice,
  inquirerConfirm,
  inquirerInputs,
} from "./interactive.js";
import {
  changePackageJson,
  getResolvedPath,
  npmInstall,
  removeDir,
} from "./utils.js";
import { messages, templates } from "./constants.js";
import { clone } from "./gitClone.js";

class Action {
  constructor(name, option) {
    this.name = name;
    this.option = option;
    this.repository = "";
  }
  async start() {
    // 验证文件名是否合法
    this.validate();
    // 获取模板
    await this.getRepository();
    // 判断是否存在同名文件夹
    await this.existPathHandler();
    // 克隆模板
    await this.cloneRepository();
    // 更新package.json
    await this.updatePackage();
    // 安装依赖
    await this.installDependencies();
  }
  validate() {
    if (!shell.which("git")) {
      console.log(logSymbols.error, "对不起，运行脚本必须先安装git!");
      shell.exit(1);
    }
    // 验证name输入是否合法--不合法内容：中文、特殊字符
    if (this.name.match(/[\u4E00-\u9FFF`~!@#$%&^*[\]()\\;:<.>/?]/g)) {
      console.log(logSymbols.error, "项目名称存在非法字符！");
      shell.exit(1);
    }
  }
  async getRepository() {
    let repository;
    if (this.option.template) {
      const template = templates.find(
        (item) => item.name === this.option.template
      );
      if (!template) {
        console.log(
          logSymbols.error,
          `不存在模板${chalk.yellowBright(this.option.template)}`
        );
        console.log(
          `\r\n 运行${logSymbols.arrow} ${chalk.cyanBright(
            "tools-cli list"
          )} 查看所有可用模板\r\n`
        );
        shell.exit(1);
      }
      repository = template.value;
    } else {
      const answer = await inquirerChoice("请选择模板", templates);
      repository = answer.choice;
    }
    this.repository = repository;
  }
  async existPathHandler() {
    const isExist = fs.existsSync(this.name);
    if (isExist && !this.option.force) {
      console.log(
        logSymbols.error,
        `已存在项目文件夹${chalk.yellow(this.name)}`
      );
      const answer = await inquirerConfirm(
        `是否删除${chalk.yellow(this.name)}文件夹？`
      );
      if (answer.confirm) {
        await removeDir(this.name);
      } else {
        console.log(
          logSymbols.error,
          chalk.redBright(
            `对不起,项目创建失败,存在同名文件夹,${chalk.yellowBright(
              this.name
            )}`
          )
        );
        shell.exit(1);
      }
    } else if (isExist && this.option.force) {
      console.log(
        logSymbols.warning,
        `已经存在项目文件夹${chalk.yellowBright(this.name)},强制删除`
      );
      //删除
      await removeDir(this.name);
    }
  }
  async cloneRepository() {
    try {
      await clone(this.repository, this.name);
    } catch (err) {
      console.log(logSymbols.error, chalk.redBright("对不起,项目创建失败"));
      console.log(err);
      shell.exit(1);
    }
  }
  async updatePackage() {
    if (this.option.ignore) {
      return;
    }
    const answers = await inquirerInputs(messages);
    await changePackageJson(this.name, answers);
  }
  async installDependencies() {
    await npmInstall(this.name);
  }
}

const initAction = (name, option) => {
  const action = new Action(name, option);
  action.start();
};

export default initAction;
