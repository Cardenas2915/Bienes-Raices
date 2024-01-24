(function() {

    
    const lat = document.querySelector('#lat').value || 5.3358291;
    const lng = document.querySelector('#lng').value || -72.3853647;
    
    const mapa = L.map('mapa').setView([lat, lng ], 16);
    let marker;
    
    //utilizar Provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //el pin
    marker = new L.marker([lat, lng], {
        draggable: true, //para permitir mover el ping
        autoPan: true //centrar el mapa cada vez que se mueva el ping
    })
    .addTo(mapa)

    //detectar movimiento del pin
    marker.on('moveend', function (e) {

        //tomamos el evento
        marker = e.target
        
        //extraemos las pocision de latitud y longitud
        const pocision = marker.getLatLng();
        
        //centramos el mapa cada vez que se mueva el ping
        mapa.panTo(new L.latLng(pocision.lat, pocision.lng))

        //obtener la informacion de las calles al soltar el pin
        geocodeService.reverse().latlng(pocision, 17).run(function(error, resultado){
            // console.log(resultado);

            //generar globo con informacion
            marker.bindPopup(resultado.address.LongLabel)

            //llenar los campos de crear.pug
            document.querySelector('.calle').textContent = resultado?.address?.Address ?? "" ;
            document.querySelector('#calle').value = resultado?.address?.Address ?? "" ;
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? "" ;
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? "" ;
        })
    })

})()