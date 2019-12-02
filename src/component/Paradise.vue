<template>
  <swipe>
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
  import Swipe from 'swipejs'

  export default {
    name: 'Paradise',
    components: { Swipe },
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
