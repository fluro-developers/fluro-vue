<template>
    <div>
        <template v-if="form">
            <template v-if="!allowed">
                <template v-if="user">
                    <slot name="authenticated"></slot>
                </template>
                <template v-if="!user">
                    <slot name="unauthenticated"></slot>
                </template>
            </template>
            <template v-if="allowed">
                <div class="fluro-post-form">
                    <v-layout>
                        <fluro-avatar left :id="user.persona" type="persona"></fluro-avatar>    
                        <v-flex>
                           
                            <h2>{{displayTitle}}</h2>
                        </v-flex>
                    </v-layout>
                    <form @submit.prevent="submit" :disabled="state == 'processing'">
                        <fluro-content-form v-model="model.data" :fields="form.fields" />
                        <template v-if="state == 'processing'">
                            <v-btn :disabled="true">
                                Processing
                                <v-progress-circular indeterminate></v-progress-circular>
                            </v-btn>
                        </template>
                        <template v-else>
                            <v-btn type="submit" color="primary">
                                Submit
                            </v-btn>
                        </template>
                    </form>
                </div>
            </template>
        </template>
    </div>
</template>
<script>
import FluroContentForm from './FluroContentForm.vue';
import _ from 'lodash';
import Vue from 'vue';



import { mapFields } from 'vuex-map-fields';


//////////////////////////////////////////////////

export default {
    props: {
        'title':{
            type:String,
        },
        'type': {
            type: String,
        },
        'target': {
            type: [Object, String],
        },
    },
    data() {
        return {
            model: {
                data: {},
            },
            thread: [],
            state: 'ready',
        }
    },
    created() {

    },
    computed: {
        displayTitle() {

            if(this.title) {
                return this.title;
            }
            return `Add ${this.form.title}`;
        },
        allowed() {
            var canCreate = this.$fluro.access.can('create', this.type, 'post');
            var canSubmit = this.$fluro.access.can('submit', this.type, 'post');

            return canCreate || canSubmit;

        },
        ...mapFields('fluro', [
            'application', //The Fluro application and all of it's permissions and data
            'user', //The authenticated user if they log in
        ]),
    },
    components: {
        FluroContentForm,
    },
    asyncComputed: {
        form: {
            default: [],
            get() {
                return this.$fluro.content.type(this.type);
            }
        }
    },
    methods: {
        reset() {
            var self = this;
            //Reset the model
            // Vue.set(self.model, 'data', {});
            self.model = {
                data: {},
            };

            self.state = 'ready';
            self.$emit('reset');
        },
        submit() {
            // console.log('SUBMIT NOW', this)


            var self = this;

            self.state = 'processing';

            //Create the post
            self.$fluro.content.submitPost(this.target, this.type, this.model)
                .then(function(post) {
                    // console.log('Created the post!', post);

                    self.$emit('created', post);
                    self.$emit('success', post);
                    self.reset();

                }, function(err) {
                    //Dispatch an error
                    self.$fluro.error(err);
                    self.state = 'error';
                    self.$emit('error', err);

                    self.error(err);
                })


        }
    }
}
</script>
<style scoped lang="scss">
.fluro-post-form {

    .v-btn {
        .v-progress-circular {
            width: 15px !important;
            height: 15px !important;
            margin-left: 15px;
        }
    }
}
</style>