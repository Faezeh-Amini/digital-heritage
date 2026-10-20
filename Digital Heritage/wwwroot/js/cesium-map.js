window.CESIUM_BASE_URL = '_content/Digital_Heritage/lib/cesium/';
// یا بسته به ساختار پروژه شما:
window.CESIUM_BASE_URL = '/lib/cesium/';

console.log("CESIUM 3D LOADED");


window.initCesiumMap = async function (containerId) {


    console.log("CESIUM START");



    Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IkdZN09ldEU4aFh4Si1Vd0YiLCJqdGkiOiI0ODkwN2VmMS1iZDI0LTQwNjMtYWUwZi03NDkyNDYxNmE5NmMiLCJpZCI6NTA3MDYzLCJzdWIiOiJGYWV6ZWgtQW1pbmkiLCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoiVW50aXRsZWQiLCJpYXQiOjE3OTA0NjE1NDJ9.2EsICSyl7UszQFRDqDYTTlHE2X-8ezF-qaeozwdxaEc";



    const terrainProvider =
        await Cesium.createWorldTerrainAsync();




    const viewer = new Cesium.Viewer(

        containerId,

        {

            terrainProvider: terrainProvider,


            animation: false,

            timeline: false,

            baseLayerPicker: false,

            geocoder: false,

            homeButton: false,

            sceneModePicker: false,

            navigationHelpButton: false,

            fullscreenButton: false


        }

    );




    console.log("MAP READY");




    // ===============================
    // SATELLITE
    // ===============================


    viewer.imageryLayers.removeAll();


    viewer.imageryLayers.addImageryProvider(

        await Cesium.IonImageryProvider.fromAssetId(2)

    );



    console.log("SATELLITE READY");





    // ===============================
    // ATMOSPHERE
    // ===============================


    viewer.scene.globe.enableLighting = true;


    viewer.scene.globe.showGroundAtmosphere = true;


    viewer.scene.skyAtmosphere.show = true;


    viewer.scene.verticalExaggeration = 1.4;


    viewer.scene.globe.depthTestAgainstTerrain = true;






    // ===============================
    // Approximate cultural-region overlay. These polygons are illustrative, not official borders.
    try {
        const regionSource = await Cesium.GeoJsonDataSource.load("/data/kurdistan-regions.geojson", { clampToGround: true, strokeWidth: 3 });
        const regionColors = { "BAKUR": "#d5b574", "ROJAVA": "#82a891", "BAŞÛR": "#d68c55", "ROJHILAT": "#9f8abd" };
        regionSource.entities.values.forEach(entity => {
            if (!entity.polygon) return;
            const color = Cesium.Color.fromCssColorString(regionColors[(entity.name || "").toUpperCase()] || "#d5b574");
            entity.polygon.material = color.withAlpha(0.18);
            entity.polygon.outline = true;
            entity.polygon.outlineColor = color;
        });
        await viewer.dataSources.add(regionSource);
        console.log("CULTURAL REGIONS READY");
    } catch (e) { console.warn("REGION OVERLAY UNAVAILABLE", e); }

    const regionLabels = [
        ["BAKÛR", 42.1, 38.7, "#d5b574"], ["ROJAVA", 40.0, 36.7, "#82a891"],
        ["BASHÛR", 44.1, 36.0, "#d68c55"], ["ROJHILAT", 47.0, 35.2, "#9f8abd"]
    ];
    regionLabels.forEach(region => viewer.entities.add({
        name: region[0], position: Cesium.Cartesian3.fromDegrees(region[1], region[2], 2500),
        label: { text: region[0], font: "15px sans-serif", style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            fillColor: Cesium.Color.fromCssColorString(region[3]), outlineColor: Cesium.Color.BLACK, outlineWidth: 3,
            showBackground: true, backgroundColor: Cesium.Color.BLACK.withAlpha(0.48), pixelOffset: new Cesium.Cartesian2(0, -8),
            disableDepthTestDistance: 3000000, scaleByDistance: new Cesium.NearFarScalar(300000, 1.0, 1800000, 0.65) }
    }));
    // CAMERA KURDISTAN
    // ===============================


    // Aim at an inland cultural-region center so the view stays off the Caspian Sea.
    viewer.camera.flyToBoundingSphere(
        new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(43.7, 36.0, 780000)),
        {
            duration: 7,
            offset: new Cesium.HeadingPitchRange(
                Cesium.Math.toRadians(-15),
                Cesium.Math.toRadians(-55),
                2100000
            )
        }
    );







    // ===============================
    // CITIES
    // ===============================


    // Load city facts and marker locations from the editable archive data.
    try {
        const cityResponse = await fetch("/data/cities.json");
        if (!cityResponse.ok) throw new Error(`City data request failed: ${cityResponse.status}`);
        const cities = await cityResponse.json();
        cities.forEach(city => viewer.entities.add({
            id: `city-${city.id}`,
            name: city.mapName || city.name,
            properties: city,
            position: Cesium.Cartesian3.fromDegrees(city.longitude, city.latitude, 0),
            point: { pixelSize: 14, heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                color: Cesium.Color.fromCssColorString("#e4c47f"), outlineColor: Cesium.Color.BLACK, outlineWidth: 2 },
            label: { text: city.mapName || city.name, font: "15px Georgia", heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                fillColor: Cesium.Color.WHITE, outlineColor: Cesium.Color.BLACK, outlineWidth: 3,
                scaleByDistance: new Cesium.NearFarScalar(350000, 1.0, 2000000, 0.65), disableDepthTestDistance: 2500000 }
        }));
        const cityList = document.getElementById("city-list");
        const citySearch = document.getElementById("city-search");
        const escapeCity = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]));
        const cityUi = {
            en:{title:"Cities",searchLabel:"Find a city",placeholder:"Search cities…",all:"All regions",empty:"No cities match your search."},
            de:{title:"Städte",searchLabel:"Stadt suchen",placeholder:"Städte suchen…",all:"Alle Regionen",empty:"Keine passende Stadt gefunden."},
            ku:{title:"شارەکان",searchLabel:"گەڕان بەدوای شارێکدا",placeholder:"گەڕان لە شارەکان…",all:"هەموو هەرێمەکان",empty:"هیچ شارێک نەدۆزرایەوە."}
        };
        const cityLang = () => { const lang=document.documentElement.lang||"en"; return lang==="ckb"?"ku":lang; };
        const renderCityList = () => {
            if (!cityList || !citySearch) return;
            const lang=cityLang(); const labels=cityUi[lang]||cityUi.en;
            document.getElementById("city-list-title").textContent=labels.title;
            document.querySelector(".city-search-label").textContent=labels.searchLabel;
            citySearch.placeholder=labels.placeholder;
            const term=citySearch.value.trim().toLocaleLowerCase();
            const matches=cities.filter(city => `${city.name} ${city.region} ${city.id}`.toLocaleLowerCase().includes(term));
            document.getElementById("city-count").textContent=String(matches.length);
            const regions=["Rojhilat","Bakûr","Rojava","Bashûr"];
            const regionalFallback={Rojhilat:"/images/heritage/kurdistan-landscape.jpg",Bakûr:"/images/heritage/kurdistan-landscape.jpg",Rojava:"/images/heritage/kurdistan-landscape.jpg",Bashûr:"/images/heritage/kurdistan-landscape.jpg"};
            const cityFallback={baneh:"/images/heritage/3rd_Edition_of_Halparke_Festival_in_Baneh_2019-04-16_07.jpg",halabja:"/images/heritage/Halabja.webp",koya:"/images/heritage/Palangan_village.jpg",soran:"/images/heritage/Palangan_village.jpg",saqqez:"/images/heritage/jina%20amini.jfif",marivan:"/images/heritage/Hawraman_2019-08-30_06.jpg",kobane:"/images/heritage/Qada%20Jina%20Azad,%20Kobanê.jpg"};
            const cityImage=city=>city.gallery?.find(item=>item?.src?.startsWith("/images/"))?.src || (city.image?.startsWith("/images/")?city.image:"") || cityFallback[city.id] || regionalFallback[city.region] || "/images/heritage/kurdistan-landscape.jpg";
            cityList.innerHTML=matches.length ? regions.map(region => {
                const group=matches.filter(city=>city.region===region);
                if(!group.length)return "";
                const heading=lang==="ku"?({"Bakûr":"باکوور","Rojava":"ڕۆژاڤا","Bashûr":"باشوور","Rojhilat":"ڕۆژهەڵات"}[region]):lang==="de"?({"Bakûr":"Nordkurdistan","Rojava":"Rojava","Bashûr":"Südkurdistan","Rojhilat":"Ostkurdistan"}[region]):region;
                return `<div class="city-list-region">${escapeCity(heading)}</div>${group.map(city=>`<button type="button" class="city-list-button" data-city-id="${escapeCity(city.id)}"><img class="city-list-photo" src="${escapeCity(cityImage(city))}" alt="" loading="lazy" onerror="this.onerror=null;this.src=&apos;/images/heritage/kurdistan-landscape.jpg&apos;"><span class="city-list-name">${escapeCity(city.mapName || city.name)}</span></button>`).join("")}`;
            }).join("") : `<p class="city-list-empty">${labels.empty}</p>`;
            cityList.querySelectorAll("[data-city-id]").forEach(button=>button.addEventListener("click",()=>{
                const city=cities.find(item=>item.id===button.dataset.cityId);
                if(!city)return;
                if(!city.image)city.image=cityImage(city);
                viewer.camera.flyTo({destination:Cesium.Cartesian3.fromDegrees(city.longitude,city.latitude,30000),orientation:{heading:Cesium.Math.toRadians(-15),pitch:Cesium.Math.toRadians(-42),roll:0},duration:2.2});
                showPanel(city);
            }));
        };
        citySearch?.addEventListener("input",renderCityList);
        renderCityList();
        window.addEventListener("digital-heritage-language-change",renderCityList);
        console.log(`CITY ARCHIVE READY: ${cities.length} cities`);
    } catch (e) { console.warn("CITY ARCHIVE UNAVAILABLE", e); }







    // ===============================
    // HERITAGE DATA
    // ===============================



    try {


        const response =

            await fetch("/data/heritage.json");



        const data =

            await response.json();





        const mapLanguage = () => { const lang=document.documentElement.lang||"en"; return lang==="ckb"?"ku":lang; };
        data.places.forEach(place => {


            viewer.entities.add({



                id: place.id,


                name: place.name,


                properties: place,



                position:

                    Cesium.Cartesian3.fromDegrees(

                        place.longitude,

                        place.latitude,

                        place.height

                    ),




                point: {
                    pixelSize: 14,
                    color: place.category === "Archaeological Site" ? Cesium.Color.GOLD : Cesium.Color.ORANGE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2
                },
                label: {
                    text: place.names?.[mapLanguage()] || place.name,
                    font: "15px Georgia",
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 3,
                    scaleByDistance: new Cesium.NearFarScalar(350000, 1.0, 2000000, 0.65),
                    disableDepthTestDistance: 2500000
                }


            });



        });



        window.addEventListener("digital-heritage-language-change", () => data.places.forEach(place => { const entity=viewer.entities.getById(place.id); if(entity?.label) entity.label.text=place.names?.[mapLanguage()] || place.name; }));
        console.log("HERITAGE READY");


    }

    catch (e) {

        console.log(
            "HERITAGE ERROR",
            e
        );

    }








    // ===============================
    // ERBIL MODEL
    // ===============================


    viewer.entities.add({


        name: "Erbil Citadel 3D",



        position:

            Cesium.Cartesian3.fromDegrees(

                44.009,

                36.191,

                450

            ),



        model:
        {

            uri: "/models/erbil.glb",

            scale: 5

        }



    });







    // ===============================
    // CLICK
    // ===============================


    const handler =

        new Cesium.ScreenSpaceEventHandler(

            viewer.scene.canvas

        );





    handler.setInputAction(function (click) {



        const picked =

            viewer.scene.pick(click.position);




        if (!Cesium.defined(picked))

            return;




        const entity = picked.id;
        if (!entity || !entity.properties) return;
        const rawProperties = typeof entity.properties.getValue === "function"
            ? entity.properties.getValue(viewer.clock.currentTime)
            : entity.properties;
        const place = rawProperties || {};
        const longitude = Number(place.longitude);
        const latitude = Number(place.latitude);
        if (!Number.isFinite(longitude) && !place.theme && !place.description) return;
        if (Number.isFinite(longitude) && Number.isFinite(latitude)) {
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 26000),
                duration: 2.5
            });
        }
        showPanel(place);



    },

        Cesium.ScreenSpaceEventType.LEFT_CLICK);







    // ===============================
    // PANEL
    // ===============================



    async function loadOpenMedia(place) {
        const container = document.getElementById("city-media-results");
        if (!container) return;
        const cityId = String(place.id || place.name || "");
        container.dataset.cityId = cityId;
        container.innerHTML = `<p class="media-loading">${currentPanelText("loading")}</p>`;
        const query = String(place.mediaSearch || `${place.name || "Kurdish heritage"} cultural heritage`);
        const escapeMedia = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char]));
        const plainMeta = value => String(value?.value || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();
        const search = async kind => {
            const limit = kind === "video" ? 2 : 4;
            const terms = [...new Set([query, String(place.name || ""), `${String(place.name || "")} ${String(place.region || "")}`].filter(Boolean))];
            const results = new Map();
            for (const term of terms) {
                const params = new URLSearchParams({ action: "query", generator: "search", gsrnamespace: "6", gsrlimit: "8",
                    gsrsearch: `filetype:${kind} ${term}`, prop: "imageinfo", iiprop: "url|mime|extmetadata", iiurlwidth: "640", format: "json", origin: "*" });
                const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`);
                if (!response.ok) throw new Error(`Commons responded ${response.status}`);
                const data = await response.json();
                Object.values(data.query?.pages || {}).forEach(page => {
                    const info = page.imageinfo?.[0];
                    const mime = info?.mime || "";
                    const normalizedTitle = String(page.title || "").replace(/_/g, " ").toLowerCase();
                    const metadataText = [normalizedTitle, plainMeta(info.extmetadata?.ImageDescription), plainMeta(info.extmetadata?.ObjectName), plainMeta(info.extmetadata?.Credit), plainMeta(info.extmetadata?.Categories)].join(" ").toLowerCase();
                    const excludedMedia = /(sanandaj,? kurdistan,? iran\s*[-–—]\s*panorami|president hassan rouhani meets orphans|islamic republic of iran army day|reginald johns, an officer in the usaf|original bomb casing used as flower pot.*halabja memorial|wall of names of victims of 1988 chemical attack.*halabja memorial|detail of truck used by bakhtiar awmar with bomb casing.*halabja memorial|halabja memorial|chemical attack.*halabja|halabja.*chemical attack|ravayat[- ]e fath|islamic revolutionary guard|revolutionary guard corps|\\birgc\\b|\\bbasij\\b|ayatollah|khamenei|khomeini|rouhani|ebrahim raisi|masoud pezeshkian|qasem soleimani|qods force|iranian (?:army|military|soldiers?|police|policemen|security forces?|government officials?)|iran (?:army|military|police|security forces?|government officials?)|(?:president|army|military|soldier|police|policeman|security force) (?:of|in) iran|iranian president|iran president|supreme leader of iran|law enforcement command of iran|holy defense|sacred defen[cs]e|سپاه پاسداران|بسیج|نیروی انتظامی|ارتش جمهوری اسلامی|حسن روحانی|ابراهیم رئیسی|علی خامنه.?ای|آیت.?الله خامنه|خمینی|مسعود پزشکیان|روایت فتح|رهبر جمهوری اسلامی|نیروی قدس)/i.test(metadataText);
                    if (!excludedMedia && (kind === "video" ? mime.startsWith("video/") : mime.startsWith("image/")) && !results.has(page.title)) {
                        results.set(page.title, { page, info });
                    }
                });
                if (results.size >= limit) break;
            }
            return [...results.values()].slice(0, limit);
        };
        try {
            const [photos, videos] = await Promise.all([search("bitmap"), search("video")]);
            if (container.dataset.cityId !== cityId) return;
            const photoCards = photos.map(({ page, info }) => {
                const license = plainMeta(info.extmetadata?.LicenseShortName) || "See file page";
                const artist = plainMeta(info.extmetadata?.Artist) || "Creator listed on file page";
                const filePage = `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, "_"))}`;
                return `<article class="open-media-card"><button type="button" class="open-media-preview" data-image-url="${escapeMedia(info.thumburl || info.url)}" data-image-title="${escapeMedia(page.title.replace(/^File:/, ""))}" aria-label="Preview ${escapeMedia(page.title.replace(/^File:/, ""))} on this page"><img loading="lazy" src="${escapeMedia(info.thumburl || info.url)}" alt="${escapeMedia(page.title)}"><span>${escapeMedia(page.title.replace(/^File:/, ""))}</span></button><small>${escapeMedia(license)} · ${escapeMedia(artist)} · <a href="${escapeMedia(filePage)}" target="_blank" rel="noopener noreferrer">Source ↗</a></small></article>`;
            }).join("");
            const videoCards = videos.map(({ page, info }) => {
                const license = plainMeta(info.extmetadata?.LicenseShortName) || "See file page";
                const artist = plainMeta(info.extmetadata?.Artist) || "Creator listed on file page";
                const filePage = `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, "_"))}`;
                const poster = info.thumburl ? `poster="${escapeMedia(info.thumburl)}"` : "";
                return `<article class="open-video-card"><video controls preload="none" ${poster}><source src="${escapeMedia(info.url)}" type="${escapeMedia(info.mime)}"></video><a href="${escapeMedia(filePage)}" target="_blank" rel="noopener noreferrer">${escapeMedia(page.title.replace(/^File:/, ""))} ↗</a><small>${escapeMedia(license)} · ${escapeMedia(artist)}</small></article>`;
            }).join("");
            const noResults = !photoCards && !videoCards ? `<p class="media-loading">${currentPanelText("noResults")}</p>` : "";
            container.innerHTML = `<p class="media-note">${currentPanelText("mediaNote")}</p><div class="media-grid">${photoCards}</div><div class="video-grid">${videoCards}</div>${noResults}`;
            container.querySelectorAll(".open-media-preview").forEach(button => button.addEventListener("click", () => {
                const overlay = document.createElement("div");
                overlay.className = "media-image-preview";
                overlay.setAttribute("role", "dialog");
                overlay.setAttribute("aria-modal", "true");
                overlay.setAttribute("aria-label", button.dataset.imageTitle || "Image preview");
                const close = document.createElement("button");
                close.type = "button";
                close.className = "media-image-preview-close";
                close.textContent = "×";
                close.setAttribute("aria-label", "Close image preview");
                const image = document.createElement("img");
                image.src = button.dataset.imageUrl;
                image.alt = button.dataset.imageTitle || "Cultural heritage image";
                const caption = document.createElement("p");
                caption.textContent = button.dataset.imageTitle || "Cultural heritage image";
                const dismiss = () => { overlay.remove(); document.removeEventListener("keydown", onKeyDown); };
                const onKeyDown = event => { if (event.key === "Escape") dismiss(); };
                close.addEventListener("click", dismiss);
                overlay.addEventListener("click", event => { if (event.target === overlay) dismiss(); });
                overlay.append(close, image, caption);
                document.body.append(overlay);
                document.addEventListener("keydown", onKeyDown);
                close.focus();
            }));
        } catch (error) {
            if (container.dataset.cityId !== cityId) return;
            container.innerHTML = `<p class="media-loading">${currentPanelText("offline")}</p>`;
        }
    }
    let activePlaceForPanel = null;
    const panelText = {
        en: { close:"Close details", place:"PLACE / CULTURAL NOTE", archive:"Cultural archive", heritage:"Heritage", openSource:"Open source", sourceNeeded:"Add a verified local source before publication", media:"OPEN MEDIA · WIKIMEDIA COMMONS", loading:"Searching openly licensed photos and video…", mediaNote:"Open-media suggestions · photo previews stay on this page; use Source to review creator and reuse terms.", noResults:"No additional matching Commons files were found. Curated archive photos are shown above when available.", offline:"Media search needs an internet connection. Locally stored project photos remain available above." },
        de: { close:"Details schließen", place:"ORT / KULTURHINWEIS", archive:"Kulturarchiv", heritage:"Kulturerbe", openSource:"Quelle öffnen", sourceNeeded:"Vor der Veröffentlichung eine geprüfte lokale Quelle ergänzen", media:"FREIE MEDIEN · WIKIMEDIA COMMONS", loading:"Suche nach frei lizenzierten Bildern und Videos…", mediaNote:"Vorschläge aus offenen Medien · Vorschauen bleiben auf dieser Seite. Quelle für Urheber- und Lizenzangaben öffnen.", noResults:"Keine weiteren passenden Commons-Dateien gefunden. Kuratierte Archivbilder stehen oben, sofern vorhanden.", offline:"Für die Mediensuche ist eine Internetverbindung erforderlich. Lokal gespeicherte Bilder bleiben oben verfügbar." },
        ku: { close:"داخستنی زانیاریی شوێن", place:"شوێن / تێبینیی کولتووری", archive:"ئەرشیفی کولتووری", heritage:"میرات", openSource:"کردنەوەی سەرچاوە", sourceNeeded:"پێش بڵاوکردنەوە سەرچاوەیەکی ناوخۆیی پشتڕاستکراو زیاد بکە", media:"ڕەنگاڵەی کراوە · WIKIMEDIA COMMONS", loading:"وێنە و ڤیدیۆیەکانی مۆڵەت‌پێدراو دەگەڕێن…", mediaNote:"پێشنیاری میدیای کراوە · پێشبینینەکان لەم پەڕەیەدا دەمێننەوە. بۆ زانینی ناوی دروستکەر و مەرجەکانی بەکارهێنان سەرچاوە بکەرەوە.", noResults:"هیچ فایلێکی گونجاوی تری Commons نەدۆزرایەوە. ئەگەر وێنەی ئەرشیفی هەڵبژێردراو هەبێت، لە سەرەوە پیشان دەدرێت.", offline:"بۆ گەڕان لە میدیا پێویستە ئینتەرنێت هەبێت. وێنە ناوخۆییەکانی پڕۆژە لە سەرەوە بەردەستن." }
    };
    const placeText = {
        en: {
            "shanidar-cave":{theme:"Middle Paleolithic · Neanderthal site",summary:"This cave in the Bradost Mountains of Erbil Governorate yielded remains of several Neanderthals. Evidence represents at least two periods, around 75,000 and 45,000–50,000 years ago. Interpretations of mortuary practices remain under study."}
        },

        de: {
            "shanidar-cave":{theme:"Mittleres Paläolithikum · Neandertalerfundstelle",summary:"In dieser Höhle im Bradost-Gebirge in der Provinz Erbil wurden Überreste mehrerer Neandertaler ausgegraben. Die Funde gehören mindestens zwei Zeitabschnitten an: vor etwa 75.000 sowie vor etwa 45.000–50.000 Jahren. Deutungen möglicher Bestattungspraktiken werden weiter untersucht."},
            hawler:{theme:"Zitadelle und vielschichtige Stadtgeschichte",summary:"Die Zitadelle von Erbil ist eine befestigte Siedlung auf einem seit langer Zeit bewohnten Hügel. Ihr Straßenplan und die Siedlungsschichten eröffnen einen Zugang zur Stadtgeschichte."},
            duhok:{theme:"Landschaft und gemeinschaftliche Erinnerung",summary:"Die Fotos zeigen Duhok und die umliegenden Berge, Gewässer und Siedlungslandschaften. Einige Motive liegen im weiteren Gouvernement und nicht im Stadtzentrum."},
            akre:{theme:"Newroz-Fackelzug und Bergstadttradition",summary:"Akre ist für die Newroz-Feier bekannt, bei der Menschen Fackeln an den Berghängen tragen. Die Galerie zeigt das Fest als gemeinschaftliches Ereignis mit Feuer, Musik und Tanz."},
            slemani:{theme:"Literatur und kurdische Sprache",summary:"Sulaymaniyah ist eine UNESCO-Literaturstadt. Die UNESCO hebt das literarische Erbe und die Rolle des Sorani-Kurdischen im kulturellen Leben hervor."},
            amed:{theme:"Stadtmauern und Hevsel-Gärten",summary:"Die Festung Diyarbakır und die Hevsel-Gärten bilden eine UNESCO-Kulturlandschaft. Sie verbinden Stadtmauern, Gärten und die Lage am Tigris."},
            sine:{theme:"Musik und Daf-Tradition",summary:"Sanandaj ist eine UNESCO-Musikstadt. Das Profil hebt kurdische Musiker und das internationale Daf-Festival hervor. Palangan liegt separat in der Provinz Kurdistan."},
            kermanshah:{theme:"Bisotun und die Zagros-Landschaft",summary:"Bisotun liegt außerhalb der Stadt Kermanshah. Die monumentale Inschrift und das Relief wurden um 521 v. Chr. unter Dareios I. geschaffen. Drei Keilschriftfassungen dokumentieren seine Thronbesteigung."},
            "sarpol-e-zahab":{theme:"Anubanini-Relief und Lullubi-Geschichte",summary:"Das Anubanini-Relief zeigt einen Herrscher vor der Göttin Ishtar und besiegte Gefangene. Die Inschrift nennt den Lullubi-König; die genaue Datierung wird wissenschaftlich diskutiert."},
            mahabad:{theme:"Mündliche Geschichte und literarische Erinnerung",summary:"Die kurzlebige Republik Mahabad wurde 1946 ausgerufen. Das Ereignis ist ein wichtiges Kapitel der modernen kurdischen Geschichte."},
            mardin:{theme:"Historische Steinstadt",summary:"Mardins Altstadt liegt an einem Felsenhang und ist für ihre traditionelle Steinarchitektur bekannt. Der UNESCO-Tentativlistenstatus ist keine Welterbe-Einschreibung."},
            qamishlo:{theme:"Stimmen und lokales Kulturleben",summary:"Möglicher Schwerpunkt: Musik, Sprache und Alltag aus lokalen Perspektiven dokumentieren. Vor konkreten historischen Aussagen örtliche Mitwirkende und verlässliche Quellen einbeziehen."},
            zakho:{theme:"Delal-Brücke und Kleiner Zab",summary:"Die Delal-Brücke überspannt den Kleinen Zab im Zentrum von Zakho. Sie verbindet Architektur, Flusslandschaft und das Leben der Stadt."},
            wan:{theme:"Tushpa und historische Stadtschichten",summary:"Die UNESCO-Tentativliste zu Tushpa und der Festung Van dokumentiert Spuren verschiedener Epochen. Die Regionalgeschichte ist vielschichtig und lässt sich nicht auf eine Gemeinschaft reduzieren."},
            hakkari:{theme:"Gebirgswege und mündliche Erinnerung",summary:"1998 wurden nahe der Burg von Hakkari dreizehn figürlich bearbeitete Stelen entdeckt. Sie zählen zu den markanten archäologischen Funden der Region."},
            kirkuk:{theme:"Ein vielschichtiges Stadtarchiv",summary:"Die Zitadelle gehört zu den wichtigsten historischen Orten Kirkuks und steht auf der UNESCO-Vorschlagsliste. Zusammen mit der Qishla spiegelt sie die vielschichtige Stadtgeschichte."},
            koya:{theme:"Lokale Erzählungen und Lernen",summary:"Ortsnamen, mündliche Geschichte und kulturelle Praktiken mit Bewohnern und lokalen Einrichtungen sammeln und vor Veröffentlichung belegen."},
            soran:{theme:"Gebirgslandschaft und Gemeinschaftswissen",summary:"Die umliegende Landschaft mit lokalem Wissen und Alltag verbinden. Ein Gespräch oder ein Beitrag aus der Gemeinschaft kann den Eintrag vertiefen."},
            halabja:{theme:"Erinnerung und Widerstandskraft",summary:"Lokale Erinnerung sensibel behandeln und die Gemeinschaft über die Inhalte mitentscheiden lassen. Für Gespräche Einverständnis einholen und Quellen klar nennen."},
            saqqez:{theme:"Regionale Erzählungen und traditionelles Wissen",summary:"Lokale Berichte über Musik, Handwerk und Alltag sammeln. Den Bezug zu Saqqez mit örtlichen Kulturquellen prüfen."},
            baneh:{theme:"Landschaft, Handwerk und Handel",summary:"Das jährliche Halparke-Treffen in Baneh bringt kurdische Tanzgruppen zusammen. Die Projektfotos zeigen das Fest als heutiges kulturelles Ereignis."},
            urmia:{theme:"Sprachen und Stadtleben",summary:"Die vielfältige Sprach- und Kulturlandschaft durch mehrere zugeordnete Perspektiven darstellen. Keine einzelne Stimme als Gesamtbild der Stadt ausgeben."},
            batman:{theme:"Nachbarschaft und lebendige Kultur",summary:"Die Bilder zeigen auch Hasankeyf, eine historische Siedlung im Gouvernement Batman außerhalb der Stadt Batman. Diese Ansichten sind regionaler Kontext."},
            cizre:{theme:"Flusslandschaft und historische Erinnerung",summary:"Ortsnamen und Erinnerungen entlang des Tigris dokumentieren. Historische Erzählungen einer Epoche zuordnen und lokale Quellen nennen."},
            sirnak:{theme:"Gebirgswege und lokales Wissen",summary:"Festhalten, wie Bewohner die Landschaft, Wege und Traditionen beschreiben. Interviews als persönliche Zeugnisse kennzeichnen und die Sprecher nennen."},
            nusaybin:{theme:"Historisches Nisibis und Grenzland-Erinnerung",summary:"Nusaybin liegt am Ort des antiken Nisibis, einer alten Siedlung an historischen Wegen durch Obermesopotamien. Archäologische und religiöse Zeugnisse erinnern an verschiedene Epochen."},
            kobane:{theme:"Gemeinschaftliche Erinnerung und Gegenwartskultur",summary:"Lokale Mitwirkende sollen Geschichte und Kontext mitbestimmen. Für sensible Gegenwartsgeschichte Ersthandquellen nutzen und Einverständnis einholen."},
            afrin:{theme:"Landschaft, Landwirtschaft und lokale Erinnerung",summary:"Landschaft und gemeinschaftliches Wissen mit klar zugeordneten Quellen dokumentieren. Datierte und ortsbezogene Angaben, besonders zu jüngeren Ereignissen, prüfen."},
            amuda:{theme:"Sprache und Erzählungen der Gemeinschaft",summary:"Lokale Berichte über Sprache, Lesen, Musik und Alltag sammeln. Eine konkrete Tradition erst mit benannter Quelle als stadtweit darstellen."},
            derik:{theme:"Grenzlandschaft und lokales Wissen",summary:"Ortsnamen und gemeinschaftliches Wissen in der Umgebung dokumentieren. Schreibweise und kulturellen Zusammenhang mit lokalen Mitwirkenden prüfen."},
            tirbespiye:{theme:"Dorfnetzwerke und lebendiges Erbe",summary:"Ein lokal belegtes Handwerk, Lied oder eine mündliche Geschichte aus der Stadt und den Dörfern zeigen. Gemeinschaft und Aufnahmedatum nennen."},
            hasakah:{theme:"Viele Gemeinschaften, gemeinsame Stadtgeschichte",summary:"Die Stadt mit mehreren zugeordneten Stimmen und Sprachen darstellen. Keine Perspektive als vollständigen Bericht über alle Gemeinschaften behandeln."},
            marivan:{theme:"Zarivar-See und lokales Landschaftswissen",summary:"Die Fotos zeigen Hawraman und Bergdörfer in der weiteren Region um Marivan, nicht ausschließlich die Stadt. Sie verbinden Siedlung, Bergwege und Umweltwissen."},
            bukan:{theme:"Sprache, Musik und lokale Erinnerung",summary:"Lokale Erzählungen über Musik, Literatur und Alltag sammeln. Historische Angaben mit benannten Mitwirkenden und einer örtlichen Einrichtung belegen."},        },
        ku: {
            hawler:{theme:"Keleh û dîroka bajêr a çendqatî",summary:"Keleha Hewlêrê li ser girê ku ji demên dirêj ve tê niştecihkirin, niştecihiyeke xurtkirî ye. Rê û qatên niştecihbûnê deriyek ji bo dîroka bajêr vedikin."},
            duhok:{theme:"Peyzaj û bîranîna civakê",summary:"Wêneyan Duhok û çiya, av û peyzajên niştecihbûnê yên derdorê nîşan didin. Hin wêne ji navenda bajêr dûr in û li navçeya firehtir in."},
            akre:{theme:"Meşên agirê Newrozê û kevneşopiya bajarê çiyayî",summary:"Akrê bi pîrozbahiyên Newrozê tê naskirin; mirov agir li ser lêwarên çiyayan digerînin. Galerî cejnê wekî kombûneke civakî ya bi agir, muzîk û govendê nîşan dide."},
            slemani:{theme:"Wêje û zimanê kurdî",summary:"Silêmanî bajarê wêjeyê yê UNESCO ye. Mîrasa wêjeyî û rola kurdiya soranî di jiyana çandî de tê girîng dîtin."},
            amed:{theme:"Dîwarên bajar û baxçeyên Hewselê",summary:"Keleha Amedê û baxçeyên Hewselê bi hev re peyzajeke çandî ya UNESCO pêk tînin; dîwar, baxçe û cihê li kêleka çemê Dîcleyê girêdidin."},
            sine:{theme:"Muzîk û kevneşopiya defê",summary:"Sine bajarê muzîkê yê UNESCO ye. Di profîla bajêr de hunermendên kurd û Festîvala Navneteweyî ya Defê derdikevin pêş. Palengan gundekî cuda ye li parêzgeha Kurdistanê."},
            kermanshah:{theme:"Bîsûtûn û peyzajê Zagrosê",summary:"Bîsûtûn li derveyî bajarê Kirmaşanê ye. Nivîsara mezin û berhewaya wê li dora sala 521 berî zayînê bi fermana Daryûşê hatine çêkirin. Sê nivîsên mixî destpêka serdestiya wî vedibêjin."},
            "sarpol-e-zahab":{theme:"Nexşê Anubanînî û dîroka Lulubiyan",summary:"Nexşê Anubanînî serwerê Lulubiyan li ber Xwedawenda Îştar û girtiyên têkçûyî nîşan dide. Nivîsê padîşah nas dike; tarîxa rastîn hê jî mijara lêkolînê ye."},
            mahabad:{theme:"Dîroka devkî û bîranîna wêjeyî",summary:"Komara Mehabad di sala ١٩٤٦ de li vir ragihandin. Ev bûyer beşek girîng ji dîroka nûjen a siyasî û çandî ya kurd e."},
            mardin:{theme:"Bajarê kevirî yê dîrokî",summary:"Bajarê kevin ê Mêrdînê li ser lêwarekî zinarî ye û bi mîmariya kevirî tê naskirin. Lîsteya pêşniyarkirî ya UNESCO ne tomarkirina Mîrasa Cîhanê ye."},
            qamishlo:{theme:"Deng û jiyana çandî ya herêmî",summary:"Mijareke pêşniyarkirî: muzîk, ziman û jiyana rojane bi dengên herêmî belge bike. Berî îdiayên dîrokî çavkanî û beşdarên herêmî piştrast bike."},
            zakho:{theme:"Pira Delal û çemê Xabûrê biçûk",summary:"Pira Delal li navenda Zaxo çemê Xabûrê biçûk derbas dike. Ew mîmarî, çem û jiyana bajarê bi hev ve girêdide."},
            wan:{theme:"Tuşpa û qatên dîrokî yên bajêr",summary:"Lîsteya pêşniyarkirî ya UNESCO ya Tuşpa û keleha Wan şopên serdemên cuda tomar dike. Dîroka herêmê çendqatî ye û bi yek civakê nayê kurtkirin."},
            hakkari:{theme:"Rêyên çiyayan û bîranîna devkî",summary:"Di sala ١٩٩٨ de sêdeh stêlên kevirî yên bi wêneyên mirovan li nêzî Keleha Hekariyê hatin dîtin. Ew ji dîtinên arkeolojîk ên girîng ên herêmê ne."},
            kirkuk:{theme:"Arşîva bajarekî çendqatî",summary:"Qaleya Kerkûkê ji cihên dîrokî yên sereke yên bajêr e û di lîsteya pêşniyarkirî ya UNESCO de ye. Qishla û qele bi hev re qatên civakî yên dîrokê nîşan didin."},
            koya:{theme:"Çîrokên herêmî û fêrbûn",summary:"Navên cihan, dîroka devkî û pratîkên çandî bi niştecih û dezgehên herêmî re berhev bike û çavkaniya wan binivîse."},
            soran:{theme:"Peyzajê çiyayî û zanîna civakê",summary:"Peyzajê derdorê bi zanîna herêmî û jiyana rojane re girêde. Hevpeyvînek an nivîsek ji civakê dikare vê têketinê dewlemend bike."},
            halabja:{theme:"Bîranîn û berxwedan",summary:"Bîranîna herêmî bi hestiyarî nîşan bide û rêzê ji civakê re bihêle ku biryarê li ser naverokê bide. Ji bo hevpeyvînan destûrê bistîne."},
            saqqez:{theme:"Çîrokên herêmî û zanîna kevneşopî",summary:"Gotinên herêmî li ser muzîk, destkarî û jiyana rojane berhev bike. Têkiliya pratîkê bi bajarê Seqizê re ji çavkaniyên çandî bipirse."},
            baneh:{theme:"Peyzaj, destkarî û bazirganî",summary:"Destkariyek an bazarekê bi hunermendekî navdar belge bike û balê bide ser guhertina wê di demê de."},
            urmia:{theme:"Ziman û jiyana bajar",summary:"Pirzimanî û jiyana çandî ya bajêr bi gelek perspektîfên ku çavkaniya wan diyar e nîşan bide. Yek deng wekî tevahiya bajêr pêşkêş neke."},
            batman:{theme:"Tax û çanda zindî",summary:"Di wêneyan de Hasankeyf jî heye: bajarokekî arkeolojîk li parêzgeha Batmanê, li derveyî bajarê Batmanê. Ev dîmen çarçoveya herêmî nîşan didin."},
            cizre:{theme:"Peyzajê çem û bîranîna dîrokî",summary:"Navên cihan û bîranînan li ser rêça Dîcleyê belge bike. Çîrokên dîrokî bi serdemê ve girêde û çavkaniyên herêmî binivîse."},
            sirnak:{theme:"Rêyên çiyayan û zanîna herêmî",summary:"Nîşan bide ku niştecih peyzaj, rê û kevneşopiyan çawa rave dikin. Hevpeyvîn wekî şahidiya kesane nîşan bide û axêver binav bike."},
            nusaybin:{theme:"Nisîbîna dîrokî û bîranîna sînorê",summary:"Nisêbîn li ser cihê Nisîbîna kevnar e, niştecihbûneke dîrokî li ser rêyên Mezopotamyaya Jorîn. Şopên arkeolojîk û olî serdemên cuda vedibêjin."},
            kobane:{theme:"Bîranîna civakê û çanda hevçerx",summary:"Beşdarên herêmî divê dîrok û çarçoveyê diyar bikin. Ji bo dîroka nêzîk a hestiyar çavkaniyên rasterast û destûrê bikar bîne."},
            afrin:{theme:"Peyzaj, çandinî û bîranîna herêmî",summary:"Peyzaj û zanîna civakê bi çavkaniyên ku têne naskirin belge bike. Dîrok û îdiayên taybet ên cihê, bi taybetî yên nû, piştrast bike."},
            amuda:{theme:"Ziman û çîrokên civakê",summary:"Gotinên herêmî li ser ziman, xwendin, muzîk û jiyana rojane berhev bike. Berî ku kevneşopiyekê giştî ya bajarê bibêjî çavkaniyekê binav bike."},
            derik:{theme:"Peyzajê sînor û zanîna herêmî",summary:"Navên cihan û zanîna civakê li peyzajê derdorê belge bike. Rastnivîs û çarçoveya çandî bi beşdarên herêmî re piştrast bike."},
            tirbespiye:{theme:"Tora gundan û mîrasa zindî",summary:"Destkariyek, stranek an çîrokeke devkî ya herêmî ji bajar û gundên derdorê nîşan bide. Civaka çavkaniyê û tarîxa tomarkirinê binivîse."},
            hasakah:{theme:"Gelek civak, dîroka hevpar a bajar",summary:"Bajar bi gelek deng û zimanan nîşan bide û çavkaniya her yekê diyar bike. Tu perspektîfê wekî çîroka temam a hemû civakan pêşkêş neke."},
            marivan:{theme:"Gola Zarîvarê û zanîna peyzajê",summary:"Wêneyan Hawraman û gundên çiyayan ên herêma firehtir a nêzîkî Merîwanê nîşan didin, ne tenê bajar. Rêyên çiyayan û zanîna jîngehê girêdidin."},
            bukan:{theme:"Ziman, muzîk û bîranîna herêmî",summary:"Gotinên herêmî li ser muzîk, wêje û jiyana rojane berhev bike. Agahiyên dîrokî bi beşdarên navdar û dezgeheke herêmî piştrast bike."},        }
    };
    const soraniPlaces = {
        "shanidar-cave":{theme:"پارینەسنگیی ناوەڕاست · شوێنی نێئاندەرتاڵەکان",summary:"لە ئەم ئەشکەوتەی چیاکانی برادۆست لە پارێزگای هەولێر، ئێسکی چەند نێئاندەرتاڵێک دۆزراوەتەوە. بەڵگەکان لانیکەم دوو قۆناغ نیشان دەدەن: نزیکەی ٧٥ هەزار ساڵ و ٤٥ تا ٥٠ هەزار ساڵ لەمەوبەر. لێکدانەوەکان دەربارەی شێوازی ناشتن هێشتا بەردەوامن."},

        hawler:{theme:"قەڵا و مێژووی چەندچینی شار",summary:"قەڵای هەولێر لەسەر گردێکی کۆنی نیشتەجێبووە. نەخشەی کۆڵان و چینەکانی نیشتەجێبوون مێژووی شار دەردەخەن."},
        duhok:{theme:"دیمەنی سروشتی و بیرەوەریی کۆمەڵگە",summary:"وێنەکان دهۆک و چیا و ئاوی دەوروبەر پیشان دەدەن؛ هەندێک شوێن لە دەرەوەی ناوەندی شارە."},
        akre:{theme:"ئاگری نەورۆز و نەریتی شاری چیا",summary:"ئاکرێ بە ئاهەنگی نەورۆز و گەڕانی ئاگردان لەسەر لێژایی چیا ناسراوە؛ کۆبوونەوەیەکی کۆمەڵایەتییە بە مۆسیقا و گۆڤەند."},
        slemani:{theme:"ئەدەب و زمانی کوردی",summary:"سلێمانی شارێکی ئەدەبیی یونسکۆیە؛ میراتی ئەدەبی و ڕۆڵی کوردیی سۆرانی لە ژیانی ئەدەبیدا جەخت لێ کراوەتەوە."},
        amed:{theme:"دیواری شار و باخچەکانی حەوسەل",summary:"قەڵای دیاربەکر و باخچەکانی حەوسەل دیمەنێکی کولتووریی یونسکۆ پێک دەهێنن و بە ڕووباری دیجلەوە پەیوەستن."},
        sine:{theme:"مۆسیقا و نەریتی دەف",summary:"سنە شارێکی مۆسیقایی یونسکۆیە و بە مۆسیقژەنانی کورد و فێستیڤاڵی نێودەوڵەتیی دەف دەناسرێت. پەڵەنگان گوندێکی جیاوازە لە پارێزگای کوردستان."},
        kermanshah:{theme:"بیسوون و دیمەنی زاگڕۆس",summary:"بیسوون لە دەرەوەی کرماشانە؛ نووسین و بەرزایی بەردییەکە بە فەرمانی داریوش، نزیکەی ٥٢١ پێش زایین، دروست کراوە. سێ دەقی میخی دەستپێکی دەسەڵاتی ئەو باس دەکەن."},
        "sarpol-e-zahab":{theme:"بەرزایی ئەنوبانی‌نی و مێژووی لولوبی",summary:"بەرزایی ئەنوبانی‌نی فەرمانڕەوا لەبەردەم ئیشتار و دیلانی شکستخواردوو پیشان دەدات. نووسینەکە پاشای لولوبی دەناسێنێت؛ بەرواری وردی جێی گفتوگۆی توێژەرانە."},
        mahabad:{theme:"مێژووی زارەکی و بیرەوەریی ئەدەبی",summary:"چیرۆکی خەڵکی ناوخۆ دەربارەی نووسینی کوردی، مۆسیقا و بیرەوەریی کۆمەڵایەتی کۆبکەرەوە؛ ناو، بەروار و مۆڵەت پێش بڵاوکردنەوە بپشکنە."},
        mardin:{theme:"شاری بەردینی مێژوویی",summary:"بەشی کۆنی ماردین لەسەر لێژایی بەردینە و بە تەلارسازیی بەردی ناسراوە. لیستی پێشنیاری یونسکۆ بە مانای تۆمارکردنی میراتی جیهانی نییە."},
        qamishlo:{theme:"دەنگ و ژیانی کولتووریی ناوخۆ",summary:"مۆسیقا، زمان و ژیانی ڕۆژانە بە دەنگی خەڵکی ناوخۆ تۆمار بکە؛ بۆ باسە مێژووییەکان سەرچاوە و بەشداربووان بپشکنە."},
        zakho:{theme:"پردی دێلال و زێی بچووک",summary:"پردی دێلال لە ناوەندی زاخۆ زێی بچووک دەبڕێت و تەلارسازی، ڕووبار و ژیانی شار پێکەوە دەبەستێتەوە."},
        wan:{theme:"توشپا و چینە مێژووییەکانی شار",summary:"شوێنەوارەکانی توشپا و قەڵای وان سەردەمە مێژووییە جیاوازەکان دەردەخەن. مێژووی ناوچەکە چەندچینییە و بە یەک چیرۆک کورت ناکرێتەوە."},
        hakkari:{theme:"ڕێگاکانی چیا و بیرەوەریی زارەکی",summary:"چیرۆکی ناوخۆ دەربارەی ڕێگاکانی چیا، وەرز و نەریتی زارەکی تۆمار بکە و ناوی قسەکەر و شوێن بنووسە."},
        kirkuk:{theme:"ئەرشیفی شاری چەندچین",summary:"کۆمەڵگە جیاوازەکان و چینە مێژووییەکانی کەرکووک بە چەند دەنگی ناوخۆوە پیشان بدە و هەر باسێک بە سەرچاوەکەیەوە ببەستەوە."},
        koya:{theme:"چیرۆک و فێربوونی ناوخۆ",summary:"ناوی شوێن، مێژووی زارەکی و کردە کولتوورییەکان لەگەڵ دانیشتووان و دامەزراوە ناوخۆییەکان کۆبکەرەوە و سەرچاوەیان بنووسە."},
        soran:{theme:"دیمەنی چیا و زانیاریی کۆمەڵگە",summary:"پەیوەندیی نێوان دیمەنی دەوروبەر و زانیاریی خەڵکی ناوخۆ پیشان بدە؛ چاوپێکەوتنێک دەتوانێت ئەم تۆمارە دەوڵەمەند بکات."},
        halabja:{theme:"بیرەوەری و بەرخۆدان",summary:"بیرەوەریی ناوخۆ بە هەستیارانە پیشان بدە و ڕێز لە خواستی کۆمەڵگە بگرە. پێش چاوپێکەوتن مۆڵەت وەربگرە و سەرچاوە بنووسە."},
        saqqez:{theme:"چیرۆکی ناوچە و زانیاریی نەریتی",summary:"چیرۆکی ناوخۆ دەربارەی مۆسیقا، دەستکاری و ژیانی ڕۆژانە کۆبکەرەوە؛ پەیوەندیی هەر نەریتێک بە سقز بپشکنە."},
        baneh:{theme:"دیمەن، دەستکاری و بازرگانی",summary:"دەستکاری یان بازاڕێکی ناوخۆ بە ناوی دروستکەرێکەوە تۆمار بکە و گۆڕانکارییەکانی لە ماوەی کاتدا باس بکە."},
        urmia:{theme:"زمان و ژیانی شار",summary:"فرەزمانی و ژیانی کولتووریی ورمێ بە چەند دیدگایەکی دیاریکراو پیشان بدە؛ هیچ دەنگێک وەک چیرۆکی تەواوی شار مەناسێنە."},
        batman:{theme:"گەرەک و کولتووری زیندوو",summary:"هەندێک وێنە هەسەنکەیف، شوێنێکی مێژوویی لە پارێزگای باتمان، پیشان دەدەن؛ ئەمانە دیمەنی ناوچەییە، نەک ناوەندی شار."},
        cizre:{theme:"دیمەنی ڕووبار و بیرەوەریی مێژوویی",summary:"ناوی شوێن و بیرەوەرییەکانی کەناری دیجلە تۆمار بکە؛ چیرۆکی مێژوویی بە سەردەمەکەیەوە ببەستەوە و سەرچاوە بنووسە."},
        sirnak:{theme:"ڕێگاکانی چیا و زانیاریی ناوخۆ",summary:"تۆمار بکە دانیشتووان دیمەن، ڕێگا و نەریتەکان چۆن باس دەکەن؛ قسەکەر و وەک شاهیدیی کەسی دیاری بکە."},
        nusaybin:{theme:"نیسیبینی مێژوویی و بیرەوەریی سنوور",summary:"مێژووی چەندچینی نیسیبین و بیرەوەریی کۆمەڵایەتیی ئەمڕۆی بناسە؛ بەڵگەی مێژوویی لە گێڕانەوەی کەسی جیا بکەرەوە."},
        kobane:{theme:"بیرەوەریی کۆمەڵگە و کولتووری هاوچەرخ",summary:"خەڵکی ناوخۆ چیرۆک و چوارچێوەکە دیاری بکەن. بۆ مێژووی هاوچەرخی هەستیار سەرچاوەی ڕاستەوخۆ و مۆڵەتی چاوپێکەوتن بەکاربهێنە."},
        afrin:{theme:"دیمەن، کشتوکاڵ و بیرەوەریی ناوخۆ",summary:"دیمەن و زانیاریی کۆمەڵگە بە سەرچاوەی دیاریکراو تۆمار بکە و بەروار و بانگەشەی پەیوەست بە شوێن بپشکنە."},
        amuda:{theme:"زمان و چیرۆکی کۆمەڵگە",summary:"چیرۆکی ناوخۆ دەربارەی زمان، خوێندنەوە، مۆسیقا و ژیانی ڕۆژانە کۆبکەرەوە و سەرچاوەی دیاریکراو بنووسە."},
        derik:{theme:"دیمەنی سنوور و زانیاریی ناوخۆ",summary:"ناوی شوێن و زانیاریی کۆمەڵگە لە دەوروبەر تۆمار بکە؛ ڕێنووس و چوارچێوەی کولتووری لەگەڵ خەڵکی ناوخۆ بپشکنە."},
        tirbespiye:{theme:"تۆڕی گوندەکان و میراتی زیندوو",summary:"دەستکاری، گۆرانی یان چیرۆکی زارەکییەکی ناوخۆ لە شار و گوندەکان پیشان بدە و کۆمەڵگە و بەرواری تۆمارکردن دیاری بکە."},
        hasakah:{theme:"کۆمەڵگە جیاوازەکان و مێژووی هاوبەشی شار",summary:"شار بە چەند دەنگ و زمانێکی سەرچاوەدار پیشان بدە؛ هیچ دیدگایەک وەک چیرۆکی تەواوی هەموو کۆمەڵگەکان مەخەرەڕوو."},
        marivan:{theme:"دەریاچەی زەریوار و زانیاریی دیمەن",summary:"وێنەکان هەورامان و گوندەکانی چیا لە ناوچەی مەریوان پیشان دەدەن، نەک هەموویان لە شار؛ ڕێگاکانی چیا و زانیاریی ژینگە بەیەکەوە دەبەستنەوە."},
        bukan:{theme:"زمان، مۆسیقا و بیرەوەریی ناوخۆ",summary:"چیرۆکی ناوخۆ دەربارەی مۆسیقا، ئەدەب و ژیانی ڕۆژانە کۆبکەرەوە و زانیاریی مێژوویی بە سەرچاوەی ناوخۆ بپشکنە."}
    };    function currentPanelText(key) { const locale = document.documentElement.lang || "en"; const lang = locale === "ckb" ? "ku" : locale; return (panelText[lang] || panelText.en)[key] || panelText.en[key]; }
    function localizedRegion(region, language) { const names = { de: { Bakûr: 'Nordkurdistan', Bashûr: 'Südkurdistan', Rojhilat: 'Ostkurdistan', Rojava: 'Westkurdistan' } }; return names[language]?.[region] || region; }
    window.addEventListener("digital-heritage-language-change", () => { if (activePlaceForPanel) showPanel(activePlaceForPanel); });
    function showPanel(place) {
        activePlaceForPanel = place;
        const panel = document.getElementById("heritage-panel");
        if (!panel) return;
        const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
        }[char]));
        const locale = document.documentElement.lang || "en";
        const language = locale === "ckb" ? "ku" : locale;
        const localized = language === "ku" ? (soraniPlaces[place.id] || {}) : ((placeText[language] || {})[place.id] || {});
        const localizedName = place.names?.[language] || place.mapName || place.name || "Cultural place";
        const localizedTheme = localized.theme || place.theme || place.category || currentPanelText("heritage");
        const localizedSummary = localized.summary || place.summary || place.description || currentPanelText("archive");
        const galleryItems = Array.isArray(place.gallery) ? place.gallery : [];
        const isGalleryImageSource = src => typeof src === "string" && (src.startsWith("/images/") || src.startsWith("https://commons.wikimedia.org/wiki/Special:FilePath/"));
        const localGallery = galleryItems.filter(item => item && isGalleryImageSource(item.src));
        const image = localGallery.length
            ? `<div class="panel-gallery">${localGallery.map(item => {
                const sourceUrl = typeof item.sourceUrl === "string" && item.sourceUrl.startsWith("https://") ? item.sourceUrl : "";
                const credit = [item.creator, item.license].filter(Boolean).map(escapeHtml).join(" · ");
                const captionText = item.caption && typeof item.caption === "object" ? (item.caption[language] || item.caption.en) : item.caption;
                const caption = escapeHtml(captionText || place.names?.[language] || place.name || "Cultural heritage image");
                return `<figure class="${item.layout === "wide" ? "wide" : ""}"><button type="button" class="panel-image-open" data-image-url="${escapeHtml(item.src)}" data-image-title="${caption}" aria-label="Enlarge ${caption}"><img class="panel-image" src="${escapeHtml(item.src)}" alt="${caption}" loading="lazy"></button><figcaption>${sourceUrl ? `<a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">${caption} ↗</a>` : caption}<small>${credit}</small></figcaption></figure>`;
            }).join("")}</div>`
            : typeof place.image === "string" && place.image.startsWith("/images/")
                ? `<button type="button" class="panel-image-open" data-image-url="${escapeHtml(place.image)}" data-image-title="${escapeHtml(place.name || "Cultural place")}" aria-label="Enlarge ${escapeHtml(place.name || "Cultural place")}"><img class="panel-image" src="${escapeHtml(place.image)}" alt="${escapeHtml(place.name || "Cultural place")}"></button>`
                : "";
        const sourceUrl = typeof place.sourceUrl === "string" && place.sourceUrl.startsWith("https://")
            ? place.sourceUrl : "";
        const source = sourceUrl
            ? `<a class="panel-source" href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(currentPanelText("openSource"))} ↗</a>`
            : `<span class="panel-source-needed">${escapeHtml(currentPanelText("sourceNeeded"))}</span>`;
        const cityMedia = place.enableOpenMedia !== false && Number.isFinite(Number(place.longitude)) && Number.isFinite(Number(place.latitude))
            ? `<section class="panel-media"><p class="media-heading">${currentPanelText("media")}</p><div id="city-media-results"></div></section>`
            : "";        panel.innerHTML = `<div class="panel-heading"><span>${currentPanelText("place")}</span><button type="button" aria-label="${currentPanelText("close")}">×</button></div>
            ${image}<p class="panel-region">${escapeHtml(localizedRegion(place.region, language) || currentPanelText("archive"))}</p>
            <h2>${escapeHtml(localizedName)}</h2>
            <h4>${escapeHtml(localizedTheme)}</h4>
            <p class="panel-description">${escapeHtml(localizedSummary)}</p>
            ${cityMedia}
            ${source}`;
        panel.querySelectorAll(".panel-image-open").forEach(button => button.addEventListener("click", () => {
            const overlay=document.createElement("div"); overlay.className="media-image-preview"; overlay.setAttribute("role","dialog"); overlay.setAttribute("aria-modal","true");
            const close=document.createElement("button"); close.type="button"; close.className="media-image-preview-close"; close.textContent="×"; close.setAttribute("aria-label",currentPanelText("close"));
            const full=document.createElement("img"); full.src=button.dataset.imageUrl; full.alt=button.dataset.imageTitle||"Cultural heritage image";
            const caption=document.createElement("p"); caption.textContent=button.dataset.imageTitle||"";
            const dismiss=()=>{overlay.remove();document.removeEventListener("keydown",onKeyDown);}; const onKeyDown=event=>{if(event.key==="Escape")dismiss();};
            close.addEventListener("click",dismiss); overlay.addEventListener("click",event=>{if(event.target===overlay)dismiss();}); document.addEventListener("keydown",onKeyDown);
            overlay.append(close,full,caption); document.body.appendChild(overlay); close.focus();
        }));        panel.style.display = "block";
        if (cityMedia) loadOpenMedia(place);
        panel.querySelector(".panel-heading button").addEventListener("click", () => { panel.style.display = "none"; });
    }





    console.log(
        "DIGITAL HERITAGE READY"
    );


};


















