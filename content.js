

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {

    if (request.text == "toggle") {

      var newEnabledValue = request.enabled

      console.log("FSODarkEnabled: " + newEnabledValue)

      if (newEnabledValue == true) {
          injectCSS()
        
        } else {
          removeCSS()
        } 
    }
  })


function injectCSS() {
  let head = document.head

  let cssLink = document.createElement("link")
  cssLink.setAttribute("rel", "stylesheet")
  cssLink.setAttribute("type", "text/css")
  cssLink.setAttribute("id", "FSODarkInjection")
  cssLink.setAttribute("href", "https://baileyseymour.com/fsodark/FSODark.css")

  head.appendChild(cssLink)
}

function removeCSS() {
  let cssLink = document.getElementById("FSODarkInjection")
  if (cssLink != undefined && cssLink != null) {
    cssLink.remove()
    return true
  } else {
    return false
  }
}

// On Load
getToggle(function (value) { 
  if (value) {
    injectCSS()
  } else {
    // do nothing since the css isnt loaded
  }
})

function getToggle(callback) { // expects function(value){...}
  chrome.storage.local.get('toggle', function (data) {
    if (data.toggle === undefined) {
      callback(true); // default value
    } else {
      callback(data.toggle);
    }
  });
}

function setToggle(value, callback) { // expects function(){...}
  chrome.storage.local.set({ toggle: value }, function () {
    if (chrome.runtime.lastError) {
      throw Error(chrome.runtime.lastError);
    } else {
      callback();
    }
  });
}