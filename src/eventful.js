/**
 * Abstract class that emits and receives events.
 * Events go in one direction only: upstream, from child to parent (compositionally speaking)
 *
 * @type {Eventful}
 */
class Eventful {
  constructor () {
    this.oneShotEvents = {}
  }

  /**
   * Set upstream: object which receives our emitted events
   *
   * @param {Eventful} upstream
   */
  setUpstream (upstream) {
    this.upstream = upstream
    return this
  }

  /**
   * Emit an event to be received by upstream object
   *
   * @param {String} type
   * @param {Object} data
   * @param {Eventful} emitter
   */
  emit(type, data = {}, emitter = this) {
    if (typeof this.upstream === 'object') this.upstream.receive(type, emitter, data)
  }

  /**
   * Log, handle, and bubble (re-emit) an event
   *
   * @param {String} type
   * @param {Eventful} emitter
   * @param {Object} data
   */
  receive (type, emitter, data) {
    if (typeof this.log === 'function') this.log(`received event '${type}'`)
    if (typeof this.handleEvent === 'function') this.handleEvent(type, emitter, data)
    this.handleOneShot(type, emitter, data)
    this.emit(type, data, emitter)
  }

  /**
   * @param {String} type
   * @param {function} handler
   * @param {Eventful} matchEmitter
   */
  addOneShotEvent (type, handler, matchEmitter = null) {
    this.oneShotEvents[type] = {handler: handler}
    if (matchEmitter) this.oneShotEvents[type].matchEmitter = matchEmitter
  }

  handleOneShot (type, emitter, data) {
    if (!this.oneShotIsCallable(type)) return

    const eventObject = this.oneShotEvents[type]
    if (eventObject.hasOwnProperty('matchEmitter') && !eventObject.matchEmitter !== emitter) {
      if (typeof this.log === 'function') this.log(`event '${type}' has one shot handler but emitter does not match`)
      return
    }

    eventObject.handler(emitter, data)
    this.oneShotEvents[type] = {}
  }

  /**
   * @param {String} type
   * @returns {boolean}
   */
  oneShotIsCallable (type) {
    return this.oneShotEvents.hasOwnProperty(type) && typeof this.oneShotEvents[type].handler === 'function'
  }
}

export default Eventful
