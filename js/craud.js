// * product crud 
// &Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, set, ref, get, child, remove, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getStorage, ref as reff, uploadBytesResumable, getDownloadURL }
    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

//   *variables
// & web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBB8LsLnZMETABDpcJv7YWf8e7BiMNAQZ8",
    authDomain: "viral-store-eb345.firebaseapp.com",
    databaseURL: "https://viral-store-eb345-default-rtdb.firebaseio.com",
    projectId: "viral-store-eb345",
    storageBucket: "viral-store-eb345.appspot.com",
    messagingSenderId: "457082796918",
    appId: "1:457082796918:web:698e4f8c7be302110ad857",
    measurementId: "G-8R9QKEBG44"
};
// *Initialize Firebase
const app = initializeApp(firebaseConfig);
let db = getDatabase();
const storage = getStorage();

let products = document.getElementById("products");
let addBtn = document.getElementById('addBtn')
let updateBtn = document.getElementById('updateBtn')
window.showAlert = showAlert;
window.retProduct = retProduct;
window.deleteProduct = deleteProduct;
let fileItem;
let fileName;
// * events 
products.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validatAll()) {
        uploadImg();
        addProduct();
        getProducts();
        // clearForm();
    }
})
// * onlad get data
window.onload = getProducts()
// *events on delete button

// *event on upddate button in form 
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('btn') && event.target.classList.contains('updateFirebase')) {
        if (validatAll()) {
            uploadImg();
            updateProduct();
            addBtn.style.display = "block";
            updateBtn.style.display = "none";
            clearForm();
            getProducts()
        }
    }
});






//  &functions
function addProduct() {
    let productName = document.getElementById('productName');
    let productPrice = document.getElementById('price');
    let hiddenId = document.getElementById("hiddenId");
    let category = document.getElementById("catSelection");
    let quantity = document.getElementById("quantity");
    let description = document.getElementById("description");
    let productImage = document.getElementById("productImage");
    let rating = document.getElementById("rating");
    let id = Date.now();
    validatAll()
    set(ref(db, "products/" + id), {
        productName: productName.value,
        price: productPrice.value,
        category: category.value,
        quantity: quantity.value,
        description: description.value,
        productImage: `https://firebasestorage.googleapis.com/v0/b/viral-store-eb345.appspot.com/o/images%2F${fileName}?alt=media&token=48bb5f80-d6a7-4b34-9be1-4dd9dd75b6b0`,
        rating: rating.value,
        id: id,
    })
    getupdatedCount(category.value, true)
    pushProdcts(category.value, id)
}
function getupdatedCount(cate, casee) {
    let dbref = ref(db)
    get(child(dbref, `/categories/${cate}/productsCount`)).then((snapshot) => {
        let count = snapshot.val()
        if (casee) {
            var updatedCount = Number(count) + 1
            console.log(updatedCount);

        }
        else {
            var updatedCount = Number(count) - 1
            console.log(updatedCount);
        }
        update(ref(db, `categories/${cate}/`), {
            productsCount: updatedCount
        })

    })
}

function getProducts() {
    let dbref = ref(db)
    get(child(dbref, '/products')).then((snapshot) => {
        let storedProducts = snapshot.val()

        console.log(storedProducts);

        displayProduct(storedProducts);

    })
}

function pushProdcts(key, id) {
    let dbref = ref(db)
    get(child(dbref, '/categories/' + key)).then((snapshot) => {
        let updateProducts = snapshot.val().products
        updateProducts.push(id)
        // console.log(updateProducts);
        update(ref(db, "categories/" + key), {
            products: updateProducts
        })
    })
}



function getFile(e) {
    fileItem = e.target.files[0];
    console.log(e.target)
    fileName = fileItem.name;
}

window.getFile = getFile;
function uploadImg() {
    const storageRef = reff(storage, 'images/' + fileName);
    const uploadTask = uploadBytesResumable(storageRef, fileItem);
}
window.uploadImg = uploadImg;




function updateProduct() {
    let productName = document.getElementById('productName');
    let productPrice = document.getElementById('price');
    let hiddenId = document.getElementById("hiddenId");
    let category = document.getElementById("catSelection");
    let quantity = document.getElementById("quantity");
    let description = document.getElementById("description");
    let productImage = document.getElementById("productImage");
    let rating = document.getElementById("rating");
    let id = hiddenId.value
    update(ref(db, "products/" + id), {
        productName: productName.value,
        price: productPrice.value,
        category: category.value,
        quantity: quantity.value,
        rating: rating.value,
        description: description.value,
        productImage: `https://firebasestorage.googleapis.com/v0/b/viral-store-eb345.appspot.com/o/images%2F${fileName}?alt=media&token=48bb5f80-d6a7-4b34-9be1-4dd9dd75b6b0`,
    })
}

function deleteProduct(key, cate) {
    remove(ref(db, "products/" + key))
    console.log(cate);
    getupdatedCount(cate.id)
    getProducts();
}

function displayProduct(storedProducts) {
    let productList = ``
    let counet = 0
    if (storedProducts == null) {
        document.getElementById('diplayArea').innerHTML = ""
    }
    else {
        Object.keys(storedProducts).forEach((key) => {
            const product = storedProducts[key];
            productList += ` <tr id="${key}" class="productRow" >
                    <td>${++counet}</td>
                    <td> <img width="40px" src="${product.productImage}" alt=""></td>
                    <td>${product.productName}</td>
                    <td>${product.category}</td>
                    <td>${product.quantity}</td>
                    <td>${product.price}</td>
                    <td>${product.rating}</td>
                    <td><button  onclick="deleteProduct(${key},${product.category})" class="btn remove btnLight"><i class="fas fa-trash"></i></button></td>
                    <td><button  onclick="retProduct(${key}),showForm('productForm')" class="btn update btnLight"><i class="fa-solid fa-pen"></i></button></td>
                </tr>
            `;
        })
        document.getElementById('diplayArea').innerHTML = productList;
    }
}


function retProduct(id) {
    let dbref = ref(db)
    let productName = document.getElementById('productName');
    let productPrice = document.getElementById('price');
    let hiddenId = document.getElementById("hiddenId");
    let category = document.getElementById("catSelection");
    let quantity = document.getElementById("quantity");
    let description = document.getElementById("description");
    let productImage = document.getElementById("productImage");
    let rating = document.getElementById("rating");
    get(child(dbref, '/products/' + id)).then((snapshot) => {
        productName.value = snapshot.val().productName
        productPrice.value = snapshot.val().price
        category.value = snapshot.val().category
        quantity.value = snapshot.val().quantity
        description.value = snapshot.val().description
        hiddenId.value = snapshot.val().id
        rating.value = snapshot.val().rating
        // productImage.value = snapshot.val().productImage
        addBtn.style.display = "none"
        updateBtn.style.display = "block"
    })
}

function clearForm() {
    let productName = document.getElementById('productName');
    let productPrice = document.getElementById('price');
    let hiddenId = document.getElementById("hiddenId");
    let category = document.getElementById("catSelection");
    let quantity = document.getElementById("quantity");
    let description = document.getElementById("description");
    let rating = document.getElementById("rating");
    productName.value = "";
    productPrice.value = "";
    category.value = "";
    quantity.value = "";
    description.value = "";
    hiddenId.value = "";
    rating.value = "";
}
function validateForm(element) {
    let regex = {
        productName: /^[a-zA-Z 0-9 -_@&%]{3,}$/,
        price: /^[0-9]+$/,         // Match one or more digits
        catSelection: /^[a-zA-Z]{3,}$/,
        quantity: /^[0-9]+$/,      // Match one or more digits
        description: /^[\w\s !@#$%^&*-_]{3,}$/,  // Match at least 3 word characters or spaces
        rating: /^[0-9.]+$/        // Match digits and dots (allowing decimal numbers)
    };
    let elementId = element.id;
    let elementValue = element.value;
    if (regex[elementId].test(elementValue)) {
        element.nextElementSibling.style.display = "none";
        return true
    }
    else {
        element.nextElementSibling.style.display = "block";
        return false
    }
}

function validatAll() {
    if (validateForm(document.getElementById('productName')) &&
        validateForm(document.getElementById('price')) &&
        validateForm(document.getElementById('catSelection')) &&
        validateForm(document.getElementById('quantity')) &&
        validateForm(document.getElementById('description')) &&
        validateForm(document.getElementById('rating'))) {
        return true;
    }
    else {
        return false;
    }
}

function showAlert(element) {
    if (validateForm(element)) {
        element.nextElementSibling.style.display = "none";
    }
    else {
        element.nextElementSibling.style.display = "block";
    }
}
window.getSection = getSection
function getSection(sections) {
    document.getElementById(sections[0]).style.display = 'block'
    document.getElementById(sections[1]).style.display = 'none'
    document.getElementById(sections[2]).style.display = 'none'
    document.getElementById(sections[3]).style.display = 'none'
}
if (localStorage.getItem('canCreate') == "false") {
    document.getElementById('manage').style.display = 'none'
}
window.logout = logout
function logout() {
    window.location.replace('index.html', 'admin.html')

}

function getOrder() {
    let dbref = ref(db);
    get(child(dbref, '/orderRequest')).then((snapshot) => {
        let orders = snapshot.val();
        let cartona = '';
        for (let orderKey in orders) {
            if (orders.hasOwnProperty(orderKey)) {
                const order = orders[orderKey];
                const orderPrice = order.totalPrice;
                const orderName = order.name;
                const orderMail = order.mail;

                cartona += `
                <div class="product mainOrder" id="${orderKey}">
                                <div class=" product orderDetails">
                                    <h4>Total Order Price: ${orderPrice}</h4>
                                    <h3>Name: ${orderName}</h3>
                                    <h4>Mail: ${orderMail}</h4>
                                </div>
                                <div class="product productMedia ">
                                `;

                // Iterate through products within the current order
                const products = order.products;
                for (let productKey in products) {
                    if (products.hasOwnProperty(productKey)) {
                        const product = products[productKey];
                        if (product.productName == undefined) {
                            continue;
                        }
                        cartona += `<div  style="margin: 5px 8px;">
                                        <img src="${product.productImage}" height="50px">
                                        <p class="fs-10">${product.price} LE</p>
                                        </div>
                                    `;
                    }
                }
                if (order.isAccepted) {
                    cartona += `     
                    </div>
                                    <button class="btn update accept btnOrder" onclick="acceptOrder('${orderKey}')">Accepted </button>
                                </div>`
                        ;
                }
                else{
                    cartona += `     
                    </div>
                                    <button class="btn update  btnOrder" onclick="acceptOrder('${orderKey}')">Accept Order</button>
                                </div>`
                        ;
                }
            }
        }

        document.getElementById('requestedOrder').innerHTML = cartona;
    });
}
window.acceptOrder = acceptOrder
function acceptOrder(key) {
    update(ref(db, '/orderRequest/' + key), {
        isAccepted: true
    })
}
getOrder()
function getCompletedOrder() {
    let dbref = ref(db);
    get(child(dbref, '/completedOrder')).then((snapshot) => {
        let orders = snapshot.val();
        let cartona = '';
        for (let orderKey in orders) {
            if (orders.hasOwnProperty(orderKey)) {
                const order = orders[orderKey];
                // const orderPrice = order.totalPrice;
                const orderName = order.name;
                const orderMail = order.email;
                cartona += `
                <div class="product mainOrder compo" id="${orderKey}">
                                <div class=" product orderDetails">
                                    
                                    <h3>Name: ${orderName}</h3>
                                    <h4>Mail: ${orderMail}</h4>
                                </div>
                                <div class="product productMedia ">
                                `;

                // Iterate through products within the current order
                const products = order.products;
                for (let productKey in products) {
                    if (products.hasOwnProperty(productKey)) {
                        const product = products[productKey];
                        if (product.productName == undefined) {
                            continue;
                        }
                        cartona += `<div  style="margin: 5px 8px;">
                                        <img src="${product.productImage}" height="50px">
                                        <p class="fs-10">${product.price} LE</p>
                                        </div>
                                    `;
                    }
                }
                if (order.isAccepted) {
                    cartona += `     
                    </div>
                                    <button class="btn update accept btnOrder" onclick="acceptOrder('${orderKey}')">Accepted </button>
                                </div>`
                        ;
                }
                else{
                    cartona += `     
                    </div>
                    <div  class="product orderDetails">
                    <p>Client Feedback :</p>
                    <p>${order.feedback}</p>
                    </div>
                                </div>`
                        ;
                }
            }
        }

        document.getElementById('completedOrder').innerHTML = cartona;
    });
}
getCompletedOrder()
window.controlOrder=controlOrder
function controlOrder(sections) {
    document.getElementById(sections[0]).style.display = 'block'
    document.getElementById(sections[1]).style.display = 'none'
    document.getElementById(sections[2]).style.borderBottom = '1px solid #595fb8'
    document.getElementById(sections[3]).style.borderBottom = '0px'
}

// & showing form popup
window.closeSec = closeSec
function closeSec(element) {
    element.parentNode.parentNode.style.display = "none"
}
window.showForm = showForm
function showForm(element) {
    document.getElementById(element).style.display = 'block'
}
window.showNav = showNav
let flag = false
function showNav() {
    if (!flag) {
        flag = true
        document.getElementById('navCollection').classList.add('flex')
        document.getElementById('navCollection').classList.remove('none')
    }
    else {
        document.getElementById('navCollection').classList.add('none')
        document.getElementById('navCollection').classList.remove('flex')
        flag = false

    }

}
window.filterProduct = filterProduct
function filterProduct(element) {
    let term = element.value
    console.log(term);
    let dbref = ref(db)
    let count = 0
    get(child(dbref, '/products')).then((snapshot) => {
        let storedProducts = snapshot.val()
        let productList = ``
        Object.keys(storedProducts).forEach((key) => {
            const product = storedProducts[key];
            if (product.productName.includes(term)) {
                productList += ` <tr id="${key}" class="productRow" >
                    <td>${++count}</td>
                    <td> <img width="40px" src="${product.productImage}" alt=""></td>
                    <td>${product.productName}</td>
                    <td>${product.category}</td>
                    <td>${product.quantity}</td>
                    <td>${product.price}</td>
                    <td>${product.rating}</td>
                    <td><button  onclick="deleteProduct(${key},${product.category})" class="btn remove btnLight"><i class="fas fa-trash"></i></button></td>
                    <td><button  onclick="retProduct(${key}),showForm('productForm')" class="btn update btnLight"><i class="fa-solid fa-pen"></i></button></td>
                </tr>
            `;
            }
            document.getElementById('diplayArea').innerHTML = productList;
        })
    })
}
