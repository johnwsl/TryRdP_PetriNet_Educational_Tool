

if(localStorage.getItem('namecert')!=null)
{
    var x = localStorage.getItem('namecert');
    document.getElementById("nome").innerHTML = x;
}
else
{
    window.open("../error5.html", "_self");
}

    