import Block from 'block'

const audio = {
  playerOpts: {
    skip: 10
  },
  basePath: '../www/dummy/audio/',
  blocks: [
    new Block('intro.mp3', 1.1),
    new Block('ficus.mp3', 9.0),
  ],
}

audio.blocks.map(block => block.basePath = audio.basePath)

export { audio }
