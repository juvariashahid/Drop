

//total time user spends on certain websites
var totalTime=0;
var hours = 0; 

//list of sites timer runs on
var urls = [];



//this function is called from the background
//script and runs for as long as chrome is open
function updateTime() {
  
  //timer only runs on windows that are open and active
  var queryInfo = {
    active: true,
    currentWindow: true
  };


  //setInterval(function, x) calls
  //function every x milliseconds
  setInterval(function() {
    chrome.tabs.query(queryInfo, function(tabs) {

      //tabs is an array where the first
      //tab corresponds to the tab currently active
      var tab = tabs[0];


      var url = tab.url;


      var totalUrls = urls.length;

      //we only care about the domain name of the url
      var domain = new URL(url).hostname;

      //we loop through the urls the timer should run on
      //and increment totalTime if there is a match for
      //the current tab
      for (i = 0; i < totalUrls; i++) {

        if (domain != urls[i]) {
          totalTime++;
          hours = Math.floor(totalTime/5);
        }
      }

      var date = new Date();
      var day = date.getDay();

      //timer always resets at 12:00 am (every new day)
      chrome.storage.local.get({day : 0}, function(data) {

        if (day > data.day || (day == 0 && data.day == 6)) {
          totalTime = 0;
          chrome.storage.local.set({day : day});
        }

      });

    });
  }, 1000);
}


function addLinkToUrls(url) {
  urls.push(url);
}


function removeLinkFromUrls(url) {
  var index = urls.indexOf(url);

  if (index > -1) {
    urls.splice(index, 1);
  }
}


function getUrls() {
  return urls;
}


function getTime() {
  return totalTime;
}


function getHours() {
  return hours;
}


updateTime();

