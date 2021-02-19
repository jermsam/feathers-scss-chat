// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { BadRequest } = require('@feathersjs/errors');
const isEmpty = require('lodash.isempty');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const {data:{email,name,password}}=context;

    let errors ={};

    if(isEmpty(name)){
      errors.name='Your name is required.';
    }
    if(!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))){
      errors.email='Please enter a valid email address.';
    }
    if(!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(password))){
      errors.password='Password must be at least 8 characters long with a digits, upper case and lower case letter.';
    }

    if(!isEmpty(errors)){
      throw new BadRequest(errors);
    }

    return context;
  };
};
