class Timeline {
  /**
   * @param {number} numberOfFragments
   */
  constructor (numberOfFragments) {
    this.numberOfFragments = numberOfFragments
    this.container = document.getElementById('timeline')
    this.build()
  }

  build () {
    for (let i = 0; i < this.numberOfFragments; i++) {
      const blip = document.createElement('div')
      blip.className = 'blip'
      this.container.appendChild(blip)
    }

    this.blips = Array.from(document.getElementsByClassName('blip'))
  }

  /**
   * @param {number} fragmentsRemaining
   */
  progress (fragmentsRemaining) {
    const index = this.numberOfFragments - fragmentsRemaining - 1

    for (const blip of this.blips.slice(0, index)) {
      blip.classList.add('on')
      blip.classList.remove('current')
    }

    this.blips[index].className = 'blip on current'
  }

  clear () {
    this.container.innerHTML = ''
  }
}

export default Timeline
