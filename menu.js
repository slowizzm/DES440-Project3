document.addEventListener('DOMContentLoaded', function(){
  var checkbox = document.querySelector('#nav-toggle');
  var checkboxLabel = document.querySelector('#nav-toggle-label');

  function removeActive(){
    checkboxLabel.classList.remove('nav-toggle-label--active');
  }

  checkbox.onclick = function(){
    if (checkbox.checked){
      checkboxLabel.classList.add('nav-toggle-label--active');
    } else{
      removeActive();
    }
  };

  var menu = document.querySelector('.ham');
  menu.onclick = function(){
    removeActive();
    checkbox.checked = false;
  };

});
