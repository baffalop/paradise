/**
 * Manages fragment titles: display and transitions
 * @type {Titles}
 */
class Titles {
  constructor () {
    this.container = document.getElementById('fragment-container')
    /** @var {?HTMLDivElement} */
    this.current = null
    /** @var {?HTMLDivElement} */
    this.previous = null
  }

  transition (name) {
    if (this.previous !== null) {
      this.previous.remove()
    }

    this.previous = this.current
    this.current = this.create(name)

    window.getComputedStyle(this.current).opacity // force reflow to render css transitions

    this.current.classList.add('in')
    if (this.previous !== null) {
      this.previous.classList.add('out')
    }
  }

  /**
   * @param {string} name
   *
   * @returns {HTMLDivElement}
   */
  create (name) {
    const elem = document.createElement('div')
    elem.className = 'fragment'
    elem.style.backgroundImage = this.getPath(name)
    this.container.appendChild(elem)
    return elem
  }

  /**
   * @param {string} name
   *
   * @returns {string}
   */
  getPath (name) {
    return `url(../www/dummy/img/fragments/${name}.png)`
  }
}

export default Titles
