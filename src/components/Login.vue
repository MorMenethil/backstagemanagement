<template>
  <div class="login">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/image/AISChaF_20200401165422701.png" alt="" />
      </div>
      <!-- 登录表单 -->
      <div class="login_row">
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="loginFormRules"
          ref="loginFormRef"
        >
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              prefix-icon="el-icon-user-solid"
            ></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>
          <!-- 登录重置按钮 -->
          <el-form-item class="r_button">
            <el-button type="primary" @click="login()">登录</el-button>
            <el-button type="info" @click="resetLoginForm()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录数据
      loginForm: {
        username: "admin",
        password: "123456",
      },
      // 登录验证
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //   登录
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginForm);
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg)
		sessionStorage.setItem('token',res.data.token)
		this.$router.push('/home')
      });
    },
    // 重置表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
  },
};
</script>

<style lang="less" scope>
html,
body,
#app {
  height: 100%;
  .login {
    background-color: #2b4b6b;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .login_box {
      width: 450px;
      height: 300px;
      background-color: #fff;
      position: relative;
      .avatar_box {
        width: 130px;
        height: 130px;
        border-radius: 50%;
        border: 10px solid #eee;
        box-shadow: 0 0 10px #000;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
    }

    .login_row {
      .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
        .r_button {
          float: right;
        }
      }
    }
  }
}
</style>
