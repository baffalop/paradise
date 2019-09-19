class Timeline {
  /**
   * @param {number} numberOfFragments
   */
  constructor (numberOfFragments) {
    this.numberOfFragments = numberOfFragments
    this.container = document.getElementById('timeline')
    this.build()
  }

  /**
   * Create the blip DOM elements and save references
   */
  build () {
    for (let i = 0; i < this.numberOfFragments; i++) {
      const blip = document.createElement('div')
      blip.className = 'blip'
      this.container.appendChild(blip)
    }

    this.blips = Array.from(document.getElementsByClassName('blip'))
  }

  /**
   * Set blips to on up to the current one, but do not activate as 'current'
   *
   * @param {number} fragmentsRemaining
   */
  prepare (fragmentsRemaining) {
    const endIndex = this.calculateIndex(fragmentsRemaining) + 1
    this.blips.slice(0, endIndex).map(blip => blip.classList.add('on'))
  }

  /**
   * @param {number} fragmentsRemaining
   */
  progress (fragmentsRemaining) {
    const index = this.calculateIndex(fragmentsRemaining)

    for (const blip of this.blips.slice(0, index)) {
      blip.classList.add('on')
      blip.classList.remove('current')
    }

    this.blips[index].className = 'blip on current'
  }

  /**
   * Reset all blips to off. If we need a different number of blips, rebuild.
   *
   * @param {number} numberOfFragments
   */
  reset (numberOfFragments) {
    if (this.numberOfFragments !== numberOfFragments) {
      this.clear()
      this.numberOfFragments = numberOfFragments
      this.build()
      return
    }

    this.blips.map(blip => blip.className = 'blip')
  }

  /**
   * @param {number} fragmentsRemaining
   *
   * @returns {number}
   */
  calculateIndex (fragmentsRemaining) {
    return this.numberOfFragments - fragmentsRemaining - 1
  }

  clear () {
    this.container.innerHTML = ''
  }
}

export default Timeline
