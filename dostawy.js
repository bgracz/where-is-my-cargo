let date = new Date();
let day = date.getDate();
let month = date.getMonth();
let year = date.getFullYear();

let monthArray =["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

date = day + '_' + monthArray[month] + '_' + year;

window.onload = function start() {
  document.getElementById('Swadzim-button').click();

  fetch('file.xlsx').then(res => {
    return res.arrayBuffer();
  }).then(res => {
    let workbook = XLSX.read(res, { type: 'array' });
    let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets["Arkusz1"], { raw: false });
    document.getElementById("json").innerHTML = JSON.stringify(rowObject, undefined, 4);

    document.getElementById('test1').innerHTML = rowObject.map(data =>
      `<tr class="head-main-table id="head-main-table"">
              <th class="head-data">Data</th>
            <th></th>
            <th>6:00</th>
            <th></th>
            <th>10:00</th>
            <th></th>
            <th>14:00</th>
            <th></th>
            <th>15:00</th>
            <th></th>
            <th>18:00</th>
              </tr>
              <tr>
                <td class="${data.n === undefined ? "work" : "weekend"}" id="${data.SWADZIM === undefined ? "empty-date" : data.SWADZIM.replace(/ /g,"_")}">${data.SWADZIM === undefined ? "" : data.SWADZIM}</td>
                <td class="${data.n === undefined ? "work" : "weekend"}">${data["Dostawa 1 -"] === undefined ? "-" : data["Dostawa 1 -"]}</td>
                <td class="${data.n === undefined ? "work" : "weekend"}">${data["I godz. 6:00"] === undefined ? "-" : data["I godz. 6:00"]}</td>
                <td class="${data.n === undefined ? "work" : "weekend"}">${data["Dostawa 2 -"] === undefined ? "-" : data["Dostawa 2 -"]}</td>
                <td class="${data.n === undefined ? "work" : "weekend"}">${data["II godz. 10:00"] === undefined ? "-" : data["II godz. 10:00"]}</td>
                <td class="${data.n === undefined ? "work" : "weekend"}">${data["Dostawa 3 -"] === undefined ? "-" : data["Dostawa 3 -"]}</td>
                <td class="${data.n === undefined ? "work" : "weekend"}">${data["III godz. 14:00"] === undefined ? "-" : data["III godz. 14:00"]}</td>
                <td class="${data.n === undefined ? "work" : "weekend"}">${data["Dostawa 4 -"] === undefined ? "-" : data["Dostawa 4 -"]}</td>
                <td class="${data.n === undefined ? "work" : "weekend"}">${data["VI godz. 15:00"] === undefined ? "-" : data["VI godz. 15:00"]}</td>
                <td class="${data.n === undefined ? "work" : "weekend"}">${data["Dostawa 5 -"] === undefined ? "-" : data["Dostawa 5 -"]}</td>
                <td class="${data.n === undefined ? "work" : "weekend"}">${data["V godz. 18:00"] === undefined ? "-" : data["V godz. 18:00"]}</td>
              </tr>`
    ).join('');
    if (rowObject.length != 0) {
      document.getElementsByClassName("loading")[0].style.display = "none";
    }
    scrollToToday();
  })
  fetch('file.xlsx').then(res => {
    return res.arrayBuffer();
  }).then(res => {
    let workbook = XLSX.read(res, { type: 'array' });
    let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets["Arkusz1"], { raw: false });
    document.getElementById("json").innerHTML = JSON.stringify(rowObject, undefined, 4);

    document.getElementById('test2').innerHTML = rowObject.map(data =>
      `<tr class="head-main-table" id="head-main-table">
            <th class="head-data">Data</th>
            <th></th>
            <th>10:00</th>
            <th></th>
            <th>13:00</th>
              </tr>
              <tr>
                <td class="${data.n === undefined ? "work" : "weekend"}" id="${data.SOSNOWIEC === undefined ? "" : data.SOSNOWIEC.replace(/ /g,"_")}_SOS">${data.SOSNOWIEC === undefined ? "" : data.SOSNOWIEC}</td>
                <td class="${data.n === undefined ? "work" : "weekend"}">${data["Dostawa 1 -"] === undefined ? "-" : data["Dostawa 1 -"]}</td>
                <td class="${data.n === undefined ? "work" : "weekend"}">${data["I godz. 10:00"] === undefined ? "-" : data["I godz. 10:00"]}</td>
                <td class="${data.n === undefined ? "work" : "weekend"}">${data["Dostawa 2 -"] === undefined ? "-" : data["Dostawa 2 -"]}</td>
                <td class="${data.n === undefined ? "work" : "weekend"}">${data["II godz. 13:00"] === undefined ? "-" : data["II godz. 13:00"]}</td>
              </tr>`
    ).join('');
    if (rowObject.length != 0) {
      document.getElementsByClassName("loading")[1].style.display = "none";
    }
  })
};

function scrollToToday () {
  let element = document.getElementById(date);
  let headerOffset = 140;
  let elementPosition = element.getBoundingClientRect().top;
  let offsetPosition = elementPosition + window.pageYOffset - headerOffset;

  window.scrollTo({
       top: offsetPosition,
       behavior: "smooth"
  });
}

function scrollToTodaySOS () {
  let elementSOS = document.getElementById(date + "_SOS");
  let headerOffsetSOS = 140;
  let elementPositionSOS = elementSOS.getBoundingClientRect().top;
  let offsetPositionSOS = elementPositionSOS + window.pageYOffset - headerOffsetSOS;

  window.scrollTo({
       top: offsetPositionSOS,
       behavior: "smooth"
  });
}

function openWarehouse(evt, warehouseName) {
  let i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(warehouseName).style.display = "block";
  evt.currentTarget.className += " active";
  
  if (warehouseName === "Swadzim") {
    scrollToToday();
    document.getElementById("save").download="Awizacje_Kontenerow_SWADZIM.xlsx";
    document.getElementById("save").href="file.xlsx"; 
  } else {
    scrollToTodaySOS();
    document.getElementById("save").download="Awizacje_Kontenerow_SOSNOWIEC.xlsx"; 
    document.getElementById("save").href="file.xlsx";
  }
}

window.onscroll = function () {
  scrollFunction();
}

mybutton = document.getElementById("topMenu");

function scrollFunction() {
  if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function reloadData() {
  location.reload(true);
};