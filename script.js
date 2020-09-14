const btnCreate = document.querySelector('.btnCreateVertex');
const vertexValue = document.querySelector('.vertexInput');
const dataEntry = document.querySelector('.dataEntry');
const btnResult = document.querySelector('.result');

btnCreate.addEventListener('click', getValue);

function Result() {

    let data = getData();

    let matrix = getAfromGminus(data);

    console.log('Matrx A', matrix)

    let d = floyd(matrix);

    let Q = getQ(d);
    let Qrel = getQrel(d, Q);

    if (checkForInfinity(d) == true) {
        alert('Не удалось рассчитать показатели компактности для ориентированного графа (в матрице кратчайших путей есть бесконечность).\nПроизводится расчёт для неориентированного графа.');

        let newMatrix = convertIntoUndirectedGraph(matrix);

        d = floyd(newMatrix);

        Q = getQ(d);
        Qrel = getQrel(d, Q);


        if (checkForInfinity(d) == true) {
            alert('Не удалось рассчитать показатели компактности для неориентированного графа (в матрице кратчайших путей есть бесконечность).\nСтруктура несвязная.')
            outputQQrel(Q, Qrel, false);

            return 0;
        }
    }

    outputQQrel(Q, Qrel, true);
    console.log(d);

    console.log(Q, Qrel)
}

function getValue() {
    const valueOfInput = vertexValue.value;
    if (!valueOfInput) {
        alert('Поле пустое');
        return;
    }
    dataEntry.textContent = '';
    for (let i = valueOfInput; i > 0; i--) {
        dataEntry.insertAdjacentHTML('afterbegin',
            `
        <div class="row mt-2"> 
            <div>G<sup>-</sup>(${i}) = </div>
            <input type="text" class="inputOfNumbers">
        </div>
        `
        )
    }

    btnResult.addEventListener('click', Result);
}

function getData() {
    let dataOfInputs = Array.from(document.querySelectorAll('.inputOfNumbers'), el => el.value);

    return dataOfInputs;
}

function getAfromGminus(data) {
    let arr = [];

    for (let t = 0; t < data.length; t++) {
        arr[t] = data[t].split(',');
    }
    for (let el in arr) {
        arr[el] = arr[el].map(parseFloat);
    }


    let matrixA = new Array();
    for (let i = 0; i < arr.length; i++) {
        matrixA[i] = new Array();
        for (let j = 0; j < arr.length; j++) {
            matrixA[i][j] = 0;
        }
    }

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (!isNaN(arr[i][j])) {
                matrixA[arr[i][j] - 1][i] = 1;
            }
        }
    }

    return matrixA;
}

function getQ(D) {
    let Q = 0;

    for (let i = 0; i < D.length; i++) {
        for (let j = 0; j < D.length; j++) {
            if (i == j)
                continue;
            Q += D[i][j];

        }
    }

    return Q;
}

function getQrel(D, Q) {
    let Qmin = D.length * (D.length - 1);
    let Qrel = (Q / Qmin) - 1;

    return Qrel;
}

function checkForInfinity(D) {
    for (let i = 0; i < D.length; i++) {
        for (let j = 0; j < D.length; j++) {
            if (D[i][j] == 999)
                return true;
        }
    }

    return false;
}

function convertIntoUndirectedGraph(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix.length; j++) {
            if (matrix[i][j] == 1)
                matrix[j][i] = 1;
        }
    }

    return matrix;
}

function floyd(d) {
    for (let i = 0; i < d.length; ++i)
        for (let j = 0; j < d.length; ++j)
            if (i == j)
                d[i][j] = 0;
            else if (d[i][j] == 0)
                d[i][j] = 999;

    for (let k = 0; k < d.length; ++k)
        for (let i = 0; i < d.length; ++i)
            for (let j = 0; j < d.length; ++j)
                if (d[i][k] + d[k][j] < d[i][j])
                    d[i][j] = Math.min(d[i][j], d[i][k] + d[k][j]);

    return d;
}

function outputQQrel(Q, Qrel, counted) {
    const dataEntry = document.querySelector('.data-output')
    if (counted == true) {
        dataEntry.innerHTML += `<li class="list-group-item">Q = ` + Q.toFixed(3) + '</li>';
        dataEntry.innerHTML += `<li class="list-group-item">Qrel = ` + Qrel.toFixed(3) + '</li>';
    }
    else if (counted == false) {
        dataEntry.innerHTML += `<li class="list-group-item">Q = - </li>`;
        dataEntry.innerHTML += `<li class="list-group-item">Qrel = - </li>`;
    }
}