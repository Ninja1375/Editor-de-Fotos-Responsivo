const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const uploadImageInput = document.getElementById('upload-image');
const slider = document.getElementById('slider');
const filterButtons = document.querySelectorAll('.filter-buttons button');
const controls = document.querySelectorAll('.controls button');
const defaultImageUrl = 'https://raw.githubusercontent.com/Ninja1375/Editor-de-Fotos-Responsivo/main/Logo%20editor%20de%20imagens%20.png';

// Configurações padrão
let img = new Image();
let currentFilter = 'brightness'; // Filtro inicial
let filters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  sepia: 0,
  blur: 0,
  invert: 0,  // Para o efeito negativo
};

// Carregar imagem padrão ao iniciar
img.src = defaultImageUrl;
img.onload = function () {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  applyFilters();
};

// Função para aplicar filtros
function applyFilters() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.filter = `
    brightness(${filters.brightness}%)
    contrast(${filters.contrast}%)
    saturate(${filters.saturation}%)
    sepia(${filters.sepia}%)
    blur(${filters.blur}px)
    invert(${filters.invert}%)
  `;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

// Selecionar nova imagem
document.getElementById('select-image').addEventListener('click', () => {
  uploadImageInput.click();
});

uploadImageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

img.onload = function () {
  canvas.width = img.width;
  canvas.height = img.height;
  applyFilters();
};

// Função para atualizar o filtro
filterButtons.forEach(button => {
  button.addEventListener('click', function () {
    // Desativar todos os botões
    filterButtons.forEach(btn => btn.classList.remove('active'));
    // Ativar o botão clicado
    this.classList.add('active');

    currentFilter = this.id;
    slider.value = filters[currentFilter];

    // Verificar o máximo e mínimo conforme o filtro
    if (currentFilter === 'blur') {
      slider.max = 10;
      slider.min = 0;
    } else if (currentFilter === 'invert') {
      slider.max = 100;
      slider.min = 0;
    } else {
      slider.max = 200;
      slider.min = 0;
    }

    // Garantir que o botão fique azul instantaneamente
    applyFilters();
  });
});

// Atualizar o valor do filtro com o slider
slider.addEventListener('input', function () {
  filters[currentFilter] = this.value;
  applyFilters();
});

// Rotação e Inversão da Imagem
document.getElementById('rotate-left').addEventListener('click', () => {
  rotateImage(-90);
});

document.getElementById('rotate-right').addEventListener('click', () => {
  rotateImage(90);
});

document.getElementById('flip-vertical').addEventListener('click', () => {
  flipImage();
});

// Limpar Filtros
document.getElementById('reset-filters').addEventListener('click', () => {
  // Restaurar os valores dos filtros
  filters = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    sepia: 0,
    blur: 0,
    invert: 0,
  };
  applyFilters();
  slider.value = 100; // Resetar o slider para 100%

  // Desativar todos os botões de filtro
  filterButtons.forEach(btn => btn.classList.remove('active'));
});

// Funções de rotação e inversão
function rotateImage(degrees) {
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');

  tempCanvas.width = canvas.height;
  tempCanvas.height = canvas.width;

  tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
  tempCtx.rotate((degrees * Math.PI) / 180);
  tempCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

  canvas.width = tempCanvas.width;
  canvas.height = tempCanvas.height;
  ctx.drawImage(tempCanvas, 0, 0);
  applyFilters();
}

function flipImage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(0, canvas.height);
  ctx.scale(1, -1);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  applyFilters();
}

// Salvar a imagem editada
document.getElementById('save').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'imagem-editada.png';
  link.href = canvas.toDataURL();
  link.click();
});
