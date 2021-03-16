//Utility Functions:
//1. Function to get DOM element from string-
function getElementFromString(string) {
    let div = document.createElement('div');
    div.innerHTML = string;
    return div.firstElementChild;
}

//Initializing no. of parameters
let addedParamCount = 0;

//Hiding the choose content type, request json and params box initially
let parametersBox = document.getElementById("parametersBox");
let requestJsonBox = document.getElementById("requestJsonBox");
let chooseContentType = document.getElementById("chooseContentType");
let chooseRequestType = document.getElementById("chooseRequestType");
let params = document.getElementById("params");

parametersBox.style.display = "none";
requestJsonBox.style.display = "none";
chooseContentType.style.display = "none";

//If GET is selecetd,hide the json and params box and if POST is selected,show the boxes
let getRadio = document.getElementById("getRequest");
let postRadio = document.getElementById("postRequest");

getRadio.addEventListener('click', () => {
    parametersBox.style.display = "none";
    requestJsonBox.style.display = "none";
    chooseContentType.style.display = "none";
    params.style.display = 'none';
});

postRadio.addEventListener('click', () => {
    chooseContentType.style.display = 'block';
    requestJsonBox.style.display = "block";
    params.style.display = 'block';
});

//If JSON is selected then hide params and if params is selected then hide the json box
let jsonRadio = document.getElementById("contentJson");
let paramsRadio = document.getElementById("contentParams");

jsonRadio.addEventListener('click', () => {
    parametersBox.style.display = 'none';
    requestJsonBox.style.display = 'block';
    params.style.display = 'none';
});

paramsRadio.addEventListener('click', () => {
    parametersBox.style.display = 'block';
    requestJsonBox.style.display = 'none';
    params.style.display = 'block';
});

//whenever user clicks on add parameter button, add a parameter
let addParam = document.getElementById("addParam");
addParam.addEventListener('click', () => {
    let str = `<div class="row mb-3 my-2">
                    <label for="parameter${addedParamCount + 2}" class="col-sm-2 col-form-label">Parameter ${addedParamCount + 2}</label>
                    <div class="col-md-4">
                        <input type="text" class="form-control" id="parameterKey${addedParamCount + 2}" placeholder="Enter parameter ${addedParamCount + 2} key">
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" id="parameterValue${addedParamCount + 2}" placeholder="Enter parameter ${addedParamCount + 2} value">
                    </div>
                    <button type="button" class="btn btn-primary btn-sm my-2 removeParam" style="width: 736px;margin-left: 202px;">Remove Parameter</button>
               </div>`;
    //Convert string element to DOM node
    let paramElement = getElementFromString(str);
    params.appendChild(paramElement);
    //Remove the parameter when clicked on Remove parameter button
    let removeParam = document.getElementsByClassName("removeParam");
    for (item of removeParam) {
        item.addEventListener('click', (e) => {
            e.target.parentElement.remove()
        })
    }

    addedParamCount++;
})

//When user clicks on send request
let sendRequest = document.getElementById("sendRequest");
sendRequest.addEventListener('click', () => {
    //Show please wait in the response box to request patience from the user
    document.getElementById("responsePrism").innerHTML = "Please wait while we are sending your request and fetching the response......";

    //Fetch all the values user has entered
    let url = document.getElementById("urlField").value;
    let requestType = document.querySelector("input[name='requestType']:checked").value;
    let contentType = document.querySelector("input[name='contentType']:checked").value;

    //If user has used params option instead of JSON the collect all the params in an object
    if (contentType == "params") {
        data = {};
        for (let i = 0; i < addedParamCount + 1; i++) {
            if (document.getElementById("parameterKey" + (i + 1)) != undefined) {
                let key = document.getElementById("parameterKey" + (i + 1)).value;
                let value = document.getElementById("parameterValue" + (i + 1)).value;
                data[key] = value;
            }

        }
        data = JSON.stringify(data);
    } else {
        data = document.getElementById("enterJson").value;
    }

    //If the method is GET then,invoke fetch api to create a post request
    if (requestType == "GET") {
        fetch(url, {
                method: "GET",
            })
            .then(response => response.text())
            .then((text) => {
                document.getElementById("responsePrism").innerHTML = text;
                Prism.highlightAll();
            })
    } else {
        fetch(url, {
                method: "POST",
                body: data,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
            .then(response => response.text())
            .then((text) => {
                document.getElementById("responsePrism").innerHTML = text;
                Prism.highlightAll();
            })
    }
})
