document.querySelector(".menubutton").addEventListener("click", function (){
        document.querySelector(".menubutton").classList.toggle("clicked");
        document.querySelector(".menubar").classList.toggle("display");
       });

       window.history.pushState(null, "", window.location.href);
       window.onpopstate = function () {
           window.history.pushState(null, "", window.location.href);
       };


const div = document.querySelector(".matchedUsers");
    document.querySelector(".searchBar input").addEventListener("input", function(evt){
             var req = { user: evt.target.value };
             if(evt.target.value.trim().length){
            $.post("/search", req, function(res,status){
                  div.classList.add("showUsers");
                  var html = "";
                  for(var i = 0; i < res.users.length; i++){
                     html += "<a href='/prof/" + res.users[i]._id + "'><div class='searchedUser'><img src='/images/" + res.users[i].picture + ".jfif'>" + res.users[i].username + "</div></a>"
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

document.querySelector(".changeAvatar button").addEventListener("click", function(){
         console.log(document.querySelector(".avatars").classList);
         document.querySelector(".avatars").classList.toggle("hide");
         document.querySelector(".avatars").classList.toggle("show");
});

// profile
document.querySelectorAll(".image img").forEach(img =>{
         img.addEventListener("click", function(evt){
             var req = {
               avt: evt.target.getAttribute("title")
             };
             $.post("/changeAvatar",req,function(res,status){
                  document.querySelector(".profile img").setAttribute("src","/images/" + req.avt + ".jfif");
                  document.querySelector(".span").innerHTML = "photo changed!";
                   document.querySelector(".avatars").classList.toggle("hide");
                  document.querySelector(".avatars").classList.toggle("show");
                  setTimeout(function(){
                      document.querySelector(".span").innerHTML = "Change picture";
                  },3000);
             });
         });
});
//
// let show=true;
document.querySelector("#nomine").addEventListener("click", function(){
            document.querySelector(".favoritelist").classList.toggle("hideFav");
            document.querySelector(".favoritelist").classList.toggle("show1")
});
//
document.querySelector("#mining").addEventListener("click", function(){
  document.querySelector(".favoritelist").classList.toggle("hideFav");
  document.querySelector(".favoritelist").classList.toggle("show1");
});

document.querySelector(".favoritelist p").addEventListener("click",function(event){
  var info={
     gum:event.target.getAttribute("num")
};
console.log(event.target.num);
  $.post("/cancel",info,function(res,status){

 });
});

// $(".fav").on('click',function(event){
//   const n=this.name;
//  console.log(n);
//   var data={
//     name:n
//   }
//
//   $.post("/favorite",function(data,status,xhr){
//     console.log(status);
//
//     console.log("successfully added to favourites");
//   });
// });
