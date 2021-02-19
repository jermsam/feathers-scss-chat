/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// Set up socket.io
const socket = io('http://localhost:3030');
// Initialize a Feathers app
const app = feathers();

// Register socket.io to talk to our server
app.configure(feathers.socketio(socket)) ;

// Register authentication
app.configure(feathers.authentication({
  storage:window.localStorage,
})) ;

// eslint-disable-next-line no-unused-vars
const login =async(email,password)=>{
  try{
    return await app.reAuthenticate();
  }catch(e){
    return await app.authenticate({
      strategy:'local',
      email,
      password
    });
  }
};

const logout =async()=>{
  await app.logout();
};


