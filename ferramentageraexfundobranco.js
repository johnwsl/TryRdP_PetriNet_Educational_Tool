//Adiciona a biblioteca cursor.js no html
document.write(unescape("%3Cscript src='cursor/build/cursor.min.js' type='text/javascript'%3E%3C/script%3E"));
//Adiciona o arquivo bodygraph.css no html . O container indicado com o id 'bodygraph' na função main deve ter class=bodygraph .
document.write(unescape("%3Clink  href='ferramenta/bodygraph.css' rel='stylesheet'/%3E"));
//Observe que a ferramenta usa a biblioteca VEX para caixa de diálogo. A biblioteca está sendo refenciada diretamente no html
//Observe também que o método alert da classe mxUtils foi modificado usando a biblioteca de caixas de diálogo 'vex'. Para usar o vex vc deve importar ela no html.


//Variáveis globais auxiliares para a contagem dos vétices(Lugares e transições) e métricas no grafo - para mostrar diferenciação ao usuário
    var auxlugar = 0;
    var auxtransim = 0;
    var auxtranstemp = 0; 
    var auxmetrica = 0;

function main(bodygraph, qxml, nextpage, ex, pontos, showsimulacao)
{

    //bodygraph -> container do grafo
    //qxml -> xml da questão na ferramenta
    //nextpage -> próxima página após a questão
    // ex -> nome do exercício usado para salvar no local storage
    // pontos -> pontuação do exercício
    // showsimulacao -> é uma url que mostra os valores dos cálculos das métricas

    //Observação: os atributos de qxml seguem um formato criado pelo programador, explicado no decorrer do código

        //Checa se o browser suporta a biblioteca mxGraph
        if (!mxClient.isBrowserSupported())
        {
            mxUtils.error('O browser não suporta!', 200, false);
        }
        else
        {
            //Define um ícone quando o mouse entra em contao com um vértice para conectar arestas
            mxConnectionHandler.prototype.connectImage = new mxImage('ferramenta/images/connector.gif', 8, 8);

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
            container.style.position = 'relative';
            container.style.overflow = 'auto';
            container.style.left = '24px';
            container.style.top = '0px';
            container.style.right = '0px';
            container.style.bottom = '0px';
            //container.style.background = 'url("ferramenta/editors/images/grid.gif")';

            bodygraph.appendChild(container);
            
            // Ajuste para o o browser IE (Esse código é um código mostrado por exemplos e pela documentação do mxGraph )
            if (mxClient.IS_QUIRKS)
            {
                bodygraph.style.overflow = 'auto';
                new mxDivResizer(tbContainer);
                new mxDivResizer(container);
            }

            // Cria grafo e o modelo do grafo (leia a documentação para entender os detalhes)
            var model = new mxGraphModel();
            var graph = new mxGraph(container, model);

            // Habilita ou desabilita certas conexões ou outras propriedades do grafo como mover label e etc
            graph.setConnectable(false);
            graph.setMultigraph(false);
            graph.setAllowDanglingEdges(false);
            graph.setCellsDisconnectable(false);
            graph.setCellsResizable(false);
            graph.vertexLabelsMovable = false;
            graph.edgeLabelsMovable = false;
            

            //Desabilita o menu contexto do browser
            mxEvent.disableContextMenu(container);

            //Rubberband
            new mxRubberband(graph);

            //UNDO REDO////////////////////////////////////////////////////
            var undoManager = new mxUndoManager();
            var listener = function(sender, evt)
            {
                undoManager.undoableEditHappened(evt.getProperty('edit'));
            };
            graph.getModel().addListener(mxEvent.UNDO, listener);
            graph.getView().addListener(mxEvent.UNDO, listener);


            //Remove células quando é apertado [DELETE]
            var keyHandler = new mxKeyHandler(graph);
            keyHandler.bindKey(46, function(evt)
            {
                if (graph.isEnabled())
                {
                    graph.removeCells();
                }
            });

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
            }

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
                token[mxConstants.STYLE_IMAGE] = 'ferramenta/editors/images/SPN/token1.gif';
            graph.getStylesheet().putCellStyle('token1', token);
            var token =  mxUtils.clone(token);
                token[mxConstants.STYLE_IMAGE] = 'ferramenta/editors/images/SPN/token2.gif';
            graph.getStylesheet().putCellStyle('token2', token);
            var token =  mxUtils.clone(token);
                token[mxConstants.STYLE_IMAGE] = 'ferramenta/editors/images/SPN/token3.gif';
            graph.getStylesheet().putCellStyle('token3', token);
            var token =  mxUtils.clone(token);
                token[mxConstants.STYLE_IMAGE] = 'ferramenta/editors/images/SPN/token4.gif';
            graph.getStylesheet().putCellStyle('token4', token);

            //ADICIONA BOTÕES PARA O GRÁFICO
            toolbar.addLine();
            addToolbarButton(tbContainer,'transtemp','','ferramenta/editors/images/SPN/TrWhite.gif', graph, undoManager, parent, docxml);
            addToolbarButton(tbContainer,'transim','','ferramenta/editors/images/SPN/TrBlack.gif', graph, undoManager, parent, docxml);										
            toolbar.addSeparator('src/images/transparent.gif');

            addToolbarButton(tbContainer,'lugar','','ferramenta/editors/images/SPN/place.gif', graph, undoManager, parent, docxml);
            toolbar.addSeparator('src/images/transparent.gif');

            addToolbarButton(tbContainer,'arco','','ferramenta/editors/images/SPN/arco.gif', graph, undoManager, parent, docxml);
            addToolbarButton(tbContainer,'arcoinibidor', '', 'ferramenta/editors/images/SPN/arco_inibidor.gif', graph, undoManager, parent, docxml);
            toolbar.addSeparator('src/images/transparent.gif');

            addToolbarButton(tbContainer,'metrica', '', 'ferramenta/editors/images/SPN/metrica.png', graph, undoManager, parent, docxml);
            toolbar.addLine();
            toolbar.addSeparator('src/images/transparent.gif');

            graph.multiplicities.push(new mxMultiplicity(true, 'Lugar', null, null, 0, 'n', ['TransIm','TransTemp'],
                                     null ,'Lugares não se conectam com lugares!'));
            graph.multiplicities.push(new mxMultiplicity(true, 'TransIm', null, null, 0, 'n', ['Lugar'], null,
                                     'Transições não se conectam com transições!'));
            graph.multiplicities.push(new mxMultiplicity(true, 'TransTemp', null, null, 0, 'n', ['Lugar'], null,
                                     'Transições não se conectam com transições!'));

            //ADICIONA BOTÕES DE ZOOM
            toolbar.addLine();
            addToolbarButton(tbContainer,'zoomin','','ferramenta/images/zoom_in.png', graph, undoManager);
            addToolbarButton(tbContainer,'zoomout', '', 'ferramenta/images/zoom_out.png', graph, undoManager);
            toolbar.addSeparator('src/images/transparent.gif');

            //UNDO REDO
            addToolbarButton(tbContainer, 'undo', '', 'ferramenta/images/undo.png', graph, undoManager);
            addToolbarButton(tbContainer, 'redo', '', 'ferramenta/images/redo.png', graph, undoManager);
            toolbar.addSeparator('src/images/transparent.gif');

            //ADICIONA BOTÃO PARA IMPRIMIR
            addToolbarButton(tbContainer, 'print', '', 'ferramenta/images/printer.png', graph, undoManager);
            toolbar.addLine();

            //ADICIONA BOTÕES SAVE E LOAD
            	// SAVE
				tbContainer.appendChild(mxUtils.button('SAVE', function()
				{
                    if(localStorage.getItem(ex+'exf')!=null)
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
                                    // Por padrão, os nomes dos exercícios 'ex' devem ser diferentes. É adicionado a string 'exf' para atribuir nomes aos modelos salvos
                                    localStorage.setItem(ex+'exf', text);
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
                        // Por padrão, os nomes dos exercícios 'ex' devem ser diferentes. É adicionado a string 'exf' para atribuir nomes aos modelos salvos
                        localStorage.setItem(ex+'exf', text);
                        vex.dialog.alert({
                            message: "Modelo salvo com sucesso!", 
                            className: 'vex-theme-default'});
  
                    }

				}));
                toolbar.addSeparator('src/images/transparent.gif');

				// LOAD
				tbContainer.appendChild(mxUtils.button('LOAD', function()
				{
                    if(localStorage.getItem(ex+'exf')!=null)
                    {
                        vex.dialog.confirm({
                            message: 'Deseja carregar o modelo anteriormente salvo deste exercício?',
                            className: 'vex-theme-default',
                            callback: function (value) {
                                if (value)
                                {
                                        var text = localStorage.getItem(ex+'exf'); 
                
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
				toolbar.addLine();
                
            ///////// Botão para visualizar o XML do mxgraph ////////////////////////////
            function verxml()
				{
					var encoder = new mxCodec();
					var node = encoder.encode(graph.getModel());
                    mxUtils.popup(mxUtils.getPrettyXml(node), true);
                    tt= mxUtils.getXml(node);
					var blob = new Blob([tt], { type: "text/xml;charset=utf-8" });							
					saveAs(blob,'testegeral.xml');

                }
            document.getElementById("xmlmxgraph").addEventListener("click", function(){verxml();});
            /////////Botão Enviar Enviar Resposta/////////////////
            document.getElementById("enviar").addEventListener("click", function(){gerador(graph);});
            
            //Cria o popupmenu
            graph.popupMenuHandler.factoryMethod = function(menu, cell, evt)
            {
                return createPopupMenu(graph, menu, cell, evt, docxml);
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
                        if(cell.getAttribute('Expression')===undefined)
                        {
                            return cell.getAttribute('Label') + ': ';
                        }
                        else
                        {
                            return cell.getAttribute('Label') + ': ' + cell.getAttribute('Expression');
                        }
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
        }	
    };

    // Função que cria o popupmenu
    function createPopupMenu(graph, menu, cell, evt, docxml)
    {
        if (cell != null)
        {
            if (mxUtils.isNode(cell.value) && cell.value.nodeName == 'TransIm')
            {
                menu.addItem('Propriedades', 'ferramenta/images/properties.gif', function()
                {
                    selectionChanged(graph, docxml);
                });
                menu.addSeparator();
            }
            else if (mxUtils.isNode(cell.value) && cell.value.nodeName == 'TransTemp')
            {
                menu.addItem('Propriedades', 'ferramenta/images/properties.gif', function()
                {
                    selectionChanged(graph, docxml);
                });
                menu.addSeparator();
            }
            else if (mxUtils.isNode(cell.value) && cell.value.nodeName == 'Lugar')
            {
                menu.addItem('Propriedades', 'ferramenta/images/properties.gif', function()
                {
                    selectionChanged(graph, docxml);
                });
                menu.addSeparator();
            }
            else if (mxUtils.isNode(cell.value) && cell.value.nodeName == 'Arco')
            {
                menu.addItem('Propriedades', 'ferramenta/images/properties.gif', function()
                {
                    selectionChanged(graph, docxml);
                });
                menu.addSeparator();

                menu.addItem('Encurvar', 'ferramenta/images/curve.gif', function()
                {
                    var model = graph.getModel();

                    graph.getModel().beginUpdate();
                    try
                    {
                        var edit = new mxStyleChange(model,cell,'stylearcocurve');
                        model.execute(edit);
                    }
                    finally
                    {
                        graph.getModel().endUpdate();
                    }
                });
                menu.addSeparator();
            }
            else if (mxUtils.isNode(cell.value) && cell.value.nodeName == 'ArcoInibidor')
            {
                menu.addItem('Propriedades', 'ferramenta/images/properties.gif', function()
                {
                    selectionChanged(graph, docxml);
                });
                menu.addSeparator();
                menu.addItem('Encurvar', 'ferramenta/images/curve.gif', function()
                {
                    var model = graph.getModel();

                    graph.getModel().beginUpdate();
                    try
                    {
                        var edit = new mxStyleChange(model,cell,'stylearcoinibidorcurve');
                        model.execute(edit);
                    }
                    finally
                    {
                        graph.getModel().endUpdate();
                    }
                });
                menu.addSeparator();
            }
            else if (mxUtils.isNode(cell.value) && cell.value.nodeName == 'Metrica')
            {
                menu.addItem('Propriedades', 'ferramenta/images/properties.gif', function()
                {
                    selectionChanged(graph, docxml);
                });
                menu.addSeparator();
            }
            //Em caso do usuário clicar na célula TokenLabel do grafo ao invés da célula Lugar
            else if(mxUtils.isNode(cell.value) && cell.value.nodeName == 'TokenLabel')
            {
                menu.addItem('Propriedades', 'ferramenta/images/properties.gif', function()
                {
                    selectionChanged(graph, docxml);
                });
                menu.addSeparator();
            }

            menu.addItem('Remover', 'ferramenta/images/delete.png', function()
            {	//Em caso do usuário clicar na célula TokenLabel do grafo ao invés da célula Lugar
                if(mxUtils.isNode(cell.value) && cell.value.nodeName == 'TokenLabel')
                {
                    placeparent = cell.getParent();//Referencia a célula Lugar
                    graph.removeCells([placeparent]);
                }
                else if((mxUtils.isNode(cell.value) && cell.value.nodeName=='Arco') || (mxUtils.isNode(cell.value) && cell.value.nodeName=='ArcoInibidor'))
                {
                    graph.removeCells();
                    if(cell.source.value.nodeName == 'Lugar')
                    {
                        identlugarAjuste(cell.source, graph); //Em caso de remoção de arcos, atualiza atributos dos lugares
                    }
                    else if(cell.target.value.nodeName == 'Lugar')
                    {
                        identlugarAjuste(cell.target, graph);
                    }
                }
                else if((mxUtils.isNode(cell.value) && cell.value.nodeName == 'TransIm') || (mxUtils.isNode(cell.value) && cell.value.nodeName == 'TransTemp'))
                {
                    var edgs = cell.edges;						
                    
                    if(edgs!=null)
                    {
                        var L = edgs.length;
                        var aux;
                        
                        for(i=0; i<L; i++)
                        {
                            if(edgs[0].source.value.nodeName == 'Lugar') //A medida que uma célula é removida do array a biblioteca auto atualiza os ídices do array													
                            {											 //Por isso deixa-se o índice constante em zero
                                aux = edgs[0].source;
                                graph.removeCells([edgs[0]]);
                                identlugarAjuste(aux, graph); 
                            }
                            else if(edgs[0].target.value.nodeName == 'Lugar')
                            {
                                aux = edgs[0].target;
                                graph.removeCells([edgs[0]]);
                                identlugarAjuste(aux, graph);
                            }
                        }
                    }
                    graph.removeCells();
                }
                else
                {
                    graph.removeCells();
                }
            });
        }
    };

    //Função que adiciona botões ao toolbar
    function addToolbarButton(tbContainer, act, label, image, graph, undoManager, parent, docxml)
    {
        var button = document.createElement('button');
        button.style.fontSize = '10';
        var mxConnectionHandlerInsertEdge = mxConnectionHandler.prototype.insertEdge; // objeto da classe mxConnectionHandler

        if (image!=null)
        {
            var img = document.createElement('img');
            img.setAttribute('src', image);
            img.style.width = '11px';
            img.style.height = '11px';
            button.appendChild(img);
        }

        if(act=='undo')
        {
            mxEvent.addListener(button, 'click', function(evt)
            {	
                undoManager.undo();
            });
        }
        else if(act=='redo')
        {
            mxEvent.addListener(button, 'click', function(evt)
            {	
                undoManager.redo();
            });
        }
        else if(act=='zoomin')
        {
            mxEvent.addListener(button, 'click', function(evt)
            {	
                graph.zoomIn();
            });
        }
        else if(act=='zoomout')
        {
            mxEvent.addListener(button, 'click', function(evt)
            {	
                graph.zoomOut();
            });
        }
        else if(act=='print')
        {
            mxEvent.addListener(button,'click', function(evt)
            {					
                var preview = new mxPrintPreview(graph);
                preview.border = 30;
                preview.open();
            });
        }
        else if(act=='arco')
        {
            mxEvent.addListener(button, 'click', function(evt)
            { 
                // Modifica o cursor usando a biblioteca cursor.js
                cursor({
                    domElement:document.getElementById("bodygraph"),
                    type:"img",
                    filePath:"ferramenta/editors/images/SPN/pointer_arco.png"
                });
                ////////////////////////////
                graph.setConnectable(true);	
                mxConnectionHandler.prototype.insertEdge = function(parent, id, value, source, target, style)
                {
                    var arco = docxml.createElement('Arco');
                    arco.setAttribute('Peso', '1');	
                      value = arco;
                    style = 'stylearco';

                    var attrs = source.value.attributes;						
                    if(source.value.nodeName == 'Lugar'){var L=2;} else if(source.value.nodeName == 'TransIm'){var L = attrs.length - 1;} else{var L = attrs.length;}
                    var strg1 = '|' + source.value.nodeName + '|';
                    var strg2 = '|' + target.value.nodeName + '|';
                                                //Em objetos TransIm desconsidera-se o último elemento('GuardaExpression') antes de 'id'
                    for (var i = 1; i < L; i++) //Apenas para 'Lugares': com L=2 e inicia com i=1, considera apenas o segundo atributo
                    {							//Em todos os objetos disconsidera o primeiro atributo, i inicia em i=1. Desconsidera também o último atributo 'id'
                        strg1 = strg1 + attrs[i].nodeValue + '|';
                    }
                    
                    attrs = target.value.attributes;
                    if(target.value.nodeName == 'Lugar'){var L=2;} else if(target.value.nodeName == 'TransIm'){var L = attrs.length - 1;} else{var L = attrs.length;}
                                                //Em objetos TransIm desconsidera-se o último elemento('GuardaExpression') antes de 'id'
                    for (var i = 1; i < L; i++) //Apenas para 'Lugares': com L=2 e inicia com i=1, considera apenas o segundo atributo
                    {							//Em todos os objetos disconsidera o primeiro atributo, i inicia em i=1. Desconsidera também o último atributo 'id'
                        strg2 = strg2 + attrs[i].nodeValue + '|';
                    }
                    arco.setAttribute('IDsource', strg1);	
                    arco.setAttribute('IDtarget', strg2);	

                    if(source.value.nodeName == 'Lugar')
                    {
                        if(target.value.nodeName == 'TransIm')
                        {
                            var countTransIm = Number(source.getAttribute('QtrIm',''));
                            countTransIm++;
                            var pesoTransIm = Number(source.getAttribute('PtrIm','')) + Number(target.getAttribute('Peso',''));
                            var priTransIm = Number(source.getAttribute('PrtrIm','')) + Number(target.getAttribute('Prioridade',''));

                            graph.getModel().beginUpdate();
                            try
                            {
                                edit = new mxCellAttributeChange(source, 'QtrIm', countTransIm);							
                                   graph.getModel().execute(edit);
                                edit = new mxCellAttributeChange(source, 'PtrIm', pesoTransIm);							
                                   graph.getModel().execute(edit);
                                edit = new mxCellAttributeChange(source, 'PrtrIm', priTransIm);							
                                   graph.getModel().execute(edit);
                            }
                            finally
                            {
                                graph.getModel().endUpdate();
                            }
                        }
                        else if(target.value.nodeName == 'TransTemp')
                        {
                            var countTransTemp = Number(source.getAttribute('QtrTp',''));
                            countTransTemp++;
                            var tempoTransTemp = Number(source.getAttribute('TtrTp','')) + Number(target.getAttribute('Tempo',''));

                            graph.getModel().beginUpdate();
                            try
                            {
                                edit = new mxCellAttributeChange(source, 'QtrTp', countTransTemp);							
                                   graph.getModel().execute(edit);
                                edit = new mxCellAttributeChange(source, 'TtrTp', tempoTransTemp);							
                                   graph.getModel().execute(edit);	
                            }
                            finally
                            {
                                graph.getModel().endUpdate();
                            }

                        }

                        graph.getModel().beginUpdate();
                        try
                           {	var QarcS = source.getAttribute('QarcS','');
                               QarcS = Number(QarcS);
                            QarcS++;
                            var ParcS = source.getAttribute('ParcS','');
                            ParcS = Number(ParcS);
                            ParcS++;
                            var edit = new mxCellAttributeChange(source, 'QarcS', QarcS);							
                               graph.getModel().execute(edit);		
                            edit = new mxCellAttributeChange(source, 'ParcS', ParcS);							
                               graph.getModel().execute(edit);				
                        }
                        finally
                        {
                                graph.getModel().endUpdate();
                        }
                    }
                    else if(target.value.nodeName == 'Lugar')
                    {
                        if(source.value.nodeName == 'TransIm')
                        {
                            var countTransIm = Number(target.getAttribute('QtrIm',''));
                            countTransIm++;
                            var pesoTransIm = Number(target.getAttribute('PtrIm','')) + Number(source.getAttribute('Peso',''));
                            var priTransIm = Number(target.getAttribute('PrtrIm','')) + Number(source.getAttribute('Prioridade',''));

                            graph.getModel().beginUpdate();
                            try
                            {
                                edit = new mxCellAttributeChange(target, 'QtrIm', countTransIm);							
                                   graph.getModel().execute(edit);
                                edit = new mxCellAttributeChange(target, 'PtrIm', pesoTransIm);							
                                   graph.getModel().execute(edit);
                                edit = new mxCellAttributeChange(target, 'PrtrIm', priTransIm);							
                                   graph.getModel().execute(edit);
                            }
                            finally
                            {
                                graph.getModel().endUpdate();
                            }
                        }
                        else if(source.value.nodeName == 'TransTemp')
                        {
                            var countTransTemp = Number(target.getAttribute('QtrTp',''));
                            countTransTemp++;
                            var tempoTransTemp = Number(target.getAttribute('TtrTp','')) + Number(source.getAttribute('Tempo',''));

                            graph.getModel().beginUpdate();
                            try
                            {
                                edit = new mxCellAttributeChange(target, 'QtrTp', countTransTemp);							
                                   graph.getModel().execute(edit);
                                edit = new mxCellAttributeChange(target, 'TtrTp', tempoTransTemp);							
                                   graph.getModel().execute(edit);	
                            }
                            finally
                            {
                                graph.getModel().endUpdate();
                            }
                        }


                        graph.getModel().beginUpdate();
                        try
                           {	var QarcT = target.getAttribute('QarcT','');
                            QarcT = Number(QarcT);
                            QarcT++;
                            var ParcT= target.getAttribute('ParcT','');
                            ParcT = Number(ParcT);
                            ParcT++;
                            var edit = new mxCellAttributeChange(target, 'QarcT', QarcT);							
                               graph.getModel().execute(edit);	
                            edit = new mxCellAttributeChange(target, 'ParcT', ParcT);							
                               graph.getModel().execute(edit);				
                        }
                        finally
                        {
                                graph.getModel().endUpdate();
                        }
                    }

                    return mxConnectionHandlerInsertEdge.apply(this, arguments);
                };
                
            });
        }
        else if(act=='arcoinibidor')
        {
            mxEvent.addListener(button, 'click', function(evt)
            {
                // Modifica o cursor
                cursor({
                    domElement:document.getElementById("bodygraph"),
                    type:"img",
                    filePath:"ferramenta/editors/images/SPN/pointer_arcoinibidor.png"
                });
                /////////////////////////////
                graph.setConnectable(true);			
                mxConnectionHandler.prototype.insertEdge = function(parent, id, value, source, target, style)
                {			
                    var arcoinibidor = docxml.createElement('ArcoInibidor');
                    arcoinibidor.setAttribute('Peso', '1');	
                      value = arcoinibidor;
                    style = 'stylearcoinibidor'; 
                    if(source.value.nodeName != 'Lugar')
                    {
                        mxUtils.alert('O arco inibidor sempre sai de um lugar para uma transição e não vice versa!');
                    }
                      else
                    {
                        var attrs = source.value.attributes;
                        var L = 2;
                        var strg1 = '|' + source.value.nodeName + '|';
                        var strg2 = '|' + target.value.nodeName + '|';
                        for (var i = 1; i < L; i++)
                        {
                            strg1 = strg1 + attrs[i].nodeValue + '|';
                        }

                        attrs = target.value.attributes;
                        if(target.value.nodeName == 'TransIm'){L = attrs.length - 1;} else{L = attrs.length;}
                        for (var i = 1; i < L; i++)
                        {
                            strg2 = strg2 + attrs[i].nodeValue + '|';
                        }
                        arcoinibidor.setAttribute('IDsource', strg1);	
                        arcoinibidor.setAttribute('IDtarget', strg2);

                        if(target.value.nodeName == 'TransIm')
                        {
                            var countTransIm = Number(source.getAttribute('QtrIm',''));
                            countTransIm++;
                            var pesoTransIm = Number(source.getAttribute('PtrIm','')) + Number(target.getAttribute('Peso',''));
                            var priTransIm = Number(source.getAttribute('PrtrIm','')) + Number(target.getAttribute('Prioridade',''));

                            graph.getModel().beginUpdate();
                            try
                            {
                                edit = new mxCellAttributeChange(source, 'QtrIm', countTransIm);							
                                   graph.getModel().execute(edit);
                                edit = new mxCellAttributeChange(source, 'PtrIm', pesoTransIm);							
                                   graph.getModel().execute(edit);
                                edit = new mxCellAttributeChange(source, 'PrtrIm', priTransIm);							
                                   graph.getModel().execute(edit);
                            }
                            finally
                            {
                                graph.getModel().endUpdate();
                            }
                        }
                        else if(target.value.nodeName == 'TransTemp')
                        {
                            var countTransTemp = Number(source.getAttribute('QtrTp',''));
                            countTransTemp++;
                            var tempoTransTemp = Number(source.getAttribute('TtrTp','')) + Number(target.getAttribute('Tempo',''));					
                            
                            graph.getModel().beginUpdate();
                            try
                            {
                                edit = new mxCellAttributeChange(source, 'QtrTp', countTransTemp);							
                                   graph.getModel().execute(edit);
                                edit = new mxCellAttributeChange(source, 'TtrTp', tempoTransTemp);							
                                   graph.getModel().execute(edit);	
                            }
                            finally
                            {
                                graph.getModel().endUpdate();
                            }
                        }

                        graph.getModel().beginUpdate();
                        try
                           {	var Qinib = source.getAttribute('Qinib','');
                            var Pinib = source.getAttribute('Pinib','');
                            Qinib = Number(Qinib);
                            Qinib++;
                            Pinib = Number(Pinib);
                            Pinib++;
                            var edit = new mxCellAttributeChange(source, 'Qinib', Qinib);							
                               graph.getModel().execute(edit);
                            edit = new mxCellAttributeChange(source, 'Pinib', Pinib);							
                               graph.getModel().execute(edit);
                        }
                        finally
                        {
                                graph.getModel().endUpdate();
                        }

                        return mxConnectionHandlerInsertEdge.apply(this, arguments);
                    }
                };					
            });
        }
        else if(act=='transim')
        {
            mxEvent.addListener(button, 'click', function(evt)
            {
                var transblack = docxml.createElement('TransIm');
                transblack.setAttribute('Label','TransIm' + auxtransim);	
                transblack.setAttribute('Prioridade','1');
                transblack.setAttribute('Peso','1');
                transblack.setAttribute('GuardaExpression','');
                graph.getModel().beginUpdate();
                try
                {
                    var parent = graph.getDefaultParent();
                    graph.insertVertex(parent, null, transblack, (Math.floor(Math.random() * 401) + 20), (Math.floor(Math.random() * 401) + 20), 
                    8, 35, 'transblack');	
                }
                finally
                {
                    graph.getModel().endUpdate();
                }
                auxtransim++;				
            });
        }
        else if(act=='transtemp')
        {
            mxEvent.addListener(button, 'click', function(evt)
            {
                var transwhite = docxml.createElement('TransTemp');
                transwhite.setAttribute('Label','TransTemp' + auxtranstemp);
                transwhite.setAttribute('Tempo', '0');	
                graph.getModel().beginUpdate();
                try
                {
                    var parent = graph.getDefaultParent();
                    graph.insertVertex(parent, null, transwhite, (Math.floor(Math.random() * 401) + 20), (Math.floor(Math.random() * 401) + 20), 
                    25, 35, 'transwhite');
                }
                finally
                {
                    graph.getModel().endUpdate();
                }		
                auxtranstemp++;				
            });
        }
        else if(act=='lugar')
        {	
            mxEvent.addListener(button, 'click', function(evt)
            {
                var place = docxml.createElement('Lugar');
                place.setAttribute('Label','Lugar' + auxlugar);
                place.setAttribute('Tokens', '0');
                place.setAttribute('Qinib', '0');//atributos de identificaçãos dos arcos conectados aos lugares
                place.setAttribute('Pinib', '0');
                place.setAttribute('QarcS', '0');
                place.setAttribute('ParcS', '0');
                place.setAttribute('QarcT', '0');
                place.setAttribute('ParcT', '0');
                place.setAttribute('QtrIm', '0');
                place.setAttribute('PtrIm', '0');
                place.setAttribute('PrtrIm', '0');
                place.setAttribute('QtrTp', '0');
                place.setAttribute('TtrTp', '0');
                
                graph.getModel().beginUpdate();
                try
                {
                    var parent = graph.getDefaultParent();
                    plc = graph.insertVertex(parent, null, place, (Math.floor(Math.random() * 401) + 20), (Math.floor(Math.random() * 401) + 20), 
                    35, 35, 'place');
                    var tokl = docxml.createElement('TokenLabel');//objeto colocados 'dentro' da célula lugar para representar os tokens
                    tokl.setAttribute('Label','');
                    toklabel = graph.insertVertex(plc, null, tokl, 0.3, 0.3, 15, 15, 'token', true);
                    toklabel.setConnectable(false);
                }
                finally
                {
                    graph.getModel().endUpdate();
                }	
                auxlugar++;							
            });
        }
        else if(act=='metrica')
        {
            mxEvent.addListener(button, 'click', function(evt)
            {
                var metrica = docxml.createElement('Metrica');
                metrica.setAttribute('Label','Metrica' + auxmetrica);
                metrica.setAttribute('Expression','');
                graph.getModel().beginUpdate();
                try
                {
                    var parent = graph.getDefaultParent();
                    metr = graph.insertVertex(parent, null, metrica, (Math.floor(Math.random() * 401) + 20), (Math.floor(Math.random() * 401) + 20), 
                    70, 30, 'metrica');	
                    metr.setConnectable(false);	
                }
                finally
                {
                    graph.getModel().endUpdate();
                }	
                auxmetrica++;					
            });
        }
        mxUtils.write(button, label);
        tbContainer.appendChild(button); 
    };

    //Modifica os atributos dos lugares relativo a identificar os mesmos nas métricas
    function identlugarAjuste(cell, graph)
    {
        var edgs = cell.edges;
        if( (cell.value.nodeName=='Lugar') && (edgs!=null) )
        {
            var attrs = cell.value.attributes;						
            var L = attrs.length;
            
            var arcinibcount = 0;
            var arcinibpesoscount = 0;
            var arccountSource = 0;
            var arccountSourcePesos = 0;
            var arccountTarget = 0;
            var arccountTargetPesos = 0;

            var countTransIm = 0;
            var pesoTransIm = 0;
            var priTransIm = 0;
            var countTransTemp = 0;
            var tempoTransTemp = 0;
                            
            for (var i = 0; i < edgs.length; i++)
            {
                if(edgs[i].value.nodeName == 'ArcoInibidor')
                {
                    if(edgs[i].source.value.nodeName == 'Lugar')
                    {
                        arcinibcount++;
                        arcinibpesoscount = arcinibpesoscount + Number(edgs[i].getAttribute('Peso',''));

                        if(edgs[i].target.value.nodeName == 'TransIm')
                        {
                            countTransIm++;
                            pesoTransIm = pesoTransIm + Number(edgs[i].target.getAttribute('Peso',''));
                            priTransIm = priTransIm + Number(edgs[i].target.getAttribute('Prioridade',''));
                        }
                        else if(edgs[i].target.value.nodeName == 'TransTemp')
                        {
                            countTransTemp++;
                            tempoTransTemp = tempoTransTemp + Number(edgs[i].target.getAttribute('Tempo',''));
                        }
                    }
                }
                else if(edgs[i].value.nodeName == 'Arco')
                {
                    if(edgs[i].source.value.nodeName == 'Lugar')
                    {
                        arccountSource++;
                        arccountSourcePesos = arccountSourcePesos + Number(edgs[i].getAttribute('Peso',''));

                        if(edgs[i].target.value.nodeName == 'TransIm')
                        {
                            countTransIm++;
                            pesoTransIm = pesoTransIm + Number(edgs[i].target.getAttribute('Peso',''));
                            priTransIm = priTransIm + Number(edgs[i].target.getAttribute('Prioridade',''));
                        }
                        else if(edgs[i].target.value.nodeName == 'TransTemp')
                        {
                            countTransTemp++;
                            tempoTransTemp = tempoTransTemp + Number(edgs[i].target.getAttribute('Tempo',''));
                        }
                    }
                    else if(edgs[i].target.value.nodeName == 'Lugar')
                    {
                        arccountTarget++;
                        arccountTargetPesos = arccountTargetPesos + Number(edgs[i].getAttribute('Peso',''));

                        if(edgs[i].source.value.nodeName == 'TransIm')
                        {
                            countTransIm++;
                            pesoTransIm = pesoTransIm + Number(edgs[i].source.getAttribute('Peso',''));
                            priTransIm = priTransIm + Number(edgs[i].source.getAttribute('Prioridade',''));
                        }
                        else if(edgs[i].source.value.nodeName == 'TransTemp')
                        {
                            countTransTemp++;
                            tempoTransTemp = tempoTransTemp + Number(edgs[i].source.getAttribute('Tempo',''));
                        }
                    }
                }
            }
            graph.getModel().beginUpdate();
                try
                   {	
                    var edit = new mxCellAttributeChange(cell, 'Qinib', arcinibcount);							
                       graph.getModel().execute(edit);	
                    edit = new mxCellAttributeChange(cell, 'Pinib', arcinibpesoscount);							
                       graph.getModel().execute(edit);		
                    edit = new mxCellAttributeChange(cell, 'QarcS', arccountSource);							
                       graph.getModel().execute(edit);	
                    edit = new mxCellAttributeChange(cell, 'ParcS', arccountSourcePesos);						
                       graph.getModel().execute(edit);	
                    edit = new mxCellAttributeChange(cell, 'QarcT', arccountTarget);							
                       graph.getModel().execute(edit);	
                    edit = new mxCellAttributeChange(cell, 'ParcT', arccountTargetPesos);							
                       graph.getModel().execute(edit);	

                    edit = new mxCellAttributeChange(cell, 'QtrIm', countTransIm);							
                       graph.getModel().execute(edit);
                    edit = new mxCellAttributeChange(cell, 'PtrIm', pesoTransIm);							
                       graph.getModel().execute(edit);
                    edit = new mxCellAttributeChange(cell, 'PrtrIm', priTransIm);							
                       graph.getModel().execute(edit);
                    edit = new mxCellAttributeChange(cell, 'QtrTp', countTransTemp);							
                       graph.getModel().execute(edit);
                    edit = new mxCellAttributeChange(cell, 'TtrTp', tempoTransTemp);							
                       graph.getModel().execute(edit);	
                }
                finally
                {
                       graph.getModel().endUpdate();
                }
        }
    };

    //Modifica o atributo 'Expression' das métricas e 'GuardaExpression' das transições imediatas, indentificando os lugares da seguinte maneira:
    // |quantidade de conexão com arco inibidor|soma dos pesos desses arcos|quant.conexão com arco como target|soma dos pesos
    // |quant.conexão com arco como source|soma dos pesos|quantidade de transições imediatas conectadas ao lugar|soma dos pesos|soma das prioridades|quantidade de transições temporal|
    // |soma dos tempos|
    function expressionChange(text, t)
    {
        var l = text.getElementsByTagName("Lugar");
        var strg = '|Lugar|';
        numLugar = l.length;
        for(var i = 0; i < numLugar; i++)
        {
            if(t.indexOf(l[i].getAttribute('Label'))!=-1)
            {
                strg = strg + l[i].getAttribute('Tokens') + '|';
                strg = strg + l[i].getAttribute('Qinib') + '|';
                strg = strg + l[i].getAttribute('Pinib') + '|';
                strg = strg + l[i].getAttribute('QarcS') + '|';
                strg = strg + l[i].getAttribute('ParcS') + '|';
                strg = strg + l[i].getAttribute('QarcT') + '|';
                strg = strg + l[i].getAttribute('ParcT') + '|';
                strg = strg + l[i].getAttribute('QtrIm') + '|';
                strg = strg + l[i].getAttribute('PtrIm') + '|';
                strg = strg + l[i].getAttribute('PrtrIm') + '|';
                strg = strg + l[i].getAttribute('QtrTp') + '|';
                strg = strg + l[i].getAttribute('TtrTp') + '|';
                // 'replace' 4 repetições de um mesmo lugar
                t = t.replace(l[i].getAttribute('Label'), strg);
                t = t.replace(l[i].getAttribute('Label'), strg);
                t = t.replace(l[i].getAttribute('Label'), strg);
                t = t.replace(l[i].getAttribute('Label'), strg);
            }

            strg = '|Lugar|';
        }

        return t
    };

    //Cria um vetor de elementos de dados dos Lugares (matriz), usado na métrica e transição imediata (expressão de guarda)
    function lugarList(text, t)
    {		
        var l = text.getElementsByTagName("Lugar");
        var strg = '|Lugar|';
        numLugar = l.length;
        var strglist = new Array();
        var j = 0;
        for(var i = 0; i < numLugar; i++)
        {
            if(t.indexOf(l[i].getAttribute('Label'))!=-1)
            {
                strg = strg + l[i].getAttribute('Tokens') + '|';
                strg = strg + l[i].getAttribute('Qinib') + '|';
                strg = strg + l[i].getAttribute('Pinib') + '|';
                strg = strg + l[i].getAttribute('QarcS') + '|';
                strg = strg + l[i].getAttribute('ParcS') + '|';
                strg = strg + l[i].getAttribute('QarcT') + '|';
                strg = strg + l[i].getAttribute('ParcT') + '|';
                strg = strg + l[i].getAttribute('QtrIm') + '|';
                strg = strg + l[i].getAttribute('PtrIm') + '|';
                strg = strg + l[i].getAttribute('PrtrIm') + '|';
                strg = strg + l[i].getAttribute('QtrTp') + '|';
                strg = strg + l[i].getAttribute('TtrTp') + '|';

                for(var z=(t.indexOf(l[i].getAttribute('Label')) + l[i].getAttribute('Label').length); (t[z]!='\)')&&(t[z]!='}'); z++)
                {
                    strg = strg + t[z];		
                }
                strglist[j] = strg;
                j++;	

                /*if( (t.indexOf(l[i].getAttribute('Label')))!=(t.lastIndexOf(l[i].getAttribute('Label'))) )
                {
                    for(var z=(t.lastIndexOf(l[i].getAttribute('Label')) + l[i].getAttribute('Label').length); (t[z]!='\)')&&(t[z]!='}'); z++)
                    {
                        strg = strg + t[z];		
                    }
                    strglist[j] = strg;
                    j++;
                }*/			
            }
            strg = '|Lugar|';
        }

        return strglist
    };

    // Comparador de métricas
    function comparadorMetrica(strgArr, t, t2)
    {
        var lstrg = strgArr.length;
        var laux = 0;
        var count = 0;
        var l = t.length;
        var l2 = t2.length;
        var auxArr = new Array(0,0,0,0,0,0,0);
        var auxArr2 = new Array(0,0,0,0,0,0,0);			

        for(var i=0;i<l2;i++)
        {
            if(t2[i]=="AND")
            {
                auxArr2[0]++;
            }
            else if(t2[i]=="OR")
            {
                auxArr2[1]++;
            }
            else if(t2[i]=="\+")
            {
                auxArr2[2]++;
            }
            else if(t2[i]=="\*")
            {
                auxArr2[3]++;
            }
            else if(t2[i]=="\/")
            {
                auxArr2[4]++;
            }
            else if(t2[i]=="P")
            {
                auxArr2[5]++;
            }
            else if(t2[i]=="E")
            {
                auxArr2[6]++;
            }
        }

        for(var i=0;i<l;i++)
        {
            if(t[i]=="AND")
            {
                auxArr[0]++;
            }
            else if(t[i]=="OR")
            {
                auxArr[1]++;
            }
            else if(t[i]=="\+")
            {
                auxArr[2]++;
            }
            else if(t[i]=="\*")
            {
                auxArr[3]++;
            }
            else if(t[i]=="\/")
            {
                auxArr[4]++;
            }
            else if(t[i]=="P")
            {
                auxArr[5]++;
            }
            else if(t[i]=="E")
            {
                auxArr[6]++;
            }
        }
        
        for(var i=0; i<7; i++)
        {
            if(auxArr[i]!=auxArr2[i])
            {
                return false
            }
        }
        
        if((auxArr[4]==auxArr2[4])&&(auxArr2[4]!=0)&&(auxArr[4]!=0))
        {
            var auxstrg = t;
            var auxstrg2 = t2;
            for(var i = 0; i < l2; i++)
            {
                if(auxstrg2[i]=="\/")
                {
                    auxstrg2 = auxstrg2.slice(i+1, l2);
                    break;
                }
            }
            for(var i = 0; i < l; i++)
            {
                if(auxstrg[i]=="\/")
                {
                    auxstrg = auxstrg.slice(i+1, l);
                    break;
                }
            }

            auxstrg2 = auxstrg2.replace(/\)/g, "0");
            auxstrg2 = auxstrg2.replace(/\(/g, "0");
            auxstrg = auxstrg.replace(/\)/g, "0");
            auxstrg = auxstrg.replace(/\(/g, "0");

            var auxl2 = auxstrg2.length;
            var auxstrg3 = '';

            for(var i = 0; i < auxl2; i++)
            {
                if(auxstrg2[i]!="0")
                {
                    auxstrg3 = auxstrg3 + auxstrg2[i];
                }
            }

            if(auxstrg.indexOf(auxstrg3)==-1)
            {
                if(auxl2>auxstrg.length)
                {
                    return false;
                }
            }
        }

        for(var i=0;i<lstrg;i++)
        {
            laux = strgArr[i].length;
            count = 0;
            for(var j=0;j<laux;j++)
            {
                if(t2.indexOf(strgArr[i][j])!=-1)
                {
                    count++;
                }
            }
            if(count==laux)
            {
                return true
            }
        }

        return false
    }


    // Comparador de GuardaExpression
    function comparadorGuarda(strgArr, t, t2)
    {
        var lstrg = strgArr.length;
        var laux = 0;
        var count = 0;
        var l = t.length;
        var l2 = t2.length;
        var auxArr = new Array(0,0,0,0,0,0,0);
        var auxArr2 = new Array(0,0,0,0,0,0,0);			

        for(var i=0;i<l2;i++)
        {
            if(t2[i]=="AND")
            {
                auxArr2[0]++;
            }
            else if(t2[i]=="OR")
            {
                auxArr2[1]++;
            }
            else if(t2[i]=="\+")
            {
                auxArr2[2]++;
            }
            else if(t2[i]=="\*")
            {
                auxArr2[3]++;
            }
            else if(t2[i]=="\/")
            {
                auxArr2[4]++;
            }
            else if(t2[i]=="P")
            {
                auxArr2[5]++;
            }
            else if(t2[i]=="E")
            {
                auxArr2[6]++;
            }
        }

        for(var i=0;i<l;i++)
        {
            if(t[i]=="AND")
            {
                auxArr[0]++;
            }
            else if(t[i]=="OR")
            {
                auxArr[1]++;
            }
            else if(t[i]=="\+")
            {
                auxArr[2]++;
            }
            else if(t[i]=="\*")
            {
                auxArr[3]++;
            }
            else if(t[i]=="\/")
            {
                auxArr[4]++;
            }
            else if(t[i]=="P")
            {
                auxArr[5]++;
            }
            else if(t[i]=="E")
            {
                auxArr[6]++;
            }
        }
        
        for(var i=0; i<7; i++)
        {
            if(auxArr[i]!=auxArr2[i])
            {
                return false
            }
        }
        
        if((auxArr[4]==auxArr2[4])&&(auxArr2[4]!=0)&&(auxArr[4]!=0))
        {
            var auxstrg = t;
            var auxstrg2 = t2;
            for(var i = 0; i < l2; i++)
            {
                if(auxstrg2[i]=="\/")
                {
                    auxstrg2 = auxstrg2.slice(i+1, l2);
                    break;
                }
            }
            for(var i = 0; i < l; i++)
            {
                if(auxstrg[i]=="\/")
                {
                    auxstrg = auxstrg.slice(i+1, l);
                    break;
                }
            }

            auxstrg2 = auxstrg2.replace(/\)/g, "0");
            auxstrg2 = auxstrg2.replace(/\(/g, "0");
            auxstrg = auxstrg.replace(/\)/g, "0");
            auxstrg = auxstrg.replace(/\(/g, "0");

            var auxl2 = auxstrg2.length;
            var auxstrg3 = '';

            for(var i = 0; i < auxl2; i++)
            {
                if(auxstrg2[i]!="0")
                {
                    auxstrg3 = auxstrg3 + auxstrg2[i];
                }
            }

            if(auxstrg.indexOf(auxstrg3)==-1)
            {
                if(auxl2>auxstrg.length)
                {
                    return false;
                }
            }
        }

        for(var i=0;i<lstrg;i++)
        {
            laux = strgArr[i].length;
            count = 0;
            if(laux!=0)
            {
                for(var j=0;j<laux;j++)
                {
                    if(t2.indexOf(strgArr[i][j])!=-1)
                    {
                        count++;
                    }
                }
                if(count==laux)
                {
                    return true
                }
            }
        }

        return false
    }
    
    
    //Gera um novo arquivo XML com dados modificados para comparar dois modelos de grafos
    // qxml -> é o endereço do arquivo xml da questão a ser resolvida
    function gerador(graph)
    {				
        var encoder = new mxCodec();
        var node = encoder.encode(graph.getModel());			
        var text = mxUtils.getXml(node);		
        text = mxUtils.parseXml(text);

        var t = text.getElementsByTagName("Metrica");//Característica do XML para o sinal '>' (fica como '&gt;') e para '<' (fica como '&lt;')
        var numMetrica = t.length;
        
        var MetricaArr = new Array(numMetrica);
        for(var i = 0; i < numMetrica; i++)
        {
            t[i].removeAttribute('Label');
            t[i].removeAttribute('id');
            MetricaArr[i] = lugarList(text, t[i].getAttribute('Expression'));//Vetor de lista de string (matriz)
            t[i].setAttribute("Expression", expressionChange(text, t[i].getAttribute('Expression')));	
        }			
        
        t = text.getElementsByTagName("TransIm");
        var numTransIm = t.length;
        var TransImArr = new Array(numTransIm);
        for(var i = 0; i < numTransIm; i++)
        {
            t[i].removeAttribute('Label');
            t[i].removeAttribute('id');
            TransImArr[i] = lugarList(text, t[i].getAttribute('GuardaExpression'));//Vetor de lista de string (matriz)
            t[i].setAttribute("GuardaExpression", expressionChange(text, t[i].getAttribute('GuardaExpression')));
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

        t = text.getElementsByTagName("Lugar");
        var numLugar = t.length;
        for(var i = 0; i < numLugar; i++)
        {
            t[i].removeAttribute('Label');
            t[i].removeAttribute('id');
            t[i].removeAttribute('Qinib');
            t[i].removeAttribute('Pinib');
            t[i].removeAttribute('QarcS');
            t[i].removeAttribute('ParcS');
            t[i].removeAttribute('QarcT');
            t[i].removeAttribute('ParcT');
            t[i].removeAttribute('QtrIm');
            t[i].removeAttribute('PtrIm');
            t[i].removeAttribute('PrtrIm');
            t[i].removeAttribute('QtrTp');
            t[i].removeAttribute('TtrTp');
        }

        t = text.getElementsByTagName("TransTemp");
        var numTransTemp = t.length;
        for(var i = 0; i < numTransTemp; i++)
        {
            t[i].removeAttribute('Label');
            t[i].removeAttribute('id');
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

        //////////////////////// ABRE UM POPUP PARA VIZUALIZAR O DOCUMENTO XML 
        tt= mxUtils.getXml(text); //O uso de getXml() gera um documento xml sem os elementos do tipo <#document></#document> que causa erro de sintaxe no xml
        mxUtils.popup(mxUtils.getPrettyXml(text), true); // Com getPrettyXml() aparece os elementos <#document></#document> que causa erro de sintaxe no xml
                                                         // No entanto o getPrettyXml() permite o uso do popup()

        var blob = new Blob([tt], { type: "text/xml;charset=utf-8" });	// Da biblioteca FileSaver.js					
        saveAs(blob,'XMLquestaogerada.xml'); // O XML gerado vem com o uso da função getXml()
        /////////////////////////
        /*
        var resultado = comparador(text, MetricaArr, TransImArr, qxml, numLugar, numTransIm, numTransTemp, numMetrica, numArcoInibidor, numArco);
        
        if(resultado == true)
        {
            // Salva no localStorage o modelo da questão que foi feita
            var encoder = new mxCodec();
            var node = encoder.encode(graph.getModel());			
            var text = mxUtils.getXml(node);		
            // Por padrão, os nomes dos exercícios 'ex' devem ser diferentes. É adicionado a string 'exqcb' para atribuir nomes aos modelos salvos
            localStorage.setItem(ex+'exf', text);
            ///////////////////
            window.onbeforeunload = null;// Anula o evento onbeforeunload
            // Mostra uma página com o resultado da simulação estacionária do modelo do exercício
            //window.open(showsimulacao);
            //window.open(showsimulacao,'popUpWindow','height=500,width=700,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
            /////////////
            acerto(nextpage, ex, pontos);
        }
        else if(resultado == false)
        {
            mxUtils.alert("Modelagem incorreta. Tente novamente!");
        }*/
        
    };

    //Compara um modelo base com um modelo gerado pela funação gerador
    function comparador(textxml, MetricaArr, TransImArr, qxml, numLugar, numTransIm, numTransTemp, numMetrica, numArcoInibidor, numArco)
    {
        var text = textxml;
        var text2 =mxUtils.load(qxml);//Texto de resposta da questão em xml - text2
        var count = 0;
        text2 = text2.getDocumentElement();

        var t2 = text2.getElementsByTagName("Lugar");		
        var l = t2.length;
        if(numLugar==l)
        {
            var auxl = l;
            var t = text.getElementsByTagName("Lugar");
            
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
            if(count!=l){mxUtils.alert("Modelagem incorreta. Observação: a quantidade de tokens ou conexões de alguns lugares estão incorretos."); return null;};				
            count = 0;
        }
        else{mxUtils.alert("Modelagem incorreta. Observação: a quantidade de lugares ou a quantidade de tokens(em alguns lugares) está diferente em relação ao modelo correto."); return null;}

        t2 = text2.getElementsByTagName("TransIm");
        l = t2.length; 
        if(numTransIm==l)
        {
            t = text.getElementsByTagName("TransIm");
            var auxl = l;
            for(var i = 1; i <= auxl; i++)
            {
                for(var j = 1; j <= auxl; j++)
                {
                    if(t2[i-1].isEqualNode(t[j-1]))
                    {
                        count++;t2[i-1].remove();t[j-1].remove(); auxl--; j=0; i=0; break;
                    }
                    else if( (t[j-1].getAttribute('Prioridade')==t2[i-1].getAttribute('Prioridade'))&&(t[j-1].getAttribute('Peso')==t2[i-1].getAttribute('Peso')) )
                    {	
                        if((t[j-1].getAttribute('GuardaExpression')=="")||(t2[i-1].getAttribute('GuardaExpression')==""))
                        {
                            if((t[j-1].getAttribute('GuardaExpression')=="")&&(t2[i-1].getAttribute('GuardaExpression')==""))
                            {
                                count++;t2[i-1].remove();t[j-1].remove(); auxl--; j=0; i=0; break;
                            }
                            else
                            {
                                break;
                            }

                        }					
                        else if(comparadorGuarda(TransImArr, t[j-1].getAttribute('GuardaExpression'), t2[i-1].getAttribute('GuardaExpression'))==true)
                        {   
                            count++;t2[i-1].remove();t[j-1].remove(); auxl--; j=0; i=0; break;
                        }
                    }
                }
            }
            if(count!=l){mxUtils.alert("Modelagem incorreta. Observação: as propriedades ou conexões de algumas transições imediatas estão incorretas."); return null;};
            count = 0;
        }
        else{mxUtils.alert("Modelagem incorreta. Observação: a quantidade de transições imediatas ou as propriedades(de algumas transições imediatas) está diferente em relação ao modelo correto.");return null;}

        t2 = text2.getElementsByTagName("TransTemp");
        l = t2.length; 
        if(numTransTemp==l)
        {
            t = text.getElementsByTagName("TransTemp");
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
            if(count!=l){mxUtils.alert("Modelagem incorreta. Observação: as propriedades ou conexões de algumas transições temporizadas estão incorretas."); return null;};
            count = 0;
        }
        else{mxUtils.alert("Modelagem incorreta. Observação: a quantidade de transições temporizada ou as propriedades(de algumas transições temporizadas) está diferente em relação ao modelo correto."); return null;}

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
            if(count!=l){mxUtils.alert("Modelagem incorreta. Observação: as propriedades ou conexões de alguns arcos inibidores estão incorretos."); return null;};
            count = 0;
        }
        else{mxUtils.alert("Modelagem incorreta. Observação: a quantidade de arcos inibidores está diferente em relação ao modelo correto.");return null;}

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
            if(count!=l){mxUtils.alert("Modelagem incorreta. Observação: as propriedades ou conexões de alguns arcos estão incorretos."); return null;};
            count = 0;
        }
        else{mxUtils.alert("Modelagem incorreta. Observação: a quantidade de arcos está diferente em relação ao modelo correto.");return null;}

        t2 = text2.getElementsByTagName("Metrica");// Lembrar: erro no XML para o sinal '>' (fica como '&gt;') e para '<' (fica como '&lt;')
        l = t2.length;
         
        if(numMetrica==l)
        {
            t = text.getElementsByTagName("Metrica");
            var auxl = l;
            for(var i = 1; i <= auxl; i++)
            {
                for(var j = 1; j <= auxl; j++)
                {
                    if(t2[i-1].isEqualNode(t[j-1]))
                    {
                        count++;t2[i-1].remove();t[j-1].remove(); auxl--; j=0; i=0; break;
                    }
                    else if(comparadorMetrica(MetricaArr, t[j-1].getAttribute('Expression'), t2[i-1].getAttribute('Expression'))==true)
                    {
                        count++;t2[i-1].remove();t[j-1].remove(); auxl--; j=0; i=0; break;
                    }
                }
            }
            if(count!=l){mxUtils.alert("Modelagem incorreta. Observação: algumas métricas estão incorretas."); return null;};
            count = 0;
        }
        else{mxUtils.alert("Modelagem incorreta. Observação: a quantidade de métricas está diferente em relação ao modelo correto."); return null;}

        return true;
    };

    //Função responsável por mostrar a janela para se modificar os atributos - ao clicar em propriedades no popupmenu
    function selectionChanged(graph, docxml)
    {
        //Cria uma 'div' para a janela popup
        var div = document.createElement('div');

        //Pega a célula selecionada (vértice ou aresta do grafo)
        var cell = graph.getSelectionCell();

        if (cell != null)
        {
            //Em caso do usuário clicar na célula TokenLabel do grafo ao invés da célula Lugar
            if(mxUtils.isNode(cell.value) && cell.value.nodeName == 'TokenLabel')
            {
                cell = cell.getParent();//Referencia a célula Lugar
            }

            //Cria um formulário que será usado na janela
            var form = new mxForm();
            var attrs = cell.value.attributes;
            var L = attrs.length;
            var araux= new Array(L);
            if((mxUtils.isNode(cell.value) && cell.value.nodeName=='Arco')||(mxUtils.isNode(cell.value) && cell.value.nodeName=='ArcoInibidor'))
            {
                araux[0]=createTextField(graph, form, cell, attrs[0]);
            }
            else if(mxUtils.isNode(cell.value) && cell.value.nodeName=='Lugar')// Apenas se considera os 2 primeiros atributos de objetos lugares
            {
                for (var i = 0; i < 2; i++)
                {
                    araux[i]=createTextField(graph, form, cell, attrs[i]);		
                }	
            }
            else	
            {	
                for (var i = 0; i < attrs.length; i++)
                {
                    araux[i]=createTextField(graph, form, cell, attrs[i]);		
                }
            }
            //Com o objetivo de apenas informação, adiciona-se dois dados para 'TransTemp'
            if(mxUtils.isNode(cell.value) && cell.value.nodeName == 'TransTemp')
            {
                combo = form.addCombo('Tipo de Servidor:', false, 1);
                form.addOption(combo, 'Single Server','', false);
                combo = form.addCombo('Distribuição de Probabilidade:', false, 1);
                form.addOption(combo, 'Exponencial','', false);
            }


            //Em caso do usuário selecionar arcos
            if ((mxUtils.isNode(cell.value) && cell.value.nodeName=='Arco')||(mxUtils.isNode(cell.value) && cell.value.nodeName=='ArcoInibidor'))
            {
                trg = cell.getTerminal(false);//Obtém o target(alvo) do arco
                var x = trg.geometry.x;// x e y define o ponto onde um determinado vértice se encontra para abrir a janela próximo a ele
                var y = trg.geometry.y;
            }
            else
            {
                var x = cell.geometry.x;
                var y = cell.geometry.y;
            }	
            //Cria a janela para se modificar os atributos
            div.appendChild(form.getTable());
            //A depender de alguma biblioteca ou framework usado no desenvolvimento front-end de sites, pode ocorrer alterações na proportção do posicionamento da janela
            var wnd = new mxWindow(cell.value.nodeName, div, (x + 400), (y + 600), 280, 150, true, true);
            wnd.setVisible(true);
            wnd.setMinimizable(false);
            wnd.setClosable(true);

            //Adiciona os botões OK e Cancel na janela
            form.addButtons(
            function() //Função para o botão OK
            {
                var auxbool = false;

                while(auxbool==false)
                {
                    if((mxUtils.isNode(cell.value) && cell.value.nodeName=='Arco')||(mxUtils.isNode(cell.value) && cell.value.nodeName=='ArcoInibidor'))
                    {
                        (araux[0])();
                    }
                    else if(mxUtils.isNode(cell.value) && cell.value.nodeName=='Lugar')
                    {
                        for(var i = 0; i < 2; i++) //Apenas se considera os 2 primeiros atributos de objetos lugares
                        {
                            (araux[i])();
                        }
                    }
                    else	
                    {	
                        for(var i = 0; i < attrs.length; i++)
                        {
                            (araux[i])();
                        }
                    }

                    if((mxUtils.isNode(cell.value)) && (cell.value.nodeName=='Lugar'))
                    {
                        auxbool=lugarChanged(graph, cell, docxml);
                        if(auxbool==true)
                        {
                            arcoAjuste(cell, graph);
                            identlugarAjuste(cell, graph);
                        }
                        break;							
                    }
                    else if((mxUtils.isNode(cell.value) && cell.value.nodeName=='ArcoInibidor') || (mxUtils.isNode(cell.value) && cell.value.nodeName=='Arco'))
                    {
                        auxbool=arcoChanged(cell);
                        if(auxbool==true)
                        {
                            if(cell.source.value.nodeName == 'Lugar')
                            {
                                identlugarAjuste(cell.source, graph);
                            }
                            else if(cell.target.value.nodeName == 'Lugar')
                            {
                                identlugarAjuste(cell.target, graph);
                            }
                        }
                        break;
                    }
                    else if(mxUtils.isNode(cell.value) && cell.value.nodeName == 'TransTemp')
                    {
                        auxbool=transtempChanged(cell, graph);
                        if(auxbool==true)
                        {
                            arcoAjuste(cell, graph);
                            var edgs = cell.edges;
                            if(edgs!=null)
                            {
                                var L = edgs.length;
                                var aux;
                        
                                for(i=0; i<L; i++)
                                {
                                    if(edgs[i].source.value.nodeName == 'Lugar')													
                                    {											 
                                        aux = edgs[i].source;
                                        identlugarAjuste(aux, graph); 
                                    }
                                    else if(edgs[i].target.value.nodeName == 'Lugar')
                                    {
                                        aux = edgs[i].target;
                                        identlugarAjuste(aux, graph);
                                    }
                                }
                            }
                        }
                        break;
                    }
                    else if(mxUtils.isNode(cell.value) && cell.value.nodeName == 'TransIm')
                    {
                        auxbool=transimChanged(cell, graph);
                        if(auxbool==true)
                        {
                            arcoAjuste(cell, graph);
                            var edgs = cell.edges;

                            if(edgs!=null)
                            {
                                var L = edgs.length;
                                var aux;
                        
                                for(i=0; i<L; i++)
                                {
                                    if(edgs[i].source.value.nodeName == 'Lugar') 													
                                    {											
                                        aux = edgs[i].source;
                                        identlugarAjuste(aux, graph); 
                                    }
                                    else if(edgs[i].target.value.nodeName == 'Lugar')
                                    {
                                        aux = edgs[i].target;
                                        identlugarAjuste(aux, graph);
                                    }
                                }
                            }
                        }
                        break;							
                    }
                    else if(mxUtils.isNode(cell.value) && cell.value.nodeName == 'Metrica')
                    {
                        auxbool=metricaChanged(cell, graph);
                        break;							
                    }
                    else
                    {
                        wnd.destroy();			
                        break;				
                    }
                }
                if(auxbool==true)
                {
                    wnd.destroy();
                }

            }, 
            function()//Função para o botão Cancel
            {
                var auxbool = false;
                if((mxUtils.isNode(cell.value)) && (cell.value.nodeName=='Lugar'))
                {
                    auxbool=lugarChanged(graph, cell, docxml);							
                }
                else if((mxUtils.isNode(cell.value) && cell.value.nodeName=='ArcoInibidor') || (mxUtils.isNode(cell.value) && cell.value.nodeName=='Arco'))
                {
                    auxbool=arcoChanged(cell);
                }
                else if(mxUtils.isNode(cell.value) && cell.value.nodeName == 'TransTemp')
                {
                    auxbool=transtempChanged(cell, graph);
                }
                else if(mxUtils.isNode(cell.value) && cell.value.nodeName == 'TransIm')
                {
                    auxbool=transimChanged(cell, graph);							
                }
                else if(mxUtils.isNode(cell.value) && cell.value.nodeName == 'Metrica')
                {
                    auxbool=metricaChanged(cell, graph);							
                }
                else
                {
                    wnd.destroy();						
                }

                if(auxbool==true)
                {
                    wnd.destroy();
                }
                else
                {
                    mxUtils.alert('Corrija os erros apresentados e aperte OK!');
                }
            });	
        }
    };
    
    //Cria campo de texto no formulário e muda os atributos e retorna uma função
    function createTextField(graph, form, cell, attribute)
    {
        if((attribute.nodeName=='Expression')&&(cell.value.nodeName == 'Metrica'))
        {
            var input = form.addText('Expressão' + ':', attribute.nodeValue);
        }
        else if((attribute.nodeName=='GuardaExpression')&&(cell.value.nodeName == 'TransIm'))
        {
            var input = form.addText('ExpressãoDeGuarda' + ':', attribute.nodeValue);
        }
        else
        {
            var input = form.addText(attribute.nodeName + ':', attribute.nodeValue);
        }

        var applyHandler = function()
        {
            var newValue = input.value || '';
            var oldValue = cell.getAttribute(attribute.nodeName, '');

            if (newValue != oldValue)
            {
                graph.getModel().beginUpdate();
                try
                {	
                       var edit = new mxCellAttributeChange(cell, attribute.nodeName, newValue);
                       graph.getModel().execute(edit);
                }
                finally
                {
                    graph.getModel().endUpdate();
                }
            }
        }; 
        return applyHandler;
    };
    
    //Função para ajustes de valores nos arcos -  IDtarget e IDsource
    function arcoAjuste(cell, graph)
    {
        var edgs = cell.edges;
        if(edgs!=null)
        {
            var attrs = cell.value.attributes;	
            if(cell.value.nodeName == 'Lugar'){var L=2;} else if(cell.value.nodeName == 'TransIm'){var L = attrs.length - 1;} else{var L = attrs.length;}					
                            
            for (var i = 0; i < edgs.length; i++)
            {
                if(edgs[i].source.value.nodeName == cell.value.nodeName)
                {
                    var strg1 = '|' + cell.value.nodeName + '|';
                    for (var j = 1; j < L; j++)
                    {
                        strg1 = strg1 + attrs[j].nodeValue + '|';
                    }
                    
                    graph.getModel().beginUpdate();
                    try
                       {	
                        var edit = new mxCellAttributeChange(cell.getEdgeAt(i), 'IDsource', strg1);							
                           graph.getModel().execute(edit);					
                    }
                    finally
                    {
                            graph.getModel().endUpdate();
                    }
                }
                else
                {
                    var strg2 = '|' + cell.value.nodeName + '|';
                    for (var j = 1; j < L; j++)
                    {
                        strg2 = strg2 + attrs[j].nodeValue + '|';
                    }
                    graph.getModel().beginUpdate();
                    try
                       {	
                        var edit = new mxCellAttributeChange(edgs[i], 'IDtarget', strg2);
                           graph.getModel().execute(edit);							
                    }
                    finally
                    {
                            graph.getModel().endUpdate();
                    }
                }
            }
        }
    };

    //Função de correção e mudança nos lugares - apenas age no atributo 'Tokens'
    function lugarChanged(graph, cell, docxml)
    {
        var label = cell.getAttribute('Label','');
        var aux = cell.getAttribute('Tokens', '');
        var vaux = null;

        if(labelChanged(label, graph)==false)
        {
            return false;
        }

        if((isNaN(aux)==false)&&(aux!='')&&(aux!='-0')&&(aux.indexOf(" ")==-1))
        {
            aux=Number(aux);

            if((Number.isInteger(aux)==true)&&(Math.sign(aux)>=0))
            {
                if(aux==0)
                {
                    vaux = cell.getChildAt(0);
                    graph.removeCells([vaux]);

                    var tokl = docxml.createElement('TokenLabel');						
                    tokl.setAttribute('Label',' ');
                    toklabel = graph.insertVertex(cell, null, tokl, 0.3, 0.3, 15, 15, 'token', true);
                    toklabel.setConnectable(false);
                }
                else if(aux==1)
                {
                    vaux = cell.getChildAt(0);
                    graph.removeCells([vaux]);

                    var tokl = docxml.createElement('TokenLabel');
                    tokl.setAttribute('Label',' ');
                    toklabel = graph.insertVertex(cell, null, tokl, 0.3, 0.3, 15, 15, 'token1', true);
                    toklabel.setConnectable(false);
                }
                else if(aux==2)
                {
                    vaux = cell.getChildAt(0);
                    graph.removeCells([vaux]);
                    
                    var tokl = docxml.createElement('TokenLabel');
                    tokl.setAttribute('Label',' ');
                    toklabel = graph.insertVertex(cell, null, tokl, 0.3, 0.3, 15, 15, 'token2', true);
                    toklabel.setConnectable(false);
                }
                else if(aux==3)
                {
                    vaux = cell.getChildAt(0);
                    graph.removeCells([vaux]);
                    
                    var tokl = docxml.createElement('TokenLabel');
                    tokl.setAttribute('Label',' ');
                    toklabel = graph.insertVertex(cell, null, tokl, 0.3, 0.3, 15, 15, 'token3', true);
                    toklabel.setConnectable(false);
                }
                else if(aux==4)
                {
                    vaux = cell.getChildAt(0);
                    graph.removeCells([vaux]);
                    
                    var tokl = docxml.createElement('TokenLabel');
                    tokl.setAttribute('Label',' ');
                    toklabel = graph.insertVertex(cell, null, tokl, 0.3, 0.3, 15, 15, 'token4', true);
                    toklabel.setConnectable(false);
                }
                else
                {
                    vaux = cell.getChildAt(0);
                    graph.removeCells([vaux]);
                    
                    var tokl = docxml.createElement('TokenLabel');
                    tokl.setAttribute('Label', aux);
                    toklabel = graph.insertVertex(cell, null, tokl, 0.3, 0.3, 15, 15, 'token', true);
                    toklabel.setConnectable(false);
                }
                return true;
            }
            else
            {
                mxUtils.alert('A quantidade de Tokens deve ser um inteiro positivo ou zero!');
                return false;
            }
        }
        else
        {
            mxUtils.alert('A quantidade de Tokens deve ser um inteiro positivo ou zero! E não deve haver espaço em branco!');
            return false;
        }
    };

    //Função de correção e mudança em alguns atributos dos arcos
    function arcoChanged(cell)
    {
        var aux = cell.getAttribute('Peso', '');

        if((isNaN(aux)==false)&&(aux!='')&&(aux!='-0')&&(aux.indexOf(" ")==-1))
        {
            aux=Number(aux);

            if((Number.isInteger(aux)==true)&&(Math.sign(aux)>=0))
            {
                return true;
            }
            else
            {
                mxUtils.alert('O peso deve ser um inteiro positivo ou zero!');
                return false;
            }
        }
        else
        {
            mxUtils.alert('O peso deve ser um inteiro positivo ou zero! E não deve haver espaço em branco!');
            return false;
        }
    };

    //Função de correção e mudança em alguns dos atributos de 'TransTemp'
    function transtempChanged(cell, graph)
    {
        var label = cell.getAttribute('Label','');
        var aux = cell.getAttribute('Tempo', '');

        if(labelChanged(label, graph)==false)
        {
            return false;
        }

        if((isNaN(aux)==false)&&(aux!='')&&(aux!='-0')&&(aux.indexOf(" ")==-1))
        {
            aux=Number(aux);

            if(Math.sign(aux)>=0)
            {
                return true;
            }
            else
            {
                mxUtils.alert('O tempo deve ser um número real positivo ou zero!');
                return false;
            }
        }
        else
        {
            mxUtils.alert('O tempo deve ser um número real positivo ou zero! E não deve haver espaço em branco!');
            return false;
        }
    };

    //Função de correção e mudança no atributo 'Expression' de 'Metrica'
    function metricaChanged(cell, graph)
    {
        var auxbool = true;
        var label = cell.getAttribute('Label','');
        var aux = cell.getAttribute('Expression','');

        if(labelChanged(label, graph)==false)
        {
            return false;
        }
        
        if(aux.length==0)
        {
            return auxbool;
        }
        else if(aux.indexOf(" ")!=-1)
        {
            mxUtils.alert('Erro de sintaxe na métrica: não pode haver espaço em branco!');
            auxbool=false;
        }
        else if((aux.indexOf("==")!=-1)||(aux.indexOf(">>")!=-1)||(aux.indexOf("<<")!=-1))
        {
            mxUtils.alert("Erro de sintaxe na métrica! Expressões lógicas duplicadas para  a métrica: ==, >> ou <<. Deve-se usar apenas =, > ou <.");
            auxbool=false;				
        }
        else if((aux.indexOf("=/")!=-1)||(aux.indexOf("=>")!=-1)||(aux.indexOf("=<")!=-1))
        {
            mxUtils.alert("Erro de sintaxe na métrica! Operador de comparação escrito incorretamente.");
            auxbool=false;				
        }
        else if(aux.match(/[@$%^&\[\];':"\\|, ?!]/g)!=null)
        {
            mxUtils.alert("A métrica em 'Expression' não deve ter esses caracteres especiais: @ $ % ^ & \[ \]; :' \\| , ? \" !");
            auxbool=false;					
        }
        else if( !((aux.indexOf("{")!=-1) && (aux.indexOf("}")!=-1) && (aux.indexOf("(")!=-1) && (aux.indexOf(")")!=-1)) )
        {			
            mxUtils.alert("Erro de sintaxe na métrica! Deve-se escrever '{','}','(' ou ')' corretamente.");
            auxbool=false;					
        }
        else if( (aux.indexOf("}{")!=-1)||(aux.indexOf(")(")!=-1)||(aux.indexOf("()")!=-1)||(aux.indexOf("{}")!=-1) )
        {
            mxUtils.alert("Erro de sintaxe na métrica! Deve-se escrever '{','}','(' ou ')' corretamente. Ou usar corretamente as palavras chaves AND e OR.");
            auxbool=false;	
        }
        else if( ( ((aux.match(/{/g)).length)!=((aux.match(/}/g)).length) )|| ( ((aux.match(/\(/g)).length)!=((aux.match(/\)/g)).length)) )
        {			
            mxUtils.alert("Erro de sintaxe na métrica! Deve-se escrever '{','}','(' ou ')' corretamente.");
            auxbool=false;	
        }
        else if(aux.indexOf("#")==-1)
        {			
            mxUtils.alert("Erro de sintaxe na métrica! Deve-se adicionar '#' antes dos nomes dos lugares, '#' indica o número de tokens no lugar.");
            auxbool=false;				
        }
        else if( (aux.indexOf("(#")==-1)&&(aux.indexOf("{#")==-1) )
        {
            mxUtils.alert("Erro de sintaxe na métrica! Deve-se adicionar '#' antes dos nomes dos lugares, '#' indica o número de tokens no lugar.");
            auxbool=false;	
        }
        else if(aux.indexOf("(#")!=-1)
        {
            if( ((aux.match(/\(#/g)).length)!=((aux.match(/#/g)).length) )
            {	
                if( ((aux.match(/\(#/g)).length)!=((aux.match(/#/g).length)-(aux.match(/{#/g).length)) ){	
                    mxUtils.alert("Erro de sintaxe na métrica! Deve-se adicionar '#' antes dos nomes dos lugares, '#' indica o número de tokens no lugar."+
                    "Ou deve-se escrever '{','}','(' ou ')' corretamente.");
                    auxbool=false;
                }
            }
        }	
        else if(aux.indexOf("{#")!=-1)
        {
            if( ((aux.match(/{#/g)).length)!=((aux.match(/#/g)).length) )
            {
                if( ((aux.match(/\(#/g)).length)!=((aux.match(/#/g).length)-(aux.match(/\(#/g).length)) ){
                    mxUtils.alert("Erro de sintaxe na métrica! Deve-se adicionar '#' antes dos nomes dos lugares, '#' indica o número de tokens no lugar."+
                    "Ou deve-se escrever '{','}','(' ou ')' corretamente.");
                    auxbool=false;
                }
            }	
        }
        //Último teste de sintaxe
        if(aux.indexOf("#")!=-1)
        {
            var aux2 = aux;
            aux2 = aux2.replace(/\d/g, "0");
            aux2 = aux2.replace(/=/g, "0");
            aux2 = aux2.replace(/\+/g, "0");
            aux2 = aux2.replace(/-/g, "0");
            aux2 = aux2.replace(/\*/g, "0");
              aux2 = aux2.replace(/>/g, "0");
              aux2 = aux2.replace(/</g, "0");
              aux2 = aux2.replace(/AND/g, "0");
            aux2 = aux2.replace(/OR/g, "0");
            aux2 = aux2.replace(/P\(/g, "0");
            aux2 = aux2.replace(/P{/g, "0");
            aux2 = aux2.replace(/E\(/g, "0");
              aux2 = aux2.replace(/E{/g, "0");
             aux2 = aux2.replace(/{/g, "0");
              aux2 = aux2.replace(/}/g, "0");
              aux2 = aux2.replace(/\)/g, "0");
            aux2 = aux2.replace(/\(/g, "0");
            aux2 = aux2.replace(/\//g, "0");
            aux2 = aux2.replace(/\./g, "0");

            if(aux2.indexOf("NOT")!=-1)
            {
                if(aux2.indexOf("NOT(")!=-1)
                {
                    mxUtils.alert("O operador NOT não foi escrito na posição correta.");
                }
                aux2 = aux2.replace(/NOT/g, "0");
            }

            if(aux2.indexOf("#0")!=-1)
            {			
                mxUtils.alert("Erro de sintaxe na métrica! Deve-se adicionar '#' antes dos nomes dos lugares, '#' indica o número de tokens no lugar.");
                auxbool=false;	
            }
            else
            {				
                aux2 = aux2.replace(/#/g, "1");
                aux2 = aux2.replace(/\D/g, "p");	
                
                if( (aux2.indexOf("p1")!=-1)||(aux2.indexOf("p1p")!=-1) )
                {			
                    mxUtils.alert("Erro de sintaxe na métrica! Deve-se adicionar '#' antes dos nomes dos lugares, '#' indica o número de tokens no lugar.");
                    auxbool=false;						
                }
                else if((aux2.indexOf("1pp")!=-1))
                {
                    var count = 0;
                    var aux3 = aux2;
                    var l = aux3.length;
                    for(var i = aux3.indexOf('p'); i < l; i++)//Contador de palavras que podem representar labels de lugares
                    {
                        if(aux3[i] != 'p')
                        {
                            aux3 = aux3.slice(i, l);
                            i = aux3.indexOf('p');
                            count++;
                            if(i == -1)
                            {
                                break;
                            }	
                        }
                    }
                    
                    if( ((aux2.match(/1p/g)).length) != count )
                    {
                        mxUtils.alert("Erro de sintaxe na métrica! Deve-se adicionar '#' antes dos nomes dos lugares, '#' indica o número de tokens no lugar.");
                        auxbool=false;								
                    }
                }
                else
                {
                    if( ((aux2.match(/1p/g)).length)!=((aux2.match(/p/g)).length) )
                    {
                        mxUtils.alert("Erro de sintaxe na métrica! '#' posicionado de maneira incorreta ou os caracteres e palavras chaves foram escritos ou posicionados de maneira incorreta.");
                        auxbool=false;								
                    }
                }

                if(auxbool!=false)
                {
                    auxbool = metricaAnaliselugar(aux, cell, graph, count);
                }
            }		  
        }
        return auxbool;
    };

    //Função de análise dos nomes ou labels dos lugares digitados na métrica
    function metricaAnaliselugar(strg, cell, graph, count)
    {
        var aux = strg;
        var auxcount = 0;
        var encoder = new mxCodec();
        var node = encoder.encode(graph.getModel());			
        var text = mxUtils.getXml(node);	
        text = mxUtils.parseXml(text);
        var l = text.getElementsByTagName("Lugar");
        numLugar = l.length;
        
        for(var i = 0; i < numLugar; i++)
        {
            if(aux.indexOf(l[i].getAttribute('Label'))!=-1)
            {
                i2 = aux.indexOf(l[i].getAttribute('Label'));
                l2 = l[i].getAttribute('Label').length;
                i2 = l2 + i2;

                if((aux[i2]=='>=')||(aux[i2]=='<=')||(aux[i2]=='/=')||(aux[i2]=='>')||(aux[i2]=='<')||(aux[i2]=='=')||(aux[i2]=='\/')||(aux[i2]=='}')||(aux[i2]=='\)')||(aux[i2]=='\*')||(aux[i2]=='\+')||(aux[i2]=='-'))
                {
                    auxcount++;
                    if(aux.indexOf(l[i].getAttribute('Label'))!=aux.lastIndexOf(l[i].getAttribute('Label')))
                    {
                        auxcount++;
                    }
                }					

            }
        }

        if(auxcount != count)
        {        
            mxUtils.alert("Os nomes dos lugares foram digitados incorretamente ou os lugares são inexistentes!");
            return false;
        }

        return true;
    };

    //Função de correção e mudança em alguns dos atributos de 'TransIm'
    function transimChanged(cell, graph)
    {
        var label = cell.getAttribute('Label','');
        var aux = cell.getAttribute('GuardaExpression','');
        var aux1 = cell.getAttribute('Prioridade','');
        var aux2 = cell.getAttribute('Peso','');
        var auxbool = true;
        var auxbool1 = false;
        var auxbool2 = false;

        if(labelChanged(label, graph)==false)
        {
            return false;
        }

        if((isNaN(aux1)==false)&&(aux1!='')&&(aux1!='-0')&&(aux1.indexOf(" ")==-1))
        {
            aux1=Number(aux1);

            if((Number.isInteger(aux1)==true)&&(Math.sign(aux1)>0))
            {
                auxbool1 = true;
            }
            else
            {
                mxUtils.alert('A prioridade deve ser um inteiro positivo e não nulo!');
                auxbool1 = false;
            }
        }
        else
        {
            mxUtils.alert('A prioridade deve ser um inteiro positivo e não nulo! E não deve haver espaço em branco!');
            auxbool1 = false;
        }

        if((isNaN(aux2)==false)&&(aux2!='')&&(aux2!='-0')&&(aux2.indexOf(" ")==-1))
        {
            aux2=Number(aux2);

            if((Math.sign(aux2)>0)&&(aux2<=1))
            {
                auxbool2 = true;
            }
            else
            {
                mxUtils.alert('O peso deve ser um número real positivo não nulo com valor entre zero e 1 (inclusive)!');
                auxbool2 = false;
            }
        }
        else
        {
            mxUtils.alert('O peso deve ser um número real positivo não nulo com valor entre zero e 1 (inclusive)! E não deve haver espaço em branco!'+
            'Use ponto e não vírgula em números decimais');
            auxbool2 = false;
        }
        
        if(aux.length==0)
        {
            auxbool=true;
        }
        else if(aux.indexOf(" ")!=-1)
        {
            mxUtils.alert('Erro de sintaxe na métrica: não pode haver espaço em branco!');
            auxbool=false;
        }
        else if((aux.indexOf("==")!=-1)||(aux.indexOf(">>")!=-1)||(aux.indexOf("<<")!=-1))
        {
            mxUtils.alert("Erro de sintaxe na métrica! Expressões lógicas duplicadas para  a métrica: ==, >> ou <<. Deve-se usar apenas =, > ou <.");
            auxbool=false;				
        }
        else if((aux.indexOf("=/")!=-1)||(aux.indexOf("=>")!=-1)||(aux.indexOf("=<")!=-1))
        {
            mxUtils.alert("Erro de sintaxe na métrica! Operador de comparação escrito incorretamente.");
            auxbool=false;				
        }
        else if(aux.match(/[@$%^&\[\];':"\\|,.?!]/g)!=null)
        {
            mxUtils.alert("A métrica em 'Expression' não deve ter esses caracteres especiais: @ $ % ^ & \[ \]; :' \\| , . ? \" !");
            auxbool=false;					
        }	
        else if( !((aux.indexOf("(")!=-1) && (aux.indexOf(")")!=-1)) )
        {			
            mxUtils.alert("Erro de sintaxe na métrica! Deve-se escrever '(' ou ')' corretamente.");
            auxbool=false;					
        }
        else if( (aux.indexOf("{")!=-1)||(aux.indexOf("}")!=-1) )
        {
            mxUtils.alert("Erro de sintaxe na métrica! Não se usa '{' ou '}'.");
            auxbool=false;	
        }
        else if( (aux.indexOf(")(")!=-1)||(aux.indexOf("()")!=-1) )
        {
            mxUtils.alert("Erro de sintaxe na métrica! Deve-se escrever '(' ou ')' corretamente.");
            auxbool=false;	
        }
        else if(((aux.match(/\(/g)).length)!=((aux.match(/\)/g)).length))
        {			
            mxUtils.alert("Erro de sintaxe na métrica! Deve-se escrever '(' ou ')' corretamente.");
            auxbool=false;	
        }
        else if(aux.indexOf("#")==-1)
        {			
            mxUtils.alert("Erro de sintaxe na métrica! Deve-se adicionar '#' antes dos nomes dos lugares, '#' indica o número de tokens no lugar.");
            auxbool=false;				
        }
        else if( (aux.indexOf("(#")==-1)&&(aux.indexOf("{#")==-1) )
        {
            mxUtils.alert("Erro de sintaxe na métrica! Deve-se adicionar '#' antes dos nomes dos lugares, '#' indica o número de tokens no lugar.");
            auxbool=false;	
        }
        else if(aux.indexOf("(#")!=-1)
        {
            if( ((aux.match(/\(#/g)).length)!=((aux.match(/#/g)).length) )
            {			
                mxUtils.alert("Erro de sintaxe na métrica! Deve-se adicionar '#' antes dos nomes dos lugares, '#' indica o número de tokens no lugar.");
                auxbool=false;	
            }
        }	
        else if(aux.indexOf("{#")!=-1)
        {
            if( ((aux.match(/{#/g)).length)!=((aux.match(/#/g)).length) )
            {
                mxUtils.alert("Erro de sintaxe na métrica! Deve-se adicionar '#' antes dos nomes dos lugares, '#' indica o número de tokens no lugar.");
                auxbool=false;	
            }	
        }
        //Último teste de sintaxe
        if(aux.indexOf("#")!=-1)
        {
            var aux2 = aux;
            aux2 = aux2.replace(/\d/g, "0");
            aux2 = aux2.replace(/=/g, "0");
            aux2 = aux2.replace(/\+/g, "0");
            aux2 = aux2.replace(/-/g, "0");
            aux2 = aux2.replace(/\*/g, "0");
              aux2 = aux2.replace(/>/g, "0");
              aux2 = aux2.replace(/</g, "0");
              aux2 = aux2.replace(/AND/g, "0");
            aux2 = aux2.replace(/OR/g, "0");
             aux2 = aux2.replace(/{/g, "0");
              aux2 = aux2.replace(/}/g, "0");
              aux2 = aux2.replace(/\)/g, "0");
            aux2 = aux2.replace(/\(/g, "0");
            aux2 = aux2.replace(/\//g, "0");

            if(aux2.indexOf("NOT")!=-1)
            {
                if(aux2.indexOf("NOT(")!=-1)
                {
                    mxUtils.alert("O operador NOT não foi escrito na posição correta.");
                }
                aux2 = aux2.replace(/NOT/g, "0");
            }

            if(aux2.indexOf("#0")!=-1)
            {			
                mxUtils.alert("Erro de sintaxe na métrica! Deve-se adicionar '#' antes dos nomes dos lugares, '#' indica o número de tokens no lugar.");
                auxbool=false;	
            }
            else
            {				
                aux2 = aux2.replace(/#/g, "1");
                aux2 = aux2.replace(/\D/g, "p");	
                
                if( (aux2.indexOf("p1")!=-1)||(aux2.indexOf("p1p")!=-1) )
                {			
                    mxUtils.alert("Erro de sintaxe na métrica! Deve-se adicionar '#' antes dos nomes dos lugares, '#' indica o número de tokens no lugar.");
                    auxbool=false;						
                }
                else if((aux2.indexOf("1pp")!=-1))
                {
                    var count = 0;
                    var aux3 = aux2;
                    var l = aux3.length;
                    for(var i = aux3.indexOf('p'); i < l; i++)//Contador de palavras que podem representar labels de lugares
                    {
                        if(aux3[i] != 'p')
                        {
                            aux3 = aux3.slice(i, l);
                            i = aux3.indexOf('p');
                            count++;
                            if(i == -1)
                            {
                                break;
                            }	
                        }
                    }
                    
                    if( ((aux2.match(/1p/g)).length) != count )
                    {
                        mxUtils.alert("Erro de sintaxe na métrica! '#' posicionado de maneira incorreta ou os caracteres e palavras chaves foram escritos ou posicionados de maneira incorreta. Não se calcula Esperança ou Probabilidade em Expressão de Guarda");
                        auxbool=false;								
                    }
                }
                else
                {
                    if( ((aux2.match(/1p/g)).length)!=((aux2.match(/p/g)).length) )
                    {
                        mxUtils.alert("Erro de sintaxe na métrica! '#' posicionado de maneira incorreta ou os caracteres e palavras chaves foram escritos ou posicionados de maneira incorreta. Não se calcula Esperança ou Probabilidade em Expressão de Guarda");
                        auxbool=false;								
                    }
                }
            }	
            if( (aux2.indexOf("=")!=-1)&&(aux2.indexOf("<")!=-1)&&(aux2.indexOf(">")!=-1) )
            {
                mxUtils.alert("Erro de sintaxe na métrica! Operadores de comparação não digitados, '>','<','>=','<=','/=' ou '=' .");
                auxbool=false;	
            }

            if(auxbool!=false)
            {
                auxbool = metricaAnaliselugar(aux, cell, graph, count);
            }  
        }

        return (auxbool && auxbool1 && auxbool2);
    };

    function analiselabels(label, graph)
    {
        var encoder = new mxCodec();
        var node = encoder.encode(graph.getModel());			
        var text = mxUtils.getXml(node);	
        text = mxUtils.parseXml(text);
        var l = text.getElementsByTagName("Lugar");
        var ttemp = text.getElementsByTagName("TransTemp");
        var tim = text.getElementsByTagName("TransIm");
        var metr = text.getElementsByTagName("Metrica");
        var count = 0;

        for(var i = 0; i < l.length; i++)
        {
            if(l[i].getAttribute('Label') == label)
            {
                count++;
                if(count>1){return false}
            }
        }
        for(var i = 0; i < ttemp.length; i++)
        {
            if(ttemp[i].getAttribute('Label') == label)
            {
                count++;
                if(count>1){return false}
            }
        }
        for(var i = 0; i < tim.length; i++)
        {
            if(tim[i].getAttribute('Label') == label)
            {
                count++;
                if(count>1){return false}
            }
        }
        for(var i = 0; i < metr.length; i++)
        {
            if(metr[i].getAttribute('Label') == label)
            {
                count++;
                if(count>1){return false}
            }
        }
        return true;
    };

    //Função que analisa os labels (exceto nos arcos)
    function labelChanged(label, graph)
    {
        var aux = label[0];
        
        if(label.length==0)
        {
            mxUtils.alert("O nome do Label não deve estar em branco!");
            return false;				
        }
        else if(label.indexOf(" ")!=-1)
        {
            mxUtils.alert("O nome do Label não deve ter espaço em branco!");
            return false;	
        }
        else if(isNaN(aux)==false)
        {
            mxUtils.alert("O nome do Label não deve iniciar com números!");
            return false;	
        }
        else if(label.match(/[!@#$%^&*()+=\[\]{};':"\\|,.<>\/?_-]/g)!=null)
        {
            mxUtils.alert("O nome do Label não deve ter caracteres especiais!");
            return false;					
        }
        else if(analiselabels(label, graph)==false)
        {
            mxUtils.alert("Os nomes dos elementos da rede (label) não podem ser iguais. Cada nome deve ser único.");
            return false;
        }
        return true;
    };