

function registrarcert() {
  var x = document.getElementById("myForm").elements[0].value;

  if(localStorage.getItem('namecert')!=null)
  {
    vex.dialog.alert({//Com o uso da biblioteca VEX
      message: 'O nome já foi registrado como: '+localStorage.getItem('namecert')+'.', 
      className: 'vex-theme-default'});      
      setTimeout(function(){ window.open('../certificado.html', '_blank'); }, 2000);
  }  
  else if(x!='')
  {
      vex.dialog.confirm({//Com o uso da biblioteca VEX
        message: 'O seu nome completo: '+ x + ',' +'está correto?',
        className: 'vex-theme-default',
        callback: function (value) {
          if (value) 
          {
            localStorage.setItem('namecert', x);
            window.open('../certificado.html', '_blank');
          } 
        }
      });
  }
  else
  {
    vex.dialog.alert({//Com o uso da biblioteca VEX
      message: 'Você não digitou o seu nome.', 
      className: 'vex-theme-default'}); 
  }
}
