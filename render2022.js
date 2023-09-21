let data = [];
let count = 1;

window.onload = function start() {
    fetch('file').then(res => {
        return res.arrayBuffer();
    }).then(res => {
        let workbook = XLSX.read(res, { type: 'array' });
            let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets["Total"], { raw: false });
            document.getElementById("json").innerHTML = JSON.stringify(rowObject, undefined, 4);

            rowObject = rowObject.filter(e => e.Dostawca !== undefined);
            rowObject = rowObject.filter(e => e["Kwota USD ZAMÓWIENIE"] == undefined);

            console.log(rowObject);
            let unique = [...new Set(rowObject.map(item => item.Dostawca.trim()))];
            let uniqueKupiec = [...new Set(rowObject.map(item => item["Kupiec nazwisko"].trim()))];
            let uniqueCategory = [...new Set(rowObject.map(item => item.Produkt))];
            unique.push(`<option value="none" selected disabled hidden>wybierz</option>`)
            uniqueKupiec.push(`<option value="none" selected disabled hidden>wybierz</option>`)
            uniqueCategory.push(`<option value="none" selected disabled hidden>wybierz</option>`)

            document.getElementById('test1').innerHTML = rowObject.map(data =>
                `<div class="card ${data.Dostawca === undefined ? "noname" : data.Dostawca.trim()} ${data["Kupiec nazwisko"].trim()} ${data.Produkt} ${data[" DOKUMENTY DLA KSIĘGOWOŚCI "] === undefined ? "in-progress" : "done"} ${data["booking ok"] === "TAK, OPÓŹNIENIE" ? "late" : ""}">
                    <div class="flip-card">
                    <div class="flip-card-inner">
                    <div class="flip-card-front">
                    <div><p class="id">${data["Nr PO"]}</p></div>
                    <div><h1 class="dostawca">${data.Dostawca === undefined ? 'brak nazwy' : data.Dostawca.length > 15 ? data.Dostawca.slice(0, 12) + '...' : data.Dostawca}</h1></div>
                    <div><p class="partia">${data.Partia === undefined ? '' : data.Partia}</p></div>
                    <div class="main-Info">
                    <div class="cardInfo">${data.Produkt} (${data.Dział})</div>
                    <div class="cardInfo">${data["Kupiec nazwisko"]}</div>
                    </div>
                    <div><p class="rozrzut">I. rozrzut: ${data["Pierwszy rozrzut data"] === undefined ? '---' : data["Pierwszy rozrzut data"]}</p></div>
                    <div class="cardInfo port">Wpłynie do portu: <b>${data.ETA === undefined ? "---" : data.ETA}</b></div>
                    <div class="cardInfo">Dostawa - Swadzim: <b>${data["Data rozładunku SWA"] === undefined ? "---" : data["Data rozładunku SWA"]}</b></div>
                    <div class="cardInfo">Dostawa - Sosnowiec: <b>${data["Data rozładunku SOS"] === undefined ? "---" : data["Data rozładunku SOS"]}</b></div>
                    </div>
                    <div class="flip-card-back">
                    <div class="cardInfo">Wypłynął: <b>${data["ETD real"] === undefined ? "---" : data["ETD real"]}</b></div>
                    <table>
                       <tr>
                         <th>Baza</th>
                         <th>20"</th>
                         <th>40"</th>
                         <th>40HC</th>
                         <th class="m3">m<sup>3</sup></th>
                       </tr>
                       <tr>
                         <td>Swadzim</td>
                         <td>${data["Swadz 20'"] === undefined ? "-" : data["Swadz 20'"]}</td>
                         <td>${data["Swadz 40'"] === undefined ? "-" : data["Swadz 40'"]}</td>
                         <td>${data["Swadz 40HC"] === undefined ? "-" : data["Swadz 40HC"]}</td>
                         <td>${data["Swadz m3"] === undefined ? "---" : data["Swadz m3"]}</td>
                       </tr>
                         <tr>
                         <td>Sosnowiec</td>
                         <td>${data["Sosno 20'"] === undefined ? "-" : data["Sosno 20'"]}</td>
                         <td>${data["Sosno 40'"] === undefined ? "-" : data["Sosno 40'"]}</td>
                         <td>${data["Sosno 40HC"] === undefined ? "-" : data["Sosno 40HC"]}</td>
                         <td>${data["Sosn m3"] === undefined ? "---" : data["Sosn m3"]}</td>
                       </tr>
                     </table>
                     <div class="cardInfo">$ ${data["Kwota USD realizacja"] === undefined ? "---" : data["Kwota USD realizacja"]}<b></b></div>
                        <div class="docs">
                        ${data[" SPECYFIKACJA ZROBIONA "] == "TAK" ? "<a class="+"document"+" "+"href="+data.Lokalizacja.replace(/\s/g, '%20')+"Specyfikacja.xlsx"+" "+"download="+"Specyfikacja_"+data.Dostawca+".xlsx" + ">Specyfikacja</a>" : ""}
                        ${data[" KALKULACJA KOŃCOWA ZROBIONA "] == "TAK" ? "<a class="+"document"+" "+"href="+data.Lokalizacja.replace(/\s/g, '%20')+"Kalkulacja.xlsx"+" "+"download="+"Kalkulacja_koncowa_"+data.Dostawca+".xlsx" + ">Kalkulacja</a>" : ""}
                        </div>
                    </div>
                    </div>
                    </div>
                    </div>`
            ).join('')
            document.getElementById('supplier-select').innerHTML = unique.map(item =>
                `<option value="${item}">${item}</option>`
            ).sort()
            document.getElementById('kupiec-select').innerHTML = uniqueKupiec.map(item =>
                `<option value="${item}">${item}</option>`
            ).sort()
            document.getElementById('category-select').innerHTML = uniqueCategory.map(item =>
                `<option value="${item}">${item}</option>`
            ).sort()
    })
};

let checkState = false;
let filter = false;
let filterName;

$(document).ready(function () {
    $('#checkbox1').click(function () {
        checkState = $("#checkbox1").is(":checked") ? true : false;
        hideDoneElements();
    });
});

function hideDoneElements() {
    if (checkState == true && filter == false) {       //ukryj zrealizowane
        let elems = document.getElementsByClassName('done');
        for (let i = 0; i < elems.length; i += 1) {
            elems[i].style.display = 'none';
        }
    } else if (checkState == false && filter == false) {    //pokaz zrealizowane - brak innych filtrow
        let elems = document.getElementsByClassName('done');
        for (let i = 0; i < elems.length; i += 1) {
            elems[i].style.display = 'inline-block';
        }
    } else if (checkState == true && filter == true) {      //ukryj zrealizowane z uwzglednieniem innych filtrow
        let elem = document.getElementsByClassName(filterName);
        for (let i = 0; i < elem.length; i += 1) {
            elem[i].style.display = 'inline-block';
        }
        let elems = document.getElementsByClassName('done');
        for (let i = 0; i < elems.length; i += 1) {
            elems[i].style.display = 'none';
        }
    } else if (checkState == false && filter == true) {     //pokaz wszyskie z uwzglednieniem innych filtrow
        let elem = document.getElementsByClassName(filterName);
        for (let i = 0; i < elem.length; i += 1) {
            elem[i].style.display = 'inline-block';
        }
    }
};

function supplier(value) {
    filter = true;
    filterName = value;
    let elems = document.getElementsByClassName('card');
    for (let i = 0; i < elems.length; i += 1) {
        elems[i].style.display = 'none';
    }
    let elem = document.getElementsByClassName(value);
    for (let i = 0; i < elem.length; i += 1) {
        elem[i].style.display = 'inline-block';
    }
    hideDoneElements();
    document.getElementById("dostawca-filters").style.opacity = "1";
    document.getElementById("kupiec-filters").style.opacity = "0.4";
    document.getElementById("category-filters").style.opacity = "0.4";
    $('#kupiec-select').prop('selected', function () {
        return this.value = "none";
    });
    $('#category-select').prop('selected', function () {
        return this.value = "none";
    });
};

function buyer(value) {
    filter = true;
    filterName = value;
    let elems = document.getElementsByClassName('card');
    for (let i = 0; i < elems.length; i += 1) {
        elems[i].style.display = 'none';
    }
    let elem = document.getElementsByClassName(value);
    for (let i = 0; i < elem.length; i += 1) {
        elem[i].style.display = 'inline-block';
    }
    hideDoneElements();
    document.getElementById("dostawca-filters").style.opacity = "0.4";
    document.getElementById("kupiec-filters").style.opacity = "1";
    document.getElementById("category-filters").style.opacity = "0.4";
    $('#supplier-select').prop('selected', function () {
        return this.value = "none";
    });
    $('#category-select').prop('selected', function () {
        return this.value = "none";
    });
};

function category(value) {
    filter = true;
    filterName = value;
    let elems = document.getElementsByClassName('card');
    for (let i = 0; i < elems.length; i += 1) {
        elems[i].style.display = 'none';
    }
    let elem = document.getElementsByClassName(value);
    for (let i = 0; i < elem.length; i += 1) {
        elem[i].style.display = 'inline-block';
    }
    hideDoneElements();
    document.getElementById("dostawca-filters").style.opacity = "0.4";
    document.getElementById("kupiec-filters").style.opacity = "0.4";
    document.getElementById("category-filters").style.opacity = "1";
    $('#supplier-select').prop('selected', function () {
        return this.value = "none";
    });
    $('#kupiec-select').prop('selected', function () {
        return this.value = "none";
    });
};

function reloadData() {
    location.reload(true);
};