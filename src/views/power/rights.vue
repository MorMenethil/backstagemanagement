<template>
	<div class="rights">
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>权限列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片 -->
		<el-card class="box-card">
			<!-- 权限列表表格 -->
			<template>
				<el-table :data="rightsList" stripe border style="width: 100%">
					<el-table-column type="index"></el-table-column>
					<el-table-column prop="authName" label="权限名称"></el-table-column>
					<el-table-column prop="path" label="路径"></el-table-column>
					<el-table-column prop="level" label="权限等级">
						<template v-slot="scope">
							<el-tag v-if="scope.row.level === '0'">一级</el-tag>
							<el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
							<el-tag v-else type="warning">三级</el-tag>
						</template>
					</el-table-column>
				</el-table>
			</template>
		</el-card>
	</div>
</template>

<script>
export default {
	data() {
		return {
			rightsList: []
		};
	},
	methods: {
		// 获取权限列表
		async getRightsList() {
			const { data: res } = await this.$http.get('rights/'+ 'list')
			console.log(res)
			if(res.meta.status !== 200) return this.$message('获取数据列表失败')
			this.rightsList = res.data
		}
	},
	created() {
		this.getRightsList()
	}
};
</script>

<style></style>
