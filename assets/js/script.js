function addMindmapZooming() {  
  document.querySelector("div").addEventListener("wheel", function(e) {
    e.preventDefault();
    e.deltaY > 0 ? jm.view.zoomOut() : jm.view.zoomIn();  
  });
}

function flatten(tree) {
  var values = [];
  values.push(tree.id)
  tree.children.forEach(function (child) {
    flatten_child(child, values);
  });

  return values;
}

function flatten_child(child, values) {
  values.push(child.id);
  if (child.children) {
    child.children.forEach(function (subchild) {
      flatten_child(subchild, values);
    });
  }
}

function hasNodeWithIdInTree(tree, id) {
  tree.children.forEach(function(child) {
    if (child.id === id) {
      return true;
    }

    if (child.children) {
      var result = hasNodeWithIdInTreeChild();    

      if (result) return true;
    }
  });

  return false;
}

function hasNodeWithIdInTreeChild(child) {
  child.children.forEach(function(subchild) {
    if (subchild.id === id) {
      return true;
    }

    if (child.children) {
      var result = hasNodeWithIdInTreeChild();
      if (result) return true;
    }
  });

  return false;
}

addMindmapZooming();

var test = 
`Geschiedenis neurowetenschap
	Oudheid
		Hippocrates
			Hersenen = bron EG
		Aristoteles
			Hart = lichaam en geest
			Hersenen = ondergeschikt (afkoelen)
		Galenus
			Gladiatoren
			Hersenen = GWC
			Ventrikels = levensadem
			Holle zenuwen
			Geen lokalisatie
	Middeleeuwen
		Ventriculaire theorie
		CF lokalisatie in ventrikels
	Renaissance
		Vesalius
			Ziel NIET in ventrikels
			Hersenen = IBW
		Leonardo Da Vinci
			Anatomie schedel
			Was hersenen Os
	17e eeuw
		Descartes
			Ik denk dus ik ben
			Dualisme
			Pijnappelklier
		Thomas Willis
			Functionele organisatie + NIVEAUS
			Toetsbare hypothesen
			Hogere structuren = meer ontwikkeld
			Cirkel van Willis
	19e eeuw
		Corticale lokalisatie 
			Franz Gall
				Frenologie
				Knobbels
				Lokalisatie!
			Paul Broca
				Meneer Tan
				Motorische afasie
			Wernicke
				Taalbegrip
			Wernicke & Broca
				Uitval!
				Antilokalisatie!
		Evolutie, genen, gedrag
			Darwin
				Evolutie
			Gregor Mendel
				Erfelijk materiaal
			Francis Galton
				Genetische theorie
				Tweelingen (eeneiig vs twee-eiig)
		Wetenschappelijke psychologie
			Wilhelm Wundt
				Experimenteel-empirisch
				Introspectie onbetrouwbaar
				Hogere mentale processen
				Bewustzijn = selectie, inzoomen, associaties
		Microscopisch onderzoek
			Ramon y Cajal
				Neuronen als bouwstenen
				Types neuronen
				Afstand
	20e eeuw
		Henry Dale, Otto Loewi
			Neurotransmitters
			Activeren/inhiberen
		Henri Laborit
			Narcotica
			Chloorpromazine
		Antidepressiva ('50)
		Gedragsgenetica (Watson en Crick)
		Gedragspsychologie (Pavlov, Skinner, Chomsky)`;

var testnodes = test.split('\n').map(function(text) {
  return new Node(text);
});

var root = new Node("root");
root.addChildren(testnodes);
for (var i = 0; i < root.children[0].children.length; i++) {
  root.children[0].children[i].direction = i <= root.children[0].children.length / 2 ? "left" : "right";
}

function Node(indented_line) {
  var self = this;

  this.children = [];
  this.level = indented_line.length - indented_line.trimLeft().length;
  this.text = indented_line.trim();
  
  //jsMind additions
  this.id = this.text.split(' ').join('');
  this.topic = this.text;

  this.addChildren = function(nodes) {
    var childlevel = nodes[0].level;

    while (nodes.length > 0) {
      var node = nodes.shift();
      
      if (node.level == childlevel) {
        self.children.push(node);
      } else if (node.level > childlevel) {
        nodes.unshift(node);
        self.children[self.children.length - 1].addChildren(nodes);
      } else if (node.level <= self.level) {
        nodes.unshift(node);

        if (node.text == "") {
          console.log(node);
        }
        return;
      }
    }
  };
}

function scrollToElement(element){
  var container = element.parentElement.parentElement;
  var scrollTop = element.offsetTop - container.offsetHeight / 2;
  var scrollLeft = element.offsetLeft - container.offsetWidth / 2;

  if (element.offsetTop < container.scrollTop || element.offsetTop > container.scrollTop + container.offsetHeight / 2
    || element.offsetLeft < container.scrollLeft || element.offsetLeft > container.scrollLeft + container.offsetWidth / 2)
  {
    $(container).animate({ scrollTop: scrollTop, scrollLeft: scrollLeft }, {
      duration: 200,
      queue: false,
      easing: "linear"
    });
  }
}

var mind = {
  "meta": {
    "name": "jsMind remote",
    "author": "hizzgdev@163.com",
    "version": "0.2"
  },
  "format": "node_tree",
  "data": JSON.parse(JSON.stringify(root.children[0]))
};
var options = {
  container:'mindmap',
  theme:'custom',
  editable:true
};
var jm = new jsMind(options);
jm.show(mind);
jm.view.relayout();
jm.view.minZoom = 0.1; 
console.log(jm);

//Enable this for auto-collapse 1
/*root.children[0].children.forEach(function (topNode) {
  jm.collapse_node(topNode.id);
});*/

var ids = flatten(mind.data);
var cid = 0;
setInterval(() => {
  jm.select_node(ids[cid]);
  scrollToElement(jm.get_selected_node()._data.view.element);

  //Enable this for auto-collapse 2
  /*
  if (jm.get_selected_node().data.level === 1) {
    root.children[0].children.forEach(function (topNode) {
      jm.collapse_node(topNode.id);
    });
    
    jm.expand_node(ids[cid]);
  }*/

  cid++;
  if (cid >= ids.length) cid = 0;
}, 500);
