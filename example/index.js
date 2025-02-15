axios.defaults.baseURL = 'http://localhost:4000';

Vue.use(VueRouter)
Vue.use(VueAuthenticate, {
  tokenName: 'access_token',
  baseUrl: 'http://localhost:4000',
  storageType: 'cookieStorage',
  providers: {
    /* discord: {
      clientId: '',
      redirectUri: 'http://localhost:4000/auth/discord'
    } */
  }
})

var router = new VueRouter({
  mode: 'history',
  routes: [
    { 
      path: '/',
      name: 'index',
      component: {
        data: function () {
          return {
            isAuthenticated: this.$auth.isAuthenticated(),
            access_token: null,
            response: null
          }
        },
        template: `
          <div class="index-component">
            <div class="authentication-status" v-if="isAuthenticated">
              You are successfully authenticated
              <div class="authentication-status__token">{{$auth.getToken()}}</div>
            </div>

            <button @click="authLogin()">Login</button>
            <button @click="authRegister()">Register</button>
            <button @click="authLogout()">Logout</button>
            
            <hr />

            <button @click="auth('github')" class="button--github">Auth github</button>
            <button @click="auth('facebook')" class="button--facebook">Auth facebook</button>
            <button @click="auth('google')" class="button--google">Auth google</button>
            <button @click="auth('twitter')" class="button--twitter">Auth twitter</button>

            <hr />
            
            <button @click="auth('instagram')" class="button--instagram">Auth instagram</button>
            <button @click="auth('bitbucket')" class="button--bitbucket">Auth bitbucket</button>
            <button @click="auth('linkedin')" class="button--linkedin">Auth LinkedIn</button>
            <button @click="auth('live')" class="button--live">Auth Live</button>

            <hr />

            <button @click="auth('discord')" class="button--live">Auth Discord</button>

            <pre class="response" v-if="response !== null">{{JSON.stringify(response, null, 2)}}</pre>
          </div>
        `,
        methods: {

          authLogin: function () {
            var this_ = this;
            let user = {
              email: 'john.doe@domain.com', 
              password: 'pass123456'
            };

            if (this.$auth.isAuthenticated()) {
              this.$auth.logout()
            }

            this.$auth.login(user).then(function (response) {
              this_.isAuthenticated = this_.$auth.isAuthenticated();
              this_.response = response
            })
          },

          authRegister: function () {
            var this_ = this;
            let user = {
              name: 'John Doe',
              email: 'john.doe@domain.com', 
              password: 'pass123456'
            };

            if (this.$auth.isAuthenticated()) {
              this.$auth.logout()  
            }
            
            this.$auth.register(user).then(function (response) {
              this_.isAuthenticated = this_.$auth.isAuthenticated();
              this_.response = response
            })
          },

          authLogout: function () {
            var this_ = this;
            this.$auth.logout().then(function () {
              if (!this_.$auth.isAuthenticated()) {
                this_.response = null
              }

              this_.isAuthenticated = this_.$auth.isAuthenticated();
            })
          },

          auth: function(provider) {
            if (this.$auth.isAuthenticated()) {
              this.$auth.logout()
            }

            this.response = null

            var this_ = this;
            this.$auth.authenticate(provider).then(function (authResponse) {
              this_.isAuthenticated = this_.$auth.isAuthenticated();

              if (provider === 'github') {
                this_.$http.get('https://api.github.com/user').then(function (response) {
                  this_.response = response
                })
              } else if (provider === 'facebook') {
                this_.$http.get('https://graph.facebook.com/v2.5/me', {
                  params: { access_token: this_.$auth.getToken() }
                }).then(function (response) {
                  this_.response = response
                })
              } else if (provider === 'google') {
                this_.$http.get('https://www.googleapis.com/plus/v1/people/me/openIdConnect').then(function (response) {
                  this_.response = response
                })
              } else if (provider === 'twitter') {
                this_.response = authResponse.body.profile
              } else if (provider === 'instagram') {
                this_.response = authResponse
              } else if (provider === 'bitbucket') {
                this_.$http.get('https://api.bitbucket.org/2.0/user').then(function (response) {
                  this_.response = response
                })
              } else if (provider === 'linkedin') {
                this_.response = authResponse
              } else if (provider === 'live') {
                this_.response = authResponse
              }else if (provider === 'discord') {
                this_.$http.get('https://discordapp.com/api/users/@me', {
                  params: { access_token: this_.$auth.getToken() }
                }).then(function (response) {
                  var profile = response.data;
                  this_.$http.get('https://discordapp.com/api/users/@me/guilds', {
                    params: { access_token: this_.$auth.getToken() }
                  }).then(response => {
                    profile.guilds = response.data;
                    this_.response = profile;
                  });
                });
              }
            }).catch(function (err) {
              this_.isAuthenticated = this_.$auth.isAuthenticated()
              this_.response = err
            })
          }
        }
      } 
    },

    {
      path: '/auth/callback',
      component: {
        template: '<div class="auth-component"></div>'
      }
    }
  ]
})

var app = new Vue({
  router: router
}).$mount('#app')
