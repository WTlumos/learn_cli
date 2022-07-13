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