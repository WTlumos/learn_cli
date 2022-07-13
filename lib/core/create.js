const { program } = require("commander");
const { createProjectAction,addComponentAction, addPageAction, addStoreAction } = require("./actions");

const createCommands =  ()=>{
    // 从github抓取项目
    program
    // 创建命令
    .command('create <project> [otherArgs...]')
    // 描述信息
    .description('clone a repository into a newly created directory')
    // 命令中参数信息
    .action(createProjectAction);

    // 创建vue组件
    program
    // 创建命令
    .command('addcpn <name>')
    // 描述信息
    .description('add vue component, 例如: learn addcpn NarBar [-d src/components]')
    // 命令中参数信息
    .action(name => addComponentAction(name, program.opts().dest|| 'src/components'));

    // 创建vue page
    program
    // 创建命令
    .command('addpage <page>')
    // 描述信息
    .description('add vue page, 例如: learn addpage Home [-d src/pages]')
    // 命令中参数信息
    .action(page => addPageAction(page, program.opts().dest|| `src/pages/${page.toLowerCase()}`));

    // 创建vue store
    program
    // 创建命令
    .command('addstore <store>')
    // 描述信息
    .description('add vue store, 例如: learn addstore favor [-d dest]')
    // 命令中参数信息
    .action(store => addStoreAction(store, program.opts().dest|| `src/store/modules/${store.toLowerCase()}`));

}


module.exports = createCommands;