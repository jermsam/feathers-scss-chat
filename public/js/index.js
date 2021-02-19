/* eslint-disable no-undef */


/*

formButton.innerHTML='Sign Up';



*/


const authForm=`
<div class="form">
<div class="form-control">
<span class="form-control__label">Name:</span>
<input type="text" placeholder="Enter Your Full Name">
<span class="form-control__error">
 Your name is required.
</span>
</div>
<div class="form-control">
  <span class="form-control__label">Email:</span>
  <input type="email" placeholder="Enter Your Email Address">
  <span class="form-control__error">
    Please enter a valid email address.
  </span>
</div>
<div class="form-control">
  <span class="form-control__label">Password:</span>
  <input type="password" placeholder="Enter Your Password">
  <span class="form-control__error ">
    Password must be at least 8 characters long with a digits, upper case and lower case letter.
  </span>
</div>

  <div class="form-button">
    <span class="form-control__error show" id='server-error'>

    </span>
    <button class="primary--btn">
      <a>Sign Up</a>
  </button>
  <div><span id="form-toggle-prompt" >Already registered?</span> <a id="form-toggle-btn">LOG IN</a></div>
  </div>
<div class="circle"></div>
        </div>
`;

const showDashboard =({avatar,name})=>`
<div class="dashboard">
  <div class='followup'>
      <div class='user'>
        <img src=${avatar} alt="Avatar" >
        <h3>${name}</h3>
      </div>
      <div>
<h5>INBOX</h5>
<h5>_____________________</h5>
</div>
<div class='clients'>



</div>
      <div class="conversation__controls">

      <button id='logout' class='secondary--btn'> <a>Log Out</a> </button>
      </div>
  </div>
  <div class='chat-area'>
  <div class='chat-client'>
  <div>
  <p>Chatting with:</p>
  <h3 id='to' class=''>Every One</h3>
  </div>
  </div>
  <div class='chat'>



  </div>
  <div class='chat-form'>
  <input type="text" placeholder='Type a message' id='message-input'>
  <div><img src="https://i.imgur.com/v7oUwbD.png" alt="add attachment"></div>
  </div>

  </div>
  <div class="users-list">

  <div class="users-list__item active">
  <img src="https://image.flaticon.com/icons/png/512/32/32441.png" alt="Every one">

  <div class="users-list__item-name">
    General
  </div>

  </div>
  <h5>USERS</h5>










  </div>
</div>
   `;

const selectReceiver =(userListItems,handler)=>{
  userListItems.forEach(item => {
    // add onClick handler to all items
    item.addEventListener('click', async() =>{
      // check if it has active class
      const hasActiveClass = item.classList.contains('active');
      if(!hasActiveClass){
        // alert('does not');
        // add active class
        item.classList.add('active');
      }
      //remove active from any where on the dom other than this
      document.querySelectorAll('.active').forEach(
        active=>{
          if(!active.isEqualNode(item)){
            active.classList.remove('active');
          }
        }
      );
      await handler(item.id);
    });
  });
};

const selectUser=async(id,indicator)=>{
  if(id){
    indicator.class=id;
    const {name}= await app.service('users').get(id);
    indicator.innerHTML=name;
  }else{
    indicator.class='';
    indicator.innerHTML='Everyone';
  }
};

const populateChatWindow =async(userId,inboxNode,indicator)=>{

  // get messages;
  const res = await app.service('messages').find({query:{
    $limit: 100000000000000000000,
    $sort:{
      createdAt:-1
    },

  }});



  if(!indicator.class){

    inboxNode.innerHTML='';
    res.data.filter(({to}) => (to===''))
      .forEach(message=>{
        const {from:{avatar,name,_id},text}=message;
        let ownerClass = (_id==userId)? 'you':'other';

        inboxNode.innerHTML += ` <div class="chat-message ${ownerClass}">
      <div class="chat-message__content">
      <img src="${avatar}" alt="${name}">

       <div class="chat-message__text">
      ${text}
       </div>
       <div class="chat-message__time">
           Apr 17
       </div>
      </div>
      </div>`;
      });
  }else{
    inboxNode.innerHTML='';

    res.data.filter(({from,to})=>((from._id==indicator.class&&to==userId)||(to==indicator.class&&from._id==userId))).forEach(message=>{
      const {from:{avatar,name,_id},text}=message;

      let ownerClass = (_id==userId)? 'you':'other';

      inboxNode.innerHTML += ` <div class="chat-message ${ownerClass}">
      <div class="chat-message__content">
      <img src="${avatar}" alt="${name}">

       <div class="chat-message__text">
      ${text}
       </div>
       <div class="chat-message__time">
           Apr 17
       </div>
      </div>
      </div>`;
    });
  }

};


const populateInbox = async(userId,inboxNode,indicator)=>{
  inboxNode.innerHTML='';
  const inbox=[];
  // get messages;
  const res = await app.service('messages').find({query:{
    $sort:{
      createdAt:1
    },
    $limit: 100000000000000000000,
  }});

  res.data.filter(message => message.to===userId).map(({text,from:{avatar,name,_id,online}})=>{
    const classname = online?'online':'';

    if(inbox.includes(_id)&&document.querySelector(`#${_id}`)){

      document.querySelector(`#${_id}`).innerHTML=`
      <img src="${avatar}" alt="${name}">
      <div class="conversation-title">
          ${name}
      </div>
      <div class="conversation-date">
          Apr 16
      </div>
      <div class="conversation-msg">
      ${text}
      </div>
      <div class="indicator ${classname}"></div>`;
    }else{
      inboxNode.innerHTML +=`
      <div class="conversation" id=${_id}>
      <img src="${avatar}" alt="${name}">
      <div class="conversation-title">
          ${name}
      </div>
      <div class="conversation-date">
          Apr 16
      </div>
      <div class="conversation-msg">
      ${text}
      </div>
      <div class="indicator ${classname}"></div>
      </div>
      `;
    }

    inbox.push(_id);
  });
  const conversationListItems = document.querySelectorAll('.conversation');
  // console.log(conversationListItems.length);
  selectReceiver(conversationListItems,async(id)=>{

    await selectUser(id,indicator);

    await   populateChatWindow(userId,document.querySelector('.chat'),indicator);

  });

};



const checkForOnline =({online,_id},indicators)=>{


  indicators.forEach(onlineIndicatorNode=>{

    if(onlineIndicatorNode.parentNode.id==_id){
      online ? onlineIndicatorNode.classList.add('online'):
        onlineIndicatorNode.classList.remove('online');
    }
  });
};



const main =async()=>{
  const copy = document.querySelector('.copy');
  const playground = document.querySelector('.playground');

  try{
    const {user} = await login();
    copy.innerHTML='';

    playground.innerHTML=showDashboard(user);
    // log out
    document.querySelector('#logout').addEventListener('click',async()=>{
      await logout();
      location.reload();
    });

    // send - message






    // populate clients
    const {data} = await app.service('users').find({query:{
      $limit: 100000000000000000000,
      _id:{
        $ne:user._id
      }
    }});
    data.map(({_id,avatar,name,online})=>{
      const classname = online ? 'online' :'';
      document.querySelector('.users-list').innerHTML += `
      <div class="users-list__item" id=${_id}>
      <img src="${avatar}" alt="${name}">

      <div class="users-list__item-name">
          ${name}
      </div>

      <div class="indicator ${classname}"></div>
      </div>
      `;

    });

    // choose user to talk to onClick
    const userListItems = document.querySelectorAll('.users-list__item');
    const toNode = document.querySelector('#to');
    const textInput =document.querySelector('#message-input');





    textInput.addEventListener('keydown', async({key,target})=>{

      if(key === 'Enter'&&target.value) {
        const text =target.value;
        const to =toNode.class;
        const message ={text,to};
        // console.log(message);
        await app.service('messages').create(message);

        textInput.value='';
      }
    });

    await Promise.all(
      [
        populateInbox(user._id,document.querySelector('.clients'),toNode),
        populateChatWindow(user._id,document.querySelector('.chat'),toNode)
      ]
    );
    app.service('messages').on('created',async()=>{
      await Promise.all(
        [
          populateInbox(user._id,document.querySelector('.clients'),toNode),
          populateChatWindow(user._id,document.querySelector('.chat'),toNode)
        ]
      );
    });


    selectReceiver(userListItems,async(id)=> {
      await selectUser(id,toNode);
      await   populateChatWindow(user._id,document.querySelector('.chat'),toNode);

    });

    app.service('users').on('patched',user =>checkForOnline(user,document.querySelectorAll('.indicator')));


  }catch(e){
    // when not logged in
    console.log('ERR',e.message);
    copy.innerHTML =`<h1>Feathers Chat App</h1>
<h2>A Feather Chat App with Scss Styling</h2>`;
    playground.innerHTML=authForm;

    // selectors
    const toggleBtn = document.querySelector('#form-toggle-btn');
    const nameControl =document.querySelector('.form-control:nth-child(1)');
    const formButton=document.querySelector('.primary--btn');
    const togglePrompt = document.querySelector('#form-toggle-prompt');

    const nameInput =document.querySelector('.form-control:nth-child(1) input');
    const nameError =document.querySelector('.form-control:nth-child(1) .form-control__error');

    const emailInput =document.querySelector('.form-control:nth-child(2) input');
    const emailError =document.querySelector('.form-control:nth-child(2) .form-control__error');

    const passwordInput =document.querySelector('.form-control:nth-child(3) input');
    const passwordError =document.querySelector('.form-control:nth-child(3) .form-control__error');

    const serverError = document.querySelector('#server-error');


    //handlers
    formButton.innerHTML= '<a>Sign Up</a>';
    const toggleForm = ()=>{
      if(toggleBtn.innerHTML=='LOG IN'){
        nameControl.classList.add('hide');
        formButton.innerHTML= '<a>Log In</a>';
        toggleBtn.innerHTML= 'SIGN UP';
        togglePrompt.innerHTML= 'Not registered?';

      }else{
        nameControl.classList.remove('hide');
        formButton.innerHTML= '<a>Sign Up</a>';
        toggleBtn.innerHTML= 'LOG IN';
        togglePrompt.innerHTML= 'Already registered?';

      }

      serverError.innerHTML='';
      passwordError.classList.remove('show');
      nameError.classList.remove('show');
      emailError.classList.remove('show');
    };

    const validateName =()=>{
      if(nameInput.value==''&&toggleBtn.innerHTML== 'LOG IN'){
        nameError.classList.add('show');
        return false;
      }else{
        nameError.classList.remove('show');
        return true;
      }
    };

    const validateEmail=()=>{
      if(!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(emailInput.value))){
        emailError.classList.add('show') ;
        return false;
      }else{
        emailError.classList.remove('show') ;
        return true;
      }
    };

    validatePassword=()=>{
      if(!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(passwordInput.value))){
        passwordError.classList.add('show') ;
        return false;
      }else{
        passwordError.classList.remove('show') ;
        return true;
      }
    };

    const clearForm =()=>{
      nameInput.value='';
      emailInput.value='';
      passwordInput.value='';
      serverError.innerHTML='';
    };

    const submitForm =async()=>{

      const isReady= validateName()*validateEmail()*validatePassword();

      const name=nameInput.value;
      const email=emailInput.value;
      const password=passwordInput.value;
      if(isReady){

        switch(formButton.innerHTML){
        case '<a>Sign Up</a>':
          {

            try{

              await app.service('users').create({name,email,password});
              await login(email, password);
              location.reload();
            }catch(e){
              if(e.data){
                if(e.data.name){
                  name.innerHTML=e.data.name;
                  nameError.classList.add('show');
                }
                if(e.data.email){
                  email.innerHTML=e.data.email;
                  emailError.classList.add('show');
                }

                if(e.data.password){
                  password.innerHTML=e.data.password;
                  passwordError.classList.add('show');
                }
              }
            }
          }

          break;

        case '<a>Log In</a>':
          {
            try{

              const auth = await login(email, password);

              console.log('user authenticated: ',auth);
              serverError.classList.remove('show') ;
              clearForm();
              location.reload();

            }catch(e){
              if(e.message=='Invalid login'){
                serverError.classList.add('show') ;
                serverError.innerHTML='User with those credentials not found.';
              }
            }
          }
          break;
        default:
          return;
        }

      }


    };

    // add events to
    toggleBtn.addEventListener('click',toggleForm);
    formButton.addEventListener('click', submitForm);
    nameInput.addEventListener('keyup',validateName);
    emailInput.addEventListener('keyup',validateEmail);
    passwordInput.addEventListener('keyup',validatePassword);

  }

};

main();


