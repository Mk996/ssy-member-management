<template>
  <div class="loader_overlay">
    <div class="item loading-2">
      <div class="spinner">
        <div class="circle circle-1">
          <div class="circle-inner"></div>
        </div>
        <div class="circle circle-2">
          <div class="circle-inner"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loader_overlay {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;
  background-color: rgba(0, 0, 0, 0.7);
}

.loading-2 {
  z-index: 20;
  .spinner * {
    box-sizing: border-box;
  }
  .spinner {
    display: inline-block;
    animation-name: anim-spinner;
    animation-duration: 0.7s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    .circle {
      width: 3.5rem;
      height: 1.75rem;
      overflow: hidden;
    }
    .circle-inner {
      transform: rotate(45deg);
      border-radius: 50%;
      border: 0.3rem solid #0095da;
      border-right: 0.3rem solid transparent;
      border-bottom: 0.3rem solid transparent;
      width: 100%;
      height: 200%;
      animation-name: anim-circle-1;
      animation-duration: 0.7s;
      animation-iteration-count: infinite;
      animation-direction: alternate;
      animation-timing-function: cubic-bezier(0.25, 0.1, 0.5, 1);
    }
    .circle-2 {
      transform: rotate(180deg);
      & .circle-inner {
        animation-name: anim-circle-2;
      }
    }
    @keyframes anim-circle-1 {
      from {
        transform: rotate(60deg);
      }
      to {
        transform: rotate(205deg);
      }
    }
    @keyframes anim-circle-2 {
      from {
        transform: rotate(30deg);
      }
      to {
        transform: rotate(-115deg);
      }
    }
    @keyframes anim-spinner {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
}
</style>
