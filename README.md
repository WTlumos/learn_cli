[TOC]

# 实现自己的脚手架工具

##  创建项目

1. 创建index.js

2. 创建package.json 

    ```bash
    npm init -y
    ```

3. 创建命令

    入口文件index.js中，添加如下指令(shebang也成为hashbang)

    ```js
    #! /usr/bin/env node
    console.log("learn_cli");
    ```

4. 修改package.json

    ```json
    "bin":{
    "learn":"index.js"
    }
    ```

5. 执行命令

    ```bash
    $ npm link
    
    added 1 package in 2s
    $ learn
    learn_cli
    ```



## Commander的使用

编写代码来描述你的命令行界面

Commander 负责将参数解析为选项和命令参数，为问题显示使用错误，并实现一个有帮助的系统

https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md

### 安装

```bash
npm install commander
```



###  目录结构

```bash
|- learn_cli
    |- lib
    	 |- config
    	 	|- repo-config.js
       |- core
          |- help.js
          |- create.js
       |- templates
       	  |- vue-component.ejs
          |- vue-router.ejs
       	  |- vue-store.ejs
       	  |- vue-types.ejs
       |- utils
    |- node_modules
    |- index.js
    |- package-lock.js
    |- package.js
```



### 编写命令信息

```js
// =================lib/core/help.js=======================
const { program } = require("commander");
const helpOptions = ()=>{
    // 添加其他选项，修改帮助选项
    program.option('-i --info','a learn cli');
    program.option('-s --src <src>','a source folder');
    program.option('-d --dest <dest>','a destination folder, 如: -d src/pages');
    program.option('-f --framework <framework>','your framework name');

    program.on('--help',function(){
        console.log("");
        console.log("Others:");
    });
}

module.exports = helpOptions;


// ==========================index.js============================
#! /usr/bin/env node
const { program } = require("commander");
// 添加其他选项，修改帮助选项
const helpOptions = require("./lib/core/help");

const package = require("./package.json");
// 获取模块版本号
// 修改命令
// program.version(package.version,"-v -version");
program.version(package.version);

// 添加其他选项，修改帮助选项
helpOptions();

// 解析终端指令
program.parse(process.argv);
```

运行命令

```bash
$ learn --help
Usage: learn [options]

Options:
  -V, --version               output the version number
  -i --info                   a learn cli
  -s --src <src>              a source folder
  -d --dest <dest>            a destination folder, 如: -d src/pages
  -f --framework <framework>  your framework name
  -h, --help                  display help for command

Others:
$
$
$ learn --version
$ 1.0.0
```



## 创建项目指令

### 思路

1.  创建解析create指令

2.  通过download-git-repo从代码仓库中下载模板 

  https://www.npmjs.com/package/download-git-repo

  ```bash
  $ npm install download-git-repo
  ```

3.  进入目录，并且执行 `npm install`命令

4.  执行 `npm run serve`命令

5.  打开浏览器



### 创建解析create指令

创建 /lib/core/create.js

单独引入 `createProjectAction` promise函数

```js
//=================== /lib/core/create.js ====================
const { program } = require("commander");
const { createProjectAction } = require("./actions");

const createCommands =  ()=>{
    program
    // 创建命令
    .command('create <project> [otherArgs...]')
    // 描述信息
    .description('clone a repository into a newly created directory')
    // 命令中参数信息
    .action(createProjectAction);
}
module.exports = createCommands;
```



### 定义项目地址

创建 /lib/config/repo-config.js

```js
//==================== /lib/config/repo-config.js =======================
const vueGitRepo = "direct:https://github.com/coderwhy/hy-vue-temp.git";

module.exports = {
    vueGitRepo
}
```



### createProjectAction函数实现

创建 /lib/core/action.js

```js
//==================== /lib/core/action.js =======================
const {promisify} =require("util");
// 项目地址
const { vueGitRepo } = require("../config/repo-config");
const download = promisify(require("download-git-repo"));

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
    

    // 2. 从仓库clone项目
    await download(vueGitRepo, project, { clone: true });

    // 3. 执行终端命令 npm install

    // 4. 运行项目
  
  	// 5. 打开浏览器
}

module.exports = {
    createProjectAction
};
```



### 执行命令

```js
// ========================= index.js======================
// 创建命令
const createCommands = require("./lib/core/create");
createCommands();
```

终端

```bash
$ learn create vue-cli
```



### 执行 `npm install`命令

创建 /utils/termianls.js

https://nodejs.org/dist/latest-v16.x/docs/api/child_process.html#child_processspawncommand-args-options

```js
// ========================= lib/util/termianl.js======================
/**
 * 执行终端命令
 */
// 开启子进程
const {spawn} = require("child_process");

const spawnCommand = (...args)=>{
    return new Promise((resolve,reject)=>{
        const childProcess = spawn(...args);
        // 打印输出流
        childProcess.stdout.pipe(process.stdout);
        // 打印出错信息
        childProcess.stderr.pipe(process.stderr);
        childProcess.on('close',()=>{
            resolve();
        });
    });

}
module.exports = spawnCommand;
```

在 /lib/core/action.js 中添加 `npm install `代码

```js
// 终端命令
const spawnCommand = require("../utils/terminal");
const createProjectAction = async (project,others)=>{
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
  
  	// 5. 打开浏览器
}
```

终端

```
$ learn create vue-cli
```

自动创建的文件夹，并完成 `npm install`



### 执行 `npm run serve`命令

在 /lib/core/action.js 中添加 `npm run serve`代码

```js
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
```



## 创建添加组件-页面-vuex命令

### 思路

- 创建addcpn、addpage、addstore的命令
- 准备好对应的ejs模块(`component.vue.ejs`, `vue-router.js.ejs`, `vue-store.js.ejs`, `vue-types.js.ejs`) 
- 封装编译ejs模块的函数
- 封装将编译后的内容，写入文件的函数
- 将上面封装的所有代码放到一起的函数



###  编写ejs模块

https://ejs.bootcss.com/ 高效的嵌入式 JavaScript 模板引擎

`/lib/templates/vue-component.ejs`

```ejs
<template>
    <div class="<%= data.name %>">
      <h1>{{ msg }}</h1>
    </div>
  </template>
  
  <script>
  export default {
    name: '<%= data.name %>',
    props: {
      msg: String
    },
    components: {

    },
    mixins: [],
    data: function(){
        return {
            message: "<%= data.lowerName %>"
        }
    },
    created: function(){

    },
    mounted: function(){

    }

  }
  </script>
  
  <style scoped>
    .<%= data.name %>{

    }
  </style>
```

`/lib/templates/vue-router.ejs`

```ejs
// 普通加载路由
// import Home from  './Home.vue'
// 懒加载路由
const <%= data.name %> = ()=> import('./<%= data.name%>.vue') 

export default{
    path: '/<%= data.lowerName %>',
    name: '<%= data.name %>',
    component: '<%= data.name %>',
    children: [
    ]
}
```

`/lib/templates/vue-store.ejs`

```ejs
import * as types from './types.js'
export default{
    namespaced: true,
    state: {

    },
    mutations: {

    },
    actions: {

    },
    getters: {
        
    }
}
```

`/lib/templates/vue-types.ejs`

```ejs
export {
    
}
```



### 创建addcpn指令代码

`lib/core/create.js` 添加指令

```js
const { createProjectAction,addComponentAction } = require("./actions");

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
}
```

`lib/core/action.js`

```js
// 编译ejs文件
const {compile, writeToFile} = require("../utils/utils");
// 判断文件不存在就创建文件
const { mkdirSync } = require("fs");

// 添加组件的action
const addComponentAction = async (name)=>{
    // 1. 编译ejs模板result
   const result =  await compile("vue-component.ejs",{name, lowerName: name.toLowerCase()});
   // console.log(result);
  
  	// 2. 写入文件操作
    // console.log(dest);
   // 判断文件不存在就创建文件
    mkdirSync(dest,{recursive:true});
    const targetPath = path.resolve(dest,`${name}.vue`);
    writeToFile(targetPath,result);
}

module.exports = {
    createProjectAction,
    addComponentAction
};
```

`lib/utils/util.js`

先下载 ejs 模板

```bash
npm i ejs
```

编写代码

```js
const ejs = require("ejs");
const path = require("path");

const compile = (templateName, data)=>{
    const templatePath = path.resolve(__dirname,`../templates/${templateName}`);

    // console.log(templatePath);

    /**
        ejs.renderFile(filename, data, options, function(err, str){
            // str => 输出渲染后的 HTML 字符串
        });
     */
    return new Promise((resolve,reject)=>{
        ejs.renderFile(templatePath,{data},{},(err,str)=>{
            if(err){
                console.log(err);
                reject(err);
                return;
            }

            resolve(str);
        })
    })

}

// 写入文件
const writeToFile = (path,content)=>{
    if(fs.existsSync(path)){
        console.error("the file already exist!");
        return;
    }
    return fs.promises.writeFile(path,content);
}

module.exports = {
    compile,
    writeToFile
}
```

执行命令

```bash
learn addcpn Narbar
```

在 `src/components`中得到模板代码

```bash
<template>
    <div class="Narbar">
      <h1>{{ msg }}</h1>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Narbar',
    props: {
      msg: String
    },
    components: {

    },
    mixins: [],
    data: function(){
        return {
            message: "narbar"
        }
    },
    created: function(){

    },
    mounted: function(){

    }

  }
  </script>
  
  <style scoped>
    .Narbar{

    }
  </style>
```



### 创建addpage指令代码

`/lib/core/create.js`

```js
const { createProjectAction,addComponentAction, addPageAction} = require("./actions");

const createCommands =  ()=>{
    // 从github抓取项目

    // 创建vue组件

    // 创建vue page
    program
    // 创建命令
    .command('addpage <page>')
    // 描述信息
    .description('add vue page, 例如: learn addpage Home [-d src/pages]')
    // 命令中参数信息
    .action(page => addPageAction(page, program.opts().dest|| `src/pages/${page.toLowerCase()}`));

    // 创建vue store

}
```

`lib/core/action.js`

```js
// 添加组件的action
const addComponentAction = async (name,dest)=>{
    handleEjsToFile(name,dest,'vue-component.ejs',`${name}.vue`);
}

// 添加page
const addPageAction = async (page,dest)=>{
    handleEjsToFile(page,dest,'vue-component.ejs',`${page}.vue`);
    handleEjsToFile(page,dest,'vue-router.ejs','router.js');
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
    addPageAction
};
```

执行命令

```bash
learn addpage Home
```



### 创建 addstore 指令代码

`/lib/core/create.js`

```js
const { createProjectAction,addComponentAction, addPageAction, addStoreAction } = require("./actions");

const createCommands =  ()=>{
    // 从github抓取项目

    // 创建vue组件

    // 创建vue page

    // 创建vue store
    program
    // 创建命令
    .command('addstore <store>')
    // 描述信息
    .description('add vue store, 例如: learn addstore favor [-d dest]')
    // 命令中参数信息
    .action(store => addStoreAction(store, program.opts().dest|| `src/store/modules/${store.toLowerCase()}`));

}
```

`/lib/core/action.js`

```js
// 添加 store
const addStoreAction = async (store,dest)=>{
    handleEjsToFile(store,dest,'vue-store.ejs',`${store}.js`);
    handleEjsToFile(store,dest,'vue-types.ejs',`types.js`);
}

module.exports = {
    createProjectAction,
    addComponentAction,
    addPageAction,
    addStoreAction
};
```

执行命令

```bash
learn addstore user
```



# 发布项目

1. 注册npm账号:  

   https://www.npmjs.com/ 

   选择sign up 								

2. 在命令行登录

   ```bash
   npm login	
   ```

3. 修改package.json

   ```json
    "keywords": ["vue","CLI","component"],
     "author": "wtlumos",
     "license": "MIT",
     "homepage": "https://github.com/WTlumos",
     "repository": {
       "type": "git",
       "url": "https://github.com/WTlumos"
     }
   ```

4. 发布到 npm registry上 	

    ```bash
    npm publish 
    ```

5. 更新仓库

   1. 修改版本号(最好符合semver规范) 

   2. 重新发布

6. 删除发布的包

   ```bash
   npm unpublish
   ```

7. 让发布的包过期

   ```bash
   npm deprecate
   ```


