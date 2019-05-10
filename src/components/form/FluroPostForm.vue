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
                        <fluro-avatar left md :id="user.persona" type="persona"></fluro-avatar>    
                        <v-flex d-flex>
                            <h3 title>{{displayTitle}}</h3>
                        </v-flex>
                    </v-layout>
                    <form @submit.prevent="submit" :disabled="state == 'processing'">
                        <fluro-content-form ref="form" v-model="model.data" :options="options" :fields="form.fields" />
                        <template v-if="state == 'processing'">
                            <v-btn class="mx-0"  :disabled="true">
                                Processing
                                <v-progress-circular indeterminate></v-progress-circular>
                            </v-btn>
                        </template>
                        <template v-else>

                           TESTING AND STUFF {{errorMessages}} {{hasErrors}}.

                           <!-- <pre>{{form.fields}}</pre> -->


                            <v-alert :value="true" type="error" outline v-if="hasErrors">
                                Please check the following messages before submitting
                                <div v-for="error in errorMessages">
                                    <strong>{{error.field.title}}</strong>: {{error.messages[0]}}
                                </div>
                            </v-alert>
                            <v-btn class="mx-0" :disabled="hasErrors" type="submit" color="primary">
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
        'title': {
            type: String,
        },
        'type': {
            type: String,
        },
        'target': {
            type: [Object, String],
        },
        'options': {
            default:function() {
                return {}
            },
            type: Object,
        },
    },
    data() {
        return {
            model: {
                data: {},
            },
            serverErrors: '',
            errorMessages: [],
            thread: [],
            state: 'ready',
        }
    },
    created() {

    },
    mounted() {
        var self = this;
        self.$watch(function() {
            return _.get(self.$refs, 'form.errorMessages');
        }, self.validate);


         self.validate();
    },
    computed: {
        hasErrors() {
            return this.errorMessages.length ? true : false;
        },
        displayTitle() {

            if (this.title) {
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
        validate() {
            
            this.errorMessages = _.get(this.$refs, 'form.errorMessages');

            console.log('VALIDATE ERROR MESSAGES', this.$refs,  this.errorMessages)
        },
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