import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, set, ref, get, child, remove, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getStorage, ref as reff,uploadBytesResumable, getDownloadURL }
    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
// *varibles
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
let categories = document.getElementById("categories");
window.deleteCategory=deleteCategory;
window.retCategory=retCategory
window.showAlrt = showAlrt;
let updateBtnCategory=document.getElementById('updateBtnCategory')
let addBtnCategory=document.getElementById('addBtnCategory')
// *for getting img to upload
let fileItem;
let fileName;
window.getFileCat=getFileCat;
window.uploadImg=uploadImg;

// *events
categories.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validatAll()) {
        addCategory()
        getCategories();
        uploadImg();
        clearForm()
    }
})

// * onlad get data
window.onload = getCategories()
// *update category
updateBtnCategory.addEventListener('click',()=>{
    if (validatAll()) {
    updateCategory()
    getCategories()
    clearForm()
    updateBtnCategory.style.display='none'
    addBtnCategory.style.display='block'
    }
})
// *functions 
function addCategory() {
    let categoryName = document.getElementById('category');
    let productsCount = document.getElementById("productsCount");
    let image = document.getElementById("image");
    let id =Date.now();
    set(ref(db, "categories/" + categoryName.value), {
        categoryName: categoryName.value,
        productsCount: productsCount.value,
        image: `https://firebasestorage.googleapis.com/v0/b/viral-store-eb345.appspot.com/o/images%2F${fileName}?alt=media&token=48bb5f80-d6a7-4b34-9be1-4dd9dd75b6b0`,
        products:['init'],
        categoryId: id,
    })
}
function getCategories() {
    let dbref = ref(db)
    get(child(dbref, '/categories')).then((snapshot) => {
        let storedCategories = snapshot.val()
        
            displayCategories(storedCategories);
        
    })
}
// !get file&file name from input type file
function getFileCat(e){
    fileItem=e.target.files[0];
    console.log(e.target.files)
    fileName=fileItem.name;
  }
//   ~ upload file to firebase

function uploadImg(){
    const storageRef =reff(storage,'images/'+fileName);
    const uploadTask = uploadBytesResumable(storageRef,fileItem);
  }
  

function updateCategory() {
    let categoryName = document.getElementById('category');
    let productsCount = document.getElementById("productsCount");
    let image = document.getElementById("image");
    let categoryId = document.getElementById("categoryHiddenId");
    let id =categoryId.value;
    update(ref(db, "categories/" + categoryName.value), {
        categoryName: categoryName.value,
        productsCount: productsCount.value,
        image: `https://firebasestorage.googleapis.com/v0/b/viral-store-eb345.appspot.com/o/images%2F${fileName}?alt=media&token=48bb5f80-d6a7-4b34-9be1-4dd9dd75b6b0`,
        products:["init"]
    })
}


function deleteCategory(key) {
    remove(ref(db, "categories/" + key))
    getCategories();
}

function displayCategories(storedProducts) {
    let categoriesList = ``
    let counet = 0
    if (storedProducts==null) {
        document.getElementById('CategoriesDiplayArea').innerHTML =""
    }
    else{
    Object.keys(storedProducts).forEach((key) => {
        const category = storedProducts[key];
        categoriesList += ` <tr id="${key}" class="productRow" >
                    <td>${++counet}</td>
                    <td> <img width="40px" src="${category.image}" alt=""></td>
                    <td>${category.categoryName}</td>
                    <td>${category.productsCount}</td>
                    <td><button onclick="deleteCategory('${category.categoryName}')"  class="btn remove btnLight"><i class="fas fa-trash"></i></button></td>
                    <td><button onclick="retCategory('${category.categoryName}'),showForm('categoryForm')" class="btn update btnLight"><i class="fa-solid fa-pen"></i></button></td>
                </tr>
            `;
    })
    document.getElementById('CategoriesDiplayArea').innerHTML = categoriesList;
}
}
function retCategory(key) {
    let dbref = ref(db)
    let categoryName = document.getElementById('category');
    let productsCount = document.getElementById("productsCount");
    let image = document.getElementById("image");
    let categoryId = document.getElementById("categoryHiddenId");
    let addBtnCategory = document.getElementById("addBtnCategory");
    let updateBtnCategory = document.getElementById("updateBtnCategory");
    get(child(dbref, '/categories/'+ key)).then((snapshot) => {
        categoryName.value = snapshot.val().categoryName
        productsCount.value = snapshot.val().productsCount
        categoryId.value = snapshot.val().categoryId
        addBtnCategory.style.display = "none"
        updateBtnCategory.style.display = "block"
    })
}

function clearForm(params) {
    let categoryName = document.getElementById('category');
    let productsCount = document.getElementById("productsCount");
    let image = document.getElementById("image");
    let categoryId = document.getElementById("categoryHiddenId");
    categoryName.value=""
    productsCount.value=""
    image.value=""
    categoryId.value=""
}

function validateForm(element) {
    let regex = {
        category: /^[a-zA-Z 0-9 @&_-]{3,}$/,
        productsCount: /^[0-9]+$/,      // Match one or more digits
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
    if (validateForm(document.getElementById('category')) &&
        validateForm(document.getElementById('productsCount'))) {
        return true;
    }
    else {
        return false;
    }
}

function showAlrt(element) {
    if (validateForm(element)) {
        element.nextElementSibling.style.display = "none";
    }
    else {
        element.nextElementSibling.style.display = "block";
    }
}

function pushProdcts(key,id) {
    let dbref=ref(db)
    get(child(dbref, '/categories/'+ key)).then((snapshot) => {
        let updateProducts= snapshot.val().products
        updateProducts.push(id)
        // console.log(updateProducts);
        update(ref(db, "categories/" +key), {
            products:updateProducts
        })
    })
}

// pushProdcts('Clothes',555)

