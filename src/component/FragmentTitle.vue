<template>
  <div class="fragment-container">
    <transition name="swipe">
      <div
        class="title"
        v-for="(title, i) in titles"
        :key="i"
        v-show="i === index"
        :style="{ backgroundImage: imgFromName(title) }"
      />
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
    data: () => ({
      index: 0,
      titles: [this.name, ''],
    }),
    watch: {
      name (newName) {
        this.index = ++this.index % 2
        this.titles[this.index] = newName
      },
    },
    methods: {
      imgFromName (name) {
        return `url(./../assets/img/fragments/${name}.png)`
      }
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
</style>
