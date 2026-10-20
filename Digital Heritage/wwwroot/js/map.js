console.log("DIGITAL HERITAGE MAP LOADED");


window.initKurdistanMap = function (elementId) {


    console.log("INIT MAP STARTED");



    const map = L.map(elementId, {

        zoomControl:true,

        attributionControl:true

    })
    .setView(
        [36.2,44.5],
        6
    );





    // Dark museum style map

    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {

            attribution:
            "© OpenStreetMap contributors",

            maxZoom:10

        }

    ).addTo(map);







    /*
       Four cultural regions
    */


    const regions = [



        {

            id:"bakur",

            name:"BAKUR - Northern Kurdistan",

            color:"#8b2f1e",

            coords:[

                [39.8,38.0],
                [39.5,43.5],
                [37.0,44.0],
                [36.5,39.5]

            ],

            text:
            "Amed, Van, Mardin and Hakkari cultural region."

        },






        {

            id:"rojava",

            name:"ROJAVA - Western Kurdistan",

            color:"#315b5b",

            coords:[

                [37.8,38.0],
                [37.8,42.5],
                [35.5,42.0],
                [35.5,38.0]

            ],

            text:
            "Qamishlo, Kobane and western Kurdish heritage."

        },







        {

            id:"bashur",

            name:"BAŞÛR - Southern Kurdistan",

            color:"#b8860b",

            coords:[

                [37.5,42.5],
                [37.0,46.5],
                [34.5,46.5],
                [34.5,42.5]

            ],

            text:
            "Hewlêr, Duhok and Slemani cultural region."

        },








        {

            id:"rojhilat",

            name:"ROJHILAT - Eastern Kurdistan",

            color:"#556b2f",

            coords:[

                [36.5,45.0],
                [36.5,49.0],
                [33.5,49.0],
                [34.0,45.0]

            ],

            text:
            "Sine, Kermashan and Mahabad heritage."

        }


    ];










    regions.forEach(region=>{



        let area = L.polygon(

            region.coords,

            {


                color:"#e5c158",

                weight:2,


                fillColor:
                region.color,


                fillOpacity:.35


            }

        )
        .addTo(map);






        area.bindTooltip(

            region.name,

            {

                permanent:true,

                direction:"center",

                className:"region-label"

            }

        );







        area.bindPopup(

        `
        <div class="heritage-popup">

        <h3>
        ${region.name}
        </h3>

        <p>
        ${region.text}
        </p>

        </div>
        `

        );








        area.on(

            "mouseover",

            function(){


                this.setStyle({

                    fillOpacity:.7,

                    weight:4

                });


            }

        );






        area.on(

            "mouseout",

            function(){


                this.setStyle({

                    fillOpacity:.35,

                    weight:2

                });


            }

        );





    });









    /*
       Important cities
    */


    const cities = [


        ["Amed",37.91,40.23],

        ["Van",38.50,43.38],

        ["Hawlêr",36.19,44.01],

        ["Duhok",36.86,42.99],

        ["Slemani",35.56,45.43],

        ["Sine",35.31,46.99],

        ["Kermashan",34.31,47.07],

        ["Mahabad",36.76,45.72],

        ["Qamishlo",37.05,41.22]

    ];








    cities.forEach(city=>{


        L.marker(

            [
                city[1],
                city[2]
            ],

            {


                icon:

                L.divIcon({

                    className:
                    "city-label",

                    html:
                    `
                    <div>
                    ${city[0]}
                    </div>
                    `,


                    iconSize:
                    [120,40]

                })


            }


        )
        .addTo(map);



    });






};