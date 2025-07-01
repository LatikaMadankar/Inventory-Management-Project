let inventory = [];

let form = document.querySelector("#addItem-form");
let tableBody = document.querySelector("#tableBody");
let totalItemDisplay = document.querySelector(".item-count");
let lowstockDisplay = document.querySelector(".low-stock-count");
let searchInput = document.querySelector("#searchInput");

form.addEventListener("submit", function(e){
    e.preventDefault();

    let name = document.querySelector("#item-name").value.trim();
    let category = document.querySelector("#item-category").value.trim();
    let quantity = parseInt(document.querySelector("#item-quantity").value);

    inventory.push({name, category, quantity});
    //row created
    let tr = document.createElement("tr");

    let status = quantity < 10 ? "Low" : "Sufficient";
    let statusClass = quantity < 10 ? "low" : "sufficient";

    tr.innerHTML = `
        <td>${name}</td>
        <td>${category}</td>
        <td>${quantity}</td>
        <td>
        <div class="status-wrapper">
            <span class="status ${statusClass}">${status}</span>
                <img src="./images/delete.png" alt="Delete" class="delete-icon" title="Delete">
            </div>
        </td>
    `;
    //delete button
    let deleteBtn = tr.querySelector(".delete-icon");
    deleteBtn.addEventListener("click", () => {
        tr.remove();
        let index = inventory.findIndex(item => item.name === name && item.category === category && item.quantity === quantity);
        if (index !== -1) inventory.splice(index, 1);
        updateStats();
        saveToStorage();
    });

    tableBody.appendChild(tr);
    updateStats();
    saveToStorage();
    form.reset();
});

function updateStats() {
    totalItemDisplay.textContent = inventory.length;
    let lowCount = inventory.filter(item => item.quantity <10).length;
    lowstockDisplay.textContent = lowCount;
}

function saveToStorage() {
    localStorage.setItem("inventoryData", JSON.stringify(inventory));
}

function loadFromStorage() {
    inventory = [];
    tableBody.innerHTML = "";
    
    let data = localStorage.getItem("inventoryData");
    if (data) {
        const savedInventory = JSON.parse(data);
        savedInventory.forEach(item => {
            inventory.push(item);
            addItemToTable(item.name, item.category, item.quantity);
        });
        
    }else {
  
    let defaultItems = [
      { name: "ERW Steel Tubes", category: "Welded Tubes", quantity: 120 },
      { name: "Boiler Tubes", category: "Industrial Tubing", quantity: 70 },
      { name: "Metal Sheets", category: "Raw Materials", quantity: 80 },
      { name: "Pipe Fittings	", category: "Accessories", quantity: 5 },
      { name: "Galvanized Steel Pipes	", category: "Welded Tubes", quantity: 85 },
      { name: "Heat Exchanger Tubes	", category: "Industrial Tubing	", quantity: 6 },
    ];

    defaultItems.forEach(item => {
      inventory.push(item);
      addItemToTable(item.name, item.category, item.quantity);
    });

    saveToStorage();
  }   
  updateStats();
}    

searchInput.addEventListener("keyup", () => {
    let filter = searchInput.value.toLowerCase();
    let rows = tableBody.querySelectorAll("tr");

    rows.forEach(row=>{
        let itemName = row.cells[0].textContent.toLowerCase();
        let itemCategory = row.cells[1].textContent.toLowerCase();
        let match = itemName.includes(filter) || itemCategory.includes(filter);
        row.style.display = match ? "" : "none";
    });
});


function addItemToTable(name, category, quantity) {
    let tr = document.createElement("tr");

    let status = quantity < 10 ? "Low" : "Sufficient";
    let statusClass = quantity < 10 ? "low" : "sufficient";

    tr.innerHTML = `
        <td>${name}</td>
        <td>${category}</td>
        <td>${quantity}</td>
        <td>
            <div class="status-wrapper">
                <span class="status ${statusClass}">${status}</span>
                <img src="./images/delete.png" alt="Delete" class="delete-icon" title="Delete">
            </div>
        </td>
    `;

    let deleteBtn = tr.querySelector(".delete-icon");
    deleteBtn.addEventListener("click", () => {
        tr.remove();
        let index = inventory.findIndex(item => item.name === name && item.category === category && item.quantity === quantity);
        if (index !== -1) inventory.splice(index, 1);
        updateStats(); 
        saveToStorage();
    });

    tableBody.appendChild(tr);
}

loadFromStorage();
