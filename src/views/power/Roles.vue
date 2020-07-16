<template>
	<div class="roles">
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片 -->
		<el-card class="box-card">
			<!-- 添加角色 -->
			<div class="add_roles_row"><el-button type="primary" @click="addRolesDialogVisible = true">添加角色</el-button></div>
			<!-- 角色列表 -->
			<template>
				<el-table :data="rolesList" stripe border style="width: 100%">
					<!-- 下拉权限列表 -->
					<el-table-column type="expand">
						<template v-slot="scope">
							<!-- 一级权限 -->
							<el-row v-for="(item, i) in scope.row.children" :key="item.id" :class="['bdbottom', i === 0 ? 'bdtop' : '', 'row_center']">
								<el-col :span="5">
									<el-tag closable>{{ item.authName }}</el-tag>
									<i class="el-icon-caret-right"></i>
								</el-col>
								<el-col :span="19">
									<!-- 二级权限 -->
									<el-row v-for="(item1, i1) in item.children" :key="item1.id" :class="[i1 === 0 ? '' : 'bdtop', 'row_center']">
										<el-col :span="8">
											<el-tag type="success" closable>{{ item1.authName }}</el-tag>
											<i class="el-icon-caret-right"></i>
										</el-col>
										<el-col :span="16">
											<!-- 三级权限 -->
											<el-tag closable @close="removeRightsById(scope.row, item2.id)" type="warning" v-for="item2 in item1.children" :key="item2.id">
												{{ item2.authName }}
											</el-tag>
										</el-col>
									</el-row>
								</el-col>
							</el-row>
						</template>
					</el-table-column>
					<el-table-column type="index"></el-table-column>
					<el-table-column prop="roleName" label="角色名称"></el-table-column>
					<el-table-column prop="roleDesc" label="角色描述"></el-table-column>
					<!-- 操作 -->
					<el-table-column label="操作">
						<template v-slot="scope">
							<el-button size="mini" type="primary" @click="editRolesDialog(scope.row.id)">编辑</el-button>
							<el-button size="mini" type="danger" @click="deleteRoles(scope.row.id)">删除</el-button>
							<el-button size="mini" type="warning" @click="assignRightsDialog(scope.row)">分配权限</el-button>
						</template>
					</el-table-column>
				</el-table>
			</template>
			<!-- 添加角色对话框 -->
			<el-dialog title="添加角色" :visible.sync="addRolesDialogVisible" width="50%" @close="resetAddRolesDialog">
				<el-form :model="addRolesForm" :rules="addRolesRules" ref="addRolesRef" label-width="100px">
					<el-form-item label="角色名称" prop="roleName"><el-input v-model="addRolesForm.roleName"></el-input></el-form-item>
					<el-form-item label="角色描述" prop="roleDesc"><el-input v-model="addRolesForm.roleDesc"></el-input></el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="addRolesDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="addRoles">确 定</el-button>
				</span>
			</el-dialog>
			<!-- 编辑角色对话框 -->
			<el-dialog title="编辑角色" :visible.sync="editRolesDialogVisible" width="50%" @close="resetEditDialog">
				<el-form :model="editRolesForm" :rules="editRolesRules" ref="editRolesRef" label-width="100px">
					<el-form-item label="角色名称" prop="roleName"><el-input v-model="editRolesForm.roleName"></el-input></el-form-item>
					<el-form-item label="角色描述" prop="roleDesc"><el-input v-model="editRolesForm.roleDesc"></el-input></el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="editRolesDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="editRoles">确 定</el-button>
				</span>
			</el-dialog>
			<!-- 分配角色权限对话框 -->
			<el-dialog title="分配角色" :visible.sync="assignRightsDialogVisible" width="50%" @close="resetTreeKeys">
				<el-tree
					:data="rightsList"
					show-checkbox
					default-expand-all
					node-key="id"
					ref="rightsListRef"
					highlight-current
					:props="defaultProps"
					:default-checked-keys="treeKeys"
				></el-tree>
				<span slot="footer" class="dialog-footer">
					<el-button @click="assignRightsDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="assignRights">确 定</el-button>
				</span>
			</el-dialog>
		</el-card>
	</div>
</template>

<script>
export default {
	data() {
		return {
			rolesList: [], // 角色列表数据
			addRolesForm: {}, // 添加用户表单数据
			editRolesForm: {}, // 编辑用户表单数据
			rightsList: [], // 权限列表数据树
			// 树状控件
			defaultProps: {
				children: 'children',
				label: 'authName'
			},
			treeKeys: [], // 默认选中的树形节点
			rolesId: '', // 树状图角色id
			addRolesDialogVisible: false, // 添加角色对话框隐藏状态
			editRolesDialogVisible: false, // 编辑角色对话框隐藏状态
			assignRightsDialogVisible: false, // 分配角色对话框隐藏状态
			//  添加角色表单验证
			addRolesRules: {
				roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
				roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
			},
			//  编辑角色表单验证
			editRolesRules: {
				roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
				roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
			}
		};
	},
	methods: {
		// 获取角色数据
		async getRolesList() {
			const { data: res } = await this.$http.get('roles');
			if (res.meta.status !== 200) return this.$message.error('获取角色列表失败');
			this.rolesList = res.data;
		},
		// 添加角色
		addRoles() {
			this.$refs.addRolesRef.validate(async valid => {
				if (!valid) return;
				const confirm = await this.$confirm('是否添加用户?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'info'
				}).catch(err => err);
				if (confirm !== 'confirm') return;
				const { data: res } = await this.$http.post('roles', this.addRolesForm);
				if (res.meta.status !== 201) return this.$message.error('添加用户失败');
				this.$message.success(res.meta.msg);
				this.$refs.addRolesRef.resetFields();
				this.addRolesDialogVisible = false;
				this.getRolesList();
			});
		},
		// 显示编辑角色对话框并获取数据
		async editRolesDialog(id) {
			this.editRolesDialogVisible = true;
			const { data: res } = await this.$http.get('roles/' + id);
			if (res.meta.status !== 200) return this.$message.error('获取用户失败');
			this.editRolesForm = res.data;
		},
		// 提交修改过得角色
		editRoles() {
			this.$refs.editRolesRef.validate(async valid => {
				if (!valid) return;
				const confirm = await this.$confirm('是否修改并提交?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'info'
				}).catch(err => err);
				if (confirm !== 'confirm') return;
				const { data: res } = await this.$http.put('roles/' + this.editRolesForm.roleId, this.editRolesForm);
				if (res.meta.status !== 200) return this.$message.error('修改失败');
				this.$message.success('修改成功');
				this.$refs.editRolesRef.resetFields();
				this.editRolesDialogVisible = false;
				this.getRolesList();
			});
		},
		// 重置添加角色表单
		resetAddRolesDialog() {
			this.$refs.addRolesRef.resetFields();
		},
		// 重置编辑角色表单
		resetEditDialog() {
			this.$refs.editRolesRef.resetFields();
		},
		// 删除角色
		async deleteRoles(id) {
			const confirm = await this.$confirm('是否修改并提交?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).catch(err => err);
			if (confirm !== 'confirm') return;
			const { data: res } = await this.$http.delete('roles/' + id);
			if (res.meta.status !== 200) return this.$message.error('删除失败');
			this.$message.success(res.meta.msg);
			this.getRolesList();
		},
		// 打开分配角色对话框并获取角色
		async assignRightsDialog(roles) {
			const { data: res } = await this.$http.get('rights/tree');
			if (res.meta.status !== 200) return this.$message.error('获取权限列表失败');
			this.rightsList = res.data;
			this.getTreeKeys(roles, this.treeKeys);
			this.assignRightsDialogVisible = true;
			this.rolesId = roles.id;
		},
		// 获取节点keys
		getTreeKeys(node, arr) {
			if (!node.children) return arr.push(node.id);
			node.children.forEach(item => this.getTreeKeys(item, arr));
		},
		// 分配角色权限
		async assignRights() {
			const confirm = await this.$confirm('是分配权限?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'info'
			}).catch(err => err);
			if (confirm !== 'confirm') return;
			const keys = [...this.$refs.rightsListRef.getCheckedKeys(), ...this.$refs.rightsListRef.getHalfCheckedKeys()];
			const idStr = keys.join(',');
			const { data: res } = await this.$http.post(`roles/${this.rolesId}/rights`, { rids: idStr });
			if (res.meta.status !== 200) return this.$message.error('更新权限失败');
			this.$message.success(res.meta.msg);
			this.getRolesList();
			this.assignRightsDialogVisible = false;
		},
		// 根据ID删除角色权限
		async removeRightsById(role, rightId) {
			const confirm = await this.$confirm('是否修改并提交?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).catch(err => err);
			if (confirm !== 'confirm') return;
			const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
			if (res.meta.status !== 200) return this.$message.error('取消权限失败');
			this.$message.success(res.meta.msg);
			role.children = res.data;
		},
		// 重置树状图选中的keys
		resetTreeKeys() {
			this.treeKeys = [];
		}
	},
	created() {
		this.getRolesList();
	}
};
</script>

<style>
.add_roles_row {
	margin-bottom: 20px;
}
.el-tag {
	margin: 10px;
}
.bdbottom {
	border-bottom: 1px solid #eee;
}
.bdtop {
	border-top: 1px solid #eee;
}
.row_center {
	display: flex;
	align-items: center;
}
</style>
