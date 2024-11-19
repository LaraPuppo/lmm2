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
  errorSound = loadSound ('assets/sonidos/cortocircuitofuerte.mp3');
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
    new DraggableShape(0, 0, Img2, 45),
    new DraggableShape(0, 0, Img3, 90),
    new DraggableShape(0, 0, Img4, 0),
    new DraggableShape(0, 0, Img5, 0),
    new DraggableShape(0, 0, Img6, 0),
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
  imageMode(CORNER); // Dibuja desde la esquina superior izquierda
  image(Img1, 540, 20); // Ajusta la altura según el diseño del HUD

  // Determina el rango de imágenes visibles según la página actual
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Solo muestra las imágenes dentro del rango de la página actual
  hudShapes.slice(startIndex, endIndex).forEach((shape, index) => {
    // Reposiciona las imágenes visibles en el HUD
    shape.x = 100 + index * 100; // Espaciado horizontal
    shape.y = 60; // Fija la altura
    shape.display();
  });
}





function drawBaseShapes() {
  baseShapes.forEach(shape => shape.display());
}

function drawDraggableShapes() {
  hudShapes.forEach(shape => {
    shape.update();
  });
}

function checkIfAllSnapped() {
  // Verifica si todas las formas fijas están encastradas
  if (baseShapes.every(shape => shape.snapped)) {
    currentLevel++; // Avanza al siguiente nivel

    if (currentLevel > 3) {
      console.log("Juego completado. Todos los niveles terminados.");
      // Puedes mostrar un mensaje final aquí o reiniciar el juego
    } else {
      console.log(`Nivel ${currentLevel - 1} completado. Cambia al nivel ${currentLevel}.`);
      transitionToNextLevel();
    }
  }
}


function transitionToNextLevel() {
  // Limpia las formas encastradas del HUD
  hudShapes = hudShapes.filter(shape => !baseShapes.some(base => base.isSnapped(shape)));

  // Limpia las bases del nivel anterior
  baseShapes = [];

  // Carga las formas del siguiente nivel
  loadLevel(currentLevel);

  console.log(`Iniciando el nivel ${currentLevel}`);
}






function resetSnappedShapes() {
  hudShapes.forEach(shape => {
    shape.snapped = false;
    shape.restoreOriginalPosition();
  });
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
        // Ajusta la posición del shape draggable al shape fijo
        selectedShape.x = baseShape.x;
        selectedShape.y = baseShape.y;
        baseShape.snapped = true; // Marca el shape fijo como encastrado
        snapSound.play();
        snapped = true;
      }
    });

    // Si no se encastró, restaura su posición original
    if (!snapped) {
      selectedShape.restoreOriginalPosition();
    }

    selectedShape = null;

    // Verifica si todas las formas fijas están encastradas
    checkIfAllSnapped();
  }
}




function keyPressed() {
  if (selectedShape) {
    if (key === 'A' || key === 'a') {
      // Rotar -45 grados
      selectedShape.rotation = (selectedShape.rotation - 45 + 360) % 360;
      rotateSound.play();
    } else if (key === 'D' || key === 'd') {
      // Rotar +45 grados
      selectedShape.rotation = (selectedShape.rotation + 45) % 360;
      rotateSound.play();
    }
  } else {
    // Cambiar páginas del HUD
    if (key === 'A' || key === 'a') {
      // Ir a la página anterior (si existe)
      if (currentPage > 0) {
        currentPage--;
        console.log(`Página actual: ${currentPage + 1}`);
      }
    } else if (key === 'D' || key === 'd') {
      // Ir a la página siguiente (si existe)
      if ((currentPage + 1) * itemsPerPage < hudShapes.length) {
        currentPage++;
        console.log(`Página actual: ${currentPage + 1}`);
      }
    }
  }
}








class DraggableShape {
  constructor(x, y, img, rotation) {
    this.originalX = x; // Guardamos la posición original
    this.originalY = y;
    this.x = x;
    this.y = y;
    this.img = img;
    this.rotation = rotation;
    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  // Método para restaurar la posición original
  restoreOriginalPosition() {
    this.x = this.originalX;
    this.y = this.originalY;
  }

  update() {
    if (this.dragging) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
    }

    push();
    translate(this.x, this.y);
    rotate(radians(this.rotation));
    imageMode(CENTER);
    image(this.img, 0, 0);
    pop();
  }

  contains(mx, my) {
    const d = dist(mx, my, this.x, this.y);
    return d < 50; // Ajustar según el tamaño de las imágenes
  }

  rotate() {
    this.rotation = (this.rotation + 45) % 360; // Incrementa 45 grados
    rotateSound.play();
  }
}


class FixedShape {
  constructor(x, y, img, rotation) {
    this.x = x;
    this.y = y;
    this.img = img; // La imagen de la forma fija
    this.rotation = rotation; // En grados
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(radians(this.rotation));
    imageMode(CENTER);
    tint (255,100);
    image(this.img, 0, 0);
    pop();
  }

  isSnapped(draggable) {
    const distance = dist(this.x, this.y, draggable.x, draggable.y);
    const angleMatch = this.rotation === draggable.rotation;
    const imgMatch = this.img === draggable.img;
  
    return distance < 50 && angleMatch && imgMatch; // Devuelve true si está encastrado
  }
  
}








