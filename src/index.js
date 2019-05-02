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
//         console.log('Mounted!');
//       }
//     });
//   }
// };

// export default FluroVue;

// import store from './store'
import Fluro from 'fluro';

/////////////////////////////////////////////////////

//Import Components
import FluroAvatar from './components/FluroAvatar.vue';
import FluroImage from './components/FluroImage.vue';
import FluroVideo from './components/FluroVideo.vue';
import FluroVideoThumbnail from './components/FluroVideoThumbnail.vue';


////////////////////////////////////////////////////////////////////

//Form Components
import FluroRealmSelect from './components/form/FluroRealmSelect.vue';
export { FluroRealmSelect as FluroRealmSelect };

import FluroEditor from './components/form/FluroEditor.vue';
export { FluroEditor as FluroEditor };

import FluroCodeEditor from './components/form/FluroCodeEditor.vue';
export { FluroCodeEditor as FluroCodeEditor };

import FluroContentForm from './components/form/FluroContentForm.vue';
export { FluroContentForm as FluroContentForm };

import FluroContentField from './components/form/FluroContentField.vue';
export { FluroContentField as FluroContentField };

import FluroDateTimePicker from './components/form/FluroDateTimePicker.vue';
export { FluroDateTimePicker as FluroDateTimePicker };


////////////////////////////////////////////////////////////////////

//Mixins
import Layout from './mixins/Layout';
export { Layout as Layout };



/////////////////////////////////////////////////////

import { getField, updateField } from 'vuex-map-fields';





/////////////////////////////////////////////////////
/////////////////////////////////////////////////////

var LOCAL_STORAGE_KEY = 'fluro.user';

/////////////////////////////////////////////////////


const FluroVue = {
    install: function(Vue, options) {

        /////////////////////////////////////////////////////

        if (!options || !options.store) {
            throw new Error('Please initialise fluro-vue with a Vuex store.');
        }

        /////////////////////////////////////////////////////

        var storedUser;

        /////////////////////////////////////////////////////

        //Check if our user has been saved to local storage
        if (localStorage) {
            var json = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (json) {
                try {
                    storedUser = JSON.parse(json);
                } catch (e) {
                    // console.log('Error', e);
                    storedUser = null;
                    localStorage.removeItem(LOCAL_STORAGE_KEY);
                } finally {
                    // console.log('Stored user', storedUser);
                }

            }

            //     // var rememberedVuex = localStorage.getItem('vuex')
            //     // if(rememberedVuex) {
            //     //     rememberedVuex = JSON.parse(rememberedVuex);
            //     // } 

            //     // if(rememberedVuex.fluro && rememberedVuex.fluro.user) {
            //     //     rememberedUser = rememberedVuex.fluro.user;
            //     // }
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
                    //User logs in to the app
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
        fluro.auth.addEventListener('change', userUpdated);

        //Set the user from the vuex store if we have it
        fluro.auth.set(store.getters['fluro/user']);

        /////////////////////////////////////////////////////

        function userUpdated(user) {
            store.commit('fluro/user', user);

            if (localStorage) {
                var json;
                if (user) {
                    json = JSON.stringify(user)
                }
                //Save to local storage
                if (json) {
                    localStorage.setItem(LOCAL_STORAGE_KEY, json);
                } else {
                    localStorage.removeItem(LOCAL_STORAGE_KEY);
                }
            }

            //Update all of the stat stores
            //as we are now a different user
            fluro.stats.refresh();
        }

        /////////////////////////////////////////////////////

        //Add Fluro Filters Globally 
        Vue.filter('dateFromID', fluro.date.dateFromID);
        Vue.filter('formatDate', fluro.date.formatDate);
        Vue.filter('readableEventDate', fluro.date.readableEventDate);
        Vue.filter('filesize', fluro.asset.filesize);
        Vue.filter('comma', fluro.utils.comma);

        //Add Fluro Components Globally
        Vue.component('fluro-avatar', FluroAvatar);
        Vue.component('fluro-image', FluroImage);
        Vue.component('fluro-video', FluroVideo);
        Vue.component('fluro-video-thumbnail', FluroVideoThumbnail);


        /////////////////////////////////////////////////////

        //Dependencies
        // Vue.use(VueSignature);


        /////////////////////////////////////////////////////

        //Attach Fluro to the main Vue Instance
        Vue.prototype.$fluro = fluro;

    }

}



////////////////////////////////////////////////////////////////////




export default FluroVue;