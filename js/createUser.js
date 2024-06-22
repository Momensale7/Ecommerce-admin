//  import { getDatabase } from 'firebase/database';

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, set, ref, get, child, remove, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js'


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
const app = initializeApp(firebaseConfig);
let db = getDatabase();
let name= document.getElementById("name");
let email = document.getElementById("email");
let passwordCreate = document.getElementById("passwordCreate");
let rePass = document.getElementById("rePass");
let userCreateCheck = document.getElementById("userCreateCheck");
let regForm = document.getElementById("regForm");
//authencation in firebase login

// * onlad get data
window.onload = getUsers()

function clearInput() {
    name.value='';
    email.value='';
    passwordCreate.value='';
    rePass.value='';
    userCreateCheck.checked = false;
}
let createUserAdmin = evt => {
    evt.preventDefault();
    let id =  Date.now();
    if((validateInput(name)&&validateInput(email)&&validateInput(passwordCreate)&&validateInput(rePass))!=true)
        {
            return
        }
        // document.getElementById('loading').style.display='flex'
    console.log('corrrext')

    set(ref(db, "listUser/"+id ), {
        name: name.value,
        email: email.value,
        password: passwordCreate.value,
        userCreateCheck:userCreateCheck.checked?true:false,
    })
    getUsers() ;
    clearInput()
    //    document.getElementById('loading').style.display='none'
};

regForm.addEventListener("submit", createUserAdmin);


function validateInput(element) {
    // password must begain with capital litter and contain number
    console.log(element.nextElementSibling)
   
    var regix = {
      signInEmail: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
      signInPass: /^[0-9]{6,}$/,
      name: /^([a-zA-Z]{1,10})?(\s{1,})?([a-zA-Z]{1,10})?(\s{1,})?([a-z]{1,10})?$/,
      email: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
      passwordCreate: /[0-9]{6,}$/,
      rePass: /^(?=.*?[a-z])?(?=.*?[A-Z])(?=.*?[0-9]).{2,}$/,
    };
    if(element.id=='rePass'){
        console.log(passwordCreate.value==element.value)
        console.log(passwordCreate.value)
        if(passwordCreate.value==element.value)
            {
                valid(element)
                return true;

            }else{
                invalid(element)
                return false;

            } 
        
    }
    if (regix[element.id].test(element.value) == true) {
        valid(element)
        return true;

    } else {
        invalid(element)
        return false;

    }
  }
window.validateInput=validateInput;

   function valid(element){
      element.classList.add("is-valid");
      element.classList.remove("is-invalid");
      element.nextElementSibling.style.display="none"; 
      return true;
  }

  function invalid(element){
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
    element.nextElementSibling.style.display="block";  
    return false;
  }

  function clearValidatClass(element){
    if(element.value=='')
        {
            element.classList.remove("is-valid");
            element.classList.remove("is-invalid");
            element.nextElementSibling.style.display="none";  
            document.getElementById('err').style.display='none'
            document.getElementById('err').innerHTML=''

        }
  }
  window.clearValidatClass=clearValidatClass;

  function getUsers() {
    let dbref = ref(db)
    get(child(dbref, '/listUser')).then((snapshot) => {
        let users = snapshot.val()      
        console.log(users);
        displayuser(users);
    })
}
  function displayuser(usersArr) {
    let usersList = ``
    let counet = 0
    if (usersArr == null) {
        document.getElementById('diplayArea').innerHTML = ""
    }
    else {
        Object.keys(usersArr).forEach((key) => {
            const user = usersArr[key];
            usersList += ` <tr id="${key}" class="productRow" >
                    <td>${++counet}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td><button  onclick="deleteUser(${key})" class="btn remove btnLight"><i class="fas fa-trash"></i></button></td>
                </tr>
            `;
        })
        document.getElementById('displayAreaCreate').innerHTML = usersList;
    }
}
function deleteUser(key) {
    remove(ref(db, "listUser/" + key))
    getUsers();
}
window.deleteUser =  deleteUser;


