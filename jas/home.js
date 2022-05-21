const hamburger =document.querySelector(".menubutton");
const navMenu=document.querySelector(".navbar");

hamburger.addEventListener("click",mobilemenu);

function mobilemenu(){
  hamburger.classList.toggle("display");
  navMenu.classList.toggle("display");
}
