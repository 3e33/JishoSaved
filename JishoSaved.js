addLoadButton();
addClearButton();

if(window.location.href.indexOf("/search/") != -1) {
  init();
};

function init() {
  var definitions = document.querySelectorAll("div.exact_block div.concept_light");
  definitions.forEach(element => addSaveButton(element));
  definitions.forEach(element => addClickFn(element, addElementToData));
}

function addSaveButton(element) {
  var parent = element.querySelector('div.concept_light-status');
  parent.appendChild(getSaveButton());
}

function getSaveButton() {
  var button = document.createElement('a');
  button.href = '#';
  button.setAttribute('name', 'save');
  button.innerHTML = 'Save';

  return button;
}

function addLoadButton() {
  document.querySelector('nav.nav-main_navigation ul.links').appendChild(getLoadButton());
}

function getLoadButton() {
  var button = document.createElement('li');
  button.innerHTML = '<a href="#" name="Load">Load</a>';
  addClickFn(button, loadSavedDefinitions);

  return button;
}

function addClearButton() {
  document.querySelector('nav.nav-main_navigation ul.links').appendChild(getClearButton());
}

function getClearButton() {
  var button = document.createElement('li');
  button.innerHTML = '<a href="#" name="Clear">Clear</a>';
  addClickFn(button, clearSavedDefinitions);

  return button;
}

function loadSavedDefinitions() {
  var mainContent =  document.querySelector('div#page_container > div');
  mainContent.innerHTML = '';

  browser.storage.local.get("data")
    .then((data) => insertSavedDefinitions(data, mainContent))
    .catch(onError);
}

function clearSavedDefinitions() {
  var confirm = window.confirm("WARNING: This will delete all saved definitions!");

  if(confirm) {
    browser.storage.local.clear()
      .then(() => console.log('Cleared definitions.'))
      .catch(onError);
  }
}

function insertSavedDefinitions(data, containerElement) {
  containerElement.innerHTML = data.data.join('');
}

function addClickFn(element, fn) {
  element.addEventListener('click', fn, false);
}

function addElementToData(event) {
  event.preventDefault();

  if(event.target.getAttribute('name') !== 'save') {
    return;
  }

  var element = event.currentTarget;
  browser.storage.local.get("data")
    .then(data => updateStorage(data, element))
    .then(() => setElementActive(element))
    .catch(onError);
}

function updateStorage(data, element) {
  if(data.data === undefined) {
    var newData = {data: [element.outerHTML]};
  } else {
    var newData = {data: [].concat(data.data, [element.outerHTML])};
  }
  browser.storage.local.set(newData)
    .then(() => console.log("stored"))
    .catch(onError);
}

function setElementActive(element) {
  element.style.backgroundColor = "#f2f2f2";
}

function onError(error) {
  console.log(error);
}
