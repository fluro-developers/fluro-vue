<template>
    <div class="dots">
        <span class="dot" :style="{backgroundColor:realm.bgColor}" v-for="realm in colouredRealms"/>
    </div>
</template>
<script>

export default {
    props:{
        'realms':{
            type:Array,
        },
    },
    computed:{
        colouredRealms() {
            return _.filter(this.realms, 'bgColor');
        }
    }
}
</script>
<style scoped lang="scss">
    
    .dots {
        display: inline-block;
        margin-right:5px;
        vertical-align: middle;
        white-space: nowrap;

        .dot {
            display: inline-block;
            border-radius: 100%;
            width: 14px;
            height:14px;
            margin-left:-7px;
            border: 1px solid #fff;
            vertical-align: middle;

            &:first-child {
                margin-left:0;
            }
        }
    }
</style>