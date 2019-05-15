<template>
    <div class="fluro-content-select">
        <div class="fluro-content-list">
            <draggable v-model="model" v-bind="dragOptions" @start="drag=true" @end="drag=false">
                <transition-group type="transition" :name="!drag ? 'flip-list' : null">
                    <!-- <div v-for="element in myArray" :key="element.id">{{element.name}}</div> -->
                    <fluro-list-item :item="item" v-for="item in model" :key="item._id" :actions="getActions(item)" />
                </transition-group>
            </draggable>
        </div>
        <!-- <pre>{{minimum}} {{maximum}} {{total}} {{model}}</pre>  -->
        <v-layout v-if="canAddValue">
            <v-flex grow>
                <v-autocomplete :box="true" :hide-selected="true" @change="selected()" prepend-inner-icon="search" placeholder="Search for items" :return-object="true" item-text="title" v-model="candidates" :multiple="true" :loading="loading" :items="results" :search-input.sync="search" flat hide-no-data :label="label">
                    <template v-slot:item="{ item }">
                        <v-list-tile-avatar class="text-sm-center">
                            <template v-if="item._type == 'persona'">
                                <fluro-avatar :id="item._id" type="persona" />
                            </template>
                            <template v-else-if="item._type == 'contact'">
                                <fluro-avatar :id="item._id" type="contact" />
                            </template>
                            <template v-else-if="item._type == 'image'">
                                <fluro-image :item="item" :spinner="true" :width="40" :height="40" />
                            </template>
                            <template v-else>
                                <fluro-icon :type="item._type"></fluro-icon>
                            </template>
                        </v-list-tile-avatar>
                        <!-- <fluro-avatar class="xs" :id="item._id" type="contact"></fluro-avatar>   -->  
                        <v-list-tile-content>
                            <v-list-tile-title v-text="item.title"></v-list-tile-title>
                            <!-- <v-list-item-subtitle> -->
                            <!-- </v-list-item-subtitle> -->
                            <!-- <v-list-item-title v-text="item.title">{{title}}</v-list-item-title> -->
                            <!-- <div class="item-subtitle">{{subtitle}}</div> -->
                            <!-- <v-list-item-title v-text="item.title"></v-list-item-title> -->
                        </v-list-tile-content>
                    </template>-
                </v-autocomplete>
            </v-flex>
            <v-flex shrink>
                <v-btn color="primary" icon>
                    <v-icon>add</v-icon>
                </v-btn>
                <v-btn icon @click="dialog = true">
                    <v-icon>more_horiz</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>
        <v-dialog content-class="fluro-content-select-dialog" v-model="dialog">
            <template v-if="dialog">
                <fluro-content-browser :minimum="minimum" :maximum="maximum" :type="type" @close="closeModal()" v-model="model"></fluro-content-browser>
            </template>
        </v-dialog>
    </div>
</template>
<script>
import FluroContentBrowser from './FluroContentBrowser.vue';
import FluroSelectionMixin from '../../mixins/FluroSelectionMixin';
import draggable from 'vuedraggable'
// import { mapFields } from 'vuex-map-fields';



export default {
    components: {
        draggable,
        FluroContentBrowser,
    },
    mixins: [FluroSelectionMixin],
    props: {
        'label': {
            type: String,
        },
        'value': {
            type: Array,
            default: function() {
                return [];
            },
        },
        'type': {
            type: String,
        },
        'minimum': {
            type: Number,
            default: 0,
        },
        'maximum': {
            type: Number,
            default: 0,
        }
    },

    // <v-input class="no-flex" :success="success" :label="label" :required="required" :error-messages="errorMessages" :hint="field.description">
    computed: {
        multiple() {
            return this.maximum != 1;
        },
        total() {
            // if(this.multiple) {
            return this.model.length;
            // } else {
            // return this.model ? 1 : 0;
            // }
        },
        canAddValue() {
            if (this.maximum) {
                return this.total < this.maximum;
            }

            return true;
        },
        dragOptions() {
            return {
                animation: 200,
                group: "description",
                disabled: false,
                ghostClass: "ghost"
            };
        },
        search: {
            get() {
                return this.terms;
            },
            set: _.debounce(function(newValue) {
                this.terms = newValue;
            }, 500)
        },
        // ...mapFields('fluro', [
        //     'realmSelectFullScreen', //The authenticated user if they log in
        // ]),
    },
    methods: {
        closeModal() {
            this.dialog = false;
        },
        selected() {

            var self = this;

            //////////////////////////////////////////

            var newEntries = self.candidates;

            //If we haven't hit the maximum yet
            if (self.canAddValue) {

                if (self.maximum) {

                    var numOpenSlots = (self.maximum - self.total);
                    newEntries = newEntries.slice(0, numOpenSlots);
                }

                if(newEntries.length) {
                    _.each(newEntries, function(item) {
                        self.select(item);
                    });
                }
            }

            //////////////////////////////////////////

            //Reset the search and clear the candidates
            self.terms = '';
            self.candidates = [];

            //////////////////////////////////////////

        },
        getActions(item) {
            var self = this;
            var actions = [];

            actions.push({
                title: 'Deselect',
                click: function() {
                    return self.deselect(item);
                }
            });

            return actions;


        }
    },
    watch: {
        'terms': function(searchTerms) {

            var self = this;
            self.results = [];

            if (searchTerms && searchTerms.length) {

                self.loading = true;
                var options;

                if(self.type) {
                    options.params = {
                        type
                    }
                }

                self.$fluro.content.search(searchTerms, options)
                    .then(function(results) {

                        self.results = results; //_.map(results, 'title');
                        self.loading = false;
                    })
                    .catch(function(err) {
                        self.loading = false;
                        self.results = [];
                    })
            }


        },
        'model': function() {
            var self = this;
            this.$emit('input', self.model); //[self.key])
        }
    },
    data() {
        return {
            candidates: this.value,
            results: [],
            terms: '',
            loading: false,
            dialog: false,
            model: this.value,
            drag: false,
        }
    },
}
</script>
<style lang="scss">
.fluro-content-select {

    & /deep/ .v-select__selections {
        padding-top: 0 !important;
    }

    & /deep/ .v-input__slot {
        min-height: 48px !important;
    }

    & /deep/ .v-input__prepend-inner,
    & /deep/ .v-input__append-inner {
        margin-top: 11px !important;
    }

    & /deep/ .v-text-field--box .v-input__slot {
        background: rgba(#000, 0.03);
    }
}

.fluro-content-select-dialog {
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.ghost {
    opacity: 0.5;
}




.flip-list-move {
    transition: transform 0.5s;
}

.no-move {
    transition: transform 0s;
}
</style>