let notificationBarOne = document.getElementById('one');
let notificationBarTwo = document.getElementById('two');

fetch('file.json', { 
  method: 'GET'
})
.then(function(response) { return response.json(); })
.then(function(json) {
    notificationBarOne.innerHTML = json.one;
    notificationBarTwo.innerHTML = json.one;
});