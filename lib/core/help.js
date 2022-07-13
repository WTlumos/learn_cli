const { program } = require("commander");


const helpOptions = ()=>{
    // 添加其他选项，修改帮助选项
    program.option('-i, --info','a learn cli');
    program.option('-s, --src <src>','a source folder');
    program.option('-d, --dest <dest>','a destination folder, 如: -d src/pages');
    program.option('-f, --framework <framework>','your framework name');

    program.on('--help',function(){
        console.log("");
        console.log("Others:");
    });
}

module.exports = helpOptions;