const {promisify} =require("util");
const path = require("path");
// 项目地址
const { vueGitRepo } = require("../config/repo-config");
// 下载github项目
const download = promisify(require("download-git-repo"));
// 执行终端命令
const spawnCommand = require("../utils/terminal");

// 编译ejs文件
const {compile, writeToFile} = require("../utils/utils");
// 判断文件不存在就创建文件
const { mkdirSync } = require("fs");

/* download callback函数
    download('地址', '存储文件名', function (err) {
        console.log(err ? 'Error' : 'Success')
    })
    -> 利用 promisify 转为 promise函数
    -> 利用 async await 转为 同步函数
*/

const createProjectAction = async (project,others)=>{
    /*
    命令$ learn create abc 123 456
    输出$ abc [ '123', '456' ]
    */
    // console.log(project,others);

    // 1. 提示信息
    console.log("Learn_cli helps you create your project, please wait a moment");

    // 2. 从仓库clone项目
    await download(vueGitRepo, project, { clone: true });

    // 3. 执行终端命令 npm install
    const npm = process.platform === 'win32'? 'npm.cmd':'npm';
    /**
     * child_process.spawn(command[, args][, options])
     * command - The command to run.
     * args - List of string arguments.
     * cwd - Current working directory of the child process.
     */
    await spawnCommand(npm,['install'],{cwd: `./${project}`});

    // 4. 运行项目
    spawnCommand(npm,['run','serve'],{cwd: `./${project}`});

    // 5. 打开浏览器
    open("http://localhost:8080/ ");

}

// 添加组件的action
const addComponentAction = async (name,dest)=>{

    handleEjsToFile(name,dest,'vue-component.ejs',`${name}.vue`);
}

// 添加page
const addPageAction = async (page,dest)=>{
    handleEjsToFile(page,dest,'vue-component.ejs',`${page}.vue`);
    handleEjsToFile(page,dest,'vue-router.ejs','router.js');
}


// 添加 store
const addStoreAction = async (store,dest)=>{
    handleEjsToFile(store,dest,'vue-store.ejs',`${store}.js`);
    handleEjsToFile(store,dest,'vue-types.ejs',`types.js`);
}

// 公共函数
const handleEjsToFile = async (name,dest,template,filename)=>{
     // 1. 编译ejs模板result
   const result =  await compile(template,{name, lowerName: name.toLowerCase()});
   // console.log(result);

   // 2. 写入文件操作
   // console.log(dest);
   // 判断文件不存在就创建文件
   mkdirSync(dest,{recursive:true});
   const targetPath = path.resolve(dest,filename);
   writeToFile(targetPath,result);
}

module.exports = {
    createProjectAction,
    addComponentAction,
    addPageAction,
    addStoreAction
};