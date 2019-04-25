<template>
    <div class="constrain">
        <slot></slot>
    </div>
</template>

<script>

export default {
    
}

</script>
<style scoped lang="scss">

.constrain {
    margin:auto;
    max-width: 1200px;
    padding: 0 15px;

    &[gutterless] {
        padding:0;
    }

    &[xs] {
    	max-width: 320px;
    }

    &[sm] {
        max-width: 740px;
    }
}


// .block + .block {
// 	padding-top:0;
// }

// @media(max-width: 768px) {
// 	.block {
// 		padding: 0;
// 	}
// } 


</style>