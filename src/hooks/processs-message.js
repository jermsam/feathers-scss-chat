// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { BadRequest } = require('@feathersjs/errors');
const isEmpty = require('lodash.isempty');
// eslint-disable-next-line no-unused-vars
module.exports = (name) => {
  return async context => {
    let errors ={};

    if(isEmpty(context.data.text)){
      errors.text='A message must have text.';
    }

    if(!isEmpty(errors)){
      throw new BadRequest(errors);
    }

    const {user} = context.params;

    context.data['from']=user._id;

    context.data['createdAt']= new Date().toISOString();

    return context;
  };
};
