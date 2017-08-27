<template>
  <div>
    <nav class="nav">
      <ul>
        <li><nuxt-link to="/">Home</nuxt-link></li>
        <li><nuxt-link to="/low-poly">Low poly</nuxt-link></li>
      </ul>
    </nav>
    <nuxt/>
  </div>
</template>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

* {
  margin: 0;
}

ul {
  list-style: none;
}

.nav {
  padding: 5px 0px;
}

.nav ul {
  display: flex;
}

.nav ul li {
  padding: 0 10px;
  font-weight: 700;
}

a {
  text-decoration: none;
  color: #2a97b0;
}

input[type=range]{
      -webkit-appearance: none;
}

input[type=range]::-webkit-slider-runnable-track {
  width: 300px;
  height: 4px;
  background: #ddd;
  border: none;
  border-radius: 3px;
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  border: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #5fb084;
  margin-top: -6px;
}

input[type=range]:focus {
  outline: none;
}

input[type=range]:focus::-webkit-slider-runnable-track {
  background: #ccc;
}
</style>
