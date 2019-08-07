/**
 * Abstract class that emits and receives events.
 * Events go in one direction only: upstream, from child to parent (compositionally speaking)
 *
 * @type {Eventful}
 */
class Eventful {
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
   * @param {Eventful} emitter
   * @param {Object} data
   */
  emit (type, emitter = this, data = {}) {
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
    this.emit(type, emitter, data)
  }
}

export default Eventful
