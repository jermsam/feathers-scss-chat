const { Service } = require('feathers-nedb');
const randomColor = require('randomcolor');

exports.Users = class Users extends Service {

  create(data,params) {
    const {email,name,password}=data;

    const background = randomColor({luminosity:'dark'}).replace('#','');

    const avatar=`https://ui-avatars.com/api/?background=${background}&color=fff&name=${name}`;

    return super.create({avatar,email,name,password},params);
  }

};
