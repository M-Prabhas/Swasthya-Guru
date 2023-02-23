
window.history.pushState(null, "", window.location.href);
window.onpopstate = function () {
    window.history.pushState(null, "", window.location.href);
};

document.querySelector("#nomine").addEventListener("click", function(){
            document.querySelector(".favoritelist").classList.toggle("hideFav");
            document.querySelector(".favoritelist").classList.toggle("show1")
});
//
document.querySelector("#mining").addEventListener("click", function(){
  document.querySelector(".favoritelist").classList.toggle("hideFav");
  document.querySelector(".favoritelist").classList.toggle("show1");
});



$("button").on("click",function(event){

   var send={
     othername:this.value
   }
   $.post("/follow",send);

});

$(".close").on("click",function(event){

console.log(evt.target);


});
