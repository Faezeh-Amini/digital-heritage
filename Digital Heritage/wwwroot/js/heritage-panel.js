console.log("HERITAGE PANEL LOADED");


window.showHeritagePanel = function (data) {

    const panel =
        document.getElementById(
            "heritage-panel"
        );


    if (!panel)
        return;



    panel.innerHTML = `

    <div class="panel-card">

        <img src="${data.image}" />


        <h2>
            ${data.name}
        </h2>


        <span>
            ${data.category}
        </span>


        <p>
            ${data.description}
        </p>


    </div>

    `;


};