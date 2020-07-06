<template>
	<div class="home">
		<el-button type="info" @click="logOut">退出</el-button>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			logOut() {
				sessionStorage.removeItem('token')
				this.$router.push('/login')
			}
		}
	}
</script>

<style lang="less" scope>
	
</style>
