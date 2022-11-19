/**
 * It creates a new element with the tag name and class name passed as arguments.
 *
 * Args:
 *   tagName: The HTML tag name of the element you want to create.
 *   className: The class name of the element you want to create.
 *
 * Returns:
 *   the element created.
 */
function novoElemento(tagName, className) {
  const elem = document.createElement(tagName);
  elem.className = className;
  return elem;
}

/**
 * This function creates a new barrier, which is a div element with two children, a border and a body,
 * and it sets the height of the body.
 *
 * Args:
 *   reversa: boolean. Defaults to false
 */
function Barreira(reversa = false) {
  this.elemento = novoElemento("div", "barreira");

  const borda = novoElemento("div", "borda");
  const corpo = novoElemento("div", "corpo");

  this.elemento.appendChild(reversa ? corpo : borda);
  this.elemento.appendChild(reversa ? borda : corpo);

  this.setAltura = (altura) => (corpo.style.height = `${altura}px`);
}

/**
 * "This function creates a pair of barriers, one above and one below, and places them on the screen."
 *
 * The function starts by creating a new div element and assigning it to the variable elemento. This
 * div will be the parent element of the pair of barriers
 *
 * Args:
 *   altura: the height of the game area
 *   abertura: the height of the gap between the two barriers
 *   x: the x position of the barrier
 */
function ParDeBarreiras(altura, abertura, x) {
  this.elemento = novoElemento("div", "par-de-barreiras");

  this.superior = new Barreira(true);
  this.inferior = new Barreira(false);

  this.elemento.appendChild(this.superior.elemento);
  this.elemento.appendChild(this.inferior.elemento);

  this.sortearAbertura = () => {
    const alturaSuperior = Math.random() * (altura - abertura);
    const alturaInferior = altura - abertura - alturaSuperior;

    this.superior.setAltura(alturaSuperior);

    this.inferior.setAltura(alturaInferior);
  };

  this.getX = () => parseInt(this.elemento.style.left.split("px"));

  this.setX = (x) => (this.elemento.style.left = `${x}px`);

  this.getLargura = () => this.elemento.clientWidth;

  this.sortearAbertura();
  this.setX(x);
}

/* Creating a new instance of the ParDeBarreiras class and appending it to the DOM. */
const b = new ParDeBarreiras(700, 200, 800);
document.querySelector("[tp-flappy]").appendChild(b.elemento);
