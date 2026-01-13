//var wmsUrl="https://simfito.regione.campania.it/geoserver/wms";
/*var urlPrefix="http://95.110.228.221/simfito/";
Ext.Ajax.setupUrl= function(options,url){
    var b=url.split('/');
    if(b.indexOf('geoserver')==-1){
        url=urlPrefix+url;
    }
    return url;
};*/
var layersList={};

function clearContainer()
{
    if(Ext.getCmp('sitiall')!==undefined){
        Ext.getCmp('sitiall').destroy();
    }
    if(Ext.getCmp('sito')!==undefined){
        Ext.getCmp('sito').destroy();
    }
    if(Ext.getCmp('sito1')!==undefined){
        Ext.getCmp('sito1').destroy();
    }
    if(Ext.getCmp('scheda')!==undefined){
        Ext.getCmp('scheda').destroy();
    }
    if(Ext.getCmp('trappole1')!==undefined){
        Ext.getCmp('trappole1').destroy();
    }
}

function checkConfig()
{
    Ext.Ajax.request({
        url: 'services/ajax.php',
        async:true,
        cors:true,
        params:{
            mode: 'chkconfig'
        },
        method: 'POST',
        success: function(response, opts) {
            var text = response.responseText;
            var resp= Ext.JSON.decode(text,true);
            //console.log(resp.data);
            for (var i in resp.data){
                localStore.setItem(resp.data[i].code,resp.data[i].value);
            }
            //localStore.setItem(resp.data[0].code,resp.data[0].value);
        },
        failure: function(response, opts) {
            console.error('server-side failure with status code ' + response.status);
        }
    });
}

function rilevato(ril){
    var fields=['sup_infest','piante_infest'];
    var values=[0,0];
    var disabled=false;
    if(ril===0){
        disabled=true;
    }
    else 
    for(var i in fields){
        Ext.getCmp(fields[i]).setDisabled(disabled);
        if(values[i]!=null){
            Ext.getCmp(fields[i]).setValue(values[i]);
        }
    }
}

function checkDuplicatedCode(store,codice,idOsservazione)
{
    var exist=false;
    store.each(function(record,index){
        if(record.get('idosservazioni')!=idOsservazione){
            if(record.get('codice')!=undefined){
                if(record.get('codice')==codice){
                    exist=true;
                }
            }
        }
    });
    return(exist);
}

function extractLayer(child)
{
    if(!child.isLeaf()){
        if(child.hasChildNodes()){
            child.eachChild(function(newChild){extractLayer(newChild);});
        }
    }
    else{
        if(child.get('baseLayer')!=undefined){
            switch(child.get('baseLayer')){
                case 'bing':
                default:
                    var layer=new ol.layer.Tile({
                        visible: true,
                        preload: Infinity,
                        baseLayer:true,
                        baseLayer:true,
                        source: new ol.source.BingMaps({
                            key: "AkakbAJ8Rv9M5qxPXcTjraIU3gWVCMTBIbu7G1KyAQYrCqgEwjlVIHIBvlEYbBez",
                            imagerySet: 'AerialWithLabels'
                        })
                    });
                    map2.addLayer(layer);
                    break;
                case 'osm':
                    var layer=new ol.layer.Tile({
                        visible: false,
                        baseLayer:true,
                        source: new ol.source.OSM()
                    });
                    map2.addLayer(layer);
                    break;
            }
            layersList[child.get('id')]=layer;
        }
        else if(child.get('layerSource')!=undefined){
            var layerSource=new ol.source.TileWMS(child.get('layerSource'));
            var layer=new ol.layer.Tile({
                visible:false,
                baseLayer:false,
                source:layerSource
            });
            layersList[child.get('id')]=layer;
            map2.addLayer(layer);
        }
    }
}

bufferedLayer=0;
function extraLayerFromLeaf(leaf, opacity)
{
    var layerSource=new ol.source.TileWMS(leaf.layerSource);
    var layer=new ol.layer.Tile({
        visible:false,
        source:layerSource,
        opacity:opacity==undefined?0.4:opacity
    });
    layersList[leaf.id]=layer;
    map2.addLayer(layer);
}

function osservazioneFormReset()
{
/*    var init;
    var form=Ext.getCmp('osservazioniform').getForm();
    var fields=form.getFields().items;
    for(var i in fields){
        if(fields[i].init!==undefined){
            init=fields[i].init;
            fields[i].setValue(init.value);
            fields[i].setDisabled(init.disabled);
        }
    }*/
    //form.reset(true);
}

function createElabElement(type,variables)
{
    var leaf={};
    var viewparams,myLayer;
    var myId=Ext.StoreManager.get('DatasetTreeStore').getById('elaborazioni').childNodes.length;
    switch(type){
        case 0: //per parassita
            myLayer='simfito:simbuffer';
            viewparams='end:'+variables.end+';start:'+variables.start+';pestcode:'+variables.pestcode+';buffer1:'+variables.buffer1+';buffer2:'+variables.buffer2+';buffer3:'+variables.buffer3+';tiposito:'+variables.tiposito;
        break;
        case 6:
            myLayer='simfito:simbuffer_siti';
            viewparams='end:'+variables.end+';start:'+variables.start+';pestcode:'+variables.pestcode+';tiposito:'+variables.tiposito;
            variables.title+=' (SITI)';
        break;
        break;    
        case 1: //presenza parassiti
            myLayer='simfito:presenzaparassiti';
            viewparams='end:'+variables.end+';start:'+variables.start+';pestcode:'+variables.pestcode+';tiposito:'+variables.tiposito+';comune:'+variables.comune;
        break;
        case 7: //presenza parassiti
            myLayer='simfito:presenzaparassiti_siti';
            viewparams='end:'+variables.end+';start:'+variables.start+';pestcode:'+variables.pestcode+';tiposito:'+variables.tiposito+';comune:'+variables.comune;
            variables.title+=' (SITI)';
        break;
        case 2: //presenza parassiti per comune
            myLayer='simfito:presenzaparassitipercomune';
            viewparams='end:'+variables.end+';start:'+variables.start+';pestcode:'+variables.pestcode+';tiposito:'+variables.tiposito;
        break;
        case 3:
            myLayer='simfito:parassitaconincidenza';
            viewparams='end:'+variables.end+';start:'+variables.start+';pestcode:'+variables.pestcode+';incidence:'+variables.incidence+';tiposito:'+variables.tiposito;
        break;
        case 4:
            myLayer='simfito:incidenzapercomune';
            viewparams='end:'+variables.end+';start:'+variables.start+';pestcode:'+variables.pestcode+';incidence:'+variables.incidence+';tiposito:'+variables.tiposito;
        break;
        case 5: //parassiti presenti
            myLayer='simfito:parassitapresente';
            viewparams='end:'+variables.end+';start:'+variables.start+';pestcode:'+variables.pestcode+';tiposito:'+variables.tiposito+';comune:'+variables.comune;
        break;
        case 8: //parassiti presenti
            myLayer='simfito:parassitapresente_siti';
            viewparams='end:'+variables.end+';start:'+variables.start+';pestcode:'+variables.pestcode+';tiposito:'+variables.tiposito+';comune:'+variables.comune;
            variables.title+=' (SITI)';
        break;
        case 9: //trappole
            /*SELECT trappole_geometry.id, sum(coalesce(unita_chk,0)), trappole_geometry.organismo,trappole_geometry.the_geom
            FROM simfito.osservazioni
            left JOIN simfito.scheda on scheda.idscheda=osservazioni.idscheda
            right JOIN simfito.trappole_geometry ON trappole_geometry.id=osservazioni.trappole_geometry_id
            WHERE trappole_geometry.organismo='DACUDO' AND (scheda.data_sopralluogo BETWEEN '20120101' AND '20211231' OR scheda.data_sopralluogo is null)
            GROUP BY trappole_geometry.id, organismo, trappole_geometry.the_geom
            order by sum(coalesce(unita_chk,0)) desc*/
            myLayer='simfito:trappole_in';
            viewparams='end:'+variables.end+';start:'+variables.start+';bayercode:'+variables.pestcode+';comune:'+variables.comune+';comunefilt:'+variables.comunefilt;
        break;
        case 10:
            var where="sch_start.data_sopralluogo<='"+variables.date+"' and future(sch_end.data_sopralluogo::text)>='"+variables.date+"' AND organismo in ('"+variables.pestcode+"')";
            myLayer='simfito:trappole3';
            viewparams='where:'+where;
        break;
        case 11:
            myLayer='simfito:trappole_per_posizionate_in';
            viewparams='end:'+variables.end+';start:'+variables.start+';bayercode:'+variables.pestcode;
        break;
        case 12:
            myLayer='simfito:trappole_per_attive_in';
            viewparams='end:'+variables.end+';start:'+variables.start+';bayercode:'+variables.pestcode;
        break;
        case 13:
            myLayer='simfito:parassita_catturato_in';
            viewparams='end:'+variables.end+';start:'+variables.start+';bayercode:'+variables.pestcode;
        break;
        case 14:
            myLayer='simfito:parassita_catturato_in_comune';
            viewparams='end:'+variables.end+';start:'+variables.start+';bayercode:'+variables.pestcode;
        break;
    }
    leaf={
        "text": myId+' '+variables.title,
        "id":bufferedLayer,
        "idx": bufferedLayer++,
        "leaf": true,
        "checked": false,
        "layerSource":{
            "url": wmsUrl,
            "params": {'LAYERS': myLayer,'viewparams':viewparams, "title": variables.title},
            "serverType": "geoserver"/*,
            "crossOrigin": "anonymous"*/
        }
    };
    return leaf;
}

function chkObsMainFields()
{
    var fieldIds=["unit_chk","peso_chk","lotti_chk","lotti_camp"];
    var toReturn="Assicurarsi che almeno uno dei gruppi: Unità, Peso e Lotti abbia valore diverso da zero!";
    var tot=0;
    for (var i in fieldIds){
       tot+=Ext.getCmp(fieldIds[i]).getValue();
    }
    if(tot>0){
        toReturn=true;
    }
    return toReturn;
}