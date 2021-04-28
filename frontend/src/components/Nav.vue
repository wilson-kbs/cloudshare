<template>
  <div id="nav">
    <router-link to="/">
      <span class="title-site">
        Kabaliserv
        <span class="service-name">Cloud Share</span>
      </span>
    </router-link>
  </div>
</template>


<style lang="scss" scoped>
#nav {
  position: relative;
  width: 100%;
  padding: 20px 30px;
  box-sizing: border-box;

  .title-site {
    position: relative;
    color: #fff;
    display: inline-block;
    font-size: 20px;
    font-weight: bold;
    .service-name {
      font-weight: 600;
      position: absolute;
      bottom: -10px;
      right: -30px;
      font-size: 12px;
    }
  }
}
</style>
