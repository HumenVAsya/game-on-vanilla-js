const imagePaths = [
  "img/buba.png",
  "img/chirva.png",
  "img/cresta.png",
  "img/pika.png",
];

class Container {
  constructor(selector) {
    this.container = document.querySelector(selector);
  }
}

class ImageManager {
  constructor(imagePaths) {
    this.images = imagePaths;
  }

  getRandomImage() {
    return this.images[Math.floor(Math.random() * this.images.length)];
  }
}

class ImageGrid extends Container {
  constructor(selector, imageManager, gridSize = 42) {
    super(selector);
    this.imageManager = imageManager;
    this.gridSize = gridSize;
  }

  createArrayOfImages() {
    return Array.from({ length: this.gridSize }, () => this.imageManager.getRandomImage());
  }
}

class ContentRenderer extends Container {
  createContent(images) {
    return images
      .map((item) => `<div class="grid-cell" data-type="${item}"><img src="${item}"/></div>`)
      .join("");
  }

  displayContent(content) {
    this.container.innerHTML = content;
  }
}

class EventManager {
  constructor(container, highlighter) {
    this.container = container;
    this.highlighter = highlighter;
  }

  addEventListeners() {
    const cells = this.container.querySelectorAll(".grid-cell");
    cells.forEach((cell) => {
      cell.addEventListener("click", (event) => {
        this.highlighter.highlightCells(event.currentTarget);
      });
      cell.addEventListener("mouseenter", (event) => {
        this.highlighter.hoverCells(event.currentTarget);
      });
      cell.addEventListener("mouseleave", () => {
        this.highlighter.clearHover();
      });
    });
  }
}

class Highlighter {
  constructor(container, gridWidth = 6, gridHeight = 7) {
    this.container = container;
    this.cells = Array.from(container.querySelectorAll(".grid-cell"));
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.totalCells = this.gridWidth * this.gridHeight;
  }

  getCellIndex(cell) {
    return this.cells.indexOf(cell);
  }

  highlightCells(clickedCell) {
    const clickedCellIndex = this.getCellIndex(clickedCell);
    const cellType = clickedCell.dataset.type;

    const directions = [
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
    ];

    const visited = new Set();

    const isValidCell = (index, type) => {
      return index >= 0 && index < this.totalCells && this.cells[index].dataset.type === type;
    };

    const dfs = (index) => {
      if (visited.has(index)) return;
      visited.add(index);
      this.cells[index].classList.add("highlight");

      const x = index % this.gridWidth;
      const y = Math.floor(index / this.gridWidth);

      for (const { dx, dy } of directions) {
        const newX = x + dx;
        const newY = y + dy;
        if (newX >= 0 && newX < this.gridWidth && newY >= 0 && newY < this.gridHeight) {
          const newIndex = newY * this.gridWidth + newX;
          if (isValidCell(newIndex, cellType)) {
            dfs(newIndex);
          }
        }
      }
    };

    this.cells.forEach((cell) => cell.classList.remove("highlight"));
    dfs(clickedCellIndex);
  }

  hoverCells(hoveredCell) {
    const hoveredCellIndex = this.getCellIndex(hoveredCell);
    const cellType = hoveredCell.dataset.type;

    const directions = [
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
    ];

    const visited = new Set();

    const isValidCell = (index, type) => {
      return index >= 0 && index < this.totalCells && this.cells[index].dataset.type === type;
    };

    const dfs = (index) => {
      if (visited.has(index)) return;
      visited.add(index);
      this.cells[index].classList.add("hover");

      const x = index % this.gridWidth;
      const y = Math.floor(index / this.gridWidth);

      for (const { dx, dy } of directions) {
        const newX = x + dx;
        const newY = y + dy;
        if (newX >= 0 && newX < this.gridWidth && newY >= 0 && newY < this.gridHeight) {
          const newIndex = newY * this.gridWidth + newX;
          if (isValidCell(newIndex, cellType)) {
            dfs(newIndex);
          }
        }
      }
    };

    this.cells.forEach((cell) => cell.classList.remove("hover"));
    dfs(hoveredCellIndex);
  }
}

const imageManager = new ImageManager(imagePaths);
const imageGrid = new ImageGrid(".app", imageManager);
const contentRenderer = new ContentRenderer(".app");

const imagesArray = imageGrid.createArrayOfImages();
const content = contentRenderer.createContent(imagesArray);
contentRenderer.displayContent(content);

const highlighter = new Highlighter(document.querySelector(".app"));
const eventManager = new EventManager(document.querySelector(".app"), highlighter);
eventManager.addEventListeners();