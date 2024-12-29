import chalk from "chalk";
import fs from "fs-extra";
import ora from "ora";
import path from "path";
import shell from "shelljs";
import logSymbols from "./logSymbols.js";

const workDir = fs.realpathSync(process.cwd());
/**
 * 获取绝对路径
 * @param {String} relativePath
 * @returns {String}
 */
export function getResolvedPath(relativePath) {
  return path.resolve(workDir, relativePath);
}

/**
 * 判断是否支持Unicode
 * @returns {boolean}
 */
export function isUnicodeSupported() {
  if (process.platform !== "win32") {
    return process.env.TERM !== "linux"; // Linux console (kernel)
  }

  return (
    Boolean(process.env.WT_SESSION) || // 是否是windows终端
    Boolean(process.env.TERMINUS_SUBLIME) || // 是否Terminus (<0.2.27)
    process.env.ConEmuTask === "{cmd::Cmder}" || // ConEmu and cmder
    process.env.TERM_PROGRAM === "Terminus-Sublime" ||
    process.env.TERM_PROGRAM === "vscode" ||
    process.env.TERM === "xterm-256color" ||
    process.env.TERM === "alacritty" ||
    process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm"
  );
}

/**
 * 删除文件目录
 * @param {String} path
 */
export async function removeDir(path) {
  const spinner = ora({
    text: `正在删除${path}`,
    color: "yellow",
  }).start();
  try {
    await fs.remove(getResolvedPath(path));
    spinner.succeed(chalk.greenBright(`删除${path}成功`));
  } catch (error) {
    spinner.fail(chalk.yellowBright(`删除${path}失败`));
    console.log(error);
  }
}

/**
 * 修改package.json
 * @param {String} name
 * @param {Object} info
 */
export async function changePackageJson(name, info) {
  try {
    const pkgPath = getResolvedPath(`${name}/package.json`);
    const pkg = await fs.readJson(pkgPath);

    Object.keys(info).forEach((item) => {
      const inpValue = info[item] ? info[item].trim() : "";
      if (item === "name") {
        pkg[item] = inpValue ? inpValue : name;
      } else if (item === "keywords" && inpValue) {
        pkg[item] = inpValue.split(",");
      } else if (inpValue) {
        pkg[item] = inpValue;
      }
    });

    await fs.writeJson(pkgPath, pkg, {
      spaces: 2,
    });
  } catch (err) {
    console.log(
      logSymbols.error,
      chalk.red("对不起,修改自定义package.json失败,请手动修改")
    );
    console.log(err);
  }
}

/**
 * 安装依赖
 */
export function npmInstall(dir) {
  const spinner = ora({
    text: `正在安装依赖`,
    color: "yellow",
  }).start();
  try {
    if (
      shell.exec(`cd ${shell.pwd()}/${dir} && npm install --force -d`).code !==
      0
    ) {
      spinner.fail(chalk.redBright("依赖安装失败"));
      shell.exit(1);
    }
    spinner.succeed(chalk.greenBright("依赖安装成功"));
  } catch (error) {
    spinner.fail(chalk.redBright("依赖安装失败"));
    console.log(error);
  }
}
