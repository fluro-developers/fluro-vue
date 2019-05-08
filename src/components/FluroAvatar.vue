<template>

<div class="avatar">
	<div class="avatar-inner" :style="{backgroundImage:backgroundImage}"></div>
</div>
</template>
<script>

export default {
	props:['id', 'type', 'width', 'size'],
	computed:{
		// classes(){
		// 	return size;
		// },
		backgroundImage() {
			
			return `url("${this.$fluro.asset.avatarUrl(this.id, this.type || 'contact', {w:this.width || 100}) }")`;
			// return this.$fluro.asset.avatarUrl(this.id, this.type || 'contact', {w:this.width || 100}) ;
		},
	}
}
</script>

<style scoped lang="scss">


.avatar {
	display:inline-block;
	width: 24px;
	vertical-align: middle;

	&[left] {
		margin-right: 10px;
	}

	&[right] {
		margin-left: 10px;
	}

	&[md] {
		width:36px;
	}

	&[lg] {
		width:48px;
	}

	&[xl] {
		width:64px;
	}
}

.avatar-inner {
	max-width: 100%;
	padding-bottom: 100%;
	position:relative;
	overflow:hidden;
	height:0;
	border-radius: 50%;
	background-color: rgba(#222,0.1);
	background-position:center center;
	background-size: cover;
	background-repeat: no-repeat;

}


</style>
