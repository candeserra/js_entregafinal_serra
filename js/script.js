// GENERAL //

let todosLosProductos = JSON.parse(localStorage.getItem("carrito")) || [];

document.addEventListener('DOMContentLoaded', () => {
    todosLosProductos = JSON.parse(localStorage.getItem("carrito")) || [];
    showHTML();
});

/* BOTON CARRITO / LISTA DE PRODUCTOS APARECE-DESAPARECE */

const btnCart = document.querySelector('.iconoCarrito');
const containerCarritoCompra = document.querySelector('.contenedorCarritoCompra')

btnCart.addEventListener('click', () => {
    containerCarritoCompra.classList.toggle('hiddenCart')
});

/* AGREGAR PRODUCTOS CARRITO */

const carritoInfo = document.querySelector('.carritoCompra');
const rowProduct = document.querySelector('.rowProduct');
const listaProductos = document.querySelector('.contenedorProductos');

const valorTotal = document.querySelector('.totalPagar');
const countProducts = document.querySelector('#contadorProductos');
const vaciarCarrito = document.querySelector('.vaciarCarrito');
const totalCarrito = document.querySelector('.totalPagar');


listaProductos.addEventListener('click', e => {
    if (e.target.classList.contains('botonAgregar')) {
        const producto = e.target.closest('.producto');
        
        const infoProducto = {
            cantidad: 1,
            titulo: producto.querySelector('h2').textContent,
            precio: producto.querySelector('.precio').textContent,
        };

        const exist = todosLosProductos.some(producto => producto.titulo === infoProducto.titulo);

        if (exist) {
            const products = todosLosProductos.map(producto => {
                if (producto.titulo === infoProducto.titulo) {
                    producto.cantidad++;
                    return producto;
                } else {
                    return producto;
                }
            });
            todosLosProductos = [...products];
        } else {
            todosLosProductos = [...todosLosProductos, infoProducto];
        }

        showHTML();
        saveLocal();

        toastr.success('Producto agregado al carrito', '', {
            positionClass: 'toast-bottom-center',
            closeButton: false,
            timeOut: 1500,
            progressBar: false,
            tapToDismiss: false, 
            progressBar: false,
            class: 'toastr-custom',
        });
    }
});

// LOCAL STORAGE // 

const saveLocal = () => {

    localStorage.setItem("carrito", JSON.stringify(todosLosProductos));
    showHTML();
}

/* ELIMINAR PRODUCTOS CARRITO */

rowProduct.addEventListener('click', (e) => {
    if (e.target.classList.contains('iconoCierre')) {
        const producto = e.target.parentElement;
        const titulo = producto.querySelector('p').textContent;

        todosLosProductos = todosLosProductos.filter(
            producto => producto.titulo !== titulo
        );
        saveLocal ();
    }
});

// SHOW HTML //

const showHTML = () => {

    // CLEAN HTML //

    rowProduct.innerHTML = '';

    let total = 0;
    let totalProductos = 0;

    todosLosProductos.forEach(producto => {
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('carritoCompra');

        containerProduct.innerHTML = `
            <div class="infoCarritoCompra">
                <span class="cantidadProductoCarrito">${producto.cantidad}</span>
                <p class="tituloProductoCarrito">${producto.titulo}</p>
                <span class="precioProductoCarrito">${producto.precio}</span>
            </div>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="iconoCierre">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        `;

        rowProduct.append(containerProduct);

        total += parseInt(producto.cantidad) * parseFloat(producto.precio.slice(1));
        totalProductos += parseInt(producto.cantidad);
    });


    if (todosLosProductos.length === 0) {
        containerCarritoCompra.innerHTML = `<p class="carritoVacio">El carrito está vacío</p>`;
    } 

    valorTotal.innerText = `$${total.toFixed(2)}`;
    countProducts.innerText = totalProductos;


};

/* FORMULARIO APARECE-DESAPARECE */

document.addEventListener("DOMContentLoaded", function () {
    const btnFinalizarCompra = document.getElementById("btnFinalizarCompra");
    const formularioPago = document.getElementById("formularioPago");

    btnFinalizarCompra.addEventListener("click", function () {
        const carrito = document.getElementById("contenedorCarritoCompra");
        if (carrito) {
            carrito.classList.add('hiddenCart');
        }
        if (formularioPago) {
            formularioPago.style.display = "block";
        }
        if (btnCart) {
            btnCart.click();
        }
    });

});

/* REINICIAR CARRITO */

const btnConfirmarCompra = document.getElementById('btnConfirmar');

btnConfirmarCompra.addEventListener('click', async function (event) {
    event.preventDefault(); 
    if (validarCompra()) {
        await reiniciarCarrito();
        await mostrarMensajePagoExitoso();
    }
});

async function mostrarMensajePagoExitoso() {
    return new Promise(resolve => {
        toastr.success('Pago exitoso', '', {
            positionClass: 'toast-bottom-center',
            closeButton: false,
            timeOut: 5000,
            progressBar: false,
            tapToDismiss: false,
            class: 'toastr-custom',
            onClose: function () {
            setTimeout(function () {
                resolve();
            }, 1500);
            },
        });
    });
}


// VALIDACION FORMULARIO // 

function validarCompra() {
    const nombreInput = document.getElementById('nombre');
    const numeroTarjetaInput = document.getElementById('tarjeta');
    const codigoSeguridadInput = document.getElementById('codigo');
    const fechaInput = document.getElementById('vencimiento');
    const metodoPagoSelect = document.getElementById('seleccionPago');

    if (!/^[a-zA-Z\s]+$/.test(nombreInput.value)) {
        mostrarError('Ingresar solo letras en el nombre');
        return;
    }

    const numeroTarjeta = numeroTarjetaInput.value.replace(/\s/g, '');
    if (!/^\d{11}$/.test(numeroTarjeta)) {
        mostrarError('Cantidad de números incorrectos en la tarjeta');
        return;
    }

    if (!/^\d{1,4}$/.test(codigoSeguridadInput.value)) {
        mostrarError('Código incorrecto');
        return;
    }

    if (!fechaInput.value) {
        mostrarError('Completar fecha de vencimiento');
        return;
    }

    if (metodoPagoSelect.value === '0') {
        mostrarError('Completar método de pago');
        return;
    }

    document.getElementById('formularioPago').submit(
        reiniciarCarrito(),
        mostrarMensajePagoExitoso()
    );
}

function reiniciarCarrito (){
    localStorage.removeItem("carrito");
    todosLosProductos = [];
    showHTML();
}


// MENSAJES TOASTR //

function mostrarError(mensaje) {
    toastr.error(mensaje, '', {
        positionClass: 'toast-bottom-center',
        closeButton: false,
        timeOut: 2000,
        progressBar: false,
        tapToDismiss: false,
        class: 'toastr-custom-error',
    });
}

toastr.success('Pago exitoso', '', {
    positionClass: 'toast-bottom-center',
    closeButton: false,
    timeOut: 2000,
    progressBar: false,
    tapToDismiss: false,
    class: 'toastr-custom',
    onClose: function () {
        setTimeout(function () {
        }, 1500);
    },
});





