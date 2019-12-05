<template>
  <swipe ref="swipe" @swiping="checkUnlock($event)">
    <div>
      <div class="title"></div>
    </div>

    <div>
      <div class="text">
        <p>
          This is a guided visit to a series of obliquely connected private libraries located in Amsterdam&rsquo;s Red Light District, the Stroud Green neighbourhood of London, Montreal&rsquo;s Plateau, and the 14e arrondissement of Paris. And other places.
        </p>
        <p>
          You will be led through observations, reflections, and movements selected randomly from an evolving collection of objects in the libraries. The experience will last approximately sixty minutes. Please put on your headphones, turn off the ringer of your device, and when you are ready, swipe to the next screen to begin.
        </p>
      </div>
    </div>

    <player @sequence-end="onSequenceEnd()" />

    <div>
      <div class="text">
        <p>
          <em>I Don&rsquo;t Know Where Paradise Is</em> was written and created by Benny Nemerofsky Ramsay to accompany a series of sculptures, collages, and photographs produced as doctoral research at the Edinburgh College of Art. Narration by Adeniyi Adelakun, Adrian Rifkin, Alberta Whittle, Benny Nemerofsky Ramsay, Gert Hekma, Joke Ballintijn, Mattias Duyves, Oskar Kirk Hansen, Thomas Waugh, Tomi Paasonen, and Will Stringer. Composition and sound design by Johannes Malfatti. App programming by Nikita Gaidakov. Sound recordings by Nikita Gaidakov and Jack Walker. <em>I Don&rsquo;t Know Where Paradise Is</em> was supported through funding by the <em>Cruising the Seventies: Unearthing Pre-HIV/AIDS Queer Sexual Cultures</em> Research Project at the Edinburgh College of Art, the Social Sciences and Humanities Research Council of Canada, and the Canada Council for the Arts.
        </p>
        <p>
          <img src="./../assets/img/logos.png" class="logos" alt="Sponsor logos" />
        </p>
      </div>
    </div>
  </swipe>
</template>

<script>
  import Swipe from './Swipe'
  import Player from './Player'

  const SLIDE_SPEED_SLOW = 1400
  const UNLOCK_TIMEOUT = 800

  export default {
    name: 'Paradise',
    components: { Swipe, Player },
    data: () => ({
      unlockCount: 0,
      unlockTimeout: null,
      devMode: false,
    }),
    computed: {
      nextUnlockIndex () {
        return (this.unlockCount + 1) % 2
      }
    },
    methods: {
      onSequenceEnd () {
        this.$refs.swipe.goto(3, SLIDE_SPEED_SLOW)
      },

      /**
       * Swipe alternately between 0th and 1st slide to unlock devMode
       *
       * @param {Number} index
       * @param {Number} dir
       */
      checkUnlock ({index, dir}) {
        if (index !== this.nextUnlockIndex || -dir !== (this.nextUnlockIndex * 2) - 1) {
          return
        }

        if (++this.unlockCount === 6) {
          alert('You have unlocked dev mode!')
          this.devMode = true
          this.unlockCount = 0
          return
        }

        console.log(`unlockCount = ${this.unlockCount}`)

        if (this.unlockTimeout) {
          window.clearTimeout(this.unlockTimeout)
          this.unlockTimeout = null
        }

        this.unlockTimeout = window.setTimeout(() => this.unlockCount = 0, UNLOCK_TIMEOUT)
      },
    },
  }
</script>

<style scoped>
  .text {
    width: 80%;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-right: 0.8em;
    line-height: 1.3em;
  }

  .title {
    background: url(./../assets/img/title.png) no-repeat center;
    background-size: contain;
    height: 80vh;
    width: 80%;
  }

  .logos {
    margin-block-start: 0.8em;
    margin-left: 15%;
    margin-right: 15%;
    width: 70%;
    height: auto;
  }
</style>

<style>
  * {
    -webkit-tap-highlight-color: rgba(0,0,0,0); /* make transparent link selection, adjust last value opacity 0 to 1.0 */
  }

  html, body { /* disable scrolling */
    margin: 0;
    height: 100vh;
    overflow: hidden;
  }

  body {
    -webkit-touch-callout: none;                /* prevent callout to copy image, etc when tap to hold */
    -webkit-text-size-adjust: none;             /* prevent webkit from resizing text to fit */
    -webkit-user-select: none;                  /* prevent copy paste, to allow, change 'none' to 'text' */
    background: #fa9c8c url(./../assets/img/background.png) no-repeat fixed center center;
    background-size: cover;
    font-family: 'GaramondBT', serif, system-ui, -apple-system, -apple-system-font;
    font-size: calc(1.1em + 0.7vw);
    height:100vh;
    width:100%;
    color: white;
  }

  small {
    font-size: 0.6em;
  }

  a {
    color: white;
    text-decoration: none;
  }

  a:hover, a:active {
    color: #d1d1d1;
  }

  @font-face {
    font-family: 'GaramondBT';
    src: url(./../assets/fonts/OriginalGaramondBT-Roman.otf);
    font-style: normal;
  }

  @font-face {
    font-family: 'GaramondBT';
    src: url(./../assets/fonts/OriginalGaramondBT-Italic.otf);
    font-style: italic;
  }

  p {
    margin-block-start: 0.6em;
    margin-block-end: 0.6em;
  }
</style>
