function mainquebracb(bodygraph, qxml, nextpage, ex, pontos)
{

    if (!mxClient.isBrowserSupported())
    {
        mxUtils.error('Browser is not supported!', 200, false);
    }
    else
    {
        //Pergunta antes do usuário sair da página
        if(localStorage.getItem(ex+'exqcb')==null)
        {
            window.onbeforeunload = function(event) {
                event.returnValue = "Deseja sair da página?";
            };  
        }   
                    // Cria 'div' para o toolbar
                    var tbContainer = document.createElement('div');
                    tbContainer.style.position = 'relative';
                    tbContainer.style.overflow = 'auto';
                    tbContainer.style.padding = '3px';
                    tbContainer.style.left = '0px';
                    tbContainer.style.top = '0px';
                    tbContainer.style.width = '65px';
                    tbContainer.style.height = '100%';
                    tbContainer.style.bottom = '0px';
                    
                    bodygraph.appendChild(tbContainer);
                
                    // Cria o toolbar
                    var toolbar = new mxToolbar(tbContainer);
                    toolbar.enabled = false;
                    
                    // Cria 'div' para o grafo (ou gráfico a depender do uso)
                    var container = document.createElement('div');
                    //container.style.position = 'relative';
                    container.style.width = '100%';
                    container.style.height = '800px';
                    container.style.overflow = 'auto';
                    container.style.left = '24px';
                    container.style.top = '0px';
                    container.style.right = '0px';
                    container.style.bottom = '0px';
                    container.style.background = 'url("../ferramenta/editors/images/grid.gif")';
        
                    bodygraph.appendChild(container);

        mxEvent.disableContextMenu(container);
        var graph = new mxGraph(container);

        graph.setMultigraph(false);
        graph.setCellsResizable(false);
        graph.vertexLabelsMovable = false;
        graph.edgeLabelsMovable = false;
        
        //Desabilita a edição dos 'labels' diretamente(dois cliques no mouse)
        graph.isCellEditable = function(cell)
        {
            if(isEdge(cell)!=null)
            {
                return !this.getModel().isEdge(cell);
            }
            else if(isVertex(cell)!=null)
            {
                return !this.getModel().isVertex(cell);
            }	
        };
        //Desabilita o ícone pasta (ícone aparece interno a algumas células)
        graph.isCellFoldable = function(cell)
        {
            return false;
        };
        //Define o nome de apresentação dos elementos
        graph.convertValueToString = function(cell)
        {
            if((mxUtils.isNode(cell.value)&&cell.value.nodeName!='Arco') && (mxUtils.isNode(cell.value) && cell.value.nodeName!='ArcoInibidor'))
            {
                if(mxUtils.isNode(cell.value) && cell.value.nodeName!='Metrica')
                {
                     return cell.getAttribute('Label');
                }
                else
                {
                    return cell.getAttribute('Label') + ': ' + cell.getAttribute('Expression');
                }
            }
            else
            {
                if(cell.getAttribute('Peso')=='1')
                {
                    return '';
                }
                else
                {
                    return cell.getAttribute('Peso');
                }
            }	 
        }


        // Enables rubberband selection
        new mxRubberband(graph);

        var parent = graph.getDefaultParent();
        var docxml = mxUtils.createXmlDocument();

        //Define estilo para as transições
        var spntransStyle = new Object(); 
            spntransStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
            spntransStyle[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
            spntransStyle[mxConstants.STYLE_STROKECOLOR] = 'black';
            spntransStyle[mxConstants.STYLE_ROUNDED] = true;
            spntransStyle[mxConstants.STYLE_FILLCOLOR] = 'black';
            spntransStyle[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = 'bottom';
            spntransStyle[mxConstants.STYLE_FONTCOLOR] = 'black';
        graph.getStylesheet().putCellStyle('transblack', spntransStyle);
        var spntransStyle = mxUtils.clone(spntransStyle);
            spntransStyle[mxConstants.STYLE_FILLCOLOR] = 'white';
        graph.getStylesheet().putCellStyle('transwhite', spntransStyle);
        //Define estilo para os lugares
        var spnplaceStyle = new Object();
            spnplaceStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
            spnplaceStyle[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
            spnplaceStyle[mxConstants.STYLE_STROKECOLOR] = 'black';
            spnplaceStyle[mxConstants.STYLE_FILLCOLOR] = 'white';
            spnplaceStyle[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = 'bottom';
            spnplaceStyle[mxConstants.STYLE_FONTCOLOR] = 'black';
        graph.getStylesheet().putCellStyle('place', spnplaceStyle);	
        //Define estilo para os arcos retos e arcos encurvados
        var spnarcoStyle = new Object;					
            spnarcoStyle[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_CLASSIC;
            spnarcoStyle[mxConstants.STYLE_EDGE] = null;
            spnarcoStyle[mxConstants.STYLE_STROKECOLOR] = 'black';
            spnarcoStyle[mxConstants.STYLE_ENDFILL] = 1;
            spnarcoStyle[mxConstants.STYLE_FONTCOLOR] = 'black';
            spnarcoStyle[mxConstants.STYLE_TARGET_PERIMETER_SPACING] = 1;
            spnarcoStyle[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = 'white';
        graph.getStylesheet().putCellStyle('stylearco', spnarcoStyle);
        var spnarcocurveStyle = mxUtils.clone(spnarcoStyle);
            spnarcocurveStyle[mxConstants.STYLE_EDGE] = mxEdgeStyle.OrthConnector;
            spnarcocurveStyle[mxConstants.STYLE_CURVED] = 1;
        graph.getStylesheet().putCellStyle('stylearcocurve', spnarcocurveStyle);
        var spnarcoStyle = mxUtils.clone(spnarcoStyle);				
            spnarcoStyle[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_OVAL;
            spnarcoStyle[mxConstants.STYLE_ENDFILL] = 0;
            spnarcoStyle[mxConstants.STYLE_FONTCOLOR] = 'black';
            spnarcoStyle[mxConstants.STYLE_TARGET_PERIMETER_SPACING] = 4;
        graph.getStylesheet().putCellStyle('stylearcoinibidor', spnarcoStyle);
        var spnarcoinibcurveStyle = mxUtils.clone(spnarcoStyle);
            spnarcoinibcurveStyle[mxConstants.STYLE_EDGE] = mxEdgeStyle.OrthConnector;
            spnarcoinibcurveStyle[mxConstants.STYLE_CURVED] = 1;
        graph.getStylesheet().putCellStyle('stylearcoinibidorcurve', spnarcoinibcurveStyle);
        //Define estilo para o conteúdo das métrica
        var metricaStyle = new Object(); 
            metricaStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
            metricaStyle[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
            metricaStyle[mxConstants.STYLE_STROKECOLOR] = 'none';
            metricaStyle[mxConstants.STYLE_ROUNDED] = false;
            metricaStyle[mxConstants.STYLE_FILLCOLOR] = 'none';
            metricaStyle[mxConstants.STYLE_FONTCOLOR] = 'black';
        graph.getStylesheet().putCellStyle('metrica', metricaStyle);
        //Define estilo para a representação dos Tokens nos lugares - TokenLabel
        //É apresentado imagens até a quantidade de quatro tokens
        var token = new Object();
            token[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
            token[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
            token[mxConstants.STYLE_IMAGE] = null;
        graph.getStylesheet().putCellStyle('token', token);
        var token =  mxUtils.clone(token);
            token[mxConstants.STYLE_IMAGE] = '../ferramenta/editors/images/SPN/token1.gif';
        graph.getStylesheet().putCellStyle('token1', token);
        var token =  mxUtils.clone(token);
            token[mxConstants.STYLE_IMAGE] = '../ferramenta/editors/images/SPN/token2.gif';
        graph.getStylesheet().putCellStyle('token2', token);
        var token =  mxUtils.clone(token);
            token[mxConstants.STYLE_IMAGE] = '../ferramenta/editors/images/SPN/token3.gif';
        graph.getStylesheet().putCellStyle('token3', token);
        var token =  mxUtils.clone(token);
            token[mxConstants.STYLE_IMAGE] = '../ferramenta/editors/images/SPN/token4.gif';
        graph.getStylesheet().putCellStyle('token4', token);
        
            //ADICIONA BOTÕES SAVE E LOAD
            	// SAVE
				tbContainer.appendChild(mxUtils.button('SAVE', function()
				{
                    if(localStorage.getItem(ex+'exqcb')!=null)
                    {
                        vex.dialog.confirm({
                            message: 'Deseja salvar o modelo que você está construíndo para este exercício? '+
                            'OBSERVAÇÃO: O modelo anteriormente salvo para este exercício será apagado.',
                            className: 'vex-theme-default',
                            callback: function (value) {
                                if (value)
                                {
                                    var encoder = new mxCodec();
                                    var node = encoder.encode(graph.getModel());			
                                    var text = mxUtils.getXml(node);		
                                    // Por padrão, os nomes dos exercícios 'ex' devem ser diferentes. É adicionado a string 'exqcb' para atribuir nomes aos modelos salvos
                                    localStorage.setItem(ex+'exqcb', text);
                                    vex.dialog.alert({
                                        message: "Modelo salvo com sucesso!", 
                                        className: 'vex-theme-default'});
                                }
                            }
                        })
                    }
                    else
                    {
                        var encoder = new mxCodec();
                        var node = encoder.encode(graph.getModel());			
                        var text = mxUtils.getXml(node);		
                        // Por padrão, os nomes dos exercícios 'ex' devem ser diferentes. É adicionado a string 'exqcb' para atribuir nomes aos modelos salvos
                        localStorage.setItem(ex+'exqcb', text);
                        vex.dialog.alert({
                            message: "Modelo salvo com sucesso!", 
                            className: 'vex-theme-default'});
                    }

				}));
                toolbar.addSeparator('../src/images/transparent.gif');
				// LOAD
				tbContainer.appendChild(mxUtils.button('LOAD', function()
				{
                    if(localStorage.getItem(ex+'exqcb')!=null)
                    {
                        vex.dialog.confirm({
                            message: 'Deseja carregar o modelo anteriormente salvo deste exercício?',
                            className: 'vex-theme-default',
                            callback: function (value) {
                                if (value)
                                {
                                        var text = localStorage.getItem(ex+'exqcb'); 
                
                                        graph.getModel().beginUpdate();
                                        try
                                        {
                                            var doc = mxUtils.parseXml(text);
                                            var codec = new mxCodec(doc);
                                            codec.decode(doc.documentElement, graph.getModel());                                        
                                        }
                                        finally
                                        {
                                            graph.getModel().endUpdate();
                                        }
                                }
                            }     
                        })
                    }
                    else
                    {
                        mxUtils.alert('Não existe modelo salvo para este exercício.');
                    }
				}));
			
        /////////Botão Enviar Enviar Resposta/////////////////
        document.getElementById("enviar").addEventListener("click", function(){geradorquebracb(graph, qxml, nextpage, ex, pontos);});

        graph.getModel().beginUpdate();
        try
        {
            var transwhite = docxml.createElement('TransTemp');
            transwhite.setAttribute('Label','Chegada');
            transwhite.setAttribute('IDqcb', 'Chegada');	
            transwhite1=graph.insertVertex(parent, null, transwhite, 300, 200, 25, 35, 'transwhite');		
            
            var transwhite = docxml.createElement('TransTemp');
            transwhite.setAttribute('Label','Saída');
            transwhite.setAttribute('IDqcb', 'Saida');	
            transwhite2=graph.insertVertex(parent, null, transwhite, 200, 250, 25, 35, 'transwhite');	
            
            var place = docxml.createElement('Lugar');
            place.setAttribute('Label','Estoque');
            place.setAttribute('IDqcb', 'Estoque');
            plc = graph.insertVertex(parent, null, place,300 ,350 , 35, 35, 'place');
             var tokl = docxml.createElement('TokenLabel');//objeto colocados 'dentro' da célula lugar para representar os tokens
            tokl.setAttribute('Label','');
            toklabel = graph.insertVertex(plc, null, tokl, 0.3, 0.3, 15, 15, 'token3', true);
            toklabel.setConnectable(false);

            var arco = docxml.createElement('Arco');
            var pt = docxml.createElement('Ponto');
            var pt1 = graph.insertVertex(parent, null, pt, 100, 100, 0, 0,);
            pt = docxml.createElement('Ponto');
            var pt2 = graph.insertVertex(parent, null, pt, 150, 150, 0, 0,);
            graph.insertEdge(parent, null, arco, pt1, pt2, 'stylearco');

            var arco = docxml.createElement('Arco');
            pt = docxml.createElement('Ponto');
            pt1 = graph.insertVertex(parent, null, pt, 400, 250, 0, 0);
            pt = docxml.createElement('Ponto');
            pt2 = graph.insertVertex(parent, null, pt, 350, 350, 0, 0);	
            graph.insertEdge(parent, null, arco, pt1, pt2, 'stylearco');
            
        }
        finally
        {
            graph.getModel().endUpdate();
        }
    }
    
    //Gera um novo arquivo XML com dados modificados para comparar dois modelos de grafos
    // qxml -> é o endereço do arquivo xml da questão a ser resolvida
    function geradorquebracb(graph, qxml, nextpage, ex, pontos)
    {
        // Para caso de apertar o botão LOAD, deve-se obter o parent mais atualizado
        graph.getModel().beginUpdate();
        try
        {
            var parent = graph.getDefaultParent();
        }
        finally
        {
            graph.getModel().endUpdate();
        }

        var edges = graph.getChildCells(parent,false, true);
        var boolaux = true;
        
        for(i=0; i<edges.length; i++)
        {                
            if((edges[i].getTerminal(true)==null)||(edges[i].getTerminal(true).value.nodeName=='Ponto')||(edges[i].getTerminal(false)==null)||(edges[i].getTerminal(false).value.nodeName=='Ponto')) 
            {
                boolaux = false;
            }
            else
            {
                var source = edges[i].getTerminal(true);
                var target = edges[i].getTerminal(false);

                edges[i].setAttribute('IDsource', source.getAttribute('IDqcb'));
                edges[i].setAttribute('IDtarget', target.getAttribute('IDqcb'));
            }
        }
        
        if(boolaux==true)
        {
            gerador(graph,qxml,nextpage, ex, pontos);
        }
        else
        {
            mxUtils.alert("Modelagem incorreta. Observação: alguns arcos não estão conectados.");
        }
    }
}
