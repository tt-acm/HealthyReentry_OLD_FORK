import { getInstance } from "./index";
import store from '@/store/index.js';

export const authGuard = (to, from, next) => {
  const authService = getInstance();

  const fn = () => {
    // If the user is authenticated, continue with the route
    console.log("to",to);
    console.log("authService.isAuthenticated", authService.isAuthenticated);
    if (authService.isAuthenticated) {
      if (authService.userDB) {
        store.commit('setUser', authService.userDB);
        routeUserFunction(authService.userDB);
      }
      else {
        authService.$api.post('/api/user', authService.user).then(returnedUser => {
          authService.userDB = returnedUser.data;
          store.commit('setUser', authService.userDB);
          routeUserFunction(returnedUser.data);
        });
      }
      // return next();
      function routeUserFunction(user) {
        // console.log("to",to);
        console.log("store.state",store.state);
        console.log("user in router",user);
        // if (!authService.userDB) return next();//un-authenticated stays at home
        //authenticated
        if (user.dateOfConsent) {//consent signed
          console.log("SIGNED");
          if (to.name === "home" || to.name === "disclosure") return next("/menu");//route signed user to menu
          else return next();
        }
        else{//authenticated, but haven't signed consent
          if (to.name === "disclosure") return next();
          else return next("/disclosure");//route signed user to sign
        }

      }
    }
    return next();

    // Otherwise, log in
    // authService.loginWithRedirect({ appState: { targetUrl: to.fullPath } });
  };

  // If loading has already finished, check our auth state using `fn()`
  if (!authService.loading) {
    return fn();
  }

  // Watch for the loading property to change before we check isAuthenticated
  authService.$watch("loading", loading => {
    if (loading === false) {
      return fn();
    }
  });
};
