

function tokengame(bodygraph)
{

    //Checa se o browser suporta a biblioteca mxGraph
    if (!mxClient.isBrowserSupported())
    {
        mxUtils.error('O browser não suporta!', 200, false);
    }
    else
    {
        //Define um ícone quando o mouse entra em contao com um vértice para conectar arestas
        mxConnectionHandler.prototype.connectImage = new mxImage('../ferramenta/images/connector.gif', 8, 8);

        //bodygraph.style.background = 'url("../ferramenta/editors/images/grid.gif")';

        // Cria grafo e o modelo do grafo (leia a documentação para entender os detalhes)
        var model = new mxGraphModel();
        var graph = new mxGraph(bodygraph, model);

        // Habilita ou desabilita certas conexões ou outras propriedades do grafo como mover label e etc
        graph.setConnectable(false);
        graph.setMultigraph(false);
        graph.setAllowDanglingEdges(false);
        graph.setCellsDisconnectable(false);
        graph.setCellsResizable(false);
        graph.vertexLabelsMovable = false;
        graph.edgeLabelsMovable = false;
        graph.setCellsMovable(false);

        //Desabilita o menu contexto do browser
        mxEvent.disableContextMenu(bodygraph);

        //Rubberband
        new mxRubberband(graph);

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

        ///////////////////
        var text = localStorage.getItem('tokengame'); 
                
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
        //////////////////
        //console.log(graph.getModel().cells);
        var clls = graph.getModel().cells;
        console.log(clls);
        var cll = graph.getModel().getCell(clls[3]);
        console.log(cll);
        console.log(clls.length);
        habilita(3, graph);
        for(var i=0; i<clls.length; i++)
        {
            console.log(i);
            habilita(clls[i], graph);
        }
        
    }

}

function habilita(id, graph)
{console.log('teste');
    //var cell = evt.getProperty(cell);
    var cell = graph.getModel().getCell(id);
		console.log(cell);			
    if (cell != null)
    {
        var overlays = graph.getCellOverlays(cell);
        
        if (overlays == null)
        {
            // Creates a new overlay with an image and a tooltip
            var overlay = new mxCellOverlay(
                new mxImage('editors/images/overlays/check.png', 16, 16),
                'Overlay tooltip');
            
            // Sets the overlay for the cell in the graph
            graph.addCellOverlay(cell, overlay);

            //graph.removeCellOverlays(cell);
            graph.addListener(mxEvent.DOUBLE_CLICK, function(sender, evt)
            {
                var cell = evt.getProperty('cell');
                mxUtils.alert('Doubleclick: '+((cell != null) ? 'Cell' : 'Graph'));
                evt.consume();
            });
        }
        else
        {
            //graph.removeCellOverlays(cell);
            graph.addListener(mxEvent.DOUBLE_CLICK, function(sender, evt)
            {
                var cell = evt.getProperty('cell');
                mxUtils.alert('Doubleclick: '+((cell != null) ? 'Cell' : 'Graph'));
                evt.consume();
            });
        }
    }
}

