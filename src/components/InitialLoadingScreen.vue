<template>
  <div class="loading-wrapper">
    <div class="loader">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<style scoped>
.loader {
  display: block;
  position: fixed;
  opacity: 0.5;
  margin: auto;
  width: 200px;
  height: 200px;
  top: calc(50% - 100px);
  left: calc(50% - 100px);
}

.loader span {
  border: 1px solid var(--q-primary);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  animation: rotateLoader 5s linear infinite;
}

@keyframes rotateLoader {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loader span:nth-child(1) {
  border-radius: 43% 57% 57% 43% / 37% 37% 63% 63%;
}
.loader span:nth-child(2) {
  animation-direction: reverse;
  border-radius: 60% 40% 66% 34% / 40% 37% 63% 60%;
}
.loader span:nth-child(3) {
  animation-duration: 3s;
  border-radius: 46% 54% 57% 43% / 32% 51% 49% 68%;
}
</style>
