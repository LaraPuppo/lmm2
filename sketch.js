let hudShapes = [];
let baseShapes = [];
let selectedShape = null;
let currentLevel = 1;

// Variables para las imágenes y sonidos
let backgroundImg, rectImg, circleImg, batteryImg;
let rotateSound, snapSound;

function preload() {
  // Cargar imágenes
  backgroundImg = loadImage('assets/Lenguaje Mul.svg');
  Img2 = loadImage('assets/componentes/img2.png');
  Img3 = loadImage('assets/componentes/img3.png');
  Img4 = loadImage('assets/componentes/img4.png');
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
  hudShapes.forEach(shape => shape.update());

  // Verifica si todas las piezas están encastradas
  checkIfAllSnapped();
}



function initHUD() {
  hudShapes = [
    new DraggableShape(60, 60, rectImg, 45),
    new DraggableShape(160, 60, circleImg, 90),
    new DraggableShape(260, 60, batteryImg, 0)
  ];
}

function loadLevel(level) {
  if (level === 1) {
    baseShapes = [
      new FixedShape(300, height - 150, rectImg, 0),
      new FixedShape(450, height - 150, circleImg, 0),
      new FixedShape(600, height - 150, batteryImg, 0)
    ];
  } else if (level === 2) {
    baseShapes = [
      new FixedShape(350, height - 200, rectImg, 0),
      new FixedShape(500, height - 200, circleImg, 0),
      new FixedShape(650, height - 200, batteryImg, 0)
    ];
  } else if (level === 3) {
    baseShapes = [
      new FixedShape(400, height - 250, rectImg, 0),
      new FixedShape(550, height - 250, circleImg, 0),
      new FixedShape(700, height - 250, batteryImg, 0)
    ];
  } else if (level === 4) {
    baseShapes = [
      new FixedShape(350, height - 300, rectImg, 0),
      new FixedShape(500, height - 300, circleImg, 0),
      new FixedShape(650, height - 300, batteryImg, 0)
    ];
  }
}


function drawHUD() {
  fill(200);
  noStroke();
  rect(0, 0, width, 100);
  hudShapes.forEach(shape => shape.display());
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
  if (baseShapes.every(shape => shape.snapped)) {
    currentLevel++;
    if (currentLevel > 3) {
      console.log("Juego completado. Todos los niveles terminados.");
      // Aquí puedes hacer algo para mostrar que el juego ha terminado, como un mensaje o reiniciar el juego
    } else {
      console.log(`Nivel ${currentLevel - 1} completado. Cambia al nivel ${currentLevel}.`);
      resetSnappedShapes();
      loadLevel(currentLevel);
    }
  }
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
        snapSound.play();
        snapped = true; // Marca que se ha encajado correctamente
      }
    });

    // Si no se ha encajado, restauramos la posición original
    if (!snapped) {
      selectedShape.restoreOriginalPosition();
    }

    selectedShape = null;
  }
}



function keyPressed() {
  if (key === 'r' || key === 'R') {
    if (selectedShape) {
      selectedShape.rotate();
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
  
    
    image(this.img, 0, 0);
    pop();
  }

  isSnapped(draggable) {
    // Comprobamos la distancia, la rotación y que las imágenes sean iguales
    const distance = dist(this.x, this.y, draggable.x, draggable.y);
    const angleMatch = this.rotation === draggable.rotation;
    const imgMatch = this.img === draggable.img; // Comparamos las imágenes

    return distance < 50 && angleMatch && imgMatch; // Solo se encaja si todo coincide
  }
}








