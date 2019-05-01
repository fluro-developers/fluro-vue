<template>
    <section>
        <slot></slot>
    </section>
</template>
<script>

export default {
    
}
</script>
<style scoped lang="scss">

//Use 100px by default
$wrapper-padding: 100px;

section {
    padding: $wrapper-padding 0;

    &[xs] {
    	padding: floor($wrapper-padding / 3) 0;
    }

    &[sm] {
    	padding: floor($wrapper-padding / 2) 0;
    }

    &[lg] {
    	padding: floor($wrapper-padding * 2) 0;
    }

    &[xl] {
    	padding: floor($wrapper-padding * 3) 0;
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