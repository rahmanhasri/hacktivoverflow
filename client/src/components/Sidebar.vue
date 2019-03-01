<template>
  <div class="main">
    <a @click.prevent="$router.push('/')" href="" class="item">
      <span class="icon">
        <i class="fa fa-inbox"></i>
      </span>
      <span class="name">Home</span>
    </a>
  </div>
</template>

<script>
export default {};
</script>

<style>
.aside {
  display: block;
  background-color: #f9f9f9;
  border-right: 1px solid #dedede;
}
.aside .compose {
  height: 95px;
  margin: 0 -10px;
  padding: 25px 30px;
}
.aside .compose .button {
  color: #f6f7f7;
}
.aside .compose .button .compose {
  font-size: 14px;
  font-weight: 700;
}
.aside .main {
  padding: 40px;
  color: #6f7b7e;
}
.aside .title {
  color: #6f7b7e;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}
.aside .main .item {
  display: block;
  padding: 10px 0;
  color: #6f7b7e;
}
.aside .main .item.active {
  background-color: #f1f1f1;
  margin: 0 -50px;
  padding-left: 50px;
}
.aside .main .item:active,
.aside .main .item:hover {
  background-color: #f2f2f2;
  margin: 0 -50px;
  padding-left: 50px;
}
.aside .main .icon {
  font-size: 19px;
  padding-right: 30px;
  color: #a0a0a0;
}
.aside .main .name {
  font-size: 15px;
  color: #5d5d5d;
  font-weight: 500;
}
</style>
