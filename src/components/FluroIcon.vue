<template>
    <font-awesome-icon :icon="icon"></font-awesome-icon>
</template>
<script>

export default {
    props:{
        'type':{
            type:String,
        }
    },
    computed: {
        icon() {
            return this.$fluro.types.icon(this.type);
        },
    }
}
</script>
<style lang="scss">

</style>