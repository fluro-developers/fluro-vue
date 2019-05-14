<template>
    <div class="fluro-content-select">
        <v-layout>
            <v-flex grow>
                Search
            </v-flex>
            <v-flex shrink>
                <v-btn icon>
                    <v-icon>add</v-icon>
                </v-btn>
                <v-btn icon @click="dialog = true">
                    <v-icon>hand</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>
        <v-dialog content-class="fluro-content-select-dialog" v-model="dialog">
            <v-toolbar class="elevation-0">
                {{selected.length}} selected
                <v-spacer></v-spacer>
                <v-text-field v-model="search" solo append-icon="search" label="Search" single-line hide-details></v-text-field>
            </v-toolbar>
            <fluro-content-browser v-model="model"></fluro-content-browser>
        </v-dialog>
    </div>
</template>
<script>
import { FluroContentBrowser } from 'fluro-vue';
// import { mapFields } from 'vuex-map-fields';

export default {
    computed: {
        // ...mapFields('fluro', [
        //     'realmSelectFullScreen', //The authenticated user if they log in
        // ]),
    },
    components: {
        FluroContentBrowser,
    },
    props: {
        'value': {
            type: Array,
            default: function() {
                return [];
            },
        },
    },
    watch: {
        'model': function() {
            var self = this;
            this.$emit('input', self.model); //[self.key])
        }
    },
    data() {
        return {
            dialog: false,
            model: this.value,
        }
    },
}
</script>
<style lang="scss">
</style>