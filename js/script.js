import {InsertData, SelectData, UpdateData, RemoveData, db} from "./module-firestore.js";
import { get, ref, child, update, remove} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

$(document).ready(function(){
    var pageIndex = 0;
    var folderCounter = 0;
  
    var table = "folder/";

    var folder = '<div class="folder" id="exam"><div class="backfolder textsection"><div class="title-exam" id="exam-title" ></div></div><div class="backfolder"></div><div class="paper paperBack"></div><div class="paper"></div><div class="frontfolder"><div class="contentbox">Date :</div><div class="contentbox left" id="exam-date"></div><div class="contentbox">Days to go :</div><div class="contentbox left" id="exam-days"></div><div class="contentbox">pg/day :</div><div class="contentbox left" id="exam-pag"></div><div class="contentbox">pages :</div><div class="contentbox left" id="exam-tot-pag"></div></div></div>';
  
    var pgDone = [], totPag = [], date = [], daysToGo = [] , pgDay = [], pgD, examTitle = [];
    let examIndex ;
  
    //element vars
    var body = $(".mainContainer");
    var section = $("section");
  
    //------------------------------FUNCTIONS
    //calculate days to go and pg / day
    function initValues(i){
      daysToGo.push( Math.floor((new Date(date[i][0],date[i][1],date[i][2]) - new Date()) / (1000*60*60*24)) - 30);
      pgD = Math.floor(totPag[i] / daysToGo[i]);
      pgDay.push((totPag[i] / daysToGo[i]) > pgD + 0.3? pgD + 1 : pgD );
    } 
  
    function setExamValues(i){
      $("#exam").attr("id", i);
      $("#" + i + " #exam-title").text(examTitle[i]);
      $("#" + i + " #exam-date").text(date[i][2]+"/"+date[i][1]+"/"+date[i][0]);
      $("#" + i + " #exam-days").text(daysToGo[i]);
      $("#" + i + " #exam-pag").text(pgDay[i]);
      $("#" + i + " #exam-tot-pag").text(pgDone[i]+"/"+totPag[i]);
    }
  
    function addFolder(){
      $('.main').append(folder);
      $(".folder").on("dblclick", function(){ 
        examIndex = parseInt($(this).attr("id"));
        setPage(2, examIndex);
      });
      $(".folder").on("click", function(){ 
        $(".folder").css("height","41px");
        if(window.innerWidth > 849){
          $(this).css("height", "320px");
        }
        else{
          $(this).css("height", "270px");
        }
      });
    }
  
    function changeTitle(i){
      var pageTitle = ["Manager", "New Exam", examTitle[i]];
      $("header .title").text(pageTitle[pageIndex]);
    }
  
    function setPage(i, en){
      pageIndex = i;
      changeTitle(en);
      switch(pageIndex){
        case 0:
          $("#back").css("display","none");
          $("header").css("grid-template-columns","1fr");
          $(".main").css("display", "block");
          $("#new").css("display","none");
          $("#update").css("display","none");
          $("#uSure").css("display", "none");
          $("footer").css("display", "block");
          body.css("padding","0");
          $(".title").css("padding","0 20px");
          section.css("height", "calc(100% - 174px)");
          break;
        case 1:
          $("#back").css("display","grid");
          $("header").css("grid-template-columns","50px auto"); 
          $(".main").css("display", "none");
          $("#new").css("display", "block");
          $("#update").css("display","none");
          $("footer").css("display", "none");
          body.css("padding","0 50px 50px 50px");
          $(".title").css("padding","0");
          section.css("height", "100%");
          break;
        case 2:
          $("#back").css("display","grid");
          $("header").css("grid-template-columns","50px auto"); 
          $(".main").css("display", "none");
          $("#new").css("display", "none");
          $("#update").css("display","block");
          $("#uSure").css("display", "none");
          $("footer").css("display", "none");
          body.css("padding","0 50px 50px 50px");
          $(".title").css("padding","0");
          section.css("height", "100%");
          break;
        case 3:
          $("#uSure").css("display", "flex");
          break;
      }
      $("input").val("");
    }
  
    function storeInputValues(){
      examTitle.push($("#newTitle").val());
      var newD = new Date($("#newDate").val());
      date.push([newD.getFullYear(), newD.getMonth()+1, newD.getDate()]);
      totPag.push(parseInt($("#newTotPage").val()));
      pgDone.push(0);
    }
  
    function insertIntoDb(){
      for(let i=0; i<folderCounter; i++){
        InsertData(table,i, examTitle[i], date[i], totPag[i], pgDone[i]);
      }
    }

    function GetAllData(){
      var i=0;
      const dbref = ref(db);
      get(child(dbref, "folder"))
      .then((snapshot)=>{
          var objs = [];
          snapshot.forEach(childSnapshot => {
            objs.push(childSnapshot.val());
            //store data into var
            examTitle.push( objs[i].title);
            date.push(objs[i].date);
            totPag.push( objs[i].nPage);
            pgDone.push(objs[i].nPageDone);

            initApp(i);
            i++;
            folderCounter = i;  
          });
          console.log(examTitle, date);
      });
    }

    function initApp(i){
      addFolder();
      initValues(i);
      setExamValues(i);
    }
  
    //---------------------------------events
    $("#back").on("click", function(){
      setPage(0,0);
    });
  
    $("#btnAddExam").on("click", function(){
      storeInputValues();
  
      addFolder();
      initValues(folderCounter);
      setExamValues(folderCounter);
  
      folderCounter += 1;

      setPage(0,0);
      insertIntoDb();

    });
  
    $("#btnNewExam").on("click", function(){
      setPage(1,0);
    });
  
    $("#btnUpdateExam").on("click", function(){
      pgDone[examIndex] += Number($("#upDone").val());
      pgDone[examIndex] -= Number($("#upUndone").val());
  
      if(pgDone[examIndex] > totPag[examIndex]){
        pgDone[examIndex] = totPag[examIndex];
      }
      else if(pgDone[examIndex] < 0){
        pgDone[examIndex] = 0;
      }

      initValues(examIndex);
  
      $("#" + examIndex + " #exam-tot-pag").text(pgDone[examIndex]+"/"+totPag[examIndex]);

      setPage(0,0);
      UpdateData(table, examIndex, pgDone[examIndex]);

    });
  
    $("#btnPassExam").on("click", function(){
      setPage(3,0);
    });
  
    $("#btnConfirmPassExam").on("click", function(){
      pgDone.splice(examIndex,1);
      totPag.splice(examIndex,1);
      date.splice(examIndex,1);
      daysToGo.splice(examIndex,1);
      pgDay.splice(examIndex,1);
      examTitle.splice(examIndex,1);
  
      $("#"+ examIndex).remove();

      setPage(0,0);
      RemoveData(table, examIndex);

    });
  
    $("#btnNoPassExam").on("click", function(){
      setPage(2,examIndex);
    });
  
    //-----------------------------------init
    setPage(0,0);
    //bug fix
    body.css("height", window.innerHeight);
    $(window).on("resize", function(){
      body.css("height", window.innerHeight);
    });
    GetAllData();
    
  });