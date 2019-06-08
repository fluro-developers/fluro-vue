


<template>
	<div class="fluro-page-preloader">
   <v-progress-circular :width="1" indeterminate></v-progress-circular>
</div>
</template>
<script>

export default {
}

</script>
<style scoped lang="scss">
    .fluro-page-preloader {
    	pointer-events: none !important;
    	position: fixed;
    	width:100vh;
    	height:100vh;
    	z-index: 10000000000000;
    	left: 0;
    	top:0;
    	right:0;
    	bottom:0;

        .v-progress-circular {
            // border: 10px solid red;
            opacity: 0.1;
            width: 30vw !important;
            height:30vw !important;
            position: absolute;
            left:35vw;
            top:50%;
            margin-top:-15vw;
            // transform:translate3d(-50%, -50%, 0);
        }
    }
</style>