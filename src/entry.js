import createShader from './core/create-shader';
import createProgram from './core/create-program';
import vs2d from './shaders/vs-2d';
import fsVariable from './shaders/fs-variable';
import * as m3 from './core/m3';
import imageUrl from './test-images/firefox.png';
import Renderer from './renderer';
import Container from './core/container';

async function loadImage(imageUrl) {
  const imageObj = new Image();
  imageObj.src = imageUrl;
  await new Promise((resolve, reject) => {
    imageObj.onload = resolve;
    imageObj.onerror = reject;
  });
  return imageObj;
}

async function main() {
  const image = await loadImage(imageUrl);
  /** @type {HTMLCanvasElement} */
  const canvasNode = document.querySelector(`.gameCanvas`);
  const renderer = new Renderer(canvasNode);
  const firefoxSprite = new Container();
  firefoxSprite.image = image;
  let firefoxXVelocity = 2;
  let firefoxYVelocity = 2;
  function render() {
    if (firefoxSprite.x + firefoxSprite.image.naturalWidth >= canvasNode.width || firefoxSprite.x < 0) {
      firefoxXVelocity *= -1;
    }
    if (firefoxSprite.y + firefoxSprite.image.naturalHeight >= canvasNode.height || firefoxSprite.y < 0) {
      firefoxYVelocity *= -1;
    }
    firefoxSprite.x += firefoxXVelocity;
    firefoxSprite.y += firefoxYVelocity;
    renderer.render(firefoxSprite);
  }
  function tick() {
    render();
    requestAnimationFrame(() => tick());
  }
  tick();
}

main();
