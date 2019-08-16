import Block from 'block'

const audio = {
  playerOpts: {
    skip: 10,
    tailOvershootThreshold: 0.5,
  },
  basePath: '../www/dummy/audio/',
  blocks: [
    new Block('intro.mp3', 2.5),
    new Block('ficus.mp3', 9.0),
  ],
}

audio.blocks.map(block => block.basePath = audio.basePath)

export { audio }
