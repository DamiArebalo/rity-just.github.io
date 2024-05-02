// #region RECURSOS


//declaracion de elementos necesarios
const productContainer = document.querySelector('.contenedor-productos');
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let agregarCarrito = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");




//#region FUNCIONES

function actualizarOfertasCreadas (){
    let ofertas = productosenLS.filter(producto => producto.oferta > 0 )
    ofertasCreadasLS = ofertas
}

//si hay algo el array global es igual al de local storage
function productosCheck(){
    if(productosenLS){
     productos = productosenLS

    }else{
    productosenLS = []
    }
    //console.log(productos)
}

function carritoCheck(){
    if(CarritoLS){
        productosEnCarrito = CarritoLS
    }else{
        productosEnCarrito = []
    }
}

function offerChek(){
    if(ofertasCreadasLS){
        ofertasCreadas = ofertasCreadasLS
    }{
        ofertasCreadas = []
    }
}

//puesto de control
//console.log(ofertasCreadasLS)



//Funcion para saber si el precio actual es con oferta o es el precio de lista
function getPrecioActual(producto){
    if(producto.oferta>0){
        return(producto.oferta.toFixed(2))
    }else{
        return(producto.precioLista)
    }

}

//----CARD DE PRODUCTOS -----
// Función para crear una tarjeta de producto
function crearTarjetaProducto(producto) {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    productCard.innerHTML = `
        <img  src="${producto.img}" alt="${producto.nombre}">
        
            <h4 class="product-name">${producto.nombre}</h4>
            <p class="product-description">${producto.descripCorta}</p>
            <p class="product-price">$${getPrecioActual(producto)}</p>
            <button class="producto-agregar" id="${producto.id}">Agregar</button>
        
    `;

    return productCard;
}

function crearTarjetaAgotado(producto) {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    productCard.innerHTML = `
        <img  src="${producto.img}" alt="${producto.nombre}">
        
            <h4 class="product-name">${producto.nombre}</h4>
            <p class="product-description">${producto.descripCorta}</p>
            <p class="product-price">$${getPrecioActual(producto)}</p>
            <button disabled class="producto-agregar" id="agotado"> SIN STOCK </button>
        
    `;

    return productCard;
}

// Agregar las tarjetas de productos al DOM
function agregarProductoAlDOM(productosElegidos) {
    
    if(productContainer!=null){
        productContainer.innerHTML=" "

        productosElegidos.forEach((producto,) =>{
            let mismoProductoCarrito = productosEnCarrito.find(carrito => carrito.id = producto.id)
            if(mismoProductoCarrito == undefined){
                if(producto.stock<=0){
                    let productoAgotado = crearTarjetaAgotado(producto)
                    productContainer.appendChild(productoAgotado)
        
                }else{
                    let productCard = crearTarjetaProducto(producto)
                    productContainer.appendChild(productCard);
                }
            }else{
                if(producto.stock<=0||mismoProductoCarrito.cantidad >= mismoProductoCarrito.stock){
                    let productoAgotado = crearTarjetaAgotado(producto)
                    productContainer.appendChild(productoAgotado)
        
                }else{
                    let productCard = crearTarjetaProducto(producto)
                    productContainer.appendChild(productCard);
                }
            }
            //console.log(productosEnCarrito   
            actualizaragregarCarrito();
            //console.log(agregarCarrito)
        })
        
        
    }
    

    
}

//funcion para guardar el array productos en el LocalStorage
function alamacenArray() {
    productosenLS = productos
    localStorage.setItem("array-productos", JSON.stringify(productosenLS));
}


//#region FORMUALRIOS
//-------------------EVENTOS DE FORMULARIO-------------


//EVENTO POR CADA CLICK EN CAMBIO DE CATEGORIA
botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {

        //RECORRO TODO LOS BOTONES Y LES SACO LA CLASE QUE MUESTRA ACTIVO
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
         
        
        //AL QUE **SI** ESTOY CLICKEANDO LO DEJA ACTIVO
        e.currentTarget.classList.add("active");
       //console.log(e.currentTarget.innerText)
    
        //SI EL ID DEL BOTON QUE ESTOY CLICKEANDO ES DISTINTO A TODOS.. 
        if (e.currentTarget.id!= "todos") {

            // CAMBIO EL TITULO DE LA BUSQUEDA
            tituloPrincipal.innerText = e.currentTarget.innerText ;

            //GUARDO EL ID DEL PRODUCTO === ID DEL BOTON
            const productosBoton = productos.filter(producto => producto.categoria === e.currentTarget.id);

            //MUESTRO LOS PRODUCTOS DE ESA CATEGORIA
            agregarProductoAlDOM(productosBoton);

        } else {
            //SI ES TODOS MUESTRA TODOS LOS PRODUCTOS
            tituloPrincipal.innerText = "Todos los productos";
            agregarProductoAlDOM(productos);
        }

    })
});

function actualizarVistaProductos(){
    let idElementoActivo
    botonesCategorias.forEach(boton =>{
        if (boton.classList.contains('active')) {
            // Guardamos el ID en la variable global
            idElementoActivo = boton.id;
        }
        console.log(idElementoActivo)
    })

    let productosBuscados = productos.filter(producto => producto.categoria == idElementoActivo);
    console.log(productosBuscados)
    if(idElementoActivo=="todos"){
        agregarProductoAlDOM(productos)

    }else{
        agregarProductoAlDOM(productosBuscados)
    }
    ;
}



//#region CARRITO
//----------------------CARRITO---------------

function agregarCarritoOferta() {
    //actualizo contenido
    let agregarCarritoOfertas = document.querySelectorAll(".producto-agregar-offer");

    console.log(agregarCarritoOfertas)
    //recorro todo los botones de las cards y al que le haga clik lo agrega al carrito
    agregarCarritoOfertas.forEach(boton => {
        boton.addEventListener("click",agregarAlCarrito);


    });
}

//BOTON PARA AGREGAR AL CARRITO
function actualizaragregarCarrito() {
    //actualizo contenido
    agregarCarrito = document.querySelectorAll(".producto-agregar");
    agregarCarrito.forEach(boton=>{
        boton.addEventListener("click", agregarAlCarrito)
    })

}


//FUNCION DE BOTON AGREGAR AL CARRITOO
function agregarAlCarrito(e) {
    //TOMO EL BOTON CLICKEADO
    const idBoton = e.currentTarget.id;
    let parseID = Number(idBoton)

    

    //BUSCO EL OBJETO PRODUCTO QUE SE SELECCIONO
    let productoAgregado = productos.find(producto => producto.id === parseID);

    carritoCheck()

    
    try {
        // SI ESTA EN CARRITO SUMO 1 A LA CANTIDAD
        if(productosEnCarrito.some(producto => producto.id === parseID)) {
            // BUSCO LA POSICION DEL PRODUCTO
            const index = productosEnCarrito.findIndex(producto => producto.id === parseID);
            let productoenCurso = productosEnCarrito[index];

            if(productoenCurso.cantidad >= productoenCurso.stock){
                throw new Error('Cantidad Maxima Alcanzada') 
            }else{
                // SUMO CANTIDAD
                productoenCurso.cantidad++;
            }

            
        } else {  
            // ARRANCA EN UNO
            productoAgregado.cantidad = 1;
            // PUSHEO A CARRITO
            productosEnCarrito.push(productoAgregado);
        }
    
        Toastify({
            text: "✅Agregado al Carrito",
            className: "info",
            duration: 3000,
            close: true,
            position: "center", 
            style: {
                background: "linear-gradient(to left, #34c765, #054d33)",
            }
        }).showToast();
    } catch (error) {
        console.error(error);
    } finally {


        actualizarVistaProductos();
        actualizarOfertasCreadas();

        agregarOfertasDOM(ofertasCreadasLS)

        actualizarNumerito();
        console.log(productosEnCarrito)
        //GUARDO EN LOCALSTORAGE EL CARRITO
        
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
        

    }
    

    
}

let numeritoActual

//FUNCION PARA ACTUALIZAR EL PREVIEW DEL CARRITO
 function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
    numeritoActual = nuevoNumerito
    //console.log(numeritoActual)
}


//#region OFERTAS 
//------------------SECCION OFERTAS-------------
const ofertas = document.querySelector("#ofertas-DOM")


//FUNCION PARA ACTUALIZAR ARRAY OFERTAS
function checkOffer (){
    return (productos.some((producto) => producto.oferta > 0)) 
     
}

function crearTarjetaOferta(producto) {
    const offerCard = document.createElement('div');
    offerCard.classList.add('product-card');

    offerCard.innerHTML = `
        <img class="img-offer" src="${producto.img}" alt="${producto.nombre}">
        <h4 class="product-name">${producto.nombre}</h4>
        <p class="product-description">${producto.descripCorta}</p>
        <div class="precio-oferta">
            <p class="offer-price">$${producto.oferta.toFixed(2)}</p>
            <p class="descuento">%${producto.descuento}</p>
        </div>
        <button class="producto-agregar-offer" id="${producto.id}">Agregar</button>
    
    `;

    return offerCard;
}

function crearTarjetaOfertaAgotado(producto) {
    const offerCard = document.createElement('div');
    offerCard.classList.add('product-card');

    offerCard.innerHTML = `
        <img class="img-offer" src="${producto.img}" alt="${producto.nombre}">
        <h4 class="product-name">${producto.nombre}</h4>
        <p class="product-description">${producto.descripCorta}</p>
        <div class="precio-oferta">
            <p class="offer-price">$${producto.oferta}</p>
            <p class="descuento">%${producto.descuento}</p>
        </div>
        <button disabled class="producto-agregar-offer" id="agotado"> Sin Stock </button>
    
    `;

    return offerCard;
}

function agregarOfertasDOM (ofertasNuevas){

    if(ofertas != null){
        ofertas.innerHTML = " "
        ofertasCreadas = Array.from(ofertasCreadas)
       
    
        ofertasNuevas.forEach((producto) =>{
            let mismoProductoCarrito = productosEnCarrito.find(carrito => carrito.id = producto.id)
            
            if(mismoProductoCarrito == undefined){
                if(producto.stock<=0){
                
                    let ofertaAgotada = crearTarjetaOfertaAgotado(producto)
                    ofertas.appendChild(ofertaAgotada);
                }
                else{
        
                    let productCard = crearTarjetaOferta(producto)
                    ofertas.appendChild(productCard);
                }
            }else{
                if(producto.stock<=0||mismoProductoCarrito.cantidad >= mismoProductoCarrito.stock){
                
                    let ofertaAgotada = crearTarjetaOfertaAgotado(producto)
                    ofertas.appendChild(ofertaAgotada);
                }
                else{
        
                    let productCard = crearTarjetaOferta(producto)
                    ofertas.appendChild(productCard);
                }
            }
        })
        agregarCarritoOferta()   
    }
    
    

    
}

//#region RELOAD
//-------------EVENTO DE RECARGA DE PAGINA ------------------

document.addEventListener("DOMContentLoaded", ()=>{
    
   
    if(carritoLs!=null && carritoLs.length!=0){
        numeritoActual = carritoLs.reduce((acc, producto) => acc + producto.cantidad, 0);
    }
    
    
    if(numerito != null){
        //Cambia numerito
        if(numeritoActual< 0 || numeritoActual==undefined){
            numerito.innerText = 0;
        }else{
            numerito.innerText = numeritoActual;
        }

    }
    
    

    productos = productosenLS
    
    //AGREGA PRODUCTOS Y OFERTAS AL DOM
    offerChek()
    
    actualizarOfertasCreadas()

    agregarProductoAlDOM(productosenLS)
    productosCheck()
    agregarOfertasDOM(ofertasCreadasLS)
    
})




