

function showModal() {

  //Get the modal
  var modal = document.getElementById('myModal');

  //Get the list of urls the timer should run on
  var urls = chrome.extension.getBackgroundPage().getUrls();

  //we change modal display from "none" to block
  //whenever this function is called
  modal.style.display = "block";

  //we add the urls back to the dom
  for (i = 0; i < urls.length; i++) {

    var url = urls[i];
    addUrlToDom(url);
  }
}


function closeModal() {

  //Get the modal
  var modal = document.getElementById('myModal');

  //Get the urls the timer should run on
  var urls = chrome.extension.getBackgroundPage().getUrls();

  //we get reference to the list of links from the popup dom
  var links = document.getElementById('links');

  //switch modal display to none when modal is closed
  modal.style.display = "none";

  //we have to remove all the links from the popup dom
  while (links.firstChild) {
    links.removeChild(links.firstChild);
  }
}


function addUrlToDom(url) {
  var newLine = document.createElement('li');
  var newLink = document.createElement('a');
  newLink.textContent = url;
  newLink.setAttribute('href',url);
  newLink.setAttribute('target','_blank');
  newLine.setAttribute('id', url);
  newLine.appendChild(newLink);
  document.getElementById("links").appendChild(newLine);
}


function addLink() {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        // tabs is an array so fetch the first (and only) object-element in tab
        var url = new URL(tabs[0].url);

        //we only need the domain of the url
        var domain = url.hostname;

        if(chrome.extension.getBackgroundPage().getUrls().indexOf(domain) == -1){
            //Don't add duplicates
            chrome.extension.getBackgroundPage().addLinkToUrls(domain);
            addUrlToDom(domain);
        }
    });
}


function removeUrlFromDom(url) {
  var elem = document.getElementById(url);
  elem.parentNode.removeChild(elem);
}


function deleteLink() {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        // tabs is an array so fetch the first (and only) object-element in tab
        var url = new URL(tabs[0].url);
        var domain = url.hostname;

        if(chrome.extension.getBackgroundPage().getUrls().indexOf(domain) != -1) {

          chrome.extension.getBackgroundPage().removeLinkFromUrls(domain);
          removeUrlFromDom(domain);
        }
    });
}


document.addEventListener('DOMContentLoaded', function() {

    // Get the button that opens the modal
    var linkIcon = document.getElementById("add-link");

    // Get the button that closes the modal
    var closeButton = document.getElementById("close");

    //Get add button to add link
    var addButton = document.getElementById("add-button");

    //Get delete button to remove link
    var deleteButton = document.getElementById("delete-button");

    //listen for events on the buttons
    linkIcon.addEventListener('click', showModal);
    closeButton.addEventListener('click', closeModal);
    addButton.addEventListener('click', addLink);
    deleteButton.addEventListener('click', deleteLink);


    setInterval(function() {

      //get total time and display it in the dom
      var secs = chrome.extension.getBackgroundPage().getTime();
      document.getElementById("time").innerHTML = moment().startOf('day').seconds(secs).format('HH:mm:ss');


    }, 1000);
    
    var hours = chrome.extension.getBackgroundPage().getHours();
    document.getElementById("hours").innerHTML = hours;
});