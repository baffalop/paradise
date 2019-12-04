<template>
    <div class="timeline">
        <div
            class="blip"
            v-for="index in total"
            :key="index"
            :class="{ lit: index <= current, active: playing && index === current }"
        />
    </div>
</template>

<script>
  export default {
    name: "Timeline",
    props: {
      total: {
        type: Number,
        required: true,
      },
      current: {
        type: Number,
        required: false,
        default: 0,
      },
      playing: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
  }
</script>

<style scoped>
    .timeline {
        transform: rotate(-8deg);
        height: 30px;
        max-width: 230px;
        width: 60%;
        margin-bottom: -20px;
        margin-top: -20px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .blip {
        display: flex;
        border-radius: 100%;
        height: 5px;
        width: 5px;
        background-color: #ddd;
        transition-property: background-color, height, width;
        transition-duration: 400ms;
        transition-timing-function: ease-in-out;
    }

    .blip.lit {
        background-color: white;
    }

    .blip.active {
        height: 9px;
        width: 9px;
    }
</style>
