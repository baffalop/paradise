class Timeline {
  /**
   * @param {number} numberOfFragments
   */
  constructor (numberOfFragments) {
    this.numberOfFragments = numberOfFragments
    this.container = document.getElementById('timeline')
  }

  build () {
    const blip = document.createElement('div')
    blip.className = 'blip'

    for (let i = 0; i < this.numberOfFragments; i++) {
      this.container.appendChild(blip)
    }
  }

  /**
   * @param {number} fragmentsRemaining
   */
  progress (fragmentsRemaining) {
    const index = this.numberOfFragments - fragmentsRemaining - 1
    const blips = document.getElementsByClassName('blip')

    for (const blip of Array.from(blips).slice(0, index)) {
      blip.classList.add('on')
    }
  }

  clear () {
    this.container.innerHTML = ''
  }
}
