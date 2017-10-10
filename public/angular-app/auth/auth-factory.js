angular.module('meanhotel').controller('AuthFactory', AuthFactory);

function AuthFactory() {
return {
   auth: auth
};

   var auth = {
       isLoggedIn: false
   };
    

   
}