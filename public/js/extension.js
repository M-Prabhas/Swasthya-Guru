var d=document.querySelector(".likes");
d.addEventListener("click", function (){
       d.innerHTML="💙";
      setTimeout(function(){
       d.innerHTML = "🤍";
     },1000);
       });

       $(".likes").on('click',function(event){
      var data={
           detail:event.target.getAttribute("flag")
         };
         $.post("/like",data,function(res,status,xhr){
          var publish=res.count;
          let stringed= publish.toString();
          document.querySelector("#number").innerHTML=stringed;
         });
       });

       $("button").on('click',function(e){
         var n={
           favasana:e.target.getAttribute("name")
         };

         $.post("/favourite",n,function(status,xhr){
              console.log(status);
         });
       });
