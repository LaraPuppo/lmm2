let hudShapes = [];
let baseShapes = [];
let selectedShape = null;
let currentLevel = 1;
let currentPage = 0; // Página inicial
const itemsPerPage = 4; // Número de imágenes por página

// Variables para las imágenes y sonidos
let backgroundImg, rectImg, circleImg, batteryImg;
let rotateSound, snapSound;

function preload() {
  // Cargar imágenes
  backgroundImg = loadImage('assets/Lenguaje Mul.svg');
  Img1 = loadImage('assets/componentes/img1.png');
  Img2 = loadImage('assets/componentes/img2.png');
  Img3 = loadImage('assets/componentes/img3.png');
  Img4 = loadImage('assets/componentes/img4.png');
  Img5 = loadImage('assets/componentes/img5.png');
  Img6 = loadImage('assets/componentes/img6.png');
  Img7 = loadImage('assets/componentes/img7.png');
  Img8 = loadImage('assets/componentes/img8.png');
  Img9 = loadImage('assets/componentes/img9.png');
  Img10 = loadImage('assets/componentes/img10.png');
  Img11 = loadImage('assets/componentes/img11.png');
  Img12 = loadImage('assets/componentes/img12.png');
  Img13 = loadImage('assets/componentes/img13.png');
  Img14 = loadImage('assets/componentes/img14.png');
  Img15 = loadImage('assets/componentes/img15.png');
  Img16 = loadImage('assets/componentes/img16.png');

  // Cargar sonidos
  rotateSound = loadSound('assets/sonidos/girar elementos.mp3');
  snapSound = loadSound('assets/sonidos/conexion correcta 1.mp3');
  errorSound = loadSound('assets/sonidos/cortocircuitofuerte.mp3');

  // Verificación de carga
  console.log('Verificación de imágenes cargadas:', Img1, Img2, Img3);
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  initHUD();
  loadLevel(currentLevel);
}

function draw() {
  // Redibuja el fondo en cada fotograma
  imageMode(CORNER);
  image(backgroundImg, 0, 0, width, height);

  // Dibuja las formas fijas
  baseShapes.forEach(shape => shape.display());

  // Dibuja las formas arrastrables
  drawHUD();

  // Verifica si todas las piezas están encastradas
  checkIfAllSnapped();
}

function initHUD() {
  hudShapes = [
    new DraggableShape(550, 100, Img2, 0),
    new DraggableShape(670, 100, Img3, 0),
    new DraggableShape(790, 100, Img4, 0),
    new DraggableShape(910, 100, Img5, 0),
    new DraggableShape(910, 100, Img6, 0),
    new DraggableShape(0, 0, Img7, 0),
    new DraggableShape(0, 0, Img8, 0),
    new DraggableShape(0, 0, Img9, 0),
    new DraggableShape(0, 0, Img10, 0),
    new DraggableShape(0, 0, Img11, 0),
    new DraggableShape(0, 0, Img12, 0),
    new DraggableShape(0, 0, Img13, 0),
    new DraggableShape(0, 0, Img14, 0),
    new DraggableShape(0, 0, Img15, 0),
    new DraggableShape(0, 0, Img16, 0),
  ];
}

function loadLevel(level) {
  if (level === 1) {
    baseShapes = [
      new FixedShape(300, height - 150, Img2, 0),
      new FixedShape(450, height - 150, Img3, 0),
      new FixedShape(600, height - 150, Img4, 0),
      new FixedShape(750, height - 150, Img5, 0),
    ];
  } else if (level === 2) {
    baseShapes = [
      new FixedShape(350, height - 200, Img6, 0),
      new FixedShape(500, height - 200, Img7, 0),
      new FixedShape(650, height - 200, Img8, 0),
      new FixedShape(800, height - 200, Img9, 0),
    ];
  } else if (level === 3) {
    baseShapes = [
      new FixedShape(350, height - 200, Img10, 0),
      new FixedShape(500, height - 200, Img11, 0),
      new FixedShape(650, height - 200, Img12, 0),
      new FixedShape(800, height - 200, Img13, 0),
    ];
  }
}

function drawHUD() {
  // Dibujar el fondo del HUD
  imageMode(CORNER); 
  image(Img1, 540, 20);

  // Determina el rango de imágenes visibles según la página actual
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Solo muestra las imágenes dentro del rango de la página actual
  hudShapes.slice(startIndex, endIndex).forEach((shape, index) => {
    // Reposiciona las imágenes visibles en el HUD
    shape.x = 550 + index * 120; // Ajusta esta coordenada según la posición horizontal del HUD
shape.y = 100; // Ajusta esta coordenada según la altura del HUD

    shape.update(); // Usamos `update` para dibujar y actualizar
  });

  // Depuración
  console.log('HUD shapes visibles:', hudShapes.slice(startIndex, endIndex));
}

function checkIfAllSnapped() {
  if (baseShapes.every(shape => shape.snapped)) {
    currentLevel++;
    if (currentLevel > 3) {
      console.log("Juego completado. Todos los niveles terminados.");
    } else {
      console.log(`Nivel ${currentLevel - 1} completado. Cambia al nivel ${currentLevel}.`);
      transitionToNextLevel();
    }
  }
}

function transitionToNextLevel() {
  hudShapes = hudShapes.filter(shape => !baseShapes.some(base => base.isSnapped(shape)));
  baseShapes = [];
  loadLevel(currentLevel);
  console.log(`Iniciando el nivel ${currentLevel}`);
}

function mousePressed() {
  hudShapes.forEach(shape => {
    if (shape.contains(mouseX, mouseY)) {
      selectedShape = shape;
      shape.dragging = true;
      shape.offsetX = shape.x - mouseX;
      shape.offsetY = shape.y - mouseY;
    }
  });
}

function mouseDragged() {
  if (selectedShape && !selectedShape.snapped) {
    selectedShape.x = mouseX;
    selectedShape.y = mouseY;
    selectedShape.checkIfCanSnap(baseShapes);
  }
}

function mouseReleased() {
  if (selectedShape) {
    selectedShape.dragging = false;
    let snapped = false;
    baseShapes.forEach(baseShape => {
      if (baseShape.isSnapped(selectedShape)) {
        selectedShape.x = baseShape.x;
        selectedShape.y = baseShape.y;
        baseShape.snapped = true; 
        snapSound.play();
        snapped = true;
      }
    });
    if (!snapped) selectedShape.restoreOriginalPosition();
    selectedShape = null;
    checkIfAllSnapped();
  }
}

class DraggableShape {
  constructor(x, y, img, rotation) {
    this.originalX = x;
    this.originalY = y;
    this.x = x;
    this.y = y;
    this.img = img;
    this.rotation = rotation;
    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  restoreOriginalPosition() {
    this.x = this.originalX;
    this.y = this.originalY;
  }

  update() {
    push();
    translate(this.x, this.y);
    rotate(radians(this.rotation));
    imageMode(CENTER);
    image(this.img, 0, 0);
    pop();
  }

  contains(mx, my) {
    const imgWidth = this.img.width / 2; // Tamaño de la imagen
    const imgHeight = this.img.height / 2;
    
    return (
      mx > this.x - imgWidth &&
      mx < this.x + imgWidth &&
      my > this.y - imgHeight &&
      my < this.y + imgHeight
    );
  }
  
}

class FixedShape {
  constructor(x, y, img, rotation) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.rotation = rotation;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(radians(this.rotation));
    imageMode(CENTER);
    tint(255, 100);
    image(this.img, 0, 0);
    pop();
  }

  isSnapped(draggable) {
    const distance = dist(this.x, this.y, draggable.x, draggable.y);
    const angleMatch = this.rotation === draggable.rotation;
    const imgMatch = this.img === draggable.img;
    return distance < 50 && angleMatch && imgMatch;
  }
}
