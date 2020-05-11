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
//         ////console.log('Mounted!');
//       }
//     });
//   }
// };

// export default FluroVue;


console.log('fluro-vue 2.0.91');

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////


var WindowObject;
var WebStorageContainer;
var listening;


if (typeof window !== 'undefined') {
    WindowObject = window;

}

if (typeof localStorage !== 'undefined') {
    WebStorageContainer = localStorage;
}

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////

// process.env.VUE_APP_VERSION = require('./package.json').version

// import store from './store'
import Fluro from 'fluro';

/////////////////////////////////////////////////////

import { getField, updateField } from 'vuex-map-fields';

/////////////////////////////////////////////////////

var LOCAL_STORAGE_KEY = '_fluro_user';

/////////////////////////////////////////////////////


const FluroVue = {
    install: function(Vue, options) {

        if (!options) {
            options = {
                // store:Vue.prototype.$store,
            };
        }

        var ApplicationContext;
        if (options.ApplicationContext) {
            ApplicationContext = options.ApplicationContext;
        } else {
            ApplicationContext = WindowObject;
        }

        /////////////////////////////////////////////////////

        if (!options || !options.store) {
            throw new Error('Please initialise fluro-vue with a Vuex store.');
        }

        /////////////////////////////////////////////////////

        //Give this window session a unique name
        if (typeof sessionStorage !== 'undefined') {
            var windowID = Fluro.utils.guid()
            sessionStorage.setItem('window.id', windowID);
        }

        /////////////////////////////////////////////////////

        //See if we know anything about the user already
        var storedUser;

        //If we are in the browser
        if (WebStorageContainer) {
            //Try and get the user from local storage
            var json = WebStorageContainer.getItem(LOCAL_STORAGE_KEY);
            try {
                storedUser = JSON.parse(json);
            } catch (err) {
                WebStorageContainer.removeItem(LOCAL_STORAGE_KEY);
            } finally {
                // console.log('Initial stored user object is', storedUser);
            }
        }

        /////////////////////////////////////////////////////

        let API_URL;
        let APPLICATION_TOKEN;
        let DEFAULT_TIMEZONE;
        let APPLICATION_REMOTE_URL;

        /////////////////////////////////////////////////////

        var HARDCODE_API;

        //Get the development environment (local staging or production)
        var environment = process.env.VUE_APP_FLURO_ENV;
        switch (environment) {
            case 'local':
                API_URL = process.env.VUE_APP_API_LOCAL;
                HARDCODE_API = true;
                break;
            case 'staging':
                API_URL = process.env.VUE_APP_API_STAGING;
                HARDCODE_API = true;
                break;
            default:
                API_URL = process.env.VUE_APP_API_LIVE;
                break;
        }



        /////////////////////////////////////////////////////

        //If we have application data from fluro set the defaults based on that
        var FluroApplicationData = (ApplicationContext ? ApplicationContext.applicationData : null);
        var FluroApplication = FluroApplicationData ? FluroApplicationData._application : null;
        var FluroCookieUser;


        /////////////////////////////////////////////////////

        var store = options.store;

        //Register a new Vuex Module
        if (store && store.registerModule) {
            store.registerModule('fluro', {
                namespaced: true,
                state() {
                    return {
                        user: storedUser, //The Current Fluro User
                        application: FluroApplication, //The Current Fluro Application
                        realmSelectFullScreen: false, //Realm Select Widget
                    }
                },
                mutations: {
                    updateField,
                    user(state, payload) {
                        //console.log('SET USER TO VUEX', typeof state);
                        state.user = payload;
                    },
                    application(state, payload) {
                        //console.log('SET APPLICATION TO VUEX', typeof state);
                        state.application = payload;
                    },
                    realmSelectFullScreen(state, payload) {
                        state.realmSelectFullScreen = payload;
                    },
                },
                getters: {
                    getField,
                    user(state, getters) {
                        //console.log('GET USER FROM VUEX', typeof state);
                        return state.user;
                    },
                    application(state, getters) {
                        //console.log('GET APPLICAITION FROM VUEX', typeof state);
                        return state.application;
                    },
                    realmSelectFullScreen(state, getters) {
                        return state.realmSelectFullScreen;
                    },
                },
            })


            // console.log('Initialize Fluro VUEX', store, storedUser)
        }
        //, { preserveState: true });


        /////////////////////////////////////////////////////

        //If we are running in the context of being deployed on Fluro
        //we should adhere to the settings set from the Application
        if (FluroApplication) {

            //Set the default timezone from our application data
            DEFAULT_TIMEZONE = FluroApplication.timezone;

            /////////////////////////////////////////////////////

            if (environment == 'production') {
                //Use the API Specified in the application
                API_URL = FluroApplication.apipath || API_URL;
            }

            /////////////////////////////////////////////////////

            switch (FluroApplication.authenticationStyle) {
                case 'application':
                    var protocol = 'http:';
                    if (WindowObject && WindowObject.location && WindowObject.location.protocol) {
                        protocol = WindowObject.location.protocol;
                    }

                    // Set the static application token
                    APPLICATION_TOKEN = FluroApplication.apikey;
                    APPLICATION_REMOTE_URL = process.env.VUE_APP_REMOTE_URL || `${protocol}//${FluroApplication.domain}`;

                    break;
                case 'global':
                    //User logs in to the app via the server
                    if (FluroApplication.requireLogin) {
                        //The user will already be logged in at this point
                        FluroCookieUser = WindowObject ? WindowObject.applicationUser : null;
                    } else {
                        //It's a global app so it's up to the application
                        //as to how it handles authentication
                    }
                    break;
            }


            /////////////////////////////////////////////////////

            //Need this workaround it seems otherwise the app doesn't get set

            if (store && store.commit) {
                // setTimeout(function() {
                store.commit('fluro/application', FluroApplication);
                // })
            }


        } else {
            //Need this workaround it seems otherwise the app doesn't get set

            if (store && store.commit) {
                // setTimeout(function() {
                store.commit('fluro/application', null);
                // })
            }

        }

        /////////////////////////////////////////////////////

        //Create a new Fluro instance
        const fluro = new Fluro({
            apiURL: API_URL,
            applicationToken: APPLICATION_TOKEN,
            domain: APPLICATION_REMOTE_URL,
            withCredentials: FluroCookieUser, //If we are using cookies
        });

        /////////////////////////////////////////////////////

        //Set the date defaults
        if (DEFAULT_TIMEZONE) {
            fluro.date.defaultTimezone = DEFAULT_TIMEZONE;
        }

        /////////////////////////////////////////////////////

        fluro.access.setDefaultApplication(FluroApplication);

        
        
        /////////////////////////////////////////////////////

        if (storedUser) {
            //Set the stored user as our auth user
            fluro.auth.set(storedUser);
        } else {
            //If we are authenticated with a cookie
            if (FluroCookieUser) {
                //console.log('-- Authenticated via cookie', FluroCookieUser)
                // console.log('We have a cookie user')
                fluro.auth.set(FluroCookieUser);
            }
        }

        /////////////////////////////////////////////////////

        //Listen for when the authentication has been updated
        fluro.auth.addEventListener('change', userUpdated);

        /////////////////////////////////////////////////////

        function userUpdated(user) {
            persistUserToLocalStorage(user);

            if (store) {
                // console.log('commit to vuex', !!user);
                store.commit('fluro/user', user)
            }

            //Update all of the stat stores
            //as we are now a different user
            fluro.stats.refresh();
        }

        /////////////////////////////////////////////////////

        function userRetrieved(user) {
            // console.log('user retrieved!', user);
            fluro.auth.set(user);
        }

        /////////////////////////////////////////////////////

        function stopLocalStorageListening() {
            if (!listening) {
                return;
            }

            if (WindowObject) {
                // console.log('stop listening')
                WindowObject.removeEventListener('storage', retrieveUserFromLocalStorage)
            }

            listening = false;
        }

        function startLocalStorageListening() {

            if (listening) {
                return;
            }

            if (WindowObject) {
                // console.log('start listening')
                WindowObject.addEventListener('storage', retrieveUserFromLocalStorage)
            }

            listening = true;
        }


        // console.log('retrieve manually')
        // retrieveUserFromLocalStorage();

        // console.log('start listening')
        startLocalStorageListening();


        /////////////////////////////////////////////////////

        function retrieveUserFromLocalStorage(WebStorageContainerEvent) {

            if (WebStorageContainerEvent) {
                if (WebStorageContainerEvent.key != LOCAL_STORAGE_KEY) {
                    return;
                }
            }

            // console.log('Retrieve user from local storage', WebStorageContainerEvent);

            //Check if our user is already in local storage
            if (WebStorageContainer) {

                var retrievedUser;

                //If it is
                var json = WebStorageContainer.getItem(LOCAL_STORAGE_KEY);
                if (json) {
                    // console.log('Retrieved user from local storage', LOCAL_STORAGE_KEY);
                    try {
                        retrievedUser = JSON.parse(json);
                        // console.log('Got stored user!', retrievedUser)
                    } catch (e) {

                        console.log(e);
                        retrievedUser = null;
                        WebStorageContainer.removeItem(LOCAL_STORAGE_KEY);
                        console.log('fluro-vue: removed from local storage');
                        userRetrieved(retrievedUser, WebStorageContainerEvent);
                    } finally {
                        console.log('fluro-vue: update from stored user');
                        userRetrieved(retrievedUser, WebStorageContainerEvent);
                    }
                } else {
                    console.log('fluro-vue: no local storage user', json);
                    userRetrieved(null, WebStorageContainerEvent);
                }
            }
        }

        /////////////////////////////////////////////////////

        function persistUserToLocalStorage(user) {

            stopLocalStorageListening();

            ///////////////////////////////////////

            if (WebStorageContainer) {
                if (!user) {
                    // console.log('remove user from local storage')
                    var current = WebStorageContainer.getItem(LOCAL_STORAGE_KEY);
                    if (current) {
                        console.log('Remove existing user from local storage')
                        WebStorageContainer.removeItem(LOCAL_STORAGE_KEY);
                    } else {
                        // console.log('already no user in local')
                    }

                } else {

                    var userString;
                    try {
                        userString = JSON.stringify(user);
                    } catch (err) {
                        console.log('Local Storage Error', err);
                    } finally {


                        var current = WebStorageContainer.getItem(LOCAL_STORAGE_KEY);
                        if (current != userString) {
                            console.log('save new user to local storage')
                            WebStorageContainer.setItem(LOCAL_STORAGE_KEY, userString);
                        }

                    }
                }
            }

            ///////////////////////////////////////


            startLocalStorageListening();
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
            var readable = fluro.types.readable(input, plural);
            return readable.length ? readable : (backup ? fluro.types.readable(backup, plural) : '');
        });


        /////////////////////////////////////////////////////

        // //Helper function for resetting the cache
        // fluro.resetCache = function() {
        //     //console.log('RESET GLOBAL CACHE')
        //     fluro.cache.reset();
        //     fluro.dispatch('cache.reset')
        // }

        // //Listen out for when the cache clears

        Vue.set(fluro.global, 'CACHE_KEY', Math.random());

        fluro.addEventListener('cache.reset', function() {
            //     //Update to a new random number
            Vue.set(fluro.global, 'CACHE_KEY', Math.random());
            //console.log('GLOBAL CACHE RESET', fluro.global.CACHE_KEY);
        });



        /////////////////////////////////////////////////////


        //Attach Fluro to the main Vue Instance
        Vue.prototype.$fluro = fluro;

    }

}



////////////////////////////////////////////////////////////////////




export default FluroVue;