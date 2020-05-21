import { getInstance } from "./index";
import store from '@/store/index.js';

export const authGuard = (to, from, next) => {
  const authService = getInstance();

  const fn = () => {
    // If the user is authenticated, continue with the route
    if (authService.isAuthenticated) {
      if (authService.userDB) {
        store.commit('setUser', authService.userDB);
      }
      else {
        authService.$api.post('/api/user', authService.user).then(returnedUser => {
          authService.userDB = returnedUser.data;
          store.commit('setUser', authService.userDB);
        });
      }
      return next();
    }

    // Otherwise, log in
    authService.loginWithRedirect({ appState: { targetUrl: to.fullPath } });
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
