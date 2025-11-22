const productos = {
  almacen: [
    {nombre:"Arroz Gallo 1 kg", precio:350, img:"arroz.jpg"},
    {nombre:"Yerba Mate 1 kg", precio:1200, img:"yerba.jpg"},
    {nombre:"Detergente 1 L", precio:800, img:"detergente.jpg"}
  ],
  indumentaria: [
    {nombre:"Remera Urbana Hombre", precio:2500, img:"remera.jpg"},
    {nombre:"Zapatilla Running", precio:8500, img:"zapa.jpg"},
    {nombre:"Buzo Niño", precio:3200, img:"buzo.jpg"}
  ],
  electro: [
    {nombre:"Pava Eléctrica", precio:5500, img:"pava.jpg"},
    {nombre:"Auriculares Bluetooth", precio:3200, img:"auris.jpg"},
    {nombre:"Lámpara LED", precio:1800, img:"lampara.jpg"}
  ]
};

function armarGrilla(seccion, data){
  const grilla = document.getElementById(seccion);
  data.forEach(p=>{
    grilla.innerHTML += `
      <div class="tarjeta">
        <img src="img/productos/${p.img}" alt="${p.nombre}">
        <h4>${p.nombre}</h4>
        <div class="precio">$${p.precio}</div>
        <a class="btn-wsp" href="https://wa.me/5493624840349?text=Hola,%20quiero%20${encodeURIComponent(p.nombre)}%20($${p.precio})" target="_blank">Pedir por WhatsApp</a>
      </div>`;
  });
}

armarGrilla('almacen', productos.almacen);
armarGrilla('indumentaria', productos.indumentaria);
armarGrilla('electro', productos.electro);