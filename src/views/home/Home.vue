<template>
	<div class="home">
		<el-container class="home_block">
			<!-- 页面头部区域 -->
			<el-header class="home_header">
				<div class="header_title">
					<div class="log"><el-image :src="require('@/assets/image/timg.jpg')"></el-image></div>
					<span>电商后台管理系统</span>
				</div>
				<el-button type="info" @click="logOut">退出</el-button>
			</el-header>
			<!-- 页面主体区域 -->
			<el-container>
				<!-- 侧边栏区域 -->
				<el-aside class="home_sidebar" :width="flg ? '56px' : '200px'">
					<!-- 折叠菜单按钮 -->
					<div class="fold_menu" @click="changeMenu">|||</div>
					<!-- 左侧菜单导航区域 -->
					<el-menu
						background-color="#333744"
						text-color="#fff"
						active-text-color="#409eff"
						unique-opened
						:collapse="flg"
						:collapse-transition="false"
						router
						:default-active="active"
					>
						<!-- 一级菜单 -->
						<el-submenu :index="item.id + ''" v-for="item in menusList" :key="item.id">
							<!-- 一级菜单模板区域 -->
							<template slot="title">
								<!-- 菜单图标 -->
								<i :class="iconFonts[item.id]"></i>
								<!-- 菜单文本 -->
								<span>{{ item.authName }}</span>
							</template>
							<!-- 二级菜单 -->
							<el-menu-item :index="item1.path" v-for="item1 in item.children" :key="item1.id" @click="add_active(item1.path)">
								<template slot="title">
									<!-- 菜单图标 -->
									<i class="el-icon-menu"></i>
									<!-- 菜单文本 -->
									<span>{{ item1.authName }}</span>
								</template>
							</el-menu-item>
						</el-submenu>
					</el-menu>
				</el-aside>
				<!-- 内容区域 -->
				<el-main class="home_content"><router-view></router-view></el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
export default {
	data() {
		return {
			menusList: [], // 菜单列表
			// 一级菜单图标
			iconFonts: {
				'125': 'iconfont icon-users',
				'103': 'iconfont icon-tijikongjian',
				'101': 'iconfont icon-shangpin',
				'102': 'iconfont icon-danju',
				'145': 'iconfont icon-baobiao'
			},
			// 菜单折叠状态
			flg: false,
			active: ''
		};
	},
	methods: {
		// 退出
		logOut() {
			sessionStorage.clear()
			this.$router.push('/login');
		},
		// 获取菜单权限
		async getMenus() {
			const { data: res } = await this.$http.get('menus');
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.menusList = res.data;
		},
		// 折叠菜单
		changeMenu() {
			this.flg = !this.flg;
		},
		// 添加菜单选中状态
		add_active(act) {
			sessionStorage.setItem('active',act)
		}
	},
	created() {
		this.getMenus();
		const active = sessionStorage.getItem('active')
		this.active = active
	}
};
</script>

<style lang="less" scope>
.home {
	height: 100%;
	.home_block {
		height: 100%;

		.home_header {
			background-color: #373d4e;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #fff;
			font-weight: 700;
			font-size: 20px;
			.header_title {
				height: 100%;
				display: flex;
				align-items: center;
				.log {
					background-color: #fff;
					height: 100%;
					width: 60px;
					border-radius: 50%;
					overflow: hidden;
					margin-right: 15px;
					.el-image {
						height: 100%;
					}
				}
			}
		}

		.el-aside {
			background-color: #333744;
			overflow: hidden;
			.el-menu {
				border-right: none;
			}
		}

		.el-main {
			background-color: #eaedf1;
		}
	}
	.iconfont {
		margin-right: 10px;
	}
	.fold_menu {
		color: #fff;
		background-color: #4a5064;
		text-align: center;
		letter-spacing: 0.2em;
		padding: 10px 0;
		font-size: 10px;
		cursor: pointer;
	}
}
</style>
