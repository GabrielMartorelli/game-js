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

/**
 * This function creates a new object called Barreiras, which has a property called pares, which is an
 * array of objects called ParDeBarreiras, which has a property called setX, which is a function that
 * takes a parameter called x, which is the value of the property called x, which is a property of the
 * object called ParDeBarreiras, which is an object in the array called pares, which is a property of
 * the object called Barreiras.
 * @param altura - height of the canvas
 * @param largura - width of the canvas
 * @param abertura - the height of the gap between the two barriers
 * @param espaco - space between the barriers
 * @param notificarPonto - function that is called when the bird passes through the middle of the
 * barrier.
 */
function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
  this.pares = [
    new ParDeBarreiras(altura, abertura, largura),
    new ParDeBarreiras(altura, abertura, largura + espaco),
    new ParDeBarreiras(altura, abertura, largura + espaco * 2),
    new ParDeBarreiras(altura, abertura, largura + espaco * 3),
  ];
  const deslocamento = 3;
  this.animar = () => {
    this.pares.forEach((par) => {
      par.setX(par.getX() - deslocamento);
      if (par.getX() < par.getLargura()) {
        par.setX(par.getX() + espaco * this.pares.length);
        par.sortearAbertura();
      }
      const meio = largura / 2;
      const cruzouOMeio =
        par.getX() + deslocamento >= meio && par.getX() < meio;
      if (cruzouOMeio) notificarPonto();
    });
  };
}

/**
 * The Passaro function takes in the height of the game and returns an object with a method called
 * animar that moves the bird up or down depending on whether the up or down arrow key is pressed.
 * @param alturaJogo - The height of the game.
 */
function Passaro(alturaJogo) {
  let voando = false;

  this.elemento = novoElemento("img", "passaro");
  this.elemento.src = "imagens/passaro.png";

  this.getY = () => parseInt(this.elemento.style.bottom.split("px")[0]);
  this.setY = (y) => (this.elemento.style.bottom = `${y}px`);

  window.onkeydown = (e) => (voando = true);
  window.onkeyup = (e) => (voando = false);

  this.animar = () => {
    const novoY = this.getY() + (voando ? 8 : -5);
    const alturaMaxima = alturaJogo - this.elemento.clientHeight;

    if (novoY <= 0) {
      this.setY(0);
    } else if (novoY >= alturaMaxima) {
      this.setY(alturaMaxima);
    } else {
      this.setY(novoY);
    }
  };

  this.setY(alturaJogo / 2);
}

/**
 * This function creates a new span element with the class name 'progresso' and then creates a new
 * function that updates the innerHTML of the span element with the value of the parameter 'pontos'
 * (which is the number of points the player has earned).
 */
function Progresso() {
  this.elemento = novoElemento("span", "progresso");

  this.atualizarPontos = (pontos) => {
    this.elemento.innerHTML = pontos;
  };
  this.atualizarPontos(0);
}

/**
 * The FlappyBird function creates a new instance of the Progresso, Barreiras, and Passaro classes, and
 * then appends the elements of each to the DOM.
 */
function FlappyBird() {
  let pontos = 0;

  const areaJogo = document.querySelector("[tp-flappy]");
  const altura = areaJogo.clientHeight;
  const largura = areaJogo.clientWidth;

  const progresso = new Progresso();
  const barreiras = new Barreiras(altura, largura, 200, 400, () =>
    progresso.atualizarPontos(++pontos)
  );
  const passaro = new Passaro(altura);

  areaJogo.appendChild(progresso.elemento);
  areaJogo.appendChild(passaro.elemento);

  barreiras.pares.forEach((par) => areaJogo.appendChild(par.elemento));

  this.start = () => {
    const temporizador = setInterval(() => {
      barreiras.animar(), passaro.animar();
    }, 20);
  };
}

/* Creating a new instance of the FlappyBird class and then calling the start method on that instance. */
new FlappyBird().start();
