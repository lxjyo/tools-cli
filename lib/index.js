import chalk from "chalk"; // 用于改变文字颜色
import figlet from "figlet"; // 用于美化终端输出
import { program } from "commander"; // 命令行工具
import { table } from "table"; // 用于生成表格
import { readJSONSync } from "fs-extra/esm";
import { templates } from "./constants.js";
import initAction from "./initAction.js";

const pkg = readJSONSync("package.json");
program.version(pkg.version, "-v, --version"); // 设置版本号

program
  .name("tools-cli")
  .description("一个简单的脚手架工具, 用于快速创建项目")
  .usage("<command> [options]")
  .on("--help", () => {
    console.log(
      "\r\n" +
        chalk.greenBright.bold(
          figlet.textSync("tools-cli", {
            font: "Standard",
            horizontalLayout: "default",
            verticalLayout: "default",
            width: 80,
            whitespaceBreak: true,
          })
        )
    );

    console.log(
      `\r\n Run ${chalk.cyan(
        `tools-cli <command> --help`
      )} for detailed usage of given command.`
    );
  });

// 创建create命令
program
  .command("create <name>")
  .description("创建一个新的项目")
  .option("-t, --template [template]", "输入模板名称创建项目")
  .option("-f, --force", "覆盖同名项目")
  .option("-i, --ignore", "忽略项目描述文件")
  .action(initAction);

program
  .command("list")
  .description("查看所有模板")
  .action(() => {
    const header = [
      chalk.cyanBright("模板名称"),
      chalk.cyanBright("模板地址"),
      chalk.cyanBright("模板描述"),
    ];
    // 转换为二维数组
    const content = templates.map((item) => [
      chalk.bold.cyanBright(item.name),
      item.value,
      item.desc,
    ]);
    const data = [header, ...content];
    const config = {
      header: {
        alignment: "center",
        content: chalk.cyanBright(" 模板列表"),
      },
    };
    console.log(table(data, config));
  });

program.parse(process.argv); // 解析命令行参数
