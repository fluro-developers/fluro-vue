<template>
    <div class="fluro-list-item">
        <div class="realm-bar" :style="realmStyle" />

        <div class="item-icon">
            <template v-if="item._type == 'persona'">
                <fluro-avatar :id="item._id" type="persona" />
            </template>
            <template v-else-if="item._type == 'contact'">
                <fluro-avatar :id="item._id" type="contact" />
            </template>
            <template v-else>
                <fluro-icon :type="item._type"></fluro-icon>
            </template>
        </div>
        <component :is="linkType" :to="to" class="item-text">
            
            <!-- <router-link :to="to" class="item-text"> -->
            <div class="item-title">{{title}}</div>
            <div class="item-subtitle">{{subtitle}}</div>
            
            <!-- </router-link> -->
        </component>
        <div class="item-actions" v-if="actions.length">
            <v-btn icon flat>
                <v-icon>more_horiz</v-icon>
            </v-btn>
        </div>
        <!-- LIST ITEM -->
    </div>
</template>
<script>
export default {
    props: {
        'to': {
            type: Object
        },
        'item': [String, Object],
        'model': {
            type: String,
            default: 'node',
        },
        'actions': {
            default: function() {
                return []
            },
            type: Array,
        }
    },
    data() {
        return {

        }
    },
    methods: {

    },
    computed: {
        linkType() {
            if (this.to) {
                return 'router-link'
            }

            return 'div'
        },

        realmStyle() {

            var realm = _.chain(this.item)
                .get('realms')
                .compact()
                .filter(function(realm) {
                    return realm.bgColor;
                })
                .last()
                .value();

            if (realm) {
                return {
                    backgroundColor: realm.bgColor,
                }
            }


        },
        icon() {
            return this.$fluro.types.icon(this.type);
        },
        type() {
            return _.get(this, 'item._type') || 'article';
        },
        title() {
            return _.get(this, 'item.title');
        },
        subtitle() {
            return _.get(this, 'item.firstLine');
        }
    }
}
</script>
<style scoped lang="scss">
.fluro-list-item {
    display: flex;
    border: 1px solid #ddd;
    border-top: none;
    overflow: hidden;
    position: relative;
    background: #fff;


    &:first-of-type {
        border-top: 1px solid #ddd;
        border-radius: 3px 3px 0 0;
    }

    &:last-of-type {
        border-bottom: 1px solid #ddd;
        border-radius: 0 0 3px 3px;

    }

    .realm-bar {
        width: 5px;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
    }


    .item-icon {
        flex: none;
        text-align: center;
        padding: 10px 5px;
        width: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .item-text {
        flex: 1;
        padding: 10px 5px;
        color: inherit;
        display: block;
        text-decoration: none;

        .item-title {
            font-weight: bold;
        }

        .item-subtitle {
            font-size: 0.8em;
            opacity: 0.5;
        }
    }

    .item-actions {
        flex: none;
        padding: 10px;

        .v-btn {
            margin: 0;
        }
    }


}
</style>