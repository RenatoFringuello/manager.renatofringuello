// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, set, get, ref, child, update, remove} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCWtMvqYRuNIJpSaPtoQiEoeIqneR_qYXE",
    authDomain: "managerapp-d1fc0.firebaseapp.com",
    databaseURL: "https://managerapp-d1fc0-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "managerapp-d1fc0",
    storageBucket: "managerapp-d1fc0.appspot.com",
    messagingSenderId: "366794643564",
    appId: "1:366794643564:web:abbc9ceac46ca21fd26049"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
//table = "<TABLE_NAME>/"

function InsertData(table, id, title, date, nPage, nPageDone){
    set(ref(db, table + id),{
        title: title,
        date: date,
        nPage: nPage,
        nPageDone: nPageDone
    })
    .then(()=>{
        console.log("stored!");
    })
    .catch((error)=>{
        console.log("error: "+ error );
    });
}

function SelectData(table, id, titleVar, dateVar, nPageVar, nPageDoneVar){
    const dbref = ref(db);
    get(child(dbref, table + id)).then((snapshot)=>{
        if(snapshot.exists()){
            titleVar = snapshot.val().title;
            dateVar = snapshot.val().date;
            nPageVar = snapshot.val().nPage;
            nPageDoneVar = snapshot.val().nPageDone;
        }
        else{
            console.log("no data found");
        }
    })
    .catch((error)=>{
        console.log("select error: "+error);
    });
}

function UpdateData(table, id, nPageDone){
    update(ref(db, table + id),{
        nPageDone: nPageDone,
    })
    .then(()=>{
        console.log("updated!");
    })
    .catch((error)=>{
        console.log("error: "+ error );
    });
}

function RemoveData(table, id){
    remove(ref(db, table + id))
    .then(()=>{
        console.log("removed!");
    })
    .catch((error)=>{
        console.log("error: "+ error );
    });
}

export {InsertData, SelectData, UpdateData, RemoveData, db};