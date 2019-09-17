// / This is your plugin object. It can be exported to be used anywhere.
// const FluroVue = {
//   // The install method is all that needs to exist on the plugin object.
//   // It takes the global Vue object as well as user-defined options.
//   install(Vue, options) {
//     // We call Vue.mixin() here to inject functionality into all components.
//     Vue.mixin({
//       // Anything added to a mixin will be injected into all components.
//       // In this case, the mounted() method runs when the component is added to the DOM.
//       mounted() {
//         //console.log('Mounted!');
//       }
//     });
//   }
// };

// export default FluroVue;

console.log('fluro-vue 2.0.11')
// process.env.VUE_APP_VERSION = require('./package.json').version

// import store from './store'
import Fluro from 'fluro';

/////////////////////////////////////////////////////

import { getField, updateField } from 'vuex-map-fields';

/////////////////////////////////////////////////////

var LOCAL_STORAGE_KEY = 'fluro.user';
var WebStorageContainer = localStorage;

/////////////////////////////////////////////////////


const FluroVue = {
    install: function(Vue, options) {

        /////////////////////////////////////////////////////

        if (!options || !options.store) {
            throw new Error('Please initialise fluro-vue with a Vuex store.');
        }

        /////////////////////////////////////////////////////
        
        //Give this window session a unique name
        if (sessionStorage) {
            var windowID = Fluro.utils.guid()
            sessionStorage.setItem('window.id', windowID);
        }

        /////////////////////////////////////////////////////

        var storedUser;

        if (WebStorageContainer) {
            var json = WebStorageContainer.getItem(LOCAL_STORAGE_KEY);
            try {
                storedUser = JSON.parse(json);
                // //console.log('Got existing user', storedUser)
            } catch (e) {
                WebStorageContainer.removeItem(LOCAL_STORAGE_KEY);
            }
        }

        /////////////////////////////////////////////////////

        var store = options.store;

        //Register a new Vuex Module
        store.registerModule('fluro', {
            namespaced: true,
            state: {
                user: storedUser, //The Current Fluro User
                application: null, //The Current Fluro Application
                realmSelectFullScreen: false, //Realm Select Widget
            },
            mutations: {
                updateField,
                user(state, payload) {
                    state.user = payload;
                },
                application(state, payload) {
                    state.application = payload;
                },
                realmSelectFullScreen(state, payload) {
                    state.realmSelectFullScreen = payload;
                },
            },
            getters: {
                getField,
                user(state, getters) {
                    return state.user;
                },
                application(state, getters) {
                    return state.application;
                },
                realmSelectFullScreen(state, getters) {
                    return state.realmSelectFullScreen;
                },
            },
        })
        //, { preserveState: true });

        /////////////////////////////////////////////////////

        let API_URL;
        let APPLICATION_TOKEN;
        let DEFAULT_TIMEZONE;
        let APPLICATION_REMOTE_URL;

        /////////////////////////////////////////////////////

        //Get the development environment (local staging or production)
        var environment = process.env.VUE_APP_FLURO_ENV;
        switch (environment) {
            case 'local':
                API_URL = process.env.VUE_APP_API_LOCAL;
                break;
            case 'staging':
                API_URL = process.env.VUE_APP_API_STAGING;
                break;
            default:
                API_URL = process.env.VUE_APP_API_LIVE;
                break;
        }

        /////////////////////////////////////////////////////

        //If we have application data from fluro set the defaults based on that
        var FluroApplicationData = _.get(window, 'applicationData');
        var FluroApplication = _.get(FluroApplicationData, '_application');

        //If we are running in the context of being deployed on Fluro
        //we should adhere to the settings set from the Application
        if (FluroApplication) {
            switch (FluroApplication.authenticationStyle) {
                case 'application':
                    var protocol = 'http:';
                    if (window && window.location && window.location.protocol) {
                        protocol = window.location.protocol;
                    }

                    // Set the static application token
                    APPLICATION_TOKEN = FluroApplication.apikey;
                    APPLICATION_REMOTE_URL = process.env.VUE_APP_REMOTE_URL || `${protocol}//${FluroApplication.domain}`;

                    break;
                case 'global':
                    //User logs in to the app via the server
                    if(FluroApplication.requireLogin) {
                        //The user will already be logged in at this point
                        var FluroCookieUser = _.get(window, 'applicationUser');

                        if(FluroCookieUser) {
                            console.log('-- Authenticated via cookie', FluroCookieUser)
                             fluro.auth.set(FluroCookieUser);
                        }
                       
                    } else {
                        //It's a global app so it's up to the application
                        //as to how it handles authentication
                    }
                    break;
            }

            /////////////////////////////////////////////////////

            if (environment == 'production') {
                //Use the API Specified in the application
                API_URL = FluroApplication.apipath || API_URL;
            }

            /////////////////////////////////////////////////////

            //Set the default timezone from our application data
            DEFAULT_TIMEZONE = FluroApplication.timezone;

            //Need this workaround it seems otherwise the app doesn't get set
            setTimeout(function() {
                store.commit('fluro/application', FluroApplication);
            })

        } else {
            //Need this workaround it seems otherwise the app doesn't get set
            setTimeout(function() {
                store.commit('fluro/application', null);
            })
        }

        /////////////////////////////////////////////////////

        //Create a new Fluro instance
        const fluro = new Fluro({
            apiURL: API_URL,
            applicationToken: APPLICATION_TOKEN,
            domain: APPLICATION_REMOTE_URL,
        });

        /////////////////////////////////////////////////////

        //Set the date defaults
        if (DEFAULT_TIMEZONE) {
            fluro.date.defaultTimezone = DEFAULT_TIMEZONE;
        }

        /////////////////////////////////////////////////////

        fluro.access.setDefaultApplication(FluroApplication);

        //Listen for when the user session changes
        // fluro.auth.onChange = userUpdated;
        // fluro.auth.debug = true;
        fluro.auth.addEventListener('change', userUpdated);

        //Set the user from the vuex store if we have it
        fluro.auth.set(store.getters['fluro/user']);

        /////////////////////////////////////////////////////

        function userUpdated(user, disablePersist) {
            store.commit('fluro/user', user);
            if (!disablePersist) {
                persistUserToLocalStorage(user);
            }

            //Update all of the stat stores
            //as we are now a different user
            fluro.stats.refresh();
        }

        /////////////////////////////////////////////////////

        // function stopLocalStorageListening() {
        //     if (window) {
        //         window.removeEventListener('storage', retrieveUserFromLocalStorage)
        //     }
        // }

        // function startLocalStorageListening() {
        if (window) {
            window.addEventListener('storage', retrieveUserFromLocalStorage)

            /////////////////////////////////////////////////////

            // retrieveUserFromLocalStorage();
        }


        /////////////////////////////////////////////////////

        function retrieveUserFromLocalStorage(WebStorageContainerEvent) {


            if (WebStorageContainerEvent) {
                if (WebStorageContainerEvent.key != LOCAL_STORAGE_KEY) {
                    return;
                }
            }

            //Check if our user is already in local storage
            if (WebStorageContainer) {
                //If it is
                var json = WebStorageContainer.getItem(LOCAL_STORAGE_KEY);
                if (json) {
                    try {
                        storedUser = JSON.parse(json);
                    } catch (e) {

                        //console.log(e);
                        storedUser = null;
                        WebStorageContainer.removeItem(LOCAL_STORAGE_KEY);
                        userUpdated(null, WebStorageContainerEvent);
                    } finally {
                        userUpdated(storedUser, WebStorageContainerEvent);
                    }
                } else {
                    userUpdated(null, WebStorageContainerEvent);
                }
            }
        }

        /////////////////////////////////////////////////////

        function persistUserToLocalStorage(user) {
            if (WebStorageContainer) {
                if (!user) {
                    WebStorageContainer.removeItem(LOCAL_STORAGE_KEY);
                } else {
                    try {
                        //console.log('PERSIST USER NOW', user)
                        WebStorageContainer.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
                    } catch (err) {
                        //console.log('Error', err)
                    }

                }
            }
        }

        /////////////////////////////////////////////////////

        //Add Fluro Filters Globally 
        Vue.filter('dateFromID', fluro.date.dateFromID);
        Vue.filter('formatDate', fluro.date.formatDate);
        Vue.filter('timeago', fluro.date.timeago);
        Vue.filter('readableEventDate', fluro.date.readableEventDate);
        Vue.filter('readableEventTime', fluro.date.readableEventTime);
        Vue.filter('filesize', fluro.asset.filesize);
        Vue.filter('comma', fluro.utils.comma);
        Vue.filter('definitionTitle', function(input, plural, backup) {
            var readable =fluro.types.readable(input, plural);
            return readable.length ? readable : ( backup ? fluro.types.readable(backup, plural) : '');
        });

        /////////////////////////////////////////////////////

        //Attach Fluro to the main Vue Instance
        Vue.prototype.$fluro = fluro;

    }

}



////////////////////////////////////////////////////////////////////




export default FluroVue;