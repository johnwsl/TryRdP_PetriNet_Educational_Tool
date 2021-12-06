/*/ Identifica se o browser é da Microsoft (não compatível com a aplicação)
function detectIE() {
    var ua = window.navigator.userAgent;
  
    // Test values; Uncomment to check result …
  
    // IE 10
    // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
    
    // IE 11
    // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
    
    // Edge 12 (Spartan)
    // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
    
    // Edge 13
    // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';
  
    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older => return version number
      // parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
      return true;
    }
  
    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      // var rv = ua.indexOf('rv:');
      // parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
      return true;
    }
  
    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      //parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
      return true;
    }
  
    // other browser
    return false;
  }

if(detectIE()==true)
{
    if(window.location.pathname.indexOf("index.html")!=-1)
    {    
        window.open('error.html', "_self");
    }
    else
    {
        window.open("../error.html", "_self");
    }
}*/
//////////////////////////////////////////////////////////////////////////////////////

if (typeof(Storage) !== "undefined")//Observa se o browser suporta web storage 
{
    //Cria o array heuristica para marcar as páginas que foram visitadas pelo o usuário
    //Variável do localstorage marcada como 'heuristica' representa as páginas gerais visitadas pelo usuário
    //Variável do localstorage marcada como 'heuristicaresp' armasena as questões que o usuário viu as respostas
    if(localStorage.getItem("heuristica")==null)
    {
        var heuristica = [];
        localStorage.setItem("heuristica", JSON.stringify(heuristica)); 
    }
    if(localStorage.getItem("heuristicaresp")==null)
    {
        var heuristicaresp = [];
        localStorage.setItem("heuristicaresp", JSON.stringify(heuristicaresp));
    }

    //Marca os títulos dos capítulos visitados pelo usuário
    var tagcap = document.querySelectorAll("a.nav-link.collapsed");
    var pthnome = window.location.pathname;
    if(pthnome.indexOf("cap1")!=-1)
    {
        if(localStorage.getItem("cap1")==null)
        {
            localStorage.setItem("cap1","0");
        }
    }
    else if(pthnome.indexOf("cap2")!=-1)
    {
        if(localStorage.getItem("cap2")==null)
        {
            localStorage.setItem("cap2","0");
        }
    }
    else if(pthnome.indexOf("cap3")!=-1)
    {
        if(localStorage.getItem("cap3")==null)
        {
            localStorage.setItem("cap3","0");
        }
    }

    if(localStorage.getItem("cap1")!=null)
    {
        tagcap[0].style.color = 'white'
    }
    if(localStorage.getItem("cap2")!=null)
    {
        tagcap[1].style.color = 'white'
    }
    if(localStorage.getItem("cap3")!=null)
    {
        tagcap[2].style.color = 'white'
    }

    //Modifica o 'parent node' do container que mostra a pontuação
    var parent = document.querySelectorAll("div.sb-sidenav-menu-heading");
    parent[0].appendChild(document.querySelectorAll("div.sb-sidenav-footer")[0]);
    document.querySelectorAll("div.sb-sidenav-footer")[0].style.background = '#212529';
    document.querySelectorAll("a.btn.btn-outline-secondary.btn-sm")[0].style.fontSize = 'x-small';

    //Modifica o link que redireciona para a página de apresentação 
    var atag= document.querySelectorAll("a.nav-link");
    if(window.location.pathname.indexOf("apres.html")!=-1){
        atag[0].href = "apres.html";
    }
    else{
        atag[0].href = "../apres.html";
    }

    //Remove as três tags de navegação inicialmente colocadas nas páginas
    var navs = document.getElementsByClassName("sb-sidenav-menu-nested nav");
    navs[0].remove(); navs[0].remove(); navs[0].remove();

    //Adiciona tags de navegação ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if(window.location.pathname.indexOf("apres.html")!=-1)
    {    
        var tagscap1 =          "<nav class='sb-sidenav-menu-nested nav'>"+
                                    "<a class='nav-link'  href='cap1/introducaoasredesdepetri.html'>1.1 Introdução às Redes de Petri</a>"+
                                    "<a class='nav-link'  href='cap1/elementosbasicos.html'>1.2 Elementos básicos (lugares, transições, arcos e tokens)</a>"+
                                    "<a class='nav-link'  href='cap1/elementosbasicosumexemplo.html'>1.3 Elementos básicos (exemplo 1)</a>"+
                                    "<a class='nav-link'  href='cap1/elementosbasicosexemplodois.html'>1.4 Elementos básicos (exemplo 2)</a>"+
                                    "<a class='nav-link'  href='cap1/ferramentausoqcb.html'>Exercício do tipo quebra-cabeça</a>"+ 
                                    "<a class='nav-link'  href='cap1/exerciciofixacaoqcb1.html'>Exercício de Fixação 1 </a>"+   
                                    "<a class='nav-link'  href='cap1/exerciciofixacaoqcb2.html'>Exercício de Fixação 2  </a>"+
                                    "<a class='nav-link'  href='cap1/funcionamentocondicao.html'>1.5 Conceitos fundamentais das redes de Petri (pré-condição, disparo e pós-condição) </a>"+
                                    "<a class='nav-link'  href='cap1/funcionamentocondicaoumexemplo.html'>1.6 Conceitos fundamentais das redes de Petri (pré-condição, disparo e pós-condição) - Exemplo</a>"+
                                    "<a class='nav-link'  href='cap1/ferramentauso.html'>Exercício de Modelagem </a>"+
                                    "<a class='nav-link'  href='cap1/exerciciofixacao3.html'>Exercício de Fixação 3 </a>"+
                                    "<a class='nav-link'  href='cap1/exerciciofinal1.html'>Exercício Final 1</a>"+
                                "</nav>";

        var tagscap2 =          "<nav class='sb-sidenav-menu-nested nav'>"+
                                    "<a class='nav-link' href='cap2/modelbasica.html'>2 Modelagem Básica</a>"+
                                    "<a class='nav-link' href='cap2/redesequencia.html'>2.1 Redes Elementares (Sequenciamento)</a>"+
                                    "<a class='nav-link' href='cap2/rededistribuicao.html'>2.2 Redes Elementares (Distribuição)</a>"+
                                    "<a class='nav-link' href='cap2/cap2exfixqcb1.html'>Exercício de Fixação 4</a>"+
                                    "<a class='nav-link' href='cap2/redejoin.html'>2.3 Redes Elementares(Junção)</a>"+
                                    "<a class='nav-link' href='cap2/cap2exfixqcb2.html'>Exercício de Fixação 5</a>"+
                                    "<a class='nav-link' href='cap2/redeescolha.html'>2.4 Redes Elementares (Escolha Não-Determinística)</a>"+
                                    "<a class='nav-link' href='cap2/cap2exfixqcb3.html'>Exercício de Fixação 6</a>"+
                                    "<a class='nav-link' href='cap2/buffer.html'>2.5 Modelagem com Buffer</a>"+
                                    "<a class='nav-link' href='cap2/cap2exfixqcb4.html'>Exercício de Fixação 7</a>"+
                                    "<a class='nav-link' href='cap2/arcoinibidor.html'>2.6 Modelagem com Arco Inibidor</a>"+ 
                                    "<a class='nav-link' href='cap2/arcoinibidorexemplo.html'>2.7 Modelagem com Arco Inibidor (exemplo)</a>"+
                                    "<a class='nav-link' href='cap2/cap2exfixqcb5.html'>Exercício de Fixação 8</a>"+
                                    "<a class='nav-link' href='cap2/arcomultivalor.html'>2.8 Modelagem com Arcos Multivalorados</a>"+
                                    "<a class='nav-link' href='cap2/cap2exfixqcb6.html'>Exercício de Fixação 9</a>"+
                                    "<a class='nav-link' href='cap2/estocastico.html'>2.9 Rede de Petri Estocástica</a>"+
                                    "<a class='nav-link' href='cap2/estocasticoimediata.html'>2.10 Rede de Petri Estocástica (transição imediata e exemplo)</a>"+
                                    "<a class='nav-link' href='cap2/estocasticofila.html'>2.11 Modelo de Fila e Exemplos</a>"+
                                    "<a class='nav-link' href='cap2/exmodelagem.html'>Exercício de Modelagem (arco inibidor e transição imediata)</a>"+
                                    "<a class='nav-link' href='cap2/cap2exfix1.html'>Exercício de Fixação 10</a>"+
                                    "<a class='nav-link' href='cap2/cap2exfix2.html'>Exercício de Fixação 11</a>"+
                                    "<a class='nav-link' href='cap2/cap2exfix3.html'>Exercício de Fixação 12</a>"+
                                    "<a class='nav-link' href='cap2/cap2exfix4.html'>Exercício de Fixação 13</a>"+
                                    "<a class='nav-link' href='cap2/disponibilidade.html'>2.12 Modelo de Falha e Reparo</a>"+
                                    "<a class='nav-link' href='cap2/cap2exfix5.html'>Exercício de Fixação 14</a>"+
                                    "<a class='nav-link' href='cap2/cap2exfix6.html'>Exercício de Fixação 15</a>"+
                                    "<a class='nav-link' href='cap2/cap2exfinal1.html'>Exercício Final 2</a>"+
                                    "<a class='nav-link' href='cap2/cap2exfinal2.html'>Exercício Final 3</a>"+
                                "</nav>";


        var tagscap3 =          "<nav class='sb-sidenav-menu-nested nav'>"+
                                        "<a class='nav-link' href='cap3/modelav.html'>3 Modelagem Avançada</a>"+
                                        "<a class='nav-link' href='cap3/metricas.html'>3.1 Métricas</a>"+
                                        "<a class='nav-link' href='cap3/cap3exfix1.html'>Exercício de Fixação 16</a>"+
                                        "<a class='nav-link' href='cap3/cap3exfix2.html'>Exercício de Fixação 17</a>"+
                                        "<a class='nav-link' href='cap3/imediataprioridade.html'>3.2 Transição Imediata (Prioridade)</a>"+
                                        "<a class='nav-link' href='cap3/cap3exfix3.html'>Exercício de Fixação 18</a>"+
                                        "<a class='nav-link' href='cap3/imediatapeso.html'>3.3 Transição Imediata (Peso)</a>"+
                                        "<a class='nav-link' href='cap3/cap3exfix4.html'>Exercício de Fixação 19</a>"+
                                        "<a class='nav-link' href='cap3/imediataguarda.html'>3.4 Transição Imediata (Expressão de Guarda)</a>"+
                                        "<a class='nav-link' href='cap3/cap3exfix5.html'>Exercício de Fixação 20</a>"+
                                        "<a class='nav-link' href='cap3/filas.html'>3.5 Filas e Lei de Little</a>"+
                                        "<a class='nav-link' href='cap3/filasexemplos.html'>3.6 Filas e Lei de Little (exemplos)</a>"+
                                        "<a class='nav-link' href='cap3/cap3exfix6.html'>Exercício de Fixação 21</a>"+
                                        "<a class='nav-link' href='cap3/cap3exfix7.html'>Exercício de Fixação 22</a>"+
                                        "<a class='nav-link' href='cap3/redefilas.html'>3.7 Rede de Filas Aberta</a>"+
                                        "<a class='nav-link' href='cap3/cap3exfix8.html'>Exercício de Fixação 23</a>"+
                                        "<a class='nav-link' href='cap3/performace.html'>3.8 Modelos de Performance</a>"+
                                        "<a class='nav-link' href='cap3/cap3exfix9.html'>Exercício de Fixação 24</a>"+
                                        "<a class='nav-link' href='cap3/disp.html'>3.9 Modelos de Disponibilidade</a>"+
                                        "<a class='nav-link' href='cap3/cap3exfix10.html'>Exercício de Fixação 25</a>"+
                                        "<a class='nav-link' href='cap3/performabilidade.html'>3.10 Modelos de Performabilidade</a>"+
                                        "<a class='nav-link' href='cap3/cap3exfix11.html'>Exercício de Fixação 26</a>"+
                                        "<a class='nav-link' href='cap3/cap3exfinal1.html'>Exercício Final 4</a>"+
                                        "<a class='nav-link' href='cap3/cap3exfinal2.html'>Exercício Final 5</a>"+
                                    "</nav>";

        document.getElementById("intro").insertAdjacentHTML("afterbegin", tagscap1); 
        document.getElementById("modelbasico").insertAdjacentHTML("afterbegin", tagscap2); 
        document.getElementById("modelavan").insertAdjacentHTML("afterbegin", tagscap3); 
    }
    else if(window.location.pathname.indexOf("cap1")!=-1)
    {
        var tagscap1 =          "<nav class='sb-sidenav-menu-nested nav'>"+
                                    "<a class='nav-link'  href='introducaoasredesdepetri.html'>1.1 Introdução às Redes de Petri</a>"+
                                    "<a class='nav-link'  href='elementosbasicos.html'>1.2 Elementos básicos (lugares, transições, arcos e tokens)</a>"+
                                    "<a class='nav-link'  href='elementosbasicosumexemplo.html'>1.3 Elementos básicos (exemplo 1)</a>"+
                                    "<a class='nav-link'  href='elementosbasicosexemplodois.html'>1.4 Elementos básicos (exemplo 2)</a>"+
                                    "<a class='nav-link'  href='ferramentausoqcb.html'>Exercício do tipo quebra-cabeça</a>"+ 
                                    "<a class='nav-link'  href='exerciciofixacaoqcb1.html'>Exercício de Fixação 1 </a>"+   
                                    "<a class='nav-link'  href='exerciciofixacaoqcb2.html'>Exercício de Fixação 2  </a>"+
                                    "<a class='nav-link'  href='funcionamentocondicao.html'>1.5 Conceitos fundamentais das redes de Petri (pré-condição, disparo e pós-condição) </a>"+
                                    "<a class='nav-link'  href='funcionamentocondicaoumexemplo.html'>1.6 Conceitos fundamentais das redes de Petri (pré-condição, disparo e pós-condição) - Exemplo</a>"+
                                    "<a class='nav-link'  href='ferramentauso.html'>Exercício de Modelagem </a>"+
                                    "<a class='nav-link'  href='exerciciofixacao3.html'>Exercício de Fixação 3 </a>"+
                                    "<a class='nav-link'  href='exerciciofinal1.html'>Exercício Final 1</a>"+
                                "</nav>";

        var tagscap2 =          "<nav class='sb-sidenav-menu-nested nav'>"+
                                    "<a class='nav-link' href='../cap2/modelbasica.html'>2 Modelagem Básica</a>"+
                                    "<a class='nav-link' href='../cap2/redesequencia.html'>2.1 Redes Elementares (Sequenciamento)</a>"+
                                    "<a class='nav-link' href='../cap2/rededistribuicao.html'>2.2 Redes Elementares (Distribuição)</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfixqcb1.html'>Exercício de Fixação 4</a>"+
                                    "<a class='nav-link' href='../cap2/redejoin.html'>2.3 Redes Elementares (Junção)</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfixqcb2.html'>Exercício de Fixação 5</a>"+
                                    "<a class='nav-link' href='../cap2/redeescolha.html'>2.4 Redes Elementares (Escolha Não-Determinística)</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfixqcb3.html'>Exercício de Fixação 6</a>"+
                                    "<a class='nav-link' href='../cap2/buffer.html'>2.5 Modelagem com Buffer</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfixqcb4.html'>Exercício de Fixação 7</a>"+
                                    "<a class='nav-link' href='../cap2/arcoinibidor.html'>2.6 Modelagem com Arco Inibidor</a>"+ 
                                    "<a class='nav-link' href='../cap2/arcoinibidorexemplo.html'>2.7 Modelagem com Arco Inibidor (exemplo)</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfixqcb5.html'>Exercício de Fixação 8</a>"+
                                    "<a class='nav-link' href='../cap2/arcomultivalor.html'>2.8 Modelagem com Arcos Multivalorados</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfixqcb6.html'>Exercício de Fixação 9</a>"+
                                    "<a class='nav-link' href='../cap2/estocastico.html'>2.9 Rede de Petri Estocástica</a>"+
                                    "<a class='nav-link' href='../cap2/estocasticoimediata.html'>2.10 Rede de Petri Estocástica (transição imediata e exemplo)</a>"+
                                    "<a class='nav-link' href='../cap2/estocasticofila.html'>2.11 Modelo de Fila e Exemplos</a>"+
                                    "<a class='nav-link' href='../cap2/exmodelagem.html'>Exercício de Modelagem (arco inibidor e transição imediata)</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfix1.html'>Exercício de Fixação 10</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfix2.html'>Exercício de Fixação 11</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfix3.html'>Exercício de Fixação 12</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfix4.html'>Exercício de Fixação 13</a>"+
                                    "<a class='nav-link' href='../cap2/disponibilidade.html'>2.12 Modelo de Falha e Reparo</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfix5.html'>Exercício de Fixação 14</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfix6.html'>Exercício de Fixação 15</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfinal1.html'>Exercício Final 2</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfinal2.html'>Exercício Final 3</a>"+
                                "</nav>";


        var tagscap3 =          "<nav class='sb-sidenav-menu-nested nav'>"+
                                    "<a class='nav-link' href='../cap3/modelav.html'>3 Modelagem Avançada</a>"+
                                    "<a class='nav-link' href='../cap3/metricas.html'>3.1 Métricas</a>"+
                                    "<a class='nav-link' href='../cap3/cap3exfix1.html'>Exercício de Fixação 16</a>"+
                                    "<a class='nav-link' href='../cap3/cap3exfix2.html'>Exercício de Fixação 17</a>"+
                                    "<a class='nav-link' href='../cap3/imediataprioridade.html'>3.2 Transição Imediata (Prioridade)</a>"+
                                    "<a class='nav-link' href='../cap3/cap3exfix3.html'>Exercício de Fixação 18</a>"+
                                    "<a class='nav-link' href='../cap3/imediatapeso.html'>3.3 Transição Imediata (Peso)</a>"+
                                    "<a class='nav-link' href='../cap3/cap3exfix4.html'>Exercício de Fixação 19</a>"+
                                    "<a class='nav-link' href='../cap3/imediataguarda.html'>3.4 Transição Imediata (Expressão de Guarda)</a>"+
                                    "<a class='nav-link' href='../cap3/cap3exfix5.html'>Exercício de Fixação 20</a>"+
                                    "<a class='nav-link' href='../cap3/filas.html'>3.5 Filas e Lei de Little</a>"+
                                    "<a class='nav-link' href='../cap3/filasexemplos.html'>3.6 Filas e Lei de Little (exemplos)</a>"+
                                    "<a class='nav-link' href='../cap3/cap3exfix6.html'>Exercício de Fixação 21</a>"+
                                    "<a class='nav-link' href='../cap3/cap3exfix7.html'>Exercício de Fixação 22</a>"+
                                    "<a class='nav-link' href='../cap3/redefilas.html'>3.7 Rede de Filas Aberta</a>"+
                                    "<a class='nav-link' href='../cap3/cap3exfix8.html'>Exercício de Fixação 23</a>"+
                                    "<a class='nav-link' href='../cap3/performace.html'>3.8 Modelos de Performance</a>"+
                                    "<a class='nav-link' href='../cap3/cap3exfix9.html'>Exercício de Fixação 24</a>"+
                                    "<a class='nav-link' href='../cap3/disp.html'>3.9 Modelos de Disponibilidade</a>"+
                                    "<a class='nav-link' href='../cap3/cap3exfix10.html'>Exercício de Fixação 25</a>"+
                                    "<a class='nav-link' href='../cap3/performabilidade.html'>3.10 Modelos de Performabilidade</a>"+
                                    "<a class='nav-link' href='../cap3/cap3exfix11.html'>Exercício de Fixação 26</a>"+
                                    "<a class='nav-link' href='../cap3/cap3exfinal1.html'>Exercício Final 4</a>"+
                                    "<a class='nav-link' href='../cap3/cap3exfinal2.html'>Exercício Final 5</a>"+
                                "</nav>";


        document.getElementById("intro").insertAdjacentHTML("afterbegin", tagscap1); 
        document.getElementById("modelbasico").insertAdjacentHTML("afterbegin", tagscap2); 
        document.getElementById("modelavan").insertAdjacentHTML("afterbegin", tagscap3); 
    }
    else if(window.location.pathname.indexOf("cap2")!=-1)
    {
        var tagscap1 =          "<nav class='sb-sidenav-menu-nested nav'>"+
                                    "<a class='nav-link'  href='../cap1/introducaoasredesdepetri.html'>1.1 Introdução às Redes de Petri</a>"+
                                    "<a class='nav-link'  href='../cap1/elementosbasicos.html'>1.2 Elementos básicos (lugares, transições, arcos e tokens)</a>"+
                                    "<a class='nav-link'  href='../cap1/elementosbasicosumexemplo.html'>1.3 Elementos básicos (exemplo 1)</a>"+
                                    "<a class='nav-link'  href='../cap1/elementosbasicosexemplodois.html'>1.4 Elementos básicos (exemplo 2)</a>"+
                                    "<a class='nav-link'  href='../cap1/ferramentausoqcb.html'>Exercício do tipo quebra-cabeça</a>"+ 
                                    "<a class='nav-link'  href='../cap1/exerciciofixacaoqcb1.html'>Exercício de Fixação 1 </a>"+   
                                    "<a class='nav-link'  href='../cap1/exerciciofixacaoqcb2.html'>Exercício de Fixação 2  </a>"+
                                    "<a class='nav-link'  href='../cap1/funcionamentocondicao.html'>1.5 Conceitos fundamentais das redes de Petri (pré-condição, disparo e pós-condição) </a>"+
                                    "<a class='nav-link'  href='../cap1/funcionamentocondicaoumexemplo.html'>1.6 Conceitos fundamentais das redes de Petri (pré-condição, disparo e pós-condição) - Exemplo</a>"+
                                    "<a class='nav-link'  href='../cap1/ferramentauso.html'>Exercício de Modelagem </a>"+
                                    "<a class='nav-link'  href='../cap1/exerciciofixacao3.html'>Exercício de Fixação 3</a>"+
                                    "<a class='nav-link'  href='../cap1/exerciciofinal1.html'>Exercício Final 1</a>"+
                                "</nav>";

        var tagscap2 =          "<nav class='sb-sidenav-menu-nested nav'>"+
                                    "<a class='nav-link' href='modelbasica.html'>2 Modelagem Básica</a>"+
                                    "<a class='nav-link' href='redesequencia.html'>2.1 Redes Elementares (Sequenciamento)</a>"+
                                    "<a class='nav-link' href='rededistribuicao.html'>2.2 Redes Elementares (Distribuição)</a>"+
                                    "<a class='nav-link' href='cap2exfixqcb1.html'>Exercício de Fixação 4</a>"+
                                    "<a class='nav-link' href='redejoin.html'>2.3 Redes Elementares(Junção)</a>"+
                                    "<a class='nav-link' href='cap2exfixqcb2.html'>Exercício de Fixação 5</a>"+
                                    "<a class='nav-link' href='redeescolha.html'>2.4 Redes Elementares (Escolha Não-Determinística)</a>"+
                                    "<a class='nav-link' href='cap2exfixqcb3.html'>Exercício de Fixação 6</a>"+
                                    "<a class='nav-link' href='buffer.html'>2.5 Modelagem com Buffer</a>"+
                                    "<a class='nav-link' href='cap2exfixqcb4.html'>Exercício de Fixação 7</a>"+
                                    "<a class='nav-link' href='arcoinibidor.html'>2.6 Modelagem com Arco Inibidor</a>"+ 
                                    "<a class='nav-link' href='arcoinibidorexemplo.html'>2.7 Modelagem com Arco Inibidor (exemplo)</a>"+
                                    "<a class='nav-link' href='cap2exfixqcb5.html'>Exercício de Fixação 8</a>"+
                                    "<a class='nav-link' href='arcomultivalor.html'>2.8 Modelagem com Arcos Multivalorados</a>"+
                                    "<a class='nav-link' href='cap2exfixqcb6.html'>Exercício de Fixação 9</a>"+
                                    "<a class='nav-link' href='estocastico.html'>2.9 Rede de Petri Estocástica</a>"+
                                    "<a class='nav-link' href='estocasticoimediata.html'>2.10 Rede de Petri Estocástica (transição imediata e exemplo)</a>"+
                                    "<a class='nav-link' href='estocasticofila.html'>2.11 Modelo de Fila e Exemplos</a>"+
                                    "<a class='nav-link' href='exmodelagem.html'>Exercício de Modelagem (arco inibidor e transição imediata)</a>"+
                                    "<a class='nav-link' href='cap2exfix1.html'>Exercício de Fixação 10</a>"+
                                    "<a class='nav-link' href='cap2exfix2.html'>Exercício de Fixação 11</a>"+
                                    "<a class='nav-link' href='cap2exfix3.html'>Exercício de Fixação 12</a>"+
                                    "<a class='nav-link' href='cap2exfix4.html'>Exercício de Fixação 13</a>"+
                                    "<a class='nav-link' href='disponibilidade.html'>2.12 Modelo de Falha e Reparo</a>"+
                                    "<a class='nav-link' href='cap2exfix5.html'>Exercício de Fixação 14</a>"+
                                    "<a class='nav-link' href='cap2exfix6.html'>Exercício de Fixação 15</a>"+
                                    "<a class='nav-link' href='cap2exfinal1.html'>Exercício Final 2</a>"+
                                    "<a class='nav-link' href='cap2exfinal2.html'>Exercício Final 3</a>"+
                                "</nav>";


        var tagscap3 =          "<nav class='sb-sidenav-menu-nested nav'>"+
                                    "<a class='nav-link' href='../cap3/modelav.html'>3 Modelagem Avançada</a>"+
                                    "<a class='nav-link' href='../cap3/metricas.html'>3.1 Métricas</a>"+
                                    "<a class='nav-link' href='../cap3/cap3exfix1.html'>Exercício de Fixação 16</a>"+
                                    "<a class='nav-link' href='../cap3/cap3exfix2.html'>Exercício de Fixação 17</a>"+
                                    "<a class='nav-link' href='../cap3/imediataprioridade.html'>3.2 Transição Imediata (Prioridade)</a>"+
                                    "<a class='nav-link' href='../cap3/cap3exfix3.html'>Exercício de Fixação 18</a>"+
                                    "<a class='nav-link' href='../cap3/imediatapeso.html'>3.3 Transição Imediata (Peso)</a>"+
                                    "<a class='nav-link' href='../cap3/cap3exfix4.html'>Exercício de Fixação 19</a>"+
                                    "<a class='nav-link' href='../cap3/imediataguarda.html'>3.4 Transição Imediata (Expressão de Guarda)</a>"+
                                    "<a class='nav-link' href='../cap3/cap3exfix5.html'>Exercício de Fixação 20</a>"+
                                    "<a class='nav-link' href='../cap3/filas.html'>3.5 Filas e Lei de Little</a>"+
                                    "<a class='nav-link' href='../cap3/filasexemplos.html'>3.6 Filas e Lei de Little (exemplos)</a>"+
                                    "<a class='nav-link' href='../cap3/cap3exfix6.html'>Exercício de Fixação 21</a>"+
                                    "<a class='nav-link' href='../cap3/cap3exfix7.html'>Exercício de Fixação 22</a>"+
                                    "<a class='nav-link' href='../cap3/redefilas.html'>3.7 Rede de Filas Aberta</a>"+
                                    "<a class='nav-link' href='../cap3/cap3exfix8.html'>Exercício de Fixação 23</a>"+
                                    "<a class='nav-link' href='../cap3/performace.html'>3.8 Modelos de Performance</a>"+
                                    "<a class='nav-link' href='../cap3/cap3exfix9.html'>Exercício de Fixação 24</a>"+
                                    "<a class='nav-link' href='../cap3/disp.html'>3.9 Modelos de Disponibilidade</a>"+
                                    "<a class='nav-link' href='../cap3/cap3exfix10.html'>Exercício de Fixação 25</a>"+
                                    "<a class='nav-link' href='../cap3/performabilidade.html'>3.10 Modelos de Performabilidade</a>"+
                                    "<a class='nav-link' href='../cap3/cap3exfix11.html'>Exercício de Fixação 26</a>"+
                                    "<a class='nav-link' href='../cap3/cap3exfinal1.html'>Exercício Final 4</a>"+
                                    "<a class='nav-link' href='../cap3/cap3exfinal2.html'>Exercício Final 5</a>"+
                                "</nav>";


        document.getElementById("intro").insertAdjacentHTML("afterbegin", tagscap1); 
        document.getElementById("modelbasico").insertAdjacentHTML("afterbegin", tagscap2); 
        document.getElementById("modelavan").insertAdjacentHTML("afterbegin", tagscap3); 
    }
    else if(window.location.pathname.indexOf("cap3")!=-1)
    {
        var tagscap1 =          "<nav class='sb-sidenav-menu-nested nav'>"+
                                    "<a class='nav-link'  href='../cap1/introducaoasredesdepetri.html'>1.1 Introdução às Redes de Petri</a>"+
                                    "<a class='nav-link'  href='../cap1/elementosbasicos.html'>1.2 Elementos básicos (lugares, transições, arcos e tokens)</a>"+
                                    "<a class='nav-link'  href='../cap1/elementosbasicosumexemplo.html'>1.3 Elementos básicos (exemplo 1)</a>"+
                                    "<a class='nav-link'  href='../cap1/elementosbasicosexemplodois.html'>1.4 Elementos básicos (exemplo 2)</a>"+
                                    "<a class='nav-link'  href='../cap1/ferramentausoqcb.html'>Exercício do tipo quebra-cabeça</a>"+ 
                                    "<a class='nav-link'  href='../cap1/exerciciofixacaoqcb1.html'>Exercício de Fixação 1 </a>"+   
                                    "<a class='nav-link'  href='../cap1/exerciciofixacaoqcb2.html'>Exercício de Fixação 2  </a>"+
                                    "<a class='nav-link'  href='../cap1/funcionamentocondicao.html'>1.5 Conceitos fundamentais das redes de Petri (pré-condição, disparo e pós-condição) </a>"+
                                    "<a class='nav-link'  href='../cap1/funcionamentocondicaoumexemplo.html'>1.6 Conceitos fundamentais das redes de Petri (pré-condição, disparo e pós-condição) - Exemplo</a>"+
                                    "<a class='nav-link'  href='../cap1/ferramentauso.html'>Exercício de Modelagem</a>"+
                                    "<a class='nav-link'  href='../cap1/exerciciofixacao3.html'>Exercício de Fixação 3 </a>"+
                                    "<a class='nav-link'  href='../cap1/exerciciofinal1.html'>Exercício Final 1</a>"+
                                "</nav>";

        var tagscap2 =          "<nav class='sb-sidenav-menu-nested nav'>"+
                                    "<a class='nav-link' href='../cap2/modelbasica.html'>2 Modelagem Básica</a>"+
                                    "<a class='nav-link' href='../cap2/redesequencia.html'>2.1 Redes Elementares (Sequenciamento)</a>"+
                                    "<a class='nav-link' href='../cap2/rededistribuicao.html'>2.2 Redes Elementares (Distribuição)</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfixqcb1.html'>Exercício de Fixação 4</a>"+
                                    "<a class='nav-link' href='../cap2/redejoin.html'>2.3 Redes Elementares(Junção)</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfixqcb2.html'>Exercício de Fixação 5</a>"+
                                    "<a class='nav-link' href='../cap2/redeescolha.html'>2.4 Redes Elementares (Escolha Não-Determinística)</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfixqcb3.html'>Exercício de Fixação 6</a>"+
                                    "<a class='nav-link' href='../cap2/buffer.html'>2.5 Modelagem com Buffer</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfixqcb4.html'>Exercício de Fixação 7</a>"+
                                    "<a class='nav-link' href='../cap2/arcoinibidor.html'>2.6 Modelagem com Arco Inibidor</a>"+ 
                                    "<a class='nav-link' href='../cap2/arcoinibidorexemplo.html'>2.7 Modelagem com Arco Inibidor (exemplo)</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfixqcb5.html'>Exercício de Fixação 8</a>"+
                                    "<a class='nav-link' href='../cap2/arcomultivalor.html'>2.8 Modelagem com Arcos Multivalorados</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfixqcb6.html'>Exercício de Fixação 9</a>"+
                                    "<a class='nav-link' href='../cap2/estocastico.html'>2.9 Rede de Petri Estocástica</a>"+
                                    "<a class='nav-link' href='../cap2/estocasticoimediata.html'>2.10 Rede de Petri Estocástica (transição imediata e exemplo)</a>"+
                                    "<a class='nav-link' href='../cap2/estocasticofila.html'>2.11 Modelo de Fila e Exemplos</a>"+
                                    "<a class='nav-link' href='../cap2/exmodelagem.html'>Exercício de Modelagem (arco inibidor e transição imediata)</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfix1.html'>Exercício de Fixação 10</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfix2.html'>Exercício de Fixação 11</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfix3.html'>Exercício de Fixação 12</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfix4.html'>Exercício de Fixação 13</a>"+
                                    "<a class='nav-link' href='../cap2/disponibilidade.html'>2.12 Modelo de Falha e Reparo</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfix5.html'>Exercício de Fixação 14</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfix6.html'>Exercício de Fixação 15</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfinal1.html'>Exercício Final 2</a>"+
                                    "<a class='nav-link' href='../cap2/cap2exfinal2.html'>Exercício Final 3</a>"+
                                "</nav>";


        var tagscap3 =          "<nav class='sb-sidenav-menu-nested nav'>"+
                                    "<a class='nav-link' href='modelav.html'>3 Modelagem Avançada</a>"+
                                    "<a class='nav-link' href='metricas.html'>3.1 Métricas</a>"+
                                    "<a class='nav-link' href='cap3exfix1.html'>Exercício de Fixação 16</a>"+
                                    "<a class='nav-link' href='cap3exfix2.html'>Exercício de Fixação 17</a>"+
                                    "<a class='nav-link' href='imediataprioridade.html'>3.2 Transição Imediata (Prioridade)</a>"+
                                    "<a class='nav-link' href='cap3exfix3.html'>Exercício de Fixação 18</a>"+
                                    "<a class='nav-link' href='imediatapeso.html'>3.3 Transição Imediata (Peso)</a>"+
                                    "<a class='nav-link' href='cap3exfix4.html'>Exercício de Fixação 19</a>"+
                                    "<a class='nav-link' href='imediataguarda.html'>3.4 Transição Imediata (Expressão de Guarda)</a>"+
                                    "<a class='nav-link' href='cap3exfix5.html'>Exercício de Fixação 20</a>"+
                                    "<a class='nav-link' href='filas.html'>3.5 Filas e Lei de Little</a>"+
                                    "<a class='nav-link' href='filasexemplos.html'>3.6 Filas e Lei de Little (exemplos)</a>"+
                                    "<a class='nav-link' href='cap3exfix6.html'>Exercício de Fixação 21</a>"+
                                    "<a class='nav-link' href='cap3exfix7.html'>Exercício de Fixação 22</a>"+
                                    "<a class='nav-link' href='redefilas.html'>3.7 Rede de Filas Aberta</a>"+
                                    "<a class='nav-link' href='cap3exfix8.html'>Exercício de Fixação 23</a>"+
                                    "<a class='nav-link' href='performace.html'>3.8 Modelos de Performance</a>"+
                                    "<a class='nav-link' href='cap3exfix9.html'>Exercício de Fixação 24</a>"+
                                    "<a class='nav-link' href='disp.html'>3.9 Modelos de Disponibilidade</a>"+
                                    "<a class='nav-link' href='cap3exfix10.html'>Exercício de Fixação 25</a>"+
                                    "<a class='nav-link' href='performabilidade.html'>3.10 Modelos de Performabilidade</a>"+
                                    "<a class='nav-link' href='cap3exfix11.html'>Exercício de Fixação 26</a>"+
                                    "<a class='nav-link' href='cap3exfinal1.html'>Exercício Final 4</a>"+
                                    "<a class='nav-link' href='cap3exfinal2.html'>Exercício Final 5</a>"+
                                "</nav>";


        document.getElementById("intro").insertAdjacentHTML("afterbegin", tagscap1); 
        document.getElementById("modelbasico").insertAdjacentHTML("afterbegin", tagscap2); 
        document.getElementById("modelavan").insertAdjacentHTML("afterbegin", tagscap3); 
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    //Adiciona a pontuação nas páginas
    if(localStorage.getItem("pontos")==null)
    {
        document.getElementById("ponto").style.fontSize = '12px';
        document.getElementById("ponto").style.fontWeight = "900";
        document.getElementById("ponto").innerHTML = "Total de pontos: 0";
        document.getElementById("ponto").insertAdjacentHTML("afterend", "<div id='progresso' style='color: white;'>Progresso Global: 0%</div>");
        document.getElementById("progresso").style.fontSize = '12px'; 
        document.getElementById("progresso").style.fontWeight = "900";
        document.getElementById("progresso").insertAdjacentHTML("afterend", "<div class='progress'><div id='barra' class='progress-bar bg-info progress-bar-striped progress-bar-animated' style='width:0%'></div></div>");
    }
    else
    {
        document.getElementById("ponto").style.fontSize = '12px'; 
        document.getElementById("ponto").style.fontWeight = "900";       
        document.getElementById("ponto").innerHTML = "Total de pontos: " + localStorage.getItem("pontos");
        document.getElementById("ponto").insertAdjacentHTML("afterend", "<div id='progresso' style='color: white;'>Progresso Global: 0%</div>"); 

        document.getElementById("progresso").innerHTML = "Progresso Global: " + localStorage.getItem("progress") + "%";
        document.getElementById("progresso").style.fontSize = '12px';
        document.getElementById("progresso").style.fontWeight = "900";
        document.getElementById("progresso").insertAdjacentHTML("afterend", "<div class='progress'><div id='barra' class='progress-bar bg-info progress-bar-striped progress-bar-animated' style='width:0%'></div></div>");
        var w = localStorage.getItem("progress") + "%";
        document.getElementById("barra").style.width = w;
    }

    //Altera o menu de navegação à esquerda
    if(window.location.pathname.indexOf("cap1")!=-1)
    {
        var x = document.querySelectorAll("a.nav-link.collapsed");      
        x[0].classList.toggle("collapsed");
        var y = document.querySelectorAll("div.collapse");
        y[0].classList.toggle("show");
    }
    else if(window.location.pathname.indexOf("cap2")!=-1)
    {
        var x = document.querySelectorAll("a.nav-link.collapsed");      
        x[1].classList.toggle("collapsed");
        var y = document.querySelectorAll("div.collapse");
        y[1].classList.toggle("show");
    }
    else if(window.location.pathname.indexOf("cap3")!=-1)
    {
        var x = document.querySelectorAll("a.nav-link.collapsed");      
        x[2].classList.toggle("collapsed");
        var y = document.querySelectorAll("div.collapse");
        y[2].classList.toggle("show");
    }

    // Avalia se o estudante tem os critérios mínimos para passar para a seção 2
    if( (localStorage.getItem("finalcap1")==null) || (Number(localStorage.pontos)<4) )
    {    
        var x = document.getElementById("modelbasico");
        x.style.display = "none";
        var x2 = document.getElementsByClassName("fas fa-angle-down");
        x2[1].style.display = "none";

        if(window.location.pathname.indexOf("cap2")!=-1)
        {
            var heuristicaresp = JSON.parse(localStorage.getItem("heuristicaresp")); 

            if(heuristicaresp.length>0)
            {                
                for(var j=0; j<heuristicaresp.length; j++)
                {
                    for(var i=0; i<localStorage.length; i++)
                    {
                        if(localStorage.key(i)==heuristicaresp[j])
                        {
                            localStorage.removeItem(localStorage.key(i));
                            localStorage.progress = (Number(localStorage.progress)-(2.5)).toString();
                        }
                    }
                }
                localStorage.removeItem('heuristicaresp');
            }
           window.open("../error2.html", "_self");
        }
    }
    else
    {
        var x = document.getElementById("modelbasico");
        x.style.display = "";
        var x2 = document.getElementsByClassName("fas fa-angle-down");
        x2[1].style.display = "";
        if(localStorage.getItem("somacap2")==null)
        { 
            localStorage.setItem("somacap2", '20'); 
            localStorage.progress = '20';
            document.getElementById("progresso").innerHTML = "Progresso Global: " + localStorage.getItem("progress") + "%";
            var w = localStorage.getItem("progress") + "%";
            document.getElementById("barra").style.width = w;
        }        
    }

    // Avalia se o estudante tem os critérios mínimos para passar para a seção 3
    if((localStorage.getItem("finalcap21")==null)||(localStorage.getItem("finalcap22")==null)||(Number(localStorage.pontos)<16))
    {
        var x = document.getElementById("modelavan");
        x.style.display = "none";
        var x2 = document.getElementsByClassName("fas fa-angle-down");
        x2[2].style.display = "none";

        if(window.location.pathname.indexOf("cap3")!=-1)
        {
            var heuristicaresp = JSON.parse(localStorage.getItem("heuristicaresp")); 

            if(heuristicaresp.length>0)
            {
                if(heuristicaresp.length>0)
                {                
                    for(var j=0; j<heuristicaresp.length; j++)
                    {
                        for(var i=0; i<localStorage.length; i++)
                        {
                            if(localStorage.key(i)==heuristicaresp[j])
                            {
                                localStorage.removeItem(localStorage.key(i));
                                localStorage.progress = (Number(localStorage.progress)-(2.5)).toString();
                            }
                        }
                    }
                    localStorage.removeItem('heuristicaresp');
                }
            }
            window.open("../error3.html", "_self");
        }
    }
    else
    {
        var x = document.getElementById("modelavan");
        x.style.display = "";
        var x2 = document.getElementsByClassName("fas fa-angle-down");
        x2[2].style.display = "";
        if(localStorage.getItem("somacap3")==null)
        { 
            localStorage.setItem("somacap3", '60');
            localStorage.progress = '60';    
            document.getElementById("progresso").innerHTML = "Progresso Global: " + localStorage.getItem("progress") + "%";  
            var w = localStorage.getItem("progress") + "%";
            document.getElementById("barra").style.width = w;  
        }  
    }


        // Avalia se o estudante tem os critérios mínimos para receber o certificado
        if((localStorage.getItem("finalcap31")==null)||(localStorage.getItem("finalcap32")==null)||(Number(localStorage.pontos)<25))
        {
            if(window.location.pathname.indexOf("certiavalia.html")!=-1)
            {
                window.open("../error4.html", "_self");
            }
        }
        else
        {
            var x2 = document.getElementsByClassName("fas fa-angle-down");
            x2[2].style.display = "";

            localStorage.progress = '100';    
            document.getElementById("progresso").innerHTML = "Progresso Global: " + localStorage.getItem("progress") + "%";   
            var w = localStorage.getItem("progress") + "%";
            document.getElementById("barra").style.width = w;
            
            if(window.location.pathname.indexOf("apres.html")!=-1)
            {
                document.querySelectorAll("div.nav")[0].insertAdjacentHTML("beforeend", "<a class='nav-link' href='cap3/certiavalia.html'><i class='material-icons'>military_tech</i>&nbsp;&nbsp;&nbsp;CERTIFICADO</a>");
            }
            else if(window.location.pathname.indexOf("cap3")!=-1)
            {
                document.querySelectorAll("div.nav")[0].insertAdjacentHTML("beforeend", "<a class='nav-link' href='certiavalia.html'><i class='material-icons'>military_tech</i>&nbsp;&nbsp;&nbsp;CERTIFICADO</a>");
            }
            else if(window.location.pathname.indexOf("cap2")!=-1)
            {
                document.querySelectorAll("div.nav")[0].insertAdjacentHTML("beforeend", "<a class='nav-link' href='../cap3/certiavalia.html'><i class='material-icons'>military_tech</i>&nbsp;&nbsp;&nbsp;CERTIFICADO</a>");
            }
            else if(window.location.pathname.indexOf("cap1")!=-1)
            {
                document.querySelectorAll("div.nav")[0].insertAdjacentHTML("beforeend", "<a class='nav-link' href='../cap3/certiavalia.html'><i class='material-icons'>military_tech</i>&nbsp;&nbsp;&nbsp;CERTIFICADO</a>");
            }
        }
    

    ////////////// HEURÍSTICA DE VISIBILIDADE DO SISTEMA //////////////////////////////////////////////
    var pthnome = window.location.pathname;
    var l = pthnome.length;
    var indx = pthnome.lastIndexOf('/');
    var nome =  pthnome.slice(indx+1,l);
     
    if(!((nome.indexOf("exerciciofi")!=-1)||(nome.indexOf("exfi")!=-1)))
    {
        var heuristica = JSON.parse(localStorage.getItem("heuristica")); 

        if(heuristica.indexOf(nome)==-1)
        {
            heuristica[heuristica.length]= nome;
            localStorage.setItem("heuristica", JSON.stringify(heuristica)); 
        }
    }
    else
    {
        var heuristica = JSON.parse(localStorage.getItem("heuristica")); 
    }

    var taganav = document.querySelectorAll("a.nav-link");

    for(var j=0; j<heuristica.length; j++)
    {
        var aux = 0;
        for(var i=0; i<taganav.length; i++)
        {
            if((taganav[i].toString()).indexOf(heuristica[j])!=-1)
            {
                taganav[i].style.color = 'white';
                if(pthnome.indexOf("cap1")!=-1)
                {
                    if(aux==1)
                    {
                        taganav[i].style.color = 'white'
                        break;
                    }
                    aux++;
                }
                if(pthnome.indexOf("cap2")!=-1)
                {
                    if(aux==2)
                    {
                        taganav[i].style.color = 'white'
                        break;
                    }
                    aux++;
                }
                if(pthnome.indexOf("cap3")!=-1)
                {
                    if(aux==3)
                    {
                        taganav[i].style.color = 'white'
                        break;
                    }
                    aux++;
                }
            }
        }
    }

    var taganav2 = document.querySelectorAll("nav.sb-sidenav-menu-nested.nav > a.nav-link");

    for(var i=0; i<taganav2.length; i++)
    {
        if((taganav2[i].toString()).indexOf(nome)!=-1)
        {
            taganav2[i].style.color = '#89c0f0';  // #3fa3f7; '#368FBD'; #6fa0ca;
            break;
        }

    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////

    //////////////// FUNÇÕES /////////////////////////////////////////////////////////////
    // OBSERVAÇÃO: Os parâmetros 'ex' das função abaixo devem ter o valor igual ao valor dos parâmetros 'ex' das funções main() e mainquebracb()
    // Essas função estão nos arquivos '.js' javascript relacionado a ferramenta dos exercícios de quebra-cabeça e modelagem
    // Essas funções foram feitas com a Biblioteca vex - para a criação de caixas de diálogo
    
        // Função relacionada a opção de ver a resposta
        function confirm(url,ex){
            if(localStorage.getItem(ex)==null)
            {
                vex.dialog.confirm({
                    message: 'Deseja ver a resposta? Você não receberá pontuação nesta questão.',
                    className: 'vex-theme-default',
                    callback: function (value) {
                    if (value) 
                    {
                        if(localStorage.getItem("pontos")==null)
                        {
                            localStorage.setItem(ex, '0');
                            localStorage.setItem("pontos", '0');
                            localStorage.setItem("progress", (2.5).toString());
                            document.getElementById("progresso").innerHTML = "Progresso Global: " + localStorage.getItem("progress") + "%";
                            var w = localStorage.getItem("progress") + "%";
                            document.getElementById("barra").style.width = w;
                        }
                        else
                        {
                            localStorage.setItem(ex, '0');
                            localStorage.progress = ((2.5)+Number(localStorage.progress)).toString();
                            document.getElementById("progresso").innerHTML = "Progresso Global: " + localStorage.getItem("progress") + "%";
                            var w = localStorage.getItem("progress") + "%";
                            document.getElementById("barra").style.width = w;
                        }

                        var heuristicaresp = JSON.parse(localStorage.getItem("heuristicaresp"));
                        if(heuristicaresp.indexOf(ex)==-1)
                        {
                            heuristicaresp[heuristicaresp.length] = ex;
                            localStorage.setItem("heuristicaresp", JSON.stringify(heuristicaresp)); 
                        }

                        window.open(url,'popUpWindow','height=500,width=500,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
                    } 
                    }
                });
            }
            else
            {
                window.open(url,'popUpWindow','height=500,width=500,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
            }
        }
        // Função relacionada a resetar pontos.
        function resetar(url){
            vex.dialog.confirm({
                    message: 'Deseja resetar seus pontos e voltar ao início?',
                    className: 'vex-theme-default',
                    callback: function (value) {
                    if (value) 
                    {
                        localStorage.clear();
                        /////////////// Essa função é feita para se indicar qualquer URL, no entanto para essa aplicação, considera-se uma URL específica
                        if(window.location.pathname.indexOf("apres.html")!=-1){
                            url = "apres.html";
                        }
                        else{
                            url = "../apres.html";
                        }
                        ////////////////////////////////////////////////////////////
                        window.open(url, "_self");
                    } 
                }
            });
        }
        // Função restaurar pontos - restaura os pontos de questões em que os alunos viram a resposta
        function restaurar(){
            vex.dialog.confirm({
                    message: 'Deseja restaura os pontos de questões em que foram visto as respostas?',
                    className: 'vex-theme-default',
                    callback: function (value) {
                    if (value) 
                    {
                        var heuristicaresp = JSON.parse(localStorage.getItem("heuristicaresp")); 

                        if(heuristicaresp.length>0)
                        {                
                            for(var j=0; j<heuristicaresp.length; j++)
                            {
                                for(var i=0; i<localStorage.length; i++)
                                {
                                    if(localStorage.key(i)==heuristicaresp[j])
                                    {
                                        localStorage.removeItem(localStorage.key(i));
                                        localStorage.progress = (Number(localStorage.progress)-(2.5)).toString();
                                    }
                                }
                            }
                            localStorage.removeItem('heuristicaresp');
                        }
                        ////////////////////////////////////////////////////////////
                        if(window.location.pathname.indexOf("cap1")!=-1)
                        {
                            window.open("introducaoasredesdepetri.html", "_self");             
                        }
                        else if(window.location.pathname.indexOf("cap2")!=-1)
                        {
                            window.open("modelbasica.html", "_self");             
                        }
                        else if(window.location.pathname.indexOf("cap3")!=-1)
                        {
                            window.open("modelav.html", "_self");             
                        }

                    } 
                }
            });
        }
        
        // Função relacionada a verificação de acerto da questão
        function acerto(url,ex,pontos){

                if(localStorage.getItem("pontos")==null)
                {
                    localStorage.setItem("pontos", pontos.toString());
                    localStorage.setItem("progress", (2.5).toString());
                    
                    if(localStorage.getItem(ex)==null)
                    {
                        localStorage.setItem(ex, pontos.toString());

                        var pthnome = window.location.pathname;
                        var l = pthnome.length;
                        var indx = pthnome.lastIndexOf('/');
                        var nome =  pthnome.slice(indx+1,l);
                        var heuristica = JSON.parse(localStorage.getItem("heuristica"));

                        var msg = 'PARABÉNS! Problema modelado corretamente! ' + 'Pontos recebidos: ' + pontos + '.'
                        vex.dialog.alert({
                            message: msg, //Com o uso da biblioteca VEX a página é aberta logo em seguida, sem esperar por apertar OK
                            className: 'vex-theme-default'});

                        if(heuristica.indexOf(nome)==-1)
                        {
                            heuristica[heuristica.length]= nome;
                            localStorage.setItem("heuristica", JSON.stringify(heuristica)); 
                        }
                    }
                    else
                    {
                        var msg = 'PARABÉNS! Problema modelado corretamente! ' + 'Pontos recebidos: 0 (você viu a resposta ou já obteve pontos)'
                        vex.dialog.alert({
                            message: msg, //Com o uso da biblioteca VEX a página é aberta logo em seguida, sem esperar por apertar OK
                            className: 'vex-theme-default'});
                    }
                }
                else
                {
                    if(localStorage.getItem(ex)==null)
                    {
                        localStorage.setItem(ex, pontos.toString());                    
                        localStorage.pontos = (Number(localStorage.pontos)+pontos).toString();
                        localStorage.progress = ((2.5)+Number(localStorage.progress)).toString();

                        var pthnome = window.location.pathname;
                        var l = pthnome.length;
                        var indx = pthnome.lastIndexOf('/');
                        var nome =  pthnome.slice(indx+1,l);
                        var heuristica = JSON.parse(localStorage.getItem("heuristica"));

                        var msg = 'PARABÉNS! Problema modelado corretamente! ' + 'Pontos recebidos: ' + pontos + '.'
                        vex.dialog.alert({
                            message: msg, //Com o uso da biblioteca VEX a página é aberta logo em seguida, sem esperar por apertar OK
                            className: 'vex-theme-default'});

                        if(heuristica.indexOf(nome)==-1)
                        {
                            heuristica[heuristica.length]= nome;
                            localStorage.setItem("heuristica", JSON.stringify(heuristica)); 
                        }
                    }
                    else
                    {
                        var msg = 'PARABÉNS! Problema modelado corretamente! ' + 'Pontos recebidos: 0 (o você viu a resposta ou já obteve pontos)'
                        vex.dialog.alert({
                            message: msg, //Com o uso da biblioteca VEX a página é aberta logo em seguida, sem esperar por apertar OK
                            className: 'vex-theme-default'});
                    }
                }

                setTimeout(function(){ window.open(url, "_self"); }, 3500);
        }
    
    /////////////////////////////////////////////////////////////////////////////////////

} 
else 
{
    alert("Browser desatualizado. Browser não suporta a aplicação!");
}


