<template>
    <div class="fluro-content-form-field" v-bind="attributes" :class="fieldClass">

        <template v-if="officeUseOnly">
        </template>
        <template v-else-if="renderer == 'custom'">
            <fluro-compile-html :template="customTemplate" :context="customContext" />
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
                <!-- <pre style="background: #ff0066; padding: 10px;">{{fields}}</pre> -->
                
                <template v-for="field in fields">
                    
                    <fluro-content-form-field class="flex" :field="field" @input="valueChange" v-model="model"></fluro-content-form-field>
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
        <template v-else-if="renderer == 'datepicker'">
            <v-dialog ref="dialog" v-model="modal" persistent :return-value.sync="fieldModel" lazy full-width width="290px">
                <template v-slot:activator="{ on }">
                    <v-text-field v-model="fieldModel" :label="label" prepend-inner-icon="event" readonly v-on="on" @focus="modal = true"></v-text-field>
                </template>
                <v-card v-if="modal">
                    <v-toolbar color="primary" dark>
                        <v-toolbar-title>{{label}}</v-toolbar-title>
                    </v-toolbar>
                    <v-date-picker v-model="sudoModel" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.dialog.save(sudoModel)">OK</v-btn>
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
                    <v-time-picker v-model="sudoModel" full-width>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.dialog.save(sudoModel)">OK</v-btn>
                    </v-time-picker>
                </v-card>
            </v-dialog>
        </template>
        <template v-else-if="renderer == 'datetimepicker'">
            <fluro-date-time-picker format="h:mma - dddd D MMMM YYYY" timePickerFormat="ampm" :label="label" v-model="fieldModel" @focus="modal = true" />
        </template>
        <template v-else-if="renderer == 'textarea'">
            <v-textarea :required="required" :label="label" v-model="fieldModel" @input="valueChange" @blur="touch()" :error-messages="errorMessages" :hint="field.description" :placeholder="field.placeholder" />
        </template>
        <template v-else-if="renderer == 'select'">
            <v-select :required="required" :return-object="type == 'reference'" :label="label" :chips="multipleInput" no-data-text="No options available" :multiple="multipleInput" v-model="fieldModel" item-text="title" :items="options" @input="valueChange" @blur="touch()" :error-messages="errorMessages" :hint="field.description" :placeholder="field.placeholder" />
        </template>
        <template v-else-if="renderer == 'search-select'">
            <v-autocomplete :deletable-chips="true" :hide-selected="true" prepend-inner-icon="search" :error-messages="errorMessages" :cache-items="!defaultReferences.length" :chips="multipleInput" :clearable="!required" :return-object="true" item-text="title" v-model="fieldModel" @blur="touch()" @change="valueChange" :multiple="multipleInput" :loading="loading" :items="searchResults" :search-input.sync="keywords" flat hide-no-data :label="label">
                <!-- <template v-slot:selection="{ item, selected }">
                    <v-chip close @input="removeValue(index)" :selected="selected" color="blue-grey" class="white--text">
                       
                        <span v-text="item.title"></span>
                    </v-chip>
                </template>  -->
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
        <template v-else-if="renderer == 'signature'">
            <fluro-signature-field :label="label" v-model="fieldModel" :required="required" :error-messages="errorMessages" :hint="field.description" />
            <!-- <v-input class="no-flex" >
                <div class="signature-wrap">
                    <vue-signature-pad class="pad" ref="pad" width="100%" height="300px" />
                    <v-btn small icon @click="fieldModel = '';">
                        <v-icon>close</v-icon>
                    </v-btn>
                </div>
            </v-input> -->
        </template>
        <template v-else-if="renderer == 'code'">
            <v-card class="no-flex">
                <v-toolbar dark>
                    <v-toolbar-title>{{label}}</v-toolbar-title>
                </v-toolbar>
                <fluro-code-editor v-model="fieldModel" :lang="syntax" :height="200"></fluro-code-editor>
            </v-card>
        </template>
        <template v-else-if="renderer == 'wysiwyg'">
            <v-input class="no-flex" :required="required" :error-messages="errorMessages" :hint="field.description" />
            <template v-if="multipleInput">
                <template v-if="fieldModel.length">
                    <template v-for="(entry, index) in fieldModel">
                        <!-- <v-input class="no-flex" :label="groupTitle(entry, index)" /> -->
                        <v-layout>
                            <div class="vertical-center">
                                <v-label>{{groupTitle(entry, index)}}</v-label>
                            </div>
                            <v-spacer></v-spacer>
                            <v-btn icon flat color="error" v-if="canRemoveValue" @click="removeValue(index, true)">
                                <v-icon>close</v-icon>
                            </v-btn>
                        </v-layout>
                        <!-- <pre>BOOOLM: {{fieldModel[index]}}</pre> -->
                        <v-text-field v-model="fieldModel[index]"></v-text-field>
                        <fluro-editor v-model="fieldModel[index]" @input="valueChange" @blur="touch()" :placeholder="field.placeholder"></fluro-editor>
                        <!-- </v-input> -->
                    </template>
                </template>
                <template v-if="canAddValue">
                    <v-btn color="primary" @click="addValue('')">
                        {{multiLabel}} <v-icon>add</v-icon>
                    </v-btn>
                </template>
            </template>
            <template v-if="!multipleInput">
                <!-- <pre>TESTING: {{fieldModel}}</pre> -->
                <fluro-editor v-model="fieldModel" @input="valueChange" @blur="touch()" :placeholder="field.placeholder"></fluro-editor>
            </template>
            </v-input>
        </template>
        <template v-else>
            <template v-if="multipleInput">
                <template v-if="fieldModel.length">
                    <v-input class="no-flex" :label="label">
                        <div v-for="(entry, index) in fieldModel">
                            <v-chip close @input="removeValue(index, true)">{{entry}}</v-chip>
                        </div>
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
import FluroCodeEditor from './FluroCodeEditor.vue';
import FluroSignatureField from './FluroSignatureField.vue';
import FluroDateTimePicker from './FluroDateTimePicker.vue';
//Allow custom html to be injected at runtime


////////////////////////////////////////////////////////

export default {
    components: {
        FluroEditor,
        FluroCompileHtml,
        FluroCodeEditor,
        FluroSignatureField,
        FluroDateTimePicker,
    },
    data() {
        return {
            modal: false,
            model: this.value,
            proposedValue: null,
            sudoModel: null,

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
            //console.log('Searching', keywords);



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
        value(v) {
            //Update this field to reconnect with the new model
            this.model[this.key] = v[this.key];
        }
    },
    computed: {
        savedTerms() {
            return _.get(this.field, 'params.storeCopy');
        },
        syntax() {
            //Code entries
            return _.get(this.field, 'params.syntax');
        },
        multiLabel() {
            if (this.multipleInput) {
                if (!this.total) {
                    return `Add ${this.title}`;
                } else {
                    return `Add another ${this.title}`;
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

            //We are under the maximum
            if (this.total < this.maximum) {
                // //console.log(this.title, 'is under',this.total, this.maximum)
                return true;
            }

            return false;
        },
        canRemoveValue() {
            if (this.total > this.minimum) {
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
            classes.push(`fluro-content-form-field-${this.renderer}`);

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
                // Vue.set(this.model, this.key, value);
                this.valueChange();
            }
        },
        addLabel() {
            if (this.total) {
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
            return this.maximum === 0 || this.maximum > 1;
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
            if (this.multipleInput && this.fieldModel) {
                var total = _.get(this.fieldModel, 'length');
                // //console.log('COUNT>', this.title, total);
                return total
            }
        },
        askCount() {
            return Math.max(this.minimum, this.field.askCount);
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
        groupTitle(object, index) {
            if (object) {
                if (object.title && object.title.length) {
                    return object.title;
                }

                if (object.name && object.name.length) {
                    return object.name;
                }
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
                //console.log('Bad Data!', errors)
                return;
            }

            ////////////////////////////

            if (!self.includesValue(proposedValue)) {
                self.addValue(proposedValue);
            }

            self.proposedValue = null;

        },
        addValue(value) {


            // this.fieldModel.push(value);
            // //console.log('Add', this.fieldModel, this.maximum);
            // 
            //THIS WORKS BUT COMPUTED PROPERTIES BELOW DONT
            // if(this.fieldModel.length >= this.maximum) {
            //     return;
            // }
            // this.$set(this.model, this.field.key, [value]);


            // if (this.total < this.maximum) {
            if (this.canAddValue) {
                this.fieldModel.push(value);
                //console.log('ADD VALUE NOW', this.fieldModel)
                // Vue.set(this.fieldModel, this.total, value);
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

            //console.log('touched!');
            this.$v.model.$touch()
        },
        valueChange(event, setTouched) {

            var self = this;

            if (setTouched) {
                self.touch()
            }

            // if(self.multipleInput) {
            //     //We need to update reactivity
            //     _.each(self.fieldModel, function(entry, index) {
            //         Vue.set(self.model, `${this.key}[${index}]`, entry);
            //     });
            // }

            self.$emit('input', self.model); //[self.key])
            // self.$forceUpdate();
        }
    },
    created() {

        if (this.multipleInput) {
            switch (this.type) {
                case 'reference':
                    this.results = (this.defaultReferences || []).slice();
                    break;
                default:
                    this.results = (this.defaultValues || []).slice();
                    break;
            }
        }
    },
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
        this.$options.components.FluroContentFormField = require('./FluroContentFormField.vue').default;
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
        ////console.log('No minimum!')
        return true;
    }

    //////////////////////

    //We require an answer from here on out

    //Maximum answer of 1
    if (maximum == 1) {

        if (value) {
            ////console.log(`Required answer was provided`)
            return !checkValidInput(vm, value).length;
        } else {
            ////console.log('Requires an answer but none provided');
            return false;
        }
    }

    //////////////////////

    //We need value to be an array at this point
    if (!isArray) {
        ////console.log(`Requires ${minimum} answer but value is not an array`)
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
.fluro-content-form-field {


    .vertical-center {
        display: flex;
        align-items: center;
        min-height: 36px;
    }

    &.fluro-content-form-field-group.multiple-input {
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

    .fluro-editor .fluro-editor-textarea>div {
        min-height: 200px;
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