import Auth0Lock from 'auth0-lock';

const options = {
  auth: {
    redirect: true,
    redirectUrl: 'http://localhost:3000/callback',
    responseType: 'token id_token',
    sso: true,
    audience: 'https://taustin.auth0.com/userinfo',
    params: {
      scope: 'openid email user_metadata app_metadata picture profile'
    }
  },
  allowedConnections: [
    'twitter',
    'facebook',
    'linkedin',
    'google-oauth2',
    'Username-Password-Authentication'
  ],
  allowAutocomplete: true,
  allowShowPassword: true,
  theme: {
    logo: './logo.png',
    primaryColor: '#31324F'
  },
  socialButtonStyle: 'small',
  additionalSignUpFields: [
    {
      name: 'nickname',
      placeholder: 'Enter your username',
      prefill: 'username',
      validator: function(username) {
        return {
          valid: username.length >= 10,
          hint: 'Must have 10 or more chars'
        };
      }
    },
    {
      type: 'select',
      name: 'location',
      placeholder: 'choose your location',
      options: [
        { value: 'us', label: 'United States' },
        { value: 'fr', label: 'France' },
        { value: 'ar', label: 'Argentina' }
      ],
      prefill: 'us'
    }
  ]
};

const lock = new Auth0Lock(
  'OOo0GXvDetld_2BQ7fOAP5B3KfPMdWMi',
  'taustin.auth0.com',
  options
);

export default lock;
