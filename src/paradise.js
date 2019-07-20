import { audio as audioData } from 'data'

class Paradise {
  listen () {
    document.addEventListener('deviceready', this.init.bind(this));
  }

  init () {
    const parentElement = document.querySelector('.app')
    const listeningElement = parentElement.querySelector('.listening')
    const receivedElement = parentElement.querySelector('.received')

    listeningElement.setAttribute('style', 'display:none;')
    receivedElement.setAttribute('style', 'display:block;')

    for (const file of audioData.files) {
      console.log(file.path)
    }
  }
}

(new Paradise()).listen()
