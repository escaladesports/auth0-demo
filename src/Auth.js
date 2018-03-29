import auth0 from 'auth0-js';
import history from './history';

export default class Auth {
  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuth = this.handleAuth.bind(this);
    this.isAuth = this.isAuth.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  auth0 = new auth0.WebAuth({
    domain: 'taustin.auth0.com',
    clientID: 'OOo0GXvDetld_2BQ7fOAP5B3KfPMdWMi',
    audience: 'https://taustin.auth0.com/api/v2/',
    scope: 'openid profile',
    responseType: 'token id_token'
  });

  getAccessToken() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      return false;
    }

    return accessToken;
  }

  getProfile() {
    return new Promise((resolve, reject) => {
      let token = this.getAccessToken();
      if (!token) {
        throw new Error('No Access Token Found');
      }
      this.auth0.client.userInfo(token, (err, profile) => {
        if (profile) {
          resolve(profile);
        } else if (err) {
          reject(err);
        }
      });
    });
  }

  handleAuth() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        // redirect user to home page
        history.replace('/');
      } else if (err) {
        // redirect user to home page with error
        history.replace('/');
      }
    });
  }

  setSession(authResult) {
    // Set how long the access token will last
    let expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    // redirect user to home page or desired page
    history.replace('/');
  }

  logout() {
    // Clear Access Token and ID Token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // navigate to the home route
    history.replace('/');
  }

  isAuth() {
    // Check whether the current time is past the
    // Access Token's expiry time
    // If not expires at exist should automatically return false
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  login() {
    this.auth0.authorize();
  }
}
