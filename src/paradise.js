import { audio as audioData } from 'data'
import Swipe from 'swipejs'

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
    for (const file of audioData.files) {
      console.log(file.path)
    }
  }
}

window.paradise = new Paradise()
paradise.listen()
