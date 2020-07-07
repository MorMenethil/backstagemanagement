<template>
	<div class="users">
		<!-- 面包屑导航 -->
		<el-breadcrumb>
			<el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片 -->
		<el-card>
			<!-- 搜索栏 -->
			<div class="search_row">
				<div class="search_item">
					<el-input placeholder="请输入内容"><el-button slot="append" class="el-icon-search"></el-button></el-input>
				</div>
				<el-button type="primary" class="add_user">添加用户</el-button>
			</div>
		</el-card>
	</div>
</template>

<script></script>

<style lang="less" scope>
.users {
	.search_row {
		display: flex;
		align-items: center;
		.search_item {
			width: 350px;
			display: flex;
			margin-right: 20px;
		}
		.add_user {
		}
	}
}
</style>
