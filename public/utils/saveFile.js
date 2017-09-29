// 存储文件
const saveFile = (info, path) => {
  // path: 存储路径; info: 存储内容
  fs.writeFile(path, info, (err) => {
    if(err) throw err;
    console.log('文件已保存')
  });
}
module.exports = {
  saveFile
}