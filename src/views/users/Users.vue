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
					<el-input v-model="queryInfo.query" placeholder="请输入内容" @input="handleChangeInput"><el-button slot="append" class="el-icon-search"></el-button></el-input>
				</div>
				<el-button type="primary" class="add_user" @click="addUserDialog = true">添加用户</el-button>
			</div>
			<!-- 用户列表表格 -->
			<div class="users_table">
				<el-table stripe border :data="usersList" style="width: 100%">
					<el-table-column type="index"></el-table-column>
					<el-table-column prop="username" label="姓名"></el-table-column>
					<el-table-column prop="email" label="邮箱"></el-table-column>
					<el-table-column prop="mobile" label="电话"></el-table-column>
					<el-table-column prop="role_name" label="角色"></el-table-column>
					<el-table-column label="状态">
						<template v-slot="scope">
							<el-switch v-model="scope.row.mg_state" @change="handleChangeStatu(scope.row)"></el-switch>
						</template>
					</el-table-column>
					<!-- 用户操作 -->
					<el-table-column label="操作">
						<template v-slot="scope">
							<!-- 编辑 -->
							<el-button class="el-icon-edit" size="mini" type="primary" @click="handleEditUser(scope.row.id)"></el-button>
							<!-- 删除 -->
							<el-button class="el-icon-delete" size="mini" type="danger" @click="deleteUser(scope.row.id)"></el-button>
							<!-- 分配角色 -->
							<el-button class="el-icon-bangzhu" size="mini" type="warning" @click="assignRolesDialog(scope.row)"></el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<!-- 分页栏 -->
			<div class="paging">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="queryInfo.pagenum"
					:page-sizes="[2, 5, 10]"
					:page-size="queryInfo.pagesize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total"
				></el-pagination>
			</div>
			<!-- 添加用户对话框 -->
			<el-dialog title="添加用户" :visible.sync="addUserDialog" width="50%" @close="resetAddUserDialog">
				<!-- 主体区域 -->
				<span>
					<el-form :model="addUserForm" :rules="addUserRules" ref="addUserRef" label-width="100px">
						<el-form-item label="用户名称" prop="username"><el-input v-model="addUserForm.username"></el-input></el-form-item>
						<el-form-item label="用户密码" prop="password"><el-input v-model="addUserForm.password"></el-input></el-form-item>
						<el-form-item label="邮箱" prop="email"><el-input v-model="addUserForm.email"></el-input></el-form-item>
						<el-form-item label="手机号" prop="mobile"><el-input v-model.number="addUserForm.mobile"></el-input></el-form-item>
					</el-form>
				</span>
				<!-- 底部区域	 -->
				<span slot="footer" class="dialog-footer">
					<el-button @click="addUserDialog = false">取 消</el-button>
					<el-button type="primary" @click="addUser">确 定</el-button>
				</span>
			</el-dialog>
			<!-- 修改对话框 -->
			<el-dialog title="修改用户" :visible.sync="editUserDialog" width="50%" @close="resetEditUserDialog">
				<!-- 主体区域 -->
				<span>
					<el-form :model="editUserForm" :rules="addUserRules" ref="editUserRef" label-width="100px">
						<el-form-item label="用户名称"><el-input v-model="editUserForm.username" disabled></el-input></el-form-item>
						<el-form-item label="邮箱" prop="email"><el-input v-model="editUserForm.email"></el-input></el-form-item>
						<el-form-item label="手机号" prop="mobile"><el-input v-model.number="editUserForm.mobile"></el-input></el-form-item>
					</el-form>
				</span>
				<!-- 底部区域	 -->
				<span slot="footer" class="dialog-footer">
					<el-button @click="editUserDialog = false">取 消</el-button>
					<el-button type="primary" @click="editUser">确 定</el-button>
				</span>
			</el-dialog>
			<!-- 分配角色对话框 -->
			<el-dialog title="分配角色" :visible.sync="assignRolesDialogVisible" width="50%" @close="resetRolesInfo">
				<div>
					<div>当前的用户: {{ userInfo.username }}</div>
					<div>当前的角色: {{ userInfo.role_name }}</div>
					<div>
						属性方式：
						<template>
							<el-select v-model="rolesId" placeholder="请选择">
								<el-option v-for="item in rolesInfo" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
							</el-select>
						</template>
					</div>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button @click="assignRolesDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="assignRoles">确 定</el-button>
				</span>
			</el-dialog>
		</el-card>
	</div>
</template>

<script>
export default {
	data() {
		// 自定义校验规则----邮箱
		var checkEmail = (rule, value, callback) => {
			const emailReg = /^([a-zA-Z]|[0-9])(\w|)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
			if (!value) return callback(new Error('请输入邮箱地址'));
			setTimeout(() => {
				if (!emailReg.test(value)) return callback(new Error('请输入正确的邮箱地址'));
				callback();
			}, 100);
		};
		// 自定义校验规则----手机号
		var checkMobile = (rule, value, callback) => {
			const mobileReg = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/;
			if (!value) return callback(new Error('请输入手机号码'));
			setTimeout(() => {
				if (!Number.isInteger(value)) return callback(new Error('请输入数字'));
				if (!mobileReg.test(value)) return callback(new Error('请输入正确的手机号'));
				callback();
			}, 100);
		};
		return {
			// 获取用户列表参数
			queryInfo: {
				query: '',
				pagenum: 1,
				pagesize: 2
			},
			// 用户列表数据
			usersList: [],
			total: 0, // 总条数
			timeId: null, // 防抖定时器ID
			addUserDialog: false, // 添加用户对话框状态
			editUserDialog: false, // 编辑用户对话框状态
			assignRolesDialogVisible: false, // 分配角色对话框状态
			userInfo: {}, // 用户的信息
			rolesInfo: [], // 分配用户的信息
			rolesId: '', //待分配角色的id
			userId: '', // 用户id
			// 添加用户参数
			addUserForm: {
				username: '',
				password: '',
				email: '',
				mobile: ''
			},
			// 修改用户参数
			editUserForm: {},
			addUserRules: {
				username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }],
				password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }],
				email: [{ required: true, validator: checkEmail, trigger: 'blur' }],
				mobile: [{ required: true, validator: checkMobile, trigger: 'blur' }]
			}
		};
	},
	methods: {
		// 获取用户列表
		async getUsersList() {
			const { data: res } = await this.$http.get('users', { params: this.queryInfo });
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.usersList = res.data.users;
			this.total = res.data.total;
		},
		// 改变每页显示条数
		handleSizeChange(val) {
			this.queryInfo.pagesize = val;
			this.getUsersList();
		},
		// 改变当前页码
		handleCurrentChange(val) {
			this.queryInfo.pagenum = val;
			this.getUsersList();
		},
		// 搜索框事件
		handleChangeInput() {
			// 防抖
			clearTimeout(this.timeId);
			this.timeId = setTimeout(() => {
				this.getUsersList();
			}, 500);
		},
		// 修改用户状态
		async handleChangeStatu(val) {
			const { data: res } = await this.$http.put('users/' + val.id + '/state/' + val.mg_state);
			if (res.meta.status !== 200) {
				val.mg_state = !val.mg_state;
				return this.$message.error(res.meta.msg);
			}
			this.$message.success(res.meta.msg);
		},
		// 添加用户
		addUser() {
			this.$refs.addUserRef.validate(async valid => {
				if (!valid) return;
				const status = await this.$confirm('是否添加新用户?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'info'
				}).catch(err => err);
				if (status !== 'confirm') return this.$message.info('取消添加用户');
				const { data: res } = await this.$http.post('users', this.addUserForm);
				if (res.meta.status !== 201) return this.$message.error('添加用户失败');
				this.$message.success('添加用户成功');
				this.$refs.addUserRef.resetFields();
				this.addUserDialog = false;
				this.getUsersList();
				console.log(res);
			});
		},
		// 重置添加用户表单
		resetAddUserDialog() {
			this.$refs.addUserRef.resetFields();
		},
		// 删除用户
		async deleteUser(id) {
			const status = await this.$confirm('是否删除用户?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).catch(err => err);
			if (status !== 'confirm') return this.$message.info('取消删除用户');
			const { data: res } = await this.$http.delete('users/' + id);
			if (res.meta.status !== 200) return this.$message.error('删除用户失败');
			this.$message.success('删除用户成功');
			this.getUsersList();
		},
		// 根据id查找用户
		async handleEditUser(id) {
			this.editUserDialog = true;
			const { data: res } = await this.$http.get('users/' + id);
			if (res.meta.status !== 200) return this.$message.error('获取用户数据失败');
			this.editUserForm = res.data;
		},
		// 修改用户
		editUser() {
			this.$refs.editUserRef.validate(async valid => {
				if (!valid) return;
				const { data: res } = await this.$http.put('users/' + this.editUserForm.id, { email: this.editUserForm.email, mobile: this.editUserForm.mobile });
				if (res.meta.status !== 200) return this.$message.error('修改用户失败');
				this.$message.success(res.meta.msg);
				this.$refs.editUserRef.resetFields();
				this.editUserDialog = false;
				this.getUsersList();
			});
		},
		// 重置修改用户表单
		resetEditUserDialog() {
			this.$refs.editUserRef.resetFields();
		},
		// 打开分配角色对话框并获取数据
		async assignRolesDialog(userInfo) {
			this.userInfo = userInfo;
			this.userId = userInfo.id;
			this.assignRolesDialogVisible = true;
			const { data: res } = await this.$http.get('roles');
			if (res.meta.status !== 200) return this.$message.error('获取角色列表失败');
			this.rolesInfo = res.data;
		},
		// 分配角色
		async assignRoles() {
			if (!this.rolesId) return this.$message.error('请选择角色');
			const { data: res } = await this.$http.put(`users/${this.userId}/role`, { rid: this.rolesId });
			if (res.meta.status !== 200) return this.$message.error('设置角色失败');
			this.$message.success(res.meta.msg);
			this.getUsersList();
			this.assignRolesDialogVisible = false;
		},
		// 重置分配角色对话框信息
		resetRolesInfo() {
			this.rolesId = ''
		}
	},
	created() {
		this.getUsersList();
	}
};
</script>

<style lang="less" scope>
.users {
	// 搜索栏
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
	// 用户表格
	.users_table {
		margin: 20px 0;
		.el-table {
			.el-table-column {
			}
		}
	}
}
</style>
