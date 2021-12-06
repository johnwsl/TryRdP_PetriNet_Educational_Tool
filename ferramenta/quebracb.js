	//Gera um novo arquivo XML com dados modificados para comparar dois modelos de grafos
    // qxml -> é o endereço do arquivo xml da questão a ser resolvida

    //Adiciona o arquivo bodygraph.css no html. O container indicado com o id 'graph' na função main deve ter class=bodygraph .
    document.write(unescape("%3Clink  href='../ferramenta/bodygraph.css' rel='stylesheet'/%3E"));


    function gerador(graph, qxml, nextpage, ex, pontos)
    {
        
        var encoder = new mxCodec();
        var node = encoder.encode(graph.getModel());			
        var text = mxUtils.getXml(node);		
        text = mxUtils.parseXml(text);

        var t = text.getElementsByTagName("TransIm");
        var numTransIm = t.length;
        var TransImArr = new Array(numTransIm);
        for(var i = 0; i < numTransIm; i++)
        {
            t[0].remove();
        }			

        t = text.getElementsByTagName("TokenLabel");
        var l = t.length;
        for(var i = 0; i < l; i++)
        {
            t[0].remove();//O vetor t se atualiza automaticamente via o método remove() que retira o elemento removido e adiciona o próximo
                          //no lugar do anterior, por isso usa-se no laço t[0] sempre marcando o índice inicial - zero
        }				  

        t = text.getElementsByTagName("mxCell");
        l = t.length;
        for(var i = 0; i < l; i++)
        {
            t[0].remove();		
        }
        
        t = text.getElementsByTagName("mxGeometry");
        l = t.length;
        for(var i = 0; i < l; i++)
        {
            t[0].remove();
        }

        t = text.getElementsByTagName("Ponto");
        l = t.length;
        for(var i = 0; i < l; i++)
        {
            t[0].remove();		
        }

        t = text.getElementsByTagName("Lugar");
        var numLugar = t.length;
        for(var i = 0; i < numLugar; i++)
        {
            t[0].remove();
        }

        t = text.getElementsByTagName("TransTemp");
        var numTransTemp = t.length;
        for(var i = 0; i < numTransTemp; i++)
        {
            t[0].remove();
        }

        t = text.getElementsByTagName("ArcoInibidor");
        var numArcoInibidor = t.length;
        for(var i = 0; i < numArcoInibidor; i++)
        {
            t[i].removeAttribute('id');
        }

        t = text.getElementsByTagName("Arco");
        var numArco = t.length;
        for(var i = 0; i < numArco; i++)
        {
            t[i].removeAttribute('id');
		}

        var resultado = comparador(text, qxml, numArco, numArcoInibidor);
        
        if(resultado == true)
        {
            // Salva no localStorage o modelo da questão que foi feita
            var encoder = new mxCodec();
            var node = encoder.encode(graph.getModel());			
            var text = mxUtils.getXml(node);		
            // Por padrão, os nomes dos exercícios 'ex' devem ser diferentes. É adicionado a string 'exqcb' para atribuir nomes aos modelos salvos
            localStorage.setItem(ex+'exqcb', text);
            ///////////////////
            window.onbeforeunload = null;// Anula o evento onbeforeunload

            acerto(nextpage, ex, pontos);
        }
        else
        {
            mxUtils.alert("Modelagem incorreta. Tente novamente!");
        }
                
    };
    
    //Compara um modelo base com um modelo gerado pela funação gerador
    function comparador(textxml, qxml, numArco, numArcoInibidor)
    {
        var text = textxml;
        var text2 =mxUtils.load(qxml);//Texto de resposta da questão em xml - text2
        var count = 0;
        text2 = text2.getDocumentElement();

        t2 = text2.getElementsByTagName("ArcoInibidor");
        l = t2.length;
        if(numArcoInibidor==l)
        {
            t = text.getElementsByTagName("ArcoInibidor");
            var auxl = l;
            for(var i = 1; i <= auxl; i++)
            {
                for(var j = 1; j <= auxl; j++)
                {
                    if(t2[i-1].isEqualNode(t[j-1]))
                    {
                        count++;t2[i-1].remove();t[j-1].remove(); auxl--; j=0; i=0; break;
                    }
                }
            }
            if(count!=l){return false};
            count = 0;
        }
        else{return false}

        t2 = text2.getElementsByTagName("Arco");
        l = t2.length; 
        if(numArco==l)
        {
            t = text.getElementsByTagName("Arco");
            var auxl = l;
            for(var i = 1; i <= auxl; i++)
            {
                for(var j = 1; j <= auxl; j++)
                {
                    if(t2[i-1].isEqualNode(t[j-1]))
                    {
                        count++;t2[i-1].remove();t[j-1].remove(); auxl--; j=0; i=0; break;
                    }
                }
            }
            if(count!=l){return false};
            count = 0;
        }
        else{return false}

        return true;
    };