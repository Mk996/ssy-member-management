<template>
  <aside class="sidebar">
    <ul>
      <li class="sidebar_link">
        <router-link to="/home" class="sidebar_link_data">
          <i class="fas fa-home"></i>
          <span class="sidebar_link_name">Member List</span>
        </router-link>
      </li>
      <li class="sidebar_link">
        <router-link to="/member-register" class="sidebar_link_data">
          <i class="fas fa-file-import"></i>
          <span class="sidebar_link_name">Member Registration</span>
        </router-link>
      </li>
      <li class="sidebar_link">
        <router-link to="/transactions" class="sidebar_link_data">
          <i class="fas fa-file-import"></i>
          <span class="sidebar_link_name">Transactions</span>
        </router-link>
      </li>
    </ul>
  </aside>
</template>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

ul {
  list-style-type: none;
}

.sidebar {
  position: fixed;
  width: 18vw;
  height: 100vh;
  background-color: #fff;
  &_link {
    margin: 1.5rem 0;
    text-decoration: none;
    &_data {
      opacity: 0.7;
      color:$color-blue;
      text-decoration: none;
      &:hover {
        opacity: 1;
      }
    }
    &_name {
      padding-left: 1.2rem;
    }
  }
}

.router-link-exact-active {
  opacity: 1;
}

.name {
  padding-left: 1rem;
}
</style>
