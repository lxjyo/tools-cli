import download from "download-git-repo"; // 拉取git仓库
import ora from "ora"; // 用于输出loading
import chalk from "chalk"; // 用于改变文字颜色

/**
 *
 * @param {String} repo
 * @param {String} dest
 * @param {Object} opts
 * @returns {Promise<void>}
 */
export function clone(repo, dest, opts = false) {
  const spinner = ora("正在拉取项目模板...").start();
  return new Promise((resolve, reject) => {
    download(repo, dest, opts, (err) => {
      if (err) {
        spinner.fail(chalk.red("拉取失败"));
        reject(err);
      } else {
        spinner.succeed(chalk.green("拉取成功"));
        resolve();
      }
    });
  });
}
