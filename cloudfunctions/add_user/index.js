// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();
const _ = db.command;
//console.log('add_user云函数初始化')
// 云函数入口函数
exports.main = async(event, context) => {
  let add = 2;
  const wxContext = cloud.getWXContext();
  //console.log(add);
  //const _ = db.command
  let ret = await db.collection('users').where({ _openid: _.eq(wxContext.OPENID)}).get();
  //console.log(ret.data.length);
  if(ret.data.length == 0) {add = 1;}
  return {
    addornot: add,
    openid: wxContext.OPENID,
    ret:ret.data
  }
}