// ===============================================
// SIMULADOR DE CARRITO - UMMA PETS (catalogo-completo.html)
// ===============================================

// ---------- CLASE ----------
// Define cómo es cada producto de la tienda.
class Producto {
    constructor(id, nombre, categoria, precio, stock, imagen) {
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
        this.stock = stock;
        this.imagen = imagen;
    }

    // Informa si hay stock suficiente (devuelve true o false).
    hayStock(cantidad) {
        return this.stock >= cantidad;
    }

    // Modifica el estado del objeto: resta stock al vender.
    vender(cantidad) {
        this.stock = this.stock - cantidad;
    }

    // Devuelve un texto con los datos del producto.
    informar() {
        return this.id + ". " + this.nombre + " - $" + this.precio + " (stock: " + this.stock + ")";
    }
}

// ---------- DATOS ----------
// Array de objetos: nuestra "base de datos".
// IMPORTANTE: precios y stock son de ejemplo.
const productos = [
    new Producto(1, "maintenance criadores", "alimentos", 25000, 10, "comida-perros/maintenance-criadores-perro.JPG"),
    new Producto(2, "pedigree", "alimentos", 22000, 10, "comida-perros/pedigree-adulto-perro.JPG"),
    new Producto(3, "purina proplan", "alimentos", 30000, 8, "comida-perros/purina-proplan-perro.JPG"),
    new Producto(4, "royal canin puppy", "alimentos", 35000, 6, "comida-perros/royalcanin-puppy-perro.JPG"),
    new Producto(5, "catpro", "alimentos", 18000, 10, "comida-gatos/catpro-gato.JPG"),
    new Producto(6, "purina gato", "alimentos", 20000, 10, "comida-gatos/purina-gato.JPG"),
    new Producto(7, "raza gato", "alimentos", 15000, 10, "comida-gatos/raza-gato.JPG"),
    new Producto(8, "whiskas", "alimentos", 19000, 10, "comida-gatos/whiskas-gato.JPG"),
    new Producto(9, "pechera", "accesorios", 8000, 15, "accesorios/pechera-perro.JPG"),
    new Producto(10, "cepillo", "accesorios", 5000, 15, "accesorios/cepillo-pelos.JPG"),
    new Producto(11, "collar universal", "accesorios", 4500, 20, "accesorios/collar-universal.JPG"),
    new Producto(12, "collar gato", "accesorios", 3500, 20, "accesorios/collar-gato.JPG"),
    new Producto(13, "plato basico", "accesorios", 3000, 20, "accesorios/plato-comida-basico.JPG"),
    new Producto(14, "cucha piel premium", "accesorios", 60000, 5, "accesorios/cucha-piel-premium.JPG"),
    new Producto(15, "cucha premium", "accesorios", 55000, 5, "accesorios/cucha-2.JPG"),
    new Producto(16, "ruedita gato", "accesorios", 6000, 12, "accesorios/ruedita-juguete-gato.JPG")
];

// ---------- FUNCIÓN FLECHA ----------
const aplicarDescuento = (total, porcentaje) => total - (total * porcentaje) / 100;

// ---------- PROCESAMIENTO ----------
function buscarProducto(nombre) {
    return productos.find(producto => producto.nombre === nombre);
}

// Suma el precio de cada producto del carrito. Devuelve el total.
function calcularTotal(carrito) {
    let total = 0;
    for (const nombre of carrito) {
        total += buscarProducto(nombre).precio;
    }
    return total;
}

// Devuelve el porcentaje de descuento según el total.
function calcularPorcentaje(total) {
    if (total > 100000) {
        return 10;
    } else if (total > 50000) {
        return 5;
    } else {
        return 0;
    }
}

// ===============================================
// PARTE DOM: la tienda se muestra en la página
// ===============================================

// ---------- SELECCIÓN DE ELEMENTOS ----------
const listaProductos = document.querySelector("#lista-productos");
const listaCarrito = document.querySelector("#lista-carrito");
const resumenCarrito = document.querySelector("#resumen-carrito");
const cajaMensaje = document.querySelector("#mensaje");
const botonesFiltro = document.querySelectorAll(".filtro");

// ---------- ESTADO ----------
const carritoWeb = [];         // nombres de los productos agregados desde la página
let categoriaActual = "todos"; // filtro de categoría seleccionado
let textoBusqueda = "";        // texto escrito en el buscador
let temporizadorMensaje;       // para ocultar el mensaje después de unos segundos

// ---------- FEEDBACK VISUAL ----------
// Muestra un mensaje en la página. tipo puede ser "exito" o "error" (cambia el color).
function mostrarMensaje(texto, tipo) {
    cajaMensaje.textContent = texto;
    cajaMensaje.className = "mensaje mensaje--" + tipo;
    console.log("[" + tipo + "] " + texto);
    clearTimeout(temporizadorMensaje);
    temporizadorMensaje = setTimeout(() => {
        cajaMensaje.textContent = "";
        cajaMensaje.className = "mensaje";
    }, 3000);
}

// ---------- RENDERIZADO DINÁMICO ----------
function renderizarProductos(lista) {
    if (lista.length === 0) {
        listaProductos.innerHTML = `<p class="vacio">No se encontraron productos.</p>`;
        return;
    }
    listaProductos.innerHTML = lista.map(producto => `
        <article class="tarjeta">
            <img src="../img/${producto.imagen}" alt="${producto.nombre}" loading="lazy">
            <h3 class="tarjeta__nombre">${producto.nombre}</h3>
            <p>$${producto.precio.toLocaleString("es-AR")}</p>
            <p class="tarjeta__stock">${producto.stock > 0 ? "Stock: " + producto.stock : "Sin stock"}</p>
            <button class="boton boton--agregar" data-id="${producto.id}" ${producto.stock === 0 ? "disabled" : ""}>Agregar al carrito</button>
        </article>
    `).join("");
}

function renderizarCarrito() {
    if (carritoWeb.length === 0) {
        listaCarrito.innerHTML = `<li class="vacio">Tu carrito está vacío.</li>`;
        resumenCarrito.innerHTML = "";
        return;
    }
    listaCarrito.innerHTML = carritoWeb.map((nombre, indice) => `
        <li class="carrito__item">
            <span class="tarjeta__nombre">${nombre}</span>
            <span>$${buscarProducto(nombre).precio.toLocaleString("es-AR")}</span>
            <button class="carrito__quitar" data-indice="${indice}" aria-label="Quitar ${nombre}">✕</button>
        </li>
    `).join("");
    const total = calcularTotal(carritoWeb);
    const porcentaje = calcularPorcentaje(total);
    const totalFinal = aplicarDescuento(total, porcentaje);
    resumenCarrito.innerHTML = `
        <p>Subtotal: $${total.toLocaleString("es-AR")}</p>
        <p>Descuento: ${porcentaje}%</p>
        <p class="carrito__total">Total: $${totalFinal.toLocaleString("es-AR")}</p>
    `;
}

function aplicarFiltros() {
    const filtrados = productos.filter(producto =>
        (categoriaActual === "todos" || producto.categoria === categoriaActual) &&
        producto.nombre.includes(textoBusqueda)
    );
    renderizarProductos(filtrados);
}

// ---------- ACCIONES DEL CARRITO ----------
function agregarAlCarritoWeb(id) {
    const producto = productos.find(item => item.id === id);
    const unidadesEnCarrito = carritoWeb.filter(nombre => nombre === producto.nombre).length;
    if (producto.hayStock(unidadesEnCarrito + 1)) {
        carritoWeb.push(producto.nombre);
        renderizarCarrito();
        mostrarMensaje("Agregaste " + producto.nombre + " al carrito.", "exito");
    } else {
        mostrarMensaje("No hay más stock de " + producto.nombre + ".", "error");
    }
}

function quitarDelCarritoWeb(indice) {
    const quitado = carritoWeb.splice(indice, 1)[0];
    renderizarCarrito();
    mostrarMensaje("Quitaste " + quitado + " del carrito.", "exito");
}

function vaciarCarritoWeb() {
    if (carritoWeb.length === 0) {
        mostrarMensaje("El carrito ya está vacío.", "error");
        return;
    }
    while (carritoWeb.length > 0) {
        carritoWeb.pop();
    }
    renderizarCarrito();
    mostrarMensaje("Vaciaste el carrito.", "exito");
}

// Función que se ejecuta al hacer click en "Finalizar compra".
function comprarWeb() {
    console.log("Click en Finalizar compra. Productos en el carrito:", carritoWeb.length);
    try {
        procesarCompra();
    } catch (error) {
        console.error(error);
        mostrarMensaje("Error al finalizar la compra: " + error.message, "error");
    }
}

// Hace la compra: calcula el total, descuenta stock y vacía el carrito.
function procesarCompra() {
    if (carritoWeb.length === 0) {
        mostrarMensaje("Agregá productos antes de comprar.", "error");
        return;
    }
    const total = calcularTotal(carritoWeb);
    const totalFinal = aplicarDescuento(total, calcularPorcentaje(total));
    console.log("Compra realizada:", carritoWeb.slice(), "Subtotal:", total, "Total:", totalFinal);
    carritoWeb.forEach(nombre => buscarProducto(nombre).vender(1));
    while (carritoWeb.length > 0) {
        carritoWeb.pop();
    }
    renderizarCarrito();
    aplicarFiltros();
    resumenCarrito.innerHTML = `
        <p class="carrito__total">¡Compra realizada!</p>
        <p>Total pagado: $${totalFinal.toLocaleString("es-AR")}</p>
    `;
    mostrarMensaje("¡Compra realizada! Total pagado: $" + totalFinal.toLocaleString("es-AR"), "exito");
}

// ---------- EVENTOS ----------
document.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button");
    if (boton === null) {
        return;
    }

    if (boton.classList.contains("boton--agregar")) {
        agregarAlCarritoWeb(parseInt(boton.dataset.id));
    } else if (boton.classList.contains("carrito__quitar")) {
        quitarDelCarritoWeb(parseInt(boton.dataset.indice));
    } else if (boton.classList.contains("filtro")) {
        categoriaActual = boton.dataset.categoria;
        botonesFiltro.forEach(otro => otro.classList.remove("filtro--activo"));
        boton.classList.add("filtro--activo");
        aplicarFiltros();
    } else if (boton.id === "boton-comprar" || boton.textContent.trim() === "Finalizar compra") {
        comprarWeb();
    } else if (boton.id === "boton-vaciar") {
        vaciarCarritoWeb();
    } else {
        console.log("Botón sin acción asignada. id:", boton.id, "| clases:", boton.className);
    }
});

// Evento "input": se ejecuta cada vez que se escribe en el buscador
document.addEventListener("input", (evento) => {
    if (evento.target.id === "buscador") {
        textoBusqueda = evento.target.value.trim().toLowerCase();
        aplicarFiltros();
    }
});

// Evento de teclado: con Escape se borra la búsqueda
document.addEventListener("keydown", (evento) => {
    if (evento.target.id === "buscador" && evento.key === "Escape") {
        evento.target.value = "";
        textoBusqueda = "";
        aplicarFiltros();
    }
});

// ---------- INICIO ----------
aplicarFiltros();
renderizarCarrito();