'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  const jwt = app.middleware.jwt({app})


  //验证码
  router.get('/captcha', controller.util.captcha);
  router.get('/sendcode', controller.util.sendcode);
  router.post('/uploadfile', controller.util.uploadfile);
  router.post('/mergefile', controller.util.mergefile);



  router.group({name:'user',prefix:'/user'}, router=>{

    const{info, register, login, verify } = controller.user

    router.post('/register', register)
    router.post('/login', login)

    router.get('/info', jwt , info)


    router.post('/verify', verify)
    
  })

};
