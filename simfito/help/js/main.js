var toc={
  select: 'selected',
  unselect: 'unselected',
  header: "<div class=\"wrapper no-pad\"><ul class=\"navigation\"><li><h1 title=\"SIMFito: qualche cosa\"><a class=\"logo-small\" href=\"http://simfito.org\"></a></h1></li></ul></div>",
  footer: "<div class=\"wrapper no-pad\"><ul class=\"footer-left\"><li></li></ul><div class=\"footer-right\"></div></div>",
  chapter:[
    {
      title: 'Capitolo 1: Iniziamo',
      paragraph:[
        {title:'SIMFito', src:'index.html'},
        {title:'Richiedere le credenziali', src:'richiestacredenziali.html'},
        {title:'Password dimenticata', src:'passworddimenticata.html'}
      ]
    },
    {
      title: 'Capitolo 2: Usare SIMFito',
      paragraph: [
        {title:'Accesso', src:'accesso.html'},
        {title:'Le aziende', src:'aziende.html'},
        {title:'I Siti', src:'siti.html'},
        {title:'La scheda', src:'scheda.html'},
        {title:'Le osservazioni', src:'osservazioni.html'},
        {title:'Gli allegati', src:'allegati.html'},
        {title:'Nuove segnalazioni', src:'associazioni.html'},
        {title:'Le trappole', src:'trappole.html'}
      ]
    },
    {
      title: 'Capitolo 3: Dentro SIMFito',
      paragraph:[
        {title:'Duplicare una scheda', src:'duplicascheda.html'},
        {title:'Scheda in pdf', src:'schedapdf.html'},
        {title:'Schede in un foglio elettronico', src:'schedexls.html'},
      ]
    },
    {
      title: 'Appendice A',
      paragraph: [
        {title:'Glossario', src:'glossario.html'}
      ]
    }
  ],
  makeToc: function(activeChapter,activeParagraph){
    var c=this.chapter;
    var toc='';
    for(var i in c){
      //toc+="<h4> <a href=\"\">"+c[i].title+"</a> </h4>";
      toc+="<h4>"+c[i].title+"</h4>";
      toc+="<ul>";
      for(var j in c[i].paragraph){
        var clas=((i==activeChapter)&&(j==activeParagraph))?this.select:this.unselect;
        toc+="<li class=\""+clas+"\"> <a href=\""+c[i].paragraph[j].src+"\">"+c[i].paragraph[j].title+"</a></li>";
      }
      toc+="</ul>";
    }
    return toc;
  },
  setToc: function(containerId,activeChapter,activeParagraph){
    var myToc=this.makeToc(activeChapter,activeParagraph);
    document.getElementById(containerId).innerHTML=myToc;
  },
  setHF: function(containerId){
    document.getElementById(containerId).innerHTML=this.header;
  }
};
