//  import { getDatabase } from 'firebase/database';

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, set, ref, get, child, remove, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

let email = document.getElementById("email");
let password = document.getElementById("password");
let allUsers=[]
//authencation in firebase login


// * onlad get data
window.onload = getProducts()

let loginUser = evt => {
  //!hidden !error
  document.getElementById('err').style.display="none"
  document.getElementById('err').innerHTML=""
  evt.preventDefault();

if((validateInput(email)&&validateInput(password))!=true)
  {
    return
  }

  document.getElementById('loading').style.display='flex'
  let found=false
    Object.keys(allUsers).forEach((key)=>{
      const user=allUsers[key];  
      if(email.value.toLocaleLowerCase()==user.email.toLocaleLowerCase() && password.value==user.password)
            {
              console.log('true')
              localStorage.setItem('canCreate',user.userCreateCheck)
              window.location.replace('admin.html','index.html')
              found=true
              return ;
            }
       });
       if(!found){
         document.getElementById('err').innerHTML="incorrect email or password"
         document.getElementById('err').style.display="block"
        }
 
  //!display !error

//^loading
  setTimeout(()=>{
    document.getElementById('loading').style.display='none'
  },1000)
};


function getProducts() {
  let dbref = ref(db)
  get(child(dbref, '/listUser')).then((snapshot) => {
      allUsers = snapshot.val()   
      console.log(allUsers)
  })
}


// ^events
regForm.addEventListener("submit", loginUser);


function validateInput(element) {
    // password must begain with capital litter and contain number   
    var regix = {
      email: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
      password: /^[0-9]{6,}$/, 
    };
  
    if (regix[element.id]?.test(element.value) == true) {
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
      document.getElementById('err').style.display="none"
  }

  function invalid(element){
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
    element.nextElementSibling.style.display="block";  
    document.getElementById('err').style.display="none"
  }

  function clearValidatClass(element){
    if(element.value=='')
        {
            element.classList.remove("is-valid");
            element.classList.remove("is-invalid");
            element.nextElementSibling.style.display="none";  
          }
          document.getElementById('err').style.display="none"
         document.getElementById('err').innerHTML=""
  }
  window.clearValidatClass=clearValidatClass;
