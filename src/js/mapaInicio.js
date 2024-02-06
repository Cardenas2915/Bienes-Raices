(function() {

    const lat = 5.3358291;
    const lng = -72.3853647;
    
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 16);
    let markes = new L.FeatureGroup().addTo(mapa)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);
    
    //*api para obtener las propiedades 
    const obtenerPropiedades = async () => {
        try {
            
            const url = '/api/propiedades'
            const respuesta = await fetch(url)
            const propiedades = await respuesta.json()

            mostrarPropiedades(propiedades)

        } catch (error) {
            console.log(error)
        }
    }

    const mostrarPropiedades = propiedades => {

        propiedades.forEach(propiedad => {
            //agregar los pines en el mapa
            const marker = new L.marker([ propiedad?.lat, propiedad?.lng ], {
                autoPan: true //centrar la vista cada vez que se de click en el pin
            })
            .addTo(mapa) //agregar al mapa
            .bindPopup(`
            
                <p class="text-indigo-600 font-bold">${propiedad?.categoria.nombre}</p>
                <h1 class="text-xl font-extrabold uppercase my-2">${propiedad?.titulo}</h1>
                <img src="/uploads/${propiedad?.imagen}" alt="Imagen de la propiedad ${propiedad?.titulo}">
                <p class="text-gray-600 font-bold">${propiedad?.precio.nombre}</p>
                <a href="/propiedad/${propiedad?.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase text-white rounded">Ver propiedad</a>
                
            `) //mostrar info cada vez que se de click

            markes.addLayer(marker)
        });
    }


    obtenerPropiedades()
})()