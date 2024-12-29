/**
 * 用于处理交互
 */
import inquirer from "inquirer";

/**
 * @param {string} message 询问提示语句
 * @returns {boolean} 返回结果
 */
export const inquirerConfirm = async (message) => {
  const answer = await inquirer.prompt({
    name: "confirm",
    type: "confirm",
    message,
  });
  return answer;
};

/**
 * @param {string} message 询问提示语句
 * @param {Array} choices 选项数组
 * @returns {{choice: String}} 返回选择的结果
 */
export const inquirerChoice = async (message, choices) => {
  const answer = await inquirer.prompt({
    name: "choice",
    type: "list",
    message,
    choices,
  });
  return answer;
};

/**
 *
 * @param {String} message
 * @returns String  返回输入的结果
 */
export const inquirerInput = async (message) => {
  const answer = await inquirer.prompt({
    name: "input",
    type: "input",
    message,
  });
  return answer;
};

/**
 * @param {Array<{name: String, message: String}>} messages 询问提示语句数组
 * @returns {Object} 结果对象
 */
export const inquirerInputs = async (messages) => {
  const answers = await inquirer.prompt(
    messages.map((msg) => {
      return {
        name: msg.name,
        type: "input",
        message: msg.message,
      };
    })
  );
  return answers;
};
