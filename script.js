const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=25&page=1&sparkline=false`;

const container = document.getElementById('container');

getData(url);
let copyData;

// fetching data using the API
async function getData(url){
    await fetch(url)
        .then(response => response.json())
        .then(data => {
            // making a copy of the data, to update the table based on user input and to avoid simultaneous API calls on user inputs
            copyData = data;
            createTable(data);
        })
        .catch((error) =>{
            container.innerText = error.message;
            console.log(error);
        })
}


// no proper information about the sort method was given, hence I used these prarameters to get the sorted and updated data.
function sortByPercentage(){
    // const newUrl = url + '&order=price_change_percentage_24h_desc';
    // getData(newUrl);

    const sortedData = copyData.sort((a, b)=>{
        return b.price_change_percentage_24h - a.price_change_percentage_24h;
    });
    createTable(sortedData);
}

function sortByMarketCap(){
    // const newUrl = url + '&order=market_cap_desc';
    // getData(newUrl);
    const sortedData = copyData.sort((a, b)=>{
        return b.market_cap - a.market_cap;
    });
    createTable(sortedData);
}


// Implemented Debounce/Throttling to prevent continuous execution of the function.
const input = document.getElementById('search');
let timeout;
input.addEventListener('input', ()=>{
    clearTimeout(timeout);
    timeout = setTimeout(() =>{
        const userInput = input.value;
        createTable(copyData, userInput);
    }, 300);
})


// This function creates/updates the table 
async function createTable(data, input){
    const containerChild = document.getElementById('crypto-Table');

    // Filters the data and based on user input.
    if(input){
        data = await data.filter(obj =>{
            return obj.name.toLowerCase().includes(input) || obj.symbol.toLowerCase().includes(input) || obj.id.toLowerCase().includes(input);
        });
    }

    // Resets the container by removing the old data/table
    if(containerChild)
        container.removeChild(containerChild);

    const table = document.createElement('table');
    table.id = 'crypto-Table';

    // insert each data as a new row in the table
    data.forEach(obj => {
        createData(obj, table);
    });

    container.appendChild(table);
}


// Function to create a row and insert values into it.
function createData(obj, table){
    const tr = document.createElement('tr');
    tr.classList.add('currency');
    table.appendChild(tr);

    const colorClass = obj.price_change_percentage_24h < 0 ? 'loss' : 'profit';

    tr.innerHTML = `<td class="name">
                    <div class="wrapper">
                        <span class="logo">
                            <img src="${obj.image}" alt="${obj.id}">
                        </span>
                        <span class="coinName">
                            ${obj.name}
                        </span>
                    </div>
                    </td>
                    <td class="id">${obj.id}</td>
                    <td class="symbol">${obj.symbol.toUpperCase()}</td>
                    <td class="current-price">$${obj.current_price}</td>
                    <td class="total-volume">$${obj.total_volume}</td>
                    <td class="percentage-change ${colorClass}">${obj.price_change_percentage_24h}%</td>
                    <td class="mkt-cap">Mkt Cap:$${obj.market_cap}</td>`;
}



