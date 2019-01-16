let dotsArray = [];
let form = document.getElementById("xyr-form");
let canvas = document.getElementById("grid");
canvas.addEventListener("click", function () {
    canvasListener(canvas);
});
// form.addEventListener("input", validateX);
// form.addEventListener("submit", validateX);
// form.addEventListener("submit", submit);
// [...form.getElementsByClassName("r-buttons")].forEach(element => element.addEventListener("click", redrawCanvasWithRegardToCurrentR));
// let mainbutton = document.getElementById("mainButton");
// mainbutton.addEventListener("complete", drawPointFromSubmitButton);

// document.getElementById("rValue").addEventListener("change", redrawCanvasWithRegardToCurrentR); // NOT SURE !!!!!!!!!!!!
window.onload = getTableData;

function drawPointFromSubmitButton() {
    let x = document.getElementById("xValue").value;
    let y = document.getElementById("yValue").value;
    let match = document.getElementById("matchValue").value;
    dotsArray = [...dotsArray, {match: match, x: x, y: y}];

    redrawCanvasWithRegardToCurrentR()
}

function redrawCanvasWithRegardToCurrentR() {
    let rValue = document.getElementById("rValue").value;
    drawCanvas(canvas, rValue)
}

/* --------- Submit ---------------------------*/
function submit() {
    event.preventDefault();
    if (validateX()) {
        let formData = new FormData(form);
        sendClickCoors(formData, false);
    }
}

function insertRow(row) {
    let resultTable = document.getElementById("result-table");
    let newRow = document.createElement("tr");

    let resultCell = document.createElement("td");
    resultCell.innerText = row["result"];
    newRow.appendChild(resultCell);

    let xCell = document.createElement("td");
    xCell.innerText = row["x"];
    newRow.appendChild(xCell);


    let yCell = document.createElement("td");
    yCell.innerText = row["y"];
    newRow.appendChild(yCell);

    let rCell = document.createElement("td");
    rCell.innerText = row["r"];
    newRow.appendChild(rCell);

    dotsArray = [...dotsArray, {x: row["x"], y: row["y"]}];
    resultTable.appendChild(newRow);
}

function createTable() {
    let main = document.getElementById("main");
    let resultTable = document.getElementById("result-table");
    if (resultTable == undefined) {
        resultTable = document.createElement("table");
        resultTable.id = "result-table";
        let tBody = document.createElement("tbody");
        resultTable.appendChild(tBody);
        let headers = document.createElement("tr");
        headers.id = "result-table-headers";
        tBody.appendChild(headers);

        /* Adding columns */
        let columnResult = document.createElement("td");
        columnResult.id = "result-table-res";
        columnResult.innerText = "Результат";
        headers.appendChild(columnResult);
        let columnX = document.createElement("td");
        columnX.id = "result-table-x";
        columnX.innerText = "Коор. X";
        headers.appendChild(columnX);
        let columnY = document.createElement("td");
        columnY.id = "result-table-y";
        columnY.innerText = "Коор. Y";
        headers.appendChild(columnY);
        let columnR = document.createElement("td");
        columnR.id = "result-table-r";
        columnR.innerText = "Коор. R";
        headers.appendChild(columnR);

        main.appendChild(resultTable);
    }
}

/* --------- Validate ---------------------------*/
function validateX() {
    let y = form.elements["y-input"].value;
    if (!(isNaN(y)) && (y >= -5) && (y <= 5)) {
        removeErrorX();
        return true;
    } else {
        event.preventDefault();
        showErrorX();
        return false
    }
}


/* --------- Show Errors ---------------------------*/
function showErrorX() {
    let xBlock = document.getElementById("y-block");
    if (!xBlock.contains(document.getElementById("x-error"))) {
        let errorSpan = document.createElement("span");
        errorSpan.id = "x-error";
        errorSpan.classList.add("error-span");
        errorSpan.innerHTML = "<br>Неверное значение y";
        xBlock.appendChild(errorSpan);
        form.elements["y-input"].classList.add("error-input");
    }
}

function showErrorR() {
    let canvasFrameBlock = document.getElementById("canvas-frame");
    if (!canvasFrameBlock.contains(document.getElementById("no-r"))) {
        let errorSpan = document.createElement("span");
        errorSpan.id = "no-r";
        errorSpan.classList.add("error-span");
        errorSpan.innerHTML = "<br>Выберите R";
        canvasFrameBlock.appendChild(errorSpan);
    }
}

/* --------- Remove Errors ---------------------------*/
function removeErrorX() {
    let xBlock = document.getElementById("y-block");
    if (xBlock.contains(document.getElementById("x-error"))) {
        xBlock.removeChild(document.getElementById("x-error"));
        form.elements["y-input"].classList.remove("error-input");
    }


}

function removeErrorR() {
    let canvasFrameBlock = document.getElementById("canvas-frame");
    if (canvasFrameBlock.contains(document.getElementById("no-r"))) {
        canvasFrameBlock.removeChild(document.getElementById("no-r"));
    }


}

function getTableData() {
    let rows = Array.from(document.getElementById("table_data").children);
    let xCell, yCell, matchCell;
    for (let row of rows) {
        let cells = Array.from(row.children);
        if (cells[1] === undefined){
            break
        }
        matchCell = cells[0].innerHTML;
        xCell = cells[1].innerHTML;
        yCell = cells[2].innerHTML;
        dotsArray = [...dotsArray, {match: matchCell, x: xCell, y: yCell}];
    }
    redrawCanvasWithRegardToCurrentR();
}

// function getSessionData() {
//     fetch("ControllerServlet?getSession=true", {
//         credentials: "include",
//     }).then(function (response) {
//         response.json().then(function (sessionRows) {
//             if (sessionRows.length > .value0) {
//                 createTable();
//                 for (let row in sessionRows) {
//                     insertRow(sessionRows[row]);
//                 }
//             }
//             drawCanvas(canvas, 2);
//         })
//     });
// }

function drawCanvas(canvas, r) {
    if (canvas.getContext) {
        var context = canvas.getContext("2d");

        var width = canvas.width;
        var height = canvas.height;

        var half_width = width / 2;
        var half_height = height / 2;

        var quarter_width = half_width / 2 - (width / 20);
        var quarter_height = half_height / 2 - (height / 20);

        context.clearRect(0, 0, width, height);


        context.strokeStyle = "black";
        context.fillStyle = "black";

        //Create grid
        {
            context.beginPath();
            context.font = "10px sans-serif";
            context.moveTo(0, half_height);
            context.lineTo(width, half_height);
            context.lineTo(width - 8, half_height + 3);
            context.lineTo(width - 8, half_height - 3);
            context.lineTo(width, half_height);
            context.fillText("X", width - 8, half_height - 7);

            context.moveTo(half_width, 0);
            context.lineTo((half_width) - 3, 8);
            context.lineTo((half_width) + 3, 8);
            context.lineTo(half_width, 0);
            context.lineTo(half_width, height);
            context.fillText("Y", half_width + 5, 10);


            context.moveTo(half_width - 2 * quarter_width, half_height - 4);
            context.lineTo(half_width - 2 * quarter_width, half_height + 4);
            context.fillText(-r, half_width - 2 * quarter_width - 5, half_height - 6);

            context.moveTo(half_width - 1 * quarter_width, half_height - 4);
            context.lineTo(half_width - 1 * quarter_width, half_height + 4);
            context.fillText(-r / 2, half_width - 1 * quarter_width - 8, half_height - 6);

            context.moveTo(half_width + 2 * quarter_width, half_height - 4);
            context.lineTo(half_width + 2 * quarter_width, half_height + 4);
            context.fillText(r, half_width + 2 * quarter_width - 3, half_height - 6);

            context.moveTo(half_width + 1 * quarter_width, half_height - 4);
            context.lineTo(half_width + 1 * quarter_width, half_height + 4);
            context.fillText(r / 2, half_width + 1 * quarter_width - 5, half_height - 6);


            context.moveTo(half_width - 4, half_height - (2 * quarter_height));
            context.lineTo(half_width + 4, half_height - (2 * quarter_height));
            context.fillText(r, half_width + 5, half_height - 2 * quarter_height + 4);

            context.moveTo(half_width - 4, half_height - (1 * quarter_height));
            context.lineTo(half_width + 4, half_height - (1 * quarter_height));
            context.fillText(r / 2, half_width + 5, half_height - 1 * quarter_height + 4);

            context.moveTo(half_width - 4, half_height + (2 * quarter_height));
            context.lineTo(half_width + 4, half_height + (2 * quarter_height));
            context.fillText(-r, half_width + 5, half_height + 2 * quarter_height + 4);

            context.moveTo(half_width - 4, half_height + (1 * quarter_height));
            context.lineTo(half_width + 4, half_height + (1 * quarter_height));
            context.fillText(-r / 2, half_width + 5, half_height + 1 * quarter_height + 4);

            context.closePath();
            context.strokeStyle = "black";
            context.fillStyle = "black";
            context.stroke();
            context.fill();
        }

        //Create figure
        {
            context.beginPath();
            context.moveTo(half_width, half_height);
            context.ellipse(half_width, half_height, 2 * quarter_width, 2 * quarter_height, 0, 0, Math.PI / 2, false);
            context.rect(half_width, half_height - 2 * quarter_height, quarter_width, 2 * quarter_height);

            context.moveTo(half_width, half_height);
            context.lineTo(half_width, half_height + quarter_height);
            context.lineTo(half_width - quarter_width, half_height);
            context.lineTo(half_width, half_height);

            context.closePath();
            context.fillStyle = 'rgba(0, 97, 255, 0.7)';
            context.fill();
        }
        context.strokeStyle = "blue";
        context.fillStyle = "blue";

        //Create point of answer
        dotsArray.forEach(function (dot) {
            var pointer_x = (dot.x / r) * quarter_width * 2;
            var pointer_y = (dot.y / r) * quarter_height * 2;
            if (dot.match == "true") { // FIXME
                context.strokeStyle = "green";
                context.fillStyle = "green";
            } else {
                context.strokeStyle = "red";
                context.fillStyle = "red";
            }
            context.beginPath();
            context.arc(half_width + pointer_x, half_height - pointer_y, 1, 2 * Math.PI, 0);
            context.closePath();
            context.fill();
            context.stroke();
        });
    }

}

function canvasListener(canvas) {
    let width = canvas.width;
    let height = canvas.height;

    // TODO check r value
    let rValue = document.getElementById("rValue").value;
    alert(rValue);
    if (rValue != "0.0" && rValue !== null) {
        removeErrorR();
        let posX = event.pageX - canvas.offsetLeft;
        let posY = event.pageY - canvas.offsetTop;
        let coorX = ((posX - 163) / 130 * rValue).toFixed(3);
        let coorY = (-(posY - 139) / 108 * rValue).toFixed(3);
        let formData = new FormData;
        formData.append("x-input", coorX);
        formData.append("y-input", coorY);
        sendClickCoors(formData, true);
    } else showErrorR();
}

function sendClickCoors(formData) {
    // formData.append("click", click);
    let formArr = {};
    formData.forEach(function (value, key) {
        formArr[key] = value;
    });
    let formJson = JSON.stringify(formArr);
    document.getElementById("jsonInput").value = formJson;
    document.getElementById("hiddenButton").click();
    let rValue = document.getElementById("rValue").value;
    dotsArray = [...dotsArray, {x: formArr["x-input"], y: formArr["y-input"]}];

    drawCanvas(canvas, rValue);


    // fetch("ControllerServlet", {
    //     method: "POST",
    //     credentials: "include",
    //     body: formJson,
    // })
    //     .then(function (response) {
    //         response.json().then(function (responseArray) {
    //             createTable();
    //             insertRow(responseArray);
    //             drawCanvas(canvas, responseArray["r"]);
    //         })
    //     })
    //     .catch(function (exception) {
    //         alert("Connection error");
    //     })
}


