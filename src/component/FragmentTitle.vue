<template>
  <div class="fragment-container">
    <transition name="swipe">
      <div class="title" :key="name" :class="name" />
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'FragmentTitle',
    props: {
      name: {
        type: String,
        required: true,
      },
    },
  }
</script>

<style scoped>
  .fragment-container {
    width: 70%;
    height: 40%;
  }

  .title {
    background-color: transparent;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center bottom;
    position: absolute;
    width: 70%;
    height: 40%;
    transition: transform 0.6s, opacity 0.6s;
  }

  /* Transitions */

  .swipe-enter {
    transform: translate(100px, -20px);
    opacity: 0;
  }

  .swipe-enter-active {
    transition-timing-function: ease-out, ease-in;
    transition-delay: 0.4s;
  }

  .swipe-leave-to {
    transform: translate(-100px, 20px);
    opacity: 0;
  }

  .swipe-leave-active {
    transition-timing-function: ease-in, ease-out;
    transition-delay: 0s;
  }

  /* Titles */

  .bathhouse {
    background-image: url(./../assets/img/fragments/bathhouse.png);
  }

  .biographies {
      background-image: url(./../assets/img/fragments/biographies.png);
  }

  .clocks {
      background-image: url(./../assets/img/fragments/clocks.png);
  }

  .duster {
      background-image: url(./../assets/img/fragments/duster.png);
  }

  .exlibris {
    background-image: url(./../assets/img/fragments/exlibris.png);
  }

  .faggot {
      background-image: url(./../assets/img/fragments/faggot.png);
  }

  .ficus {
    background-image: url(./../assets/img/fragments/ficus.png);
  }

  .futurelovers {
      background-image: url(./../assets/img/fragments/futurelovers.png);
  }

  .illustration {
      background-image: url(./../assets/img/fragments/illustration.png);
  }

  .intro {
    background-image: url(./../assets/img/fragments/intro.png);
  }

  .mirror {
    background-image: url(./../assets/img/fragments/mirror.png);
  }

  .novels {
    background-image: url(./../assets/img/fragments/novels.png);
  }

  .postcard {
    background-image: url(./../assets/img/fragments/postcard.png);
  }

  .spiderplant {
      background-image: url(./../assets/img/fragments/spiderplant.png);
  }
</style>
