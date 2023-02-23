document.querySelector(".menubutton").addEventListener("click", function (){
        document.querySelector(".menubutton").classList.toggle("clicked");
        document.querySelector(".menubar").classList.toggle("display");
       });


       const div = document.querySelector(".matchedUsers");
           document.querySelector(".searchBar input").addEventListener("input", function(evt){
                    var req = { asana: evt.target.value };
                    if(evt.target.value.trim().length){
                   $.post("/searchasanas", req, function(res,status){
                         div.classList.add("showUsers");
                         var html = "";
                         for(var i = 0; i < res.asanas.length; i++){
                            html += "<a href='/asanas/" + res.asanas[i].name + "'><div class='searchedUser'>"+ res.asanas[i].name + "</div></a>"
                         }
                         div.innerHTML = html;
                      });
                    }else{
                      div.innerHTML = "";
                      div.classList.remove("showUsers");
                    }
           });

           document.querySelector(".searchBar input").addEventListener("blur",function(){
                    if(document.querySelector(".searchBar input").value === ""){
                      this.value = "";
                      div.innerHTML = "";
                      div.classList.remove("showUsers");
                    }
           });
