<template>
    <div class="fluro-content-form">
        <!-- <slot></slot> -->
        <template v-for="field in fields">
            <fluro-content-field :field="field" @input="valueChange" v-model="model"></fluro-content-field>
        </template>
    </div>
</template>
<script>
import FluroContentField from './FluroContentField.vue';

export default {

    props:{
        'fields':{
            type:Array,
        },
        'value':{
            type: Object,
        },
    },
    data() {
        return {
            model: this.value,
        }
    },
    components: {
        FluroContentField,
    },
    methods:{
        valueChange() {
            // console.log('Value changed!', this.model)

            this.$emit('input', this.model)
        }
    }
}
</script>
<style scoped lang="scss">
.fluro-content-form {}
</style>