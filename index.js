#! /usr/bin/env node
const { program } = require("commander");
// 添加其他选项，修改帮助选项
const helpOptions = require("./lib/core/help");
// 创建命令
const createCommands = require("./lib/core/create");

const package = require("./package.json");
// 获取模块版本号
// 修改命令
// program.version(package.version,"-v -version");
program.version(package.version);

// 添加其他选项，修改帮助选项
helpOptions();

// 创建命令
createCommands();

// 解析终端指令
program.parse(process.argv);