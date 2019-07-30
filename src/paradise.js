import { audio as audioData } from 'data'
import Swipe from 'swipejs'
import Player from 'player'

class Paradise {
  listen () {
    this.swipe = new Swipe(document.getElementById('slider'), {
      draggable: true,
      speed: 300,
      continuous: false,
      callback: (index) => console.log(`Swipe pos: ${index}`),
    })

    document.addEventListener('deviceready', this.init.bind(this));
  }

  init () {
    Block.basePath = audioData.basePath
    this.player = new Player(audioData.blocks)
  }
}

window.paradise = new Paradise()
paradise.listen()
