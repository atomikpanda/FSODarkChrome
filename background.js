chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {

    if (request.text == "pageload") {

      var iconOn = request.iconOn

      chrome.tabs.query(
        { currentWindow: true, active: true },
        function (tabs) {

          if (iconOn == true) {
            chrome.browserAction.setIcon({ path: "icon.png", tabId: tabs[0].id });

          } else {
            chrome.browserAction.setIcon({ path: "off.png", tabId: tabs[0].id });
          }

        })

      
    }
  })

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.query({}, function (tabs) {

    getToggle(function (value) {

      var currentVal = value
      var newEnabledVal = !currentVal
      setToggle(newEnabledVal, function () {


      })
      tabs.forEach(aTab => {

        chrome.tabs.sendMessage(aTab.id, { text: "toggle", enabled: newEnabledVal }, function (response) {
          // do sth with response

        })
        if (newEnabledVal) {
          chrome.browserAction.setIcon({ path: "icon.png", tabId: aTab.id });
        } else {
          chrome.browserAction.setIcon({ path: "off.png", tabId: aTab.id });
        }
      })
    })
  })
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

getToggle(function (enabled) {
  if (enabled == false) {
    chrome.tabs.query({}, function (tabs) {
      tabs.forEach(tab => {

        chrome.browserAction.setIcon({ path: "off.png", tabId: tab.id });
        
      });
    })
  }
})