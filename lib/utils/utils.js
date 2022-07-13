const ejs = require("ejs");
const path = require("path");
const fs = require("fs");

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