<template>
    <div class="fluro-content-browser">
        <v-card>
            <div v-if="items">
                <v-data-table item-key="_id" :search="search" v-model="selected" select-all :rows-per-page-items="pageOptions" :disable-initial-sort="true" :hide-headers="$vuetify.breakpoint.xsOnly" :headers="headers" :items="items">
                    <template v-slot:items="props">
                        <tr :active="isSelected(props.item)" @click.prevent.stop.capture="toggle(props.item)">
                            <td>
                                <v-checkbox v-model="props.selected" hide-details></v-checkbox>
                            </td>
                            <td class="text-xs-center fixed">
                                <template v-if="props.item._type == 'image'">
                                    <fluro-image :item="props.item" :spinner="true" :width="50" :height="50" />
                                </template>
                                <!-- <template v-else-if="props.item._type == 'image'">
                            </template> -->
                                <template v-else>
                                    <fluro-icon :type="props.item._type"></fluro-icon>
                                </template>
                            </td>
                            <td>
                                <strong>{{props.item.title}}</strong>
                                <div class="small muted">{{summary(props.item)}}</div>
                            </td>
                            <td>{{props.item.created | timeago}}</td>
                            <td>{{props.item.updated | timeago}}</td>
                        </tr>
                    </template>
                </v-data-table>
                <pre>{{selected.length}}</pre>
            </div>
        </v-card>
    </div>
</template>
<script>
export default {
    props: {
        'type': {
            type: String,
        },
        'value': {
            default () {
                return []
            },
            type: Array,
        },
        'terms':{
            default:'',
            type:String,
        }
    },
    watch: {
        'selected': function() {
            var self = this;
            this.$emit('input', self.selected); //[self.key])
        }
    },
    computed: {
        search: {
            get() {
                return this.terms;
            },
            set: _.debounce(function(newValue) {
                this.terms = newValue;
            }, 500)
        }
    },
    data() {
        return {
            terms: '',
            selected: this.value,
            pageOptions: [20, 40, 60],
            headers: [{
                    text: '',
                    align: 'left',
                    sortable: false,
                    value: ''
                },
                {
                    text: 'Title',
                    align: 'left',
                    sortable: true,
                    value: 'title'
                },
                {
                    text: 'Updated',
                    align: 'left',
                    sortable: true,
                    value: 'updated'
                },

                {
                    text: 'Created',
                    align: 'left',
                    sortable: true,
                    value: 'created'
                },

            ]
        }
    },
    methods: {
        select(item) {
            var self = this;
            if (!self.isSelected(item)) {

                self.$set(self.selected, self.selected.length, item);
            }
        },
        deselect(item) {
            var self = this;

            //Get the item ID
            var itemID = self.$fluro.utils.getStringID(item);

            //Find the index of the matching item
            var index = _.findIndex(self.selected, function(selectedItem) {
                var selectedItemID = self.$fluro.utils.getStringID(selectedItem);
                return itemID == selectedItemID;
            })



            //Splice the item out
            self.selected.splice(index, 1);
        },
        toggle(item) {
            var self = this;
            if (self.isSelected(item)) {
                self.deselect(item);
            } else {
                self.select(item);
            }

            console.log('TOGGLE', self.selected);
        },
        summary(item) {
            var self = this;
            var firstLine = item.firstLine || '';

            switch (item._type) {
                case 'event':
                    firstLine = `${self.$fluro.date.readableEventDate(item)} ${firstLine}`;
                    break;

            }

            return firstLine;
        },
        isSelected(item) {
            var self = this;

            var itemID = self.$fluro.utils.getStringID(item);

            //Check if the ID is already selected
            var match = _.some(self.selected, function(selectedItem) {
                var selectedItemID = self.$fluro.utils.getStringID(selectedItem);
                return itemID == selectedItemID;
            })

            return match;
        },
    },
    asyncComputed: {
        items: {
            get() {

                var self = this;

                return new Promise(function(resolve, reject) {

                    var endpoint = `/content`;

                    if (self.type && self.type.length) {
                        endpoint = `/content/${self.type}`;
                    }

                    self.$fluro.api.get(endpoint, {
                        params: {
                            list: true,
                            simple: true,
                        }
                    }).then(function(res) {

                        // self.selected = JSON.parse(JSON.stringify(res.data.slice(0, 2)));
                        return resolve(res.data);
                    }, reject);

                    // if(this.icon) {
                    //     return ['far', this.icon];
                    // } else {
                    //     return this.$fluro.types.icon(this.type) || ['far', this.type];
                    // }
                })
            }
        },
    }
}
</script>
<style lang="scss">
td.fixed {
    padding: 0 !important;
}
</style>