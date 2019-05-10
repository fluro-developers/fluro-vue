<template>
    <div class="fluro-content-form">
        <!-- <slot></slot> -->
        <template v-for="field in fields">
            <!-- <pre>{{model[field.key]}}</pre> -->
            <!-- <fluro-code-editor v-model="model[field.key]" @input="valueChange" :height="200"></fluro-code-editor> -->
            <v-container class="grid-list-xl" pa-0>
                <!-- <pre>{{field}}</pre> -->

                <!-- :parent="model[key]"  -->
                <fluro-content-form-field :options="options" :field="field" @input="update" v-model="model"></fluro-content-form-field>
            </v-container>
        </template>
    </div>
</template>
<script>
import FluroContentFormField from './FluroContentFormField.vue';
import _ from 'lodash';
import Vue from 'vue';



//////////////////////////////////////////////////

function getDefaultValueForField(field) {

    var blankValue;
    var multiple = field.maximum != 1;

    //Check if it's a nested subgroup or embedded form
    var nested = ((field.type == 'group' && field.asObject) || field.directive == 'embedded');

    ///////////////////////////////////////

    if (multiple) {
        blankValue = [];
    }

    ///////////////////////////////////////

    switch (field.type) {
        case 'reference':
            if (field.defaultReferences && field.defaultReferences.length) {
                if (multiple) {
                    blankValue = blankValue.concat(field.defaultReferences);

                } else {
                    blankValue = _.first(field.defaultReferences);
                }
            }
            break;
        default:
            if (field.defaultValues && field.defaultValues.length) {
                if (multiple) {
                    blankValue = blankValue.concat(field.defaultValues);

                } else {
                    blankValue = _.first(field.defaultValues);
                }
            }
            break;
    }

    ///////////////////////////////////////


    if (multiple) {

        var askCount = Math.max(field.askCount, field.minimum);
        var additionalRequired = Math.max((askCount - blankValue.length), 0);

        //If we need some entries by default
        if (additionalRequired) {

            switch (field.directive) {
                case 'wysiwyg':
                case 'textarea':
                case 'code':
                    _.times(additionalRequired, function() {
                        blankValue.push('');
                    })
                    break;
                default:
                    //We need to add objects
                    if (nested) {
                        _.times(additionalRequired, function() {
                            blankValue.push({});
                        })
                    }
                    break;
            }

        }
    } else {

        if (!blankValue) {
            switch (field.directive) {
                case 'wysiwyg':
                case 'textarea':
                case 'code':
                // case 'select':
                    blankValue = '';
                    break;
                default:
                    //We need to add objects
                    if (nested) {
                        blankValue = {};
                    }
                    //  else {
                    //     blankValue =  null;
                    // }
                    break;
            }
        }
    }

    ///////////////////////////////////////

    return blankValue;
}

//////////////////////////////////////////////////

export default {

    props: {
        'fields': {
            type: Array,
        },
        'value': {
            type: Object,
        },
        'options': {
            default: function() {
                return {}
            },
            type: Object,
        },
    },
    data() {
        return {
            model: this.value,
        }
    },
    computed: {
        errorMessages() {

            function mapRecursiveFieldMessage(component, trail) {
                if (component.$v && component.errorMessages && component.errorMessages.length) {
                    trail.push({field:component.field, messages:component.errorMessages});
                }

                if (component.$children) {
                    _.each(component.$children, function(child) {
                        mapRecursiveFieldMessage(child, trail);
                    })
                }
            }

            ////////////////////////////////

            var trail = [];
            mapRecursiveFieldMessage(this, trail)

            ////////////////////////////////

            return trail;



        }
    },
    components: {
        FluroContentFormField,
    },
    watch: {
        'value': function(val) {
            return this.reset();
        },
        'fields': function(val) {
            return this.reset();
        }
    },
    created() {
        this.reset();
    },
    methods: {
        reset: function() {
            var self = this;
            // self.model = {};
            //Loop through each field and create a key on the object
            //so we can listen to it's changes
            (self.fields || []).forEach(createDefaults);


            //Recursively create all the default keys for nested fields
            function createDefaults(field) {
                var blankValue = getDefaultValueForField(field);

                //Check if it's just a display group
                if (field.type == 'group' && !field.asObject) {
                    (field.fields || []).forEach(createDefaults);
                }

                // console.log('SET', field.key, blankValue);
                Vue.set(self.model, field.key, blankValue);
            }
        },
        update: function(input) {

            // console.log('Field was updated', input);
            // this.model = input;
            // 
            //TODO Figure out how to make this reactive without needing this hack
            // var newModel = _.clone(this.model);


            this.$emit('input', this.model);
            // this.$forceUpdate();
            // _.clone(this.model));//this.model);
            // this.$forceUpdate();

        }
    }
}
</script>
<style scoped lang="scss">
.fluro-content-form {}
</style>