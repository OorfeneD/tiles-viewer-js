/**
 * An image properties information
 * @typedef {{name: string, width: number, height: number, scales: number[], tileSize: number, }} ImageProperies
 */

/**
 * Generator, that create fixed length array filled by calculated values
 * @param {number} length - length of out array
 * @param {Function} foo - generator function, that calculate and return value to be pushed in array
 * @returns {Array<any>} generated array  
 */
const fillArray = (length, foo) => {
  const arr = new Array(length)
  for(let i = 0; i < length; i ++) {
    arr.push(foo(i))
  }
  return arr
}

const position = {x: 0, y: 0, scale: 1}
const size = {width: 0, height: 0}
const scales = fillArray(10, (i) => Math.pow(2, 10 + i))
/** 
 * Create canvas with TilesViewer
 * @param {string} elementSelector - selector of element for rendering TilesViewer inside
 * @param {(ImageProperies | string)} imageProperties - object of type {@link ImageProperies} or string with link to file with information about image, to be rendered
 * @returns {boolean} is creating was finished success
*/
function initTilesViewer(elementSelector, imageProperties) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const width, height = (canvas.width, canvas.height)
  
}

export default initTilesViewer