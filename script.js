//selectors

const ostaInput = document.querySelector('.osta-input');
const ostaButton = document.querySelector('.osta-button');
const ostaList = document.querySelector('.osta-list');
const filterOption = document.querySelector(".filter-osta");

//events

document.addEventListener('DOMContentLoaded', getOstokset); //hakee localstoragen tiedot
ostaButton.addEventListener('click', addOsta);              //nappia painamalla lisää tuotteen listalle
ostaList.addEventListener('click', deleteCheck);            //nappia painamalla poistaa tuotteen listalta
filterOption.addEventListener('click', filterOsta);         //nappia painamalla avaa suodatuslistan

//functions

function addOsta(event){                          //Tämän funktion tehtävänä lisätä tuote listaan.
  event.preventDefault();                         //estää lomakkeen lähetyksen koska ei haluta lähettää mitään dataa minnekään, <form></form> elementtiä käytetään tavaroiden syöttämiseksi listalle.
  const ostaDiv = document.createElement('div');  //tekee 'osta' <div></div> elementin
  ostaDiv.classList.add("osta");
  const newOsta = document.createElement('li');   //tekee <li></li> elementin
  newOsta.innerText = ostaInput.value;            
  if(ostaInput.value.length == 0){                //Alert ikkuna jos yrittää syöttää tyhjää, voisi myös muuttaa toimintaa niin, että ilmoittaa myös liian lyhyistä syötteistä
    alert("Täytä kenttä");
    return;
  }else{
    ostaDiv.appendChild(newOsta);
  }
  //if(ostaInput.value.length <= 2){              Tässä vaihtoehtoinen malli, omasta mielestä kuitenkin tässä sovelluksessa riittää tyhjän kentän eston lähettäminen
  //alert("Täytä kenttään vähintään kolme (3) merkkiä, esimerkiksi "voi");
  //return;
  //}else{
  //  ostaDiv.appendChild(newOsta);
  //}
  newOsta.classList.add('osta-item');                         //lisää tuotteen
  saveLocalOstokset(ostaInput.value);                         //localstorage
  const completedButton = document.createElement('button');   //valmisnappi
  completedButton.innerHTML = '<i class="fas fa-check"></i>'
  completedButton.classList.add("complete-btn");
  ostaDiv.appendChild(completedButton);
  const trashButton = document.createElement('button');       //roskakorinappi
  trashButton.innerHTML = '<i class="fas fa-trash"></i>'
  trashButton.classList.add("trash-btn");
  ostaDiv.appendChild(trashButton);
  ostaList.appendChild(ostaDiv);
  ostaInput.value="";
}

function deleteCheck(e){                          //Tämä funktio poistaa tavaroita listalta
  const item = e.target;
  if(item.classList[0] === "trash-btn"){
    const osta = item.parentElement;
    osta.classList.add("vasen")                    //animaatio joka työntää listan tavaran vasemmalle roskisnappia painamalla
    removeLocalOstokset(osta);
    osta.addEventListener('transitionend', function(){
      osta.remove();
    });
  }
 if(item.classList[0] === "complete-btn"){
   const osta = item.parentElement;
   osta.classList.toggle("korissa")
 }
}

function filterOsta(e){                           //Tämä funktio erittelee valmiit ja keskeneräiset listan tavarat
  const ostokset = ostaList.childNodes;
  ostokset.forEach(function(osta){
    switch(e.target.value){
      case "kaikki":
        osta.style.display ='flex';
        break;
      case "korissa":
        if(osta.classList.contains('korissa')){
          osta.style.display = 'flex';
        }else{
          osta.style.display = 'none';
        }
        break;
      case "eiKeratty":
        if(!osta.classList.contains('korissa')){
          osta.style.display = 'flex';
        }else{
          osta.style.display = 'none';
        }
        break;
    }
  });
}

function saveLocalOstokset(osta){             //Tämän funktion kautta pidetään yllä LocalStorage tallennustilaa sovellukselle
  let ostokset;
  if(localStorage.getItem('ostokset') === null){
    ostokset = [];
  }else{
    ostokset = JSON.parse(localStorage.getItem('ostokset'));
  }
  ostokset.push(osta);
  localStorage.setItem('ostokset', JSON.stringify(ostokset));
}

function getOstokset(){                             //Tämä funktio hakee edellisellä kerralla lisätyt tuotteet takaisin selaimen localstoragesta
  let ostokset;
  if(localStorage.getItem('ostokset') === null){
    ostokset = [];
  }else{
    ostokset = JSON.parse(localStorage.getItem('ostokset'));
  }
  ostokset.forEach(function(osta){
    const ostaDiv = document.createElement('div');  //tekee 'osta' <div></div> elementin
    ostaDiv.classList.add("osta");
    const newOsta = document.createElement('li');     //tekee <li></li> elementin
    newOsta.innerText = osta;
    newOsta.classList.add('osta-item');
    ostaDiv.appendChild(newOsta);
    const completedButton = document.createElement('button');   //valmisnappi
    completedButton.innerHTML = '<i class="fas fa-check"></i>'
    completedButton.classList.add("complete-btn");
    ostaDiv.appendChild(completedButton);
    const trashButton = document.createElement('button');    //roskakorinappi
    trashButton.innerHTML = '<i class="fas fa-trash"></i>'
    trashButton.classList.add("trash-btn");
    ostaDiv.appendChild(trashButton);
    ostaList.appendChild(ostaDiv);
  });
}

function removeLocalOstokset(osta){               //Tämä funktio poistaa tavaroita localstoragesta
  let ostokset;
  if(localStorage.getItem('ostokset') === null){
    ostokset = [];
  }else{
    ostokset = JSON.parse(localStorage.getItem('ostokset'));
  }
  const ostaIndex = osta.children[0].innerText;
  ostokset.splice(ostokset.indexOf(ostaIndex), 1);
  localStorage.setItem("ostokset", JSON.stringify(ostokset));
}
