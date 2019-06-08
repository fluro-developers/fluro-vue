<template>
    <font-awesome-icon :icon="iconName"></font-awesome-icon>
</template>
<script>

export default {
    props:{
        'type':{
            type:String,
        },
        'icon':{
            type:String,
        },
        'library':{
            default:'fas',
            type:String,
        }
    },
    computed: {
        fontLibrary() {
            return this.library;
        },
        iconName() {
            if(this.icon) {
                return [this.library, this.icon];
            } else {
                return this.$fluro.types.icon(this.type, this.library) || [this.library, this.type];
            }
        },
    }
}
</script>
<style scoped lang="scss">
    [left] {
        margin-right:10px;
    }

    [right] {
        margin-left: 10px;
    }
</style>