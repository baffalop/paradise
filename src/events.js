/**
 * Mixin for classes emitting and receiving events.
 * Events go in one direction only: upstream, from child to parent (compositionally speaking)
 *
 * @mixin
 */
const Eventful = class {
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
  emit (type, emitter = this, data) {
    this.upstream.receive(type, emitter, data)
  }

  /**
   * Log, handle, and bubble (re-emit) an event
   *
   * @param {String} type
   * @param {Eventful} emitter
   * @param {Object} data
   */
  receive (type, emitter, data) {
    if (this.hasOwnProperty('log')) this.log(`received event '${type}'`)
    if (this.hasOwnProperty('handleEvent')) this.handleEvent(type, emitter, data)
    this.emit(type, emitter, data)
  }
}

export default Eventful
