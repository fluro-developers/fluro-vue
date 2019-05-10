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
        }
    },
    computed: {
        iconName() {
            if(this.icon) {
                return ['far', this.icon];
            } else {
                return this.$fluro.types.icon(this.type) || ['far', this.type];
            }
        },
    }
}
</script>
<style lang="scss">

</style>