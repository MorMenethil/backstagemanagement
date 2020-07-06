<template>
  <div class="login">
    <div class="login_box">
      <div class="avatar_box">
          <img src="../assets/image/AISChaF_20200401165422701.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {};
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
          transform: translate(-50%,-50%);
          img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
          }
      }
    }
  }
}
</style>
