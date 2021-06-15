/**
 * An image properties information
 * @typedef {{name: string, width: number, height: number, scales: number[], tileSize: number, }} ImageProperties
 * @typedef {{tileKey: string, tileKeys: number[], imageSrc: string, offsetX: number, offestY: number}} TileEntity
 */

/**
 * Generator, that create fixed length array filled by calculated values
 * @param {number} length - length of out array
 * @param {Function} foo - generator function, that calculate and return value to be pushed in array
 * @returns {Array<any>} generated array  
 */
const fillArray = (length, foo) => {
  const arr = new Array(length)
  for (let i = 0; i < length; i++) {
    arr.push(foo(i))
  }
  return arr
}

const position = { x: 0, y: 0, scale: 1 }
const size = { width: 0, height: 0 }
const scales = fillArray(10, (i) => Math.pow(2, 10 + i))
/** 
 * Create canvas with TilesViewer
 * @param {string} elementSelector - selector of element for rendering TilesViewer inside
 * @param {(ImageProperies | string)} imageProperties - object of type {@link ImageProperties} or string with link to file with information about image, to be rendered
 * @returns {boolean} is creating was finished success
*/
function initTilesViewer(elementSelector, imageProperties) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const width, height = (canvas.width, canvas.height)
  size.width = imageProperties.width
  size.height = imageProperties.height

}

/**
 * Create a new instance of TilesViewer
 * @class
 */
class TilesViewer {
  size = {
    width: 0,
    height: 0
  }
  viewOffset = {
    x: 0,
    y: 0
  }
  tileRange = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }
  tiles = []
  tileDeadLineMp = 1
  /**
   * 
   * @param {string} elementSelector Selector of element to draw TilesViewer
   * @param {ImageProperties | string} imageProperties object of type {@link ImageProperties} or string with link to file with information about image, to be rendered
   */
  constructor(elementSelector, imageProperties = {}, baseUrlPath='') {
    this.element = document.querySelector(elementSelector)
    this.imageProperties = imageProperties || {}
    this.baseUrlPath = baseUrlPath
  }
  /**
   * Callback function that move view area of TilesViewer 
   * @param {number} offsetX TileViewer view offset in pixels by x axis
   * @param {number} offsetY TileViewer view offset in pixels by y axis
   */
  move(offsetX, offsetY) {
    this.viewOffset.x += offsetX
    this.viewOffset.y += offsetY
    this.updateTiles()
  }
  /**
   * Deleting tiles from one of sides. If more than one side passed, deleting first in order
   * @param {{left: boolean, right: boolean, top: boolean, bottom: boolean}} options - Object, that define side to delete tiles
   */
  deleteTiles(options = {}) {
    if (!!options.left) {
      this.tiles = this.tiles.filter(elem => elem.tileKeys[0] !== this.tileRange.left)
    } else if (!!options.right) {
      this.tiles = this.tiles.filter(elem => elem.tileKeys[0] !== this.tileRange.right)
    } else if (!!options.top) {
      this.tiles = this.tiles.filter(elem => elem.tileKeys[1] !== this.tileRange.top)
    } else if (!!options.bottom) {
      this.tiles = this.tiles.filter(elem => elem.tileKeys[1] !== this.tileRange.bottom)
    } else {

    }
  }
  /**
   * Add tiles from one of sides. If more than one side passed, adding first in order
   * @param {{left: boolean, right: boolean, top: boolean, bottom: boolean} } options - Object, that define side to add tiles
   */
  addTiles(options = {}) {
    if (!!options.left) {
      for (let i = this.tileRange.top; i < this.tileRange.bottom; i ++) {
        this.addTile(this.tileRange.left, i)
      }
    } else if (!!options.right) {
      for (let i = this.tileRange.top; i < this.tileRange.bottom; i++) {
        this.addTile(this.tileRange.right, i)
      }
    } else if (!!options.top) {
      for (let i = this.tileRange.left; i < this.tileRange.right; i++) {
        this.addTile(i, this.tileRange.top)
      }
    } else if (!!options.bottom) {
      for (let i = this.tileRange.left; i < this.tileRange.right; i++) {
        this.addTile(i, this.tileRange.bottom)
      }
    } else {

    }
  }
  /**
   * Create new Tile and push it to tiles array
   * @param {number} x index of tile by x axis
   * @param {number} y index of tile by y axis
   */
  addTile(x, y) {    
    const tile = {
      tileKey: `${x}_${y}`,
      tileKeys: [x, y],
      imageSrc: Math.min(x, y) >= 0 ? this.getTileSrc(x, y) : '',
      offsetX: 0,
      offsetY: 0
    }
    this.tiles.push(tile)
  }
  getTileSrc(x, y) {
    return `${this.baseUrlPath}${this.imageProperties.name}_${x}_${y}`
  }
  updateTiles() {
    const { left, right, top, bottom } = this.generateCurrentTileKeys()
    if (left != this.tileRange.left) {
      if (left > this.tileRange.left) {
        this.deleteTiles({ left: true })
      }
      else {
        this.addTiles({ left: true })
      }
    } else if (right != this.tileRange.right) {
      if (right > this.tileRange.right) {
        this.deleteTiles({ right: true })
      }
      else {
        this.addTiles({ right: true })
      }
    } else if (top != this.tileRange.top) {
      if (top > this.tileRange.top) {
        this.deleteTiles({ top: true })
      }
      else {
        this.addTiles({ top: true })
      }
    } else if (bottom != this.tileRange.bottom) {
      if (bottom > this.tileRange.bottom) {
        this.deleteTiles({ bottom: true })
      }
      else {
        this.addTiles({ bottom: true })
      }
    }
    this.tileRange = {
      left, right, top, bottom
    }
  }
  generateCurrentTileKeys() {
    const left = this.viewOffset.x / this.imageProperties.tileSize - this.tileDeadLineMp
    const right = (this.viewOffset.x + this.size.width) / this.imageProperties.tileSize + this.tileDeadLineMp
    const top = this.viewOffset.y / this.imageProperties.tileSize - this.tileDeadLineMp
    const bottom = (this.viewOffset.y + this.size.width) / this.imageProperties.tileSize + this.tileDeadLineMp
    return { left, right, top, bottom }
  }
}

export default initTilesViewer
export default TilesViewer