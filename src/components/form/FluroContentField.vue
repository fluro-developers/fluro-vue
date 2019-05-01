<template>
    <div class="fluro-content-field" v-bind="attributes" :class="fieldClass">
        <!-- <pre>{{field.className}}</pre> -->
        <template v-if="officeUseOnly">
        </template>
        <!--  -->
        <template v-else-if="renderer == 'custom'">
            <fluro-compile-html :template="customTemplate" :context="customContext" />
            <!-- CUSTOM INPUT -->
            <!-- <pre>{{field}}</pre> -->
        </template>
        <template v-else-if="renderer == 'embedded'">
            <template v-if="field.maximum == 1">
                <fluro-content-form v-model="fieldModel" @input="valueChange" :fields="fields"></fluro-content-form>
            </template>
            <template v-if="field.maximum != 1">
                <template v-for="(object, index) in fieldModel">
                    <v-card>
                        <v-toolbar class="elevation-0">
                            <v-toolbar-title class="hidden-xs">{{groupTitle(object, index)}}</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-toolbar-items>
                                <v-btn icon small flat color="error" @click="removeValue(index)" v-if="canRemoveValue">
                                    <v-icon>close</v-icon>
                                </v-btn>
                            </v-toolbar-items>
                        </v-toolbar>
                        </v-toolbar>
                        <v-card-text>
                            <fluro-content-form v-model="fieldModel[index]" @input="valueChange" :fields="fields"></fluro-content-form>
                        </v-card-text>
                    </v-card>
                </template>
                <v-btn color="primary" @click="addValue({})" v-if="canAddValue">
                    {{addLabel}}
                </v-btn>
            </template>
        </template>
        <template v-else-if="renderer == 'group'">
            <template v-if="asObject">
                <template v-if="field.maximum == 1">
                    <!-- v-model="model[field.key]" -->
                    <fluro-content-form v-model="fieldModel" @input="valueChange" :fields="fields"></fluro-content-form>
                </template>
                <template v-if="field.maximum != 1">
                    <template v-for="(object, index) in fieldModel">
                        <v-card>
                            <v-toolbar class="elevation-0">
                                <v-toolbar-title class="hidden-xs">{{groupTitle(object, index)}}</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-toolbar-items>
                                    <v-btn small icon flat color="error" @click="removeValue(index)" v-if="canRemoveValue">
                                        <v-icon>close</v-icon>
                                    </v-btn>
                                </v-toolbar-items>
                            </v-toolbar>
                            </v-toolbar>
                            <v-card-text>
                                <fluro-content-form v-model="fieldModel[index]" @input="valueChange" :fields="fields"></fluro-content-form>
                            </v-card-text>
                        </v-card>
                    </template>
                    <v-btn color="primary" @click="addValue({})" v-if="canAddValue">
                        {{addLabel}}
                    </v-btn>
                </template>
            </template>
            <template v-else>
                <template v-for="field in fields">
                    <fluro-content-field class="flex" :field="field" @input="valueChange" v-model="model"></fluro-content-field>
                </template>
            </template>
        </template>
        <template v-else-if="renderer == 'checkbox'">
            <div class="terms" :class="{'has-error':errorMessages.length}" v-if="savedTerms">
                <v-checkbox :mandatory="required" :persistent-hint="true" :label="label" v-model="fieldModel" @change="valueChange($event, true)" :error-messages="errorMessages" :hint="field.description" :placeholder="field.placeholder" />
                <div class="conditions">{{field.params.storeData}}</div>
            </div>
            <template v-else>
                <v-checkbox :mandatory="required" :persistent-hint="true" :label="label" v-model="fieldModel" @change="valueChange($event, true)" :error-messages="errorMessages" :hint="field.description" :placeholder="field.placeholder" />
            </template>
        </template>
        <template v-else-if="renderer == 'number'">
            <v-text-field :required="required" type="number" :label="label" v-model="fieldModel" @input="valueChange" @blur="touch()" :error-messages="errorMessages" :hint="field.description" :placeholder="field.placeholder" />
        </template>
        <template v-else-if="renderer == 'wysiwyg'">
            <!-- <pre>{{fieldModel}}</pre> -->
            <v-input class="no-flex" :label="label">
                <fluro-editor v-model="fieldModel"></fluro-editor>
            </v-input>


            <hr/>
            <pre>{{fieldModel}}</pre>
            <!-- <v-text-field :required="required" type="number" :label="label" v-model="fieldModel" @input="valueChange" @blur="touch()" :error-messages="errorMessages" :hint="field.description" :placeholder="field.placeholder" /> -->
        </template>
        <template v-else-if="renderer == 'datepicker'">
            <v-dialog ref="dialog" v-model="modal" persistent :return-value.sync="fieldModel" lazy full-width width="290px">
                <template v-slot:activator="{ on }">
                    <v-text-field v-model="fieldModel" :label="label" prepend-inner-icon="event" readonly v-on="on" @focus="modal = true"></v-text-field>
                </template>
                <v-card v-if="modal">
                    <v-toolbar color="primary" dark>
                        <v-toolbar-title>{{label}}</v-toolbar-title>
                    </v-toolbar>
                    <v-date-picker v-model="fieldModel" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.dialog.save(fieldModel)">OK</v-btn>
                    </v-date-picker>
                </v-card>
            </v-dialog>
        </template>
        <template v-else-if="renderer == 'timepicker'">
            <v-dialog ref="dialog" v-model="modal" persistent :return-value.sync="fieldModel" lazy full-width width="290px">
                <template v-slot:activator="{ on }">
                    <v-text-field v-model="fieldModel" :label="label" prepend-inner-icon="access_time" readonly v-on="on" @focus="modal = true"></v-text-field>
                </template>
                <v-card v-if="modal">
                    <v-toolbar color="primary" dark>
                        <v-toolbar-title>{{label}}</v-toolbar-title>
                    </v-toolbar>
                    <v-time-picker v-model="fieldModel" full-width>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.dialog.save(fieldModel)">OK</v-btn>
                    </v-time-picker>
                </v-card>
            </v-dialog>
        </template>
        <template v-else-if="renderer == 'datetimepicker'">
            <fluro-datetime-picker format="h:mma - dddd D MMMM YYYY" timePickerFormat="ampm" :label="label" v-model="fieldModel" @focus="modal = true" />
        </template>
        <template v-else-if="renderer == 'textarea'">
            <v-textarea :required="required" :label="label" v-model="fieldModel" @input="valueChange" @blur="touch()" :error-messages="errorMessages" :hint="field.description" :placeholder="field.placeholder" />
        </template>
        <template v-else-if="renderer == 'select'">
            <v-select :required="required" :return-object="type == 'reference'" :label="label" :chips="multipleInput" no-data-text="No options available" :multiple="multipleInput" v-model="fieldModel" item-text="title" :items="options" @input="valueChange" @blur="touch()" :error-messages="errorMessages" :hint="field.description" :placeholder="field.placeholder" />
        </template>
        <template v-else-if="renderer == 'search-select'">
            <v-autocomplete prepend-inner-icon="search" :error-messages="errorMessages" :cache-items="!defaultReferences.length" :chips="multipleInput" :clearable="!required" :return-object="true" item-text="title" v-model="fieldModel" @blur="touch()" @change="valueChange" :multiple="multipleInput" :loading="loading" :items="searchResults" :search-input.sync="keywords" flat hide-no-data :label="label">
                <template v-slot:selection="{ item, selected }">
                    <v-chip :selected="selected" color="blue-grey" class="white--text">
                        <!-- <v-icon left>mdi-coin</v-icon> -->
                        <span v-text="item.title"></span>
                    </v-chip>
                </template>
                <template v-slot:item="{ item }">
                    <fluro-avatar class="xs" :id="item._id" type="contact"></fluro-avatar>    
                    <!-- <v-list-tile-avatar color="indigo" class="headline font-weight-light white--text"> -->
                    <!-- {{item._id}} -->
                    <!-- </v-list-tile-avatar> -->
                    <v-list-tile-content>
                        <v-list-tile-title v-text="item.title"></v-list-tile-title>
                    </v-list-tile-content>
                </template>
            </v-autocomplete>
        </template>
        <template v-else-if="renderer == 'code'">
            <v-card class="no-flex">
                <v-toolbar dark>
                    <v-toolbar-title>{{label}}</v-toolbar-title>
                </v-toolbar>
                <codeeditor v-model="fieldModel" @init="editorInit" :lang="syntax" theme="tomorrow_night_eighties" height="300"></codeeditor>
            </v-card>
            <!-- <v-select :required="required" :return-object="type == 'reference'" :label="label" :chips="multipleInput" no-data-text="No options available" :multiple="multipleInput" v-model="fieldModel" item-text="title" :items="options" @input="valueChange" @blur="touch()" :error-messages="errorMessages" :hint="field.description" :placeholder="field.placeholder" /> -->
        </template>
        <template v-else>
            <template v-if="multipleInput">
                <!-- <pre>{{fieldModel}} {{canAddValue}}</pre> -->
                <!-- <v-text-field v-for="(entry, index) in fieldModel" :append-icon="'minus'" :required="required" v-model="fieldModel[index]" @input="valueChange()" @blur="touch()" :error-messages="errorMessages" :placeholder="field.placeholder" /> -->
                <template v-if="fieldModel.length">
                    <!-- :messages="errorMessages" -->
                    <v-input class="no-flex" :label="label">
                        <!-- <v-layout xs12 wrap> -->
                        <!-- <v-flex xs12> -->
                        <div v-for="(entry, index) in fieldModel">
                            <v-chip close @input="removeValue(index, true)">{{entry}}</v-chip>
                        </div>
                        <!-- </v-flex> -->
                        <!-- </v-layout> -->
                    </v-input>
                </template>
                <template v-if="canAddValue">
                    <v-text-field browser-autocomplete="off" :append-icon="canAddValue ? 'plus' : 'plus'" :required="required" :label="multiLabel" v-model="proposedValue" @keyup.enter.native.stop="addProposedValue()" @blur="addProposedValue()" :error-messages="errorMessages" :hint="hint" :placeholder="field.placeholder" />
                </template>
            </template>
            <template v-if="!multipleInput">
                <v-text-field browser-autocomplete="off" :required="required" :label="label" v-model="fieldModel" @input="valueChange" @blur="touch()" :error-messages="errorMessages" :hint="field.description" :placeholder="field.placeholder" />
            </template>
        </template>
    </div>
</template>
<script>
//Import validation options from vuelidate
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength, email, url } from 'vuelidate/lib/validators';
import _ from 'lodash';
import Vue from 'vue';
import FluroCompileHtml from '../FluroCompileHtml.vue';
import FluroEditor from './FluroEditor.vue';


//Allow custom html to be injected at runtime


////////////////////////////////////////////////////////

export default {
    components: {
        FluroEditor,
        FluroCompileHtml,
        codeeditor: require('vue2-ace-editor'),
    },
    data() {
        return {
            modal: false,
            model: this.value,
            proposedValue: null,

            //Async searching
            keywords: '',
            results: [],
            loading: false,
        }
    },
    watch: {
        'keywords': _.debounce(function() {

            var self = this;
            var field = this.field;
            var keywords = self.keywords;


            //No keywords or we already know
            if (!keywords || !keywords.length) {
                return;
                // && this.querySelections(val)
            }

            ////////////////////////////////////////////////////

            if (field.allowedReferences && field.allowedReferences.length) {
                return;
            }

            ////////////////////////////////////////////////////

            // var search = self.photographerSearch;
            self.loading = true;
            console.log('Searching', keywords);



            var options = {
                limit: 5,
                select: 'title',
            }

            //////////////////////////////

            var restrictToType = _.get(field, 'params.restrictType');

            if (restrictToType && restrictToType.length) {
                options.types = [restrictToType]
            }



            //////////////////////////////

            // self.$fluro.api.get(`/content/contact/search/${search}`, {
            self.$fluro.content.search(keywords, options)
                .then(function(results) {

                    self.results = results; //_.map(results, 'title');
                    self.loading = false;
                })
            // .catch(function(err) {

            //     self.photographers = [];
            //     self.photographerSearching = false;
            //     // self.photographerSearch = '';
            // })



        }, 500),
    },
    computed: {
        savedTerms() {
            return _.get(this.field, 'params.storeCopy');
        },
        syntax() {
            //Code entries
            return _.get(this.field, 'syntax');
        },
        multiLabel() {
            if (this.multipleInput) {
                if (this.total) {
                    return `Add ${this.title}`;
                }
            }
            return this.label

        },
        label() {
            var title = this.title;
            if (this.minimum) {
                return `${title} *`;
            } else {
                return title;
            }
        },

        hint() {

            if (this.maximum == 1) {
                return this.field.description;
            }

            if (this.minimum) {
                if (this.total < this.minimum) {
                    return `Type and press enter (${this.total} of ${this.minimum} required)`;
                }
            }

            if (this.maximum) {
                return `Type and press enter (Max ${this.maximum})`;
            }


            return `Type and press enter`;
        },
        customContext() {
            return this;
        },
        customTemplate() {
            return this.field.template;
        },
        searchResults() {

            if (this.allowedReferences && this.allowedReferences.length) {
                return this.allowedReferences;
            }

            if (this.allowedValues && this.allowedValues.length) {
                return this.allowedValues;
            }

            return this.results;
        },
        canAddValue() {

            //There is no maximum
            if (this.maximum == 0) {
                return true;
            }

            // //console.log('SUB OBJECTS?', this.fieldModel, this.minimum, this.maximum)
            //We are under the maximum
            if (this.fieldModel.length < this.maximum) {
                return true;
            }
        },
        canRemoveValue() {
            if (this.fieldModel.length > this.minimum) {
                return true;
            }
        },

        allowedValues() {
            return this.field.allowedValues;
        },
        allowedReferences() {
            return this.field.allowedReferences;
        },

        defaultValues() {
            return this.field.defaultValues;
        },
        defaultReferences() {
            return this.field.defaultReferences;
        },
        attributes() {
            return this.field.attributes
        },
        fieldClass() {

            var classes = [];

            //Add the renderer class
            classes.push(`fluro-content-field-${this.renderer}`);

            ////////////////////////////////////////////////

            switch (this.renderer) {
                case 'group':
                case 'embedded':
                    if (this.asObject || this.renderer == 'embedded') {
                        if (this.multipleInput) {
                            classes.push(`multiple-input`);
                        }
                    }
                    break;
            }

            ////////////////////////////////////////////////

            classes.push(this.field.className);

            ////////////////////////////////////////////////

            return classes.join(' ');
        },
        groupClass() {
            if (this.type == 'group' || this.type == 'embedded') {
                return `${this.field.className}`;
            }
        },
        fieldModel: {
            get() {
                return this.model[this.key]
            },
            set(value) {
                this.model[this.key] = value;
            }
        },
        addLabel() {
            if (this.fieldModel.length) {
                return `Add another ${this.title}`
            } else {
                return `Add ${this.title}`
            }
        },
        key() {
            return this.field.key;
        },

        asObject() {
            return this.field.asObject;
        },
        fields() {
            return this.field.fields;
        },
        officeUseOnly() {
            return _.get(this.field, 'params.disableWebform');
        },
        type() {
            return this.field.type;
        },
        title() {

            return this.field.title;

        },

        required() {
            return this.minimum;
        },
        multipleInput() {
            return this.maximum != 1;
        },
        options() {

            var self = this;

            ////////////////////////////////////////

            if (!self.field) {
                return [];
            }

            ////////////////////////////////////////

            if (self.field.options && self.field.options.length) {
                return _.map(self.field.options, function(option) {
                    option.title = option.name;
                    return option;
                });
            }

            ////////////////////////////////////////

            if (self.allowedReferences) {
                return self.allowedReferences;
            }

            ////////////////////////////////////////

            if (self.allowedValues) {
                return self.allowedValues;
            }



            ////////////////////////////////////////

            return [];
        },
        minimum() {
            return Math.max(parseInt(this.field.minimum), 0);
        },
        maximum() {
            return parseInt(this.field.maximum);
        },
        total() {
            return this.fieldModel.length;
        },
        errorMessages() {

            var self = this;
            const errors = []

            //Hasn't been touched yet
            if (!this.$v.model.$dirty) {
                return errors;
            }




            ////////////////////////////////////////////

            //If the value requires a certain amount of answers
            if (!this.$v.model.validateInput) {


                if (this.proposedValue) {
                    _.each(checkValidInput(self, this.proposedValue), function(err) {
                        errors.push(err);
                    });
                }


                //Include any errors for invalid or bad input
                _.each(checkValidInput(this, self.fieldModel), function(err) {
                    errors.push(err);
                });

                ///////////////////////////////////////////

                //If we require a set amount of answers
                if (this.minimum == this.maximum) {

                    //If there is a minimum
                    if (this.minimum) {

                        //If it's one
                        if (this.minimum == 1) {
                            errors.push('This field is required');
                        } else {
                            //If its more than 1
                            errors.push(`Please provide ${this.minimum} answers`);
                        }
                    }

                } else {

                    //We require one answer
                    if (this.maximum == 1) {
                        errors.push('This field is required');
                    } else {

                        var isArray = Array.isArray(this.model[this.key])

                        if (!isArray) {
                            errors.push(`Requires at least ${this.minimum} answers`)
                        }

                        //Get how many answers were provided
                        var numberOfAnswersProvided = (this.model[this.key] || '').length;

                        //If not enough to meet the minimum were provided
                        if (numberOfAnswersProvided < this.minimum) {

                            //If the minimum required is 1
                            if (this.minimum == 1) {
                                errors.push(`Requires at least 1 answer`)
                            } else {
                                //Provide at least X answers
                                errors.push(`Please provide at least ${this.minimum} answers`)
                            }
                        }

                        //If we are over the maximum
                        if (numberOfAnswersProvided > this.maximum) {
                            errors.push(`Maximum ${this.maximum} answers`);
                        }
                    }
                }




            }



            ///////////////////////////////////////////

            //If there is a custom error message
            if (this.field.errorMessage && this.field.errorMessage.length) {
                if (errors.length) {
                    return [this.field.errorMessage];
                }
            }

            ///////////////////////////////////////////

            return errors
        },
        renderer() {

            //Get the widget defined on the data object
            var dataType = this.type;
            var directive = this.field.directive;


            switch (directive) {
                case 'date-select':
                    directive = 'datepicker';
                    break;

                case 'time-select':
                    directive = 'timepicker';
                    break;
                case 'datetime-select':
                    directive = 'datetimepicker';
                    break;
                    // case 'wysiwyg':
                case 'textarea':
                    directive = 'textarea';
                    break;
                default:
                    switch (dataType) {
                        case 'group':
                            directive = 'group';
                            break;
                        case 'boolean':
                            directive = 'checkbox';
                            break;
                        case 'number':
                        case 'integer':
                        case 'decimal':
                            directive = 'number';
                            break;
                    }
                    break;
            }


            //Return the basic data type by default
            return directive;
        }
    },
    methods: {
        editorInit: function(editor) {
            console.log('Editor', editor);
            require('brace/ext/language_tools') //language extension prerequsite...
            require('brace/mode/html')
            require('brace/mode/javascript') //language
            require('brace/mode/less')
            require('brace/theme/tomorrow_night_eighties')
            require('brace/snippets/javascript') //snippet
        },
        groupTitle(object, index) {
            if (object.title && object.title.length) {
                return object.title;
            }

            if (object.name && object.name.length) {
                return object.name;
            }

            return `${this.title} ${index+1}`
        },
        includesValue(value) {
            return _.includes(this.fieldModel, value);
        },
        addProposedValue() {

            var self = this;
            var proposedValue = this.proposedValue;

            //Touch the field
            self.touch();

            if (!self.canAddValue) {
                return;
            }

            if (!proposedValue || proposedValue == '') {
                return;
            }

            ////////////////////////////

            //Check to see if the input is valid
            var errors = checkValidInput(self, proposedValue)
            if (errors.length) {
                console.log('Bad Data!', errors)
                return;
            }

            ////////////////////////////

            if (!self.includesValue(proposedValue)) {
                self.addValue(proposedValue);
            }

            self.proposedValue = null;

        },
        addValue(value) {
            if (this.canAddValue && this.fieldModel) {
                this.fieldModel.push(value);
                this.valueChange();
            }
        },
        removeValue(index, forceAllow) {
            if ((this.canRemoveValue || forceAllow) && this.fieldModel) {
                this.fieldModel.splice(index, 1);
                this.valueChange();
            }
        },
        touch() {

            console.log('touched!');
            this.$v.model.$touch()
        },
        valueChange(event, setTouched) {

            var field = this.field;

            if (setTouched) {
                this.touch()
            }
            console.log('changed');
            this.$emit('input', this.model); //[this.key])

            // this.$forceUpdate();


        }
    },

    // props: ['field', 'value'],
    props: {
        'field': {
            type: Object,
        },
        'value': {
            required: true,
        }
    },

    mixins: [validationMixin],
    beforeCreate: function() {
        this.$options.components.FluroContentForm = require('./FluroContentForm.vue').default;
        this.$options.components.FluroContentField = require('./FluroContentField.vue').default;
    },
    created() {

        //Get the field
        var field = this.field;

        /////////////////////////////////////////////////////////

        var defaultValue;

        /////////////////////////////////////////////////////////

        //Check what type it is
        switch (this.renderer) {

            case 'group':
            case 'embedded':

                //If it requires sub objects
                if (field.asObject || this.renderer == 'embedded') {

                    if (field.maximum == 1) {
                        defaultValue = {}
                    } else {

                        //Use an array as it's default value
                        defaultValue = [];

                        //Create an object for either the minimum required entries
                        //or the askCount if it's greater than the minimum
                        var startingFields = Math.max(field.minimum, field.askCount);

                        _.times(startingFields, function(i) {
                            defaultValue.push({})
                        })
                    }
                }

                break;
            default:
                if (this.multipleInput) {
                    defaultValue = [];
                }


                function getDefaultValue(renderer) {
                    switch (renderer) {
                        case 'code':
                            return '';
                            break;
                    }
                }

                //////////////////////////////////////////////////

                if (this.type == 'reference') {
                    if (this.defaultReferences && this.defaultReferences.length) {

                        if (this.multipleInput) {
                            defaultValue = defaultValue.concat(this.defaultReferences);

                        } else {
                            defaultValue = _.first(this.defaultReferences);
                        }

                        this.results = this.results.concat(this.defaultReferences);
                    }
                } else {

                    if (this.defaultValues && this.defaultValues.length) {

                        if (this.multipleInput) {
                            defaultValue = defaultValue.concat(this.defaultValues);

                        } else {
                            defaultValue = _.first(this.defaultValues);
                        }

                        this.results = this.results.concat(this.defaultValues);
                    } else {
                        if (this.multipleInput) {
                            defaultValue = [getDefaultValue(this.renderer)];
                        } else {
                            defaultValue = getDefaultValue(this.renderer);
                        }
                    }
                }
                break;
        }

        //////////////////////////////////////

        // console.log('SET DEFAULT', field.key, defaultValue);
        //Set the default value and it's reactivity
        Vue.set(this.model, field.key, defaultValue);



    },
    validations: {
        model: {
            validateInput,
        }
    },

}


////////////////////////////////////////////////////////

/**
 * Check if a numeric input matches the required minimum/maximum values
 * @param  {String|Number} input        The Number to check
 * @param  {Number|Float|Integer} minimumValue The minimum to check
 * @param  {Number|Float|Integer} maximumValue The maximim to check
 * @param  {String} numberType   The type of number to check, 'number','float' or 'integer'
 * @return {String}              The error message (if the number is invalid)
 */
function checkNumericInputError(input, minimumValue, maximumValue, numberType) {

    var parseFunction = Number;

    switch (numberType) {
        case 'integer':
            parseFunction = parseInt;
            break;
        case 'float':
        case 'decimal':
            parseFunction = parseFloat;
            break;
    }

    if (typeof input != 'undefined') {
        input = parseFunction(input);
    }

    if (typeof minimumValue != 'undefined') {
        minimumValue = parseFunction(minimumValue);
        if (input < minimumValue) {
            return `Must be at least ${minimumValue}`
        }
    }

    if (typeof maximumValue != 'undefined') {
        maximumValue = parseFunction(maximumValue);
        if (input > maximumValue) {
            return `Must be less than ${maximumValue}`
        }
    }
}



////////////////////////////////////////////////////////

//Validate the amount of answers
function validateInput(source, vm) {

    var value = source[this.key];
    var minimum = vm.minimum; //Math.max(parseInt(this.field.minimum), 0);
    var maximum = vm.maximum; //parseInt(this.field.maximum);
    var isArray = Array.isArray(value);

    if (this.proposedValue) {
        var badDataErrors = checkValidInput(vm, this.proposedValue);
        if (badDataErrors.length) {
            return false;
        }
    }

    //////////////////////

    //There is no minimum
    if (!minimum && !value) {
        //console.log('No minimum!')
        return true;
    }

    //////////////////////

    //We require an answer from here on out

    //Maximum answer of 1
    if (maximum == 1) {

        if (value) {
            //console.log(`Required answer was provided`)
            return !checkValidInput(vm, value).length;
        } else {
            //console.log('Requires an answer but none provided');
            return false;
        }
    }

    //////////////////////

    //We need value to be an array at this point
    if (!isArray) {
        //console.log(`Requires ${minimum} answer but value is not an array`)
        return false;
    }

    //////////////////////
    var numberOfAnswersProvided = (value || '').length;

    if (numberOfAnswersProvided < minimum) {
        return false;
    }

    if (numberOfAnswersProvided > maximum) {
        return false;
    }


    var badData = _.some(value, function(input) {
        return checkValidInput(vm, input).length;
    });

    if (badData) {
        return false;
    }

    //////////////////////

    //If we get here then it's valid
    return true;

}




//////////////////////////////////////////////

function checkValidInput(self, input) {

    var errors = [];


    //Now validate the input
    // var input = self.fieldModel;
    var dataType = self.type;

    //Numeric Validators
    var isNumberType;
    var minimumValue = _.get(self.field, 'params.minValue');
    var maximumValue = _.get(self.field, 'params.maxValue');

    ////////////////////////////////////////

    switch (dataType) {
        case 'email':

            if (!email(input)) {
                errors.push('Must be a valid email');
            }

            break;
        case 'url':

            if (!url(input)) {
                errors.push(`Must be a valid url eg. https://...`);
            }

            break;
        case 'boolean':

            if (self.minimum) {
                if (!input) {
                    errors.push('This is required')
                }
            }
            break;
        case 'integer':
        case 'decimal':
        case 'float':
        case 'number':
            isNumberType = true;

            var numberised = Number(input);
            var isActualNumber = (_.isFinite(numberised) && !_.isNaN(numberised));
            if (!isActualNumber) {
                errors.push(`${input} is not a valid number!`)
            }

            var numberError = checkNumericInputError(input, minimumValue, maximumValue, dataType);
            if (numberError) {
                errors.push(numberError);
            }
            break;
    }

    ////////////////////////////////////////

    return errors;
}
</script>
<style lang="scss">
.fluro-content-field {

    &.fluro-content-field-group.multiple-input {
        margin-bottom: 50px;
    }

    .no-flex {
        .v-input__slot {
            display: block;
            margin: 0;
        }
    }

    .v-sheet {
        margin-bottom: 15px;
    }

    .v-toolbar__content {
        height: 40px !important;
        padding-right: 5px;
    }

    .v-toolbar__title {
        letter-spacing: -0.03em;
    }

    .terms {

        padding: 15px 15px;
        background: rgba(#000, 0.05);
        border-radius: 3px;
        margin-top: 16px;

        &.has-error {
            background: rgba(#ff5252, 0.05)
        }

        &>.v-input {
            margin-top: 0 !important;
        }

        .conditions {
            margin-top: 10px;
            font-size: 0.9em;
            opacity: 0.8;

            font-style: italic;
        }
    }
}
</style>