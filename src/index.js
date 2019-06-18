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

console.log('fluro-vue v1.2')
// import store from './store'
import Fluro from 'fluro';


/////////////////////////////////////////////////////

//Import Components
import FluroAvatar from './components/FluroAvatar.vue';
export { FluroAvatar as FluroAvatar };


import FluroAvatarUpdate from './components/FluroAvatarUpdate.vue';
export { FluroAvatarUpdate as FluroAvatarUpdate };



import FluroImage from './components/FluroImage.vue';


import FluroVideo from './components/FluroVideo.vue';
import FluroVideoThumbnail from './components/FluroVideoThumbnail.vue';

////////////////////////////////////////////////////////////////////

import FluroListItem from './components/FluroListItem.vue';
export { FluroListItem as FluroListItem };


////////////////////////////////////////////////////////////////////

import FluroContentPanel from './components/content/FluroContentPanel.vue';
export { FluroContentPanel as FluroContentPanel };

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

//Content Render Components
import FluroContentRender from './components/FluroContentRender.vue';
export { FluroContentRender as FluroContentRender };

import FluroContentRenderField from './components/FluroContentRenderField.vue';
export { FluroContentRenderField as FluroContentRenderField };


////////////////////////////////////////////////////////////////////////////////

//UI Nicieties
import FluroPagePreloader from './components/ui/FluroPagePreloader.vue';
export { FluroPagePreloader as FluroPagePreloader };


import FluroSearchBar from './components/ui/FluroSearchBar.vue';
export { FluroSearchBar as FluroSearchBar };

import FluroIcon from './components/ui/FluroIcon.vue';
import FluroRealmDots from './components/ui/FluroRealmDots.vue';



import FluroWrapper from './components/ui/FluroWrapper.vue';
export { FluroWrapper as Wrapper };

import FluroConstrain from './components/ui/FluroConstrain.vue';
export { FluroConstrain as Constrain };

import FluroRealmBar from './components/ui/FluroRealmBar.vue';
export { FluroRealmBar as RealmBar };



////////////////////////////////////////////////////////////////////////////////

//Form Components

import FluroContentBrowser from './components/form/FluroContentBrowser.vue';
export { FluroContentBrowser as FluroContentBrowser };

import FluroContentSelect from './components/form/FluroContentSelect.vue';
export { FluroContentSelect as FluroContentSelect };

import FluroRealmSelect from './components/form/FluroRealmSelect.vue';
export { FluroRealmSelect as FluroRealmSelect };

import FluroEditor from './components/form/FluroEditor.vue';
export { FluroEditor as FluroEditor };

import FluroCodeEditor from './components/form/FluroCodeEditor.vue';
export { FluroCodeEditor as FluroCodeEditor };

import FluroContentForm from './components/form/FluroContentForm.vue';
export { FluroContentForm as FluroContentForm };

import FluroContentFormField from './components/form/FluroContentFormField.vue';
export { FluroContentFormField as FluroContentFormField };

import FluroDateTimePicker from './components/form/FluroDateTimePicker.vue';
export { FluroDateTimePicker as FluroDateTimePicker };


import FluroSignatureField from './components/form/FluroSignatureField.vue';
export { FluroSignatureField as FluroSignatureField };


import FluroAcademicSelect from './components/form/FluroAcademicSelect.vue';
export { FluroAcademicSelect as FluroAcademicSelect };


import FluroPostForm from './components/form/FluroPostForm.vue';
export { FluroPostForm as FluroPostForm };

import FluroInteractionForm from './components/form/FluroInteractionForm.vue';
export { FluroInteractionForm as FluroInteractionForm };

import FluroPostThread from './components/form/FluroPostThread.vue';
export { FluroPostThread as FluroPostThread };




////////////////////////////////////////////////////////////////////////////////


import FluroStatToggle from './components/FluroStatToggle.vue';
export { FluroStatToggle as FluroStatToggle };


import FluroStatTotal from './components/FluroStatTotal.vue';
export { FluroStatTotal as FluroStatTotal };





////////////////////////////////////////////////////////////////////

//Mixins
import Layout from './mixins/Layout';
export { Layout as Layout };


import FluroSelectionMixin from './mixins/FluroSelectionMixin';
export { FluroSelectionMixin as FluroSelectionMixin };


/////////////////////////////////////////////////////

import { getField, updateField } from 'vuex-map-fields';





/////////////////////////////////////////////////////
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
                // console.log('Got existing user', storedUser)
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
        // fluro.auth.debug = true;
        fluro.auth.addEventListener('change', userUpdated);

        //Set the user from the vuex store if we have it
        fluro.auth.set(store.getters['fluro/user']);

        /////////////////////////////////////////////////////

        function userUpdated(user, disablePersist) {
            
            // if(user) {
            //     console.log('__________________________');
            //     console.log('token', user.token);
            //     console.log('refresh', user.refreshToken);
            // }
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

                        console.log(e);
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

            console.log('LocalStorage Update', storedUser)
        }

        function persistUserToLocalStorage(user) {
            if (WebStorageContainer) {
                if (!user) {
                    WebStorageContainer.removeItem(LOCAL_STORAGE_KEY);
                } else {
                    try {
                        console.log('PERSIST USER NOW', user)
                        WebStorageContainer.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
                    } catch (err) {
                        console.log('Error', err)
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

        //Add Fluro Components Globally
        Vue.component('fluro-icon', FluroIcon);
        Vue.component('fluro-realm-dots', FluroRealmDots);
        Vue.component('fluro-avatar', FluroAvatar);
        Vue.component('fluro-image', FluroImage);
        Vue.component('fluro-list-item', FluroListItem);
        Vue.component('fluro-video', FluroVideo);
        Vue.component('fluro-video-thumbnail', FluroVideoThumbnail);
        Vue.component('fluro-page-preloader', FluroPagePreloader);

        /////////////////////////////////////////////////////

        //Attach Fluro to the main Vue Instance
        Vue.prototype.$fluro = fluro;

    }

}



////////////////////////////////////////////////////////////////////




export default FluroVue;