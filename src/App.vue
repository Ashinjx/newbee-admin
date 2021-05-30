<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
* {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
html {
  -webkit-tap-highlight-color: transparent;
  width: 100%;
  height: 100%;
}
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font-size: 14px;
}
div,
ul,
li,
h1,
h2,
h3,
h4,
h5,
h6,
p,
dl,
dt,
dd,
ol,
form,
input,
textarea,
th,
td,
select {
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
ol,
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
button,
input,
textarea {
  color: inherit;
  font: inherit;
}
i {
  font-style: normal;
}
</style>
