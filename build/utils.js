const path = require('path');
const glob = require('glob');

/** 
 * 处理多入口文件
 * @type String
 * @return {Object}
 * {'index':'../src/pages/app/index/index.js'}
*/


let getEntries = (globPath) =>{
  let entries = {};
  glob.sync(globPath).forEach((filePath)=>{  
    let split = filePath.split("/"); 
    let filename = split[split.length - 2];

    entries[filename] = filePath;

  });

  return entries;
}




module.exports = { getEntries };