<template>
    <div class="realm-select">
        <v-btn color="primary" dark @click="dialog = true">{{model.length}} Realms Selected</v-btn>
        <v-dialog content-class="realm-dialog" :fullscreen="realmSelectFullScreen" v-model="dialog">
            <!-- fullscreen hide-overlay transition="dialog-bottom-transition" scrollable -->
            <v-card tile>
                <v-toolbar card dark color="primary">
                    <v-btn icon dark @click="dialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>{{model.length}} Realms</v-toolbar-title>
                    <!-- <v-spacer></v-spacer>
                    <v-flex>
                        <v-text-field dark color="white" label="Search"></v-text-field>
                    </v-flex> -->
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn dark icon flat @click="realmSelectFullScreen = !realmSelectFullScreen">
                            <v-icon>{{ realmSelectFullScreen ? 'fullscreen_exit' :'fullscreen'}}</v-icon>
                        </v-btn>
                    </v-toolbar-items>
                    <!-- <v-menu bottom right offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn dark icon v-on="on">
                                <v-icon>more_vert</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-tile v-for="(item, i) in items" :key="i" @click="">
                                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu> -->
                </v-toolbar>
                <v-tabs class="flex-tabs" :show-arrows="true" dark :centered="true" :grow="true" v-model="active">
                    <v-tab v-for="type in tree" :key="type.definitionName" ripple>
                        {{type.plural}}
                    </v-tab>
                    <v-tab-item v-for="type in tree" :key="type.definitionName">
                        <!-- <wrapper xs style="background: #eee;"> -->
                        <constrain gutterless sm :class="{'has-selection':model.length}">
                            <v-card flat class="tab-content">
                                <div class="realm-select-item-outer">
                                    <v-list dense class="children">
                                        <template v-for="realm in type.realms">
                                            <fluro-realm-select-item :item="realm" :check="isSelected" :callback="toggle" />
                                            <!-- <v-list-tile @click="toggle(realm)">
                                        <v-list-tile-action>
                                            <v-checkbox v-model="realm.selected"></v-checkbox>
                                        </v-list-tile-action>
                                        <v-list-tile-content>
                                            
                                            <v-list-tile-title>{{realm.title}}</v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-list-tile> -->
                                        </template>
                                    </v-list>
                                </div>
                                <!-- -->
                            </v-card>
                        </constrain>
                        <!-- </wrapper> -->
                    </v-tab-item>
                </v-tabs>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import Vue from 'vue';
import FluroRealmSelectItem from './FluroRealmSelectItem.vue';
import Constrain from './layout/Constrain.vue';
import Wrapper from './layout/Wrapper.vue';
import { mapFields } from 'vuex-map-fields';

export default {
    computed: {
        ...mapFields('fluro', [
            'realmSelectFullScreen', //The authenticated user if they log in
        ]),
    },
    components: {
        FluroRealmSelectItem,
        Constrain,
        Wrapper,
    },
    props: {
        'value': {
            type: Array,
        },
    },
    data() {
        return {
            dialog: false,
            model: this.value,
            active: 0,
        }
    },
    asyncComputed: {
        tree: {
            default: [],
            get() {


                var self = this;

                // service.retrieveSelectableRealms = function(action, type, parentType, options) {



                // //Load all the realms of the user
                // var self = this;


                // return new Promise(function(resolve, reject) {

                return self.$fluro.access.retrieveSelectableRealms()
                //   .then(
                //     function(res) {

                //       var mapped = _.map(res)
                //       return resolve(mapped);
                //     },
                //     reject);

                // });

                //     return res
                //     return resolve(sorted);
                // }, reject);

                //     self.$fluro.access.retrieveSelectableRealms = function('create', self.type, self.parentType, options), {
                //             types: ['article']
                //         })
                //         .then(function(res) {

                //             return resolve(res.data);
                //         }, reject);
                // });



            }
        }
    },
    methods: {

        isSelected(realm) {
            if (this.indexOf(realm) != -1) {
                return true;
            }
        },
        indexOf(realm) {
            var self = this;

            //Check to see if this realm is selected
            var realmID = self.$fluro.utils.getStringID(realm);

            return _.findIndex(this.model, function(entry) {
                return realmID == self.$fluro.utils.getStringID(entry);
            });
        },
        addRealm(realm) {
            this.model.push(realm);
            this.valueChange();
        },
        removeRealm(index) {
            this.model.splice(index, 1);
            this.valueChange();
        },


        toggle(realm) {

            var index = this.indexOf(realm);
            if (index != -1) {
                this.removeRealm(index);
            } else {
                this.addRealm(realm);
            }
            // console.log('totggle', realm.title);
            // // this.model.push(realm);
            // Vue.set(this.model, this.model.length, realm);
            // this.valueChange();
        },
        valueChange() {
            this.$emit('input', this.model)
        }
    }
}
</script>
<style lang="scss">
$bg-color: #eaedf2;
$line-color: darken($bg-color, 10%);



@mixin flex-column {
    overflow: hidden;
    // border: 10px solid pink;
    flex: 1;
    display: flex;
    flex-direction: column;
}



.realm-dialog {
    background: $bg-color;
    max-width: 500px;
    @include flex-column;


    &>.v-card {
        @include flex-column;

        &>.v-tabs {
            @include flex-column;

            &>.v-window {
              
                @include flex-column;
                overflow: auto;
            }
        }


    }

    &.v-dialog--fullscreen {
        max-width: none;
        left: 0 !important;
        right: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        overflow: hidden !important;
    }

    .has-selection {
        .realm-select-item {
            background: lighten($bg-color, 3%);

            &.selected {

                background: #fff;
                border-color: $line-color;
                color: #333;


                .v-list__tile__title {
                    font-weight: 600;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .v-list__tile__action {
                    opacity: 1;
                }
            }
        }
    }

    .v-tabs__item {
        font-size: 12px;
    }



}


.realm-select-item-outer {
    background: $bg-color;
    padding: 0 5px 0 15px;

    .v-list {
        background: none !important;
    }

    &.has-children+.realm-select-item-outer {
        &>.realm-select-item:first-child {
            border-top: 1px solid $line-color !important;
        }
    }

    .realm-select-item {
        border: 1px solid $line-color;
        display: block;
        padding: 0 10px;

        color: #888;
        padding: 0;
        position: relative;
        background: #fff;

        &:first-child {
            border-top: none;
        }

        &:before {
            content: '';
            border-top: 1px solid $line-color;
            position: absolute;
            left: -16px;
            top: 19px;
            width: 15px;
            height: 2px;
            display: block;
        }

        .v-list__tile__action {
            opacity: 0;
        }


        .dot {
            border-radius: 100%;
            display: inline-block;
            width: 10px;
            height: 10px;
            margin-right: 10px;
            background-color: rgba(#444, 0.3);
        }
    }

    .children {
        padding: 0 0 15px;
        margin-left: 21px;
        border-left: 1px solid $line-color;
        position: relative;

        &:before {
            content: '';
            position: absolute;
            width: 1px;
            height: 20px;
            display: block;
            left: -1px;
            border-left: 1px solid $line-color;
            top: 0;
        }

        &:after {
            content: '';
            position: absolute;
            width: 1px;
            height: 36px;
            display: block;
            left: -1px;
            border-left: 1px solid $bg-color;
            bottom: 0;
        }
    }
}
</style>