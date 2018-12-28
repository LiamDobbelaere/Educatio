function addMindmapZooming() {  
  document.querySelector("div").addEventListener("wheel", function(e) {
    e.preventDefault();
    e.deltaY > 0 ? jm.view.zoomOut() : jm.view.zoomIn();  
  });
}

function scrollToElement(element){
  var container = element.parentElement.parentElement;
  var scrollTop = element.offsetTop - container.offsetHeight / 2;
  var scrollLeft = element.offsetLeft - container.offsetWidth / 2;

  if (element.offsetTop < container.scrollTop || element.offsetTop > container.scrollTop + container.offsetHeight / 2 || 
    element.offsetLeft < container.scrollLeft || element.offsetLeft > container.scrollLeft + container.offsetWidth / 2)
  {
    $(container).animate({ scrollTop: scrollTop, scrollLeft: scrollLeft }, {
      duration: 200,
      queue: false,
      easing: "linear"
    });
  }
}

function flatten(tree) {
  var values = [];
  flattenChild(tree, values);

  return values;
}

function flattenChild(child, values) {
  values.push(child);
  if (child.children) {
    child.children.forEach(function (subchild) {
      flattenChild(subchild, values);
    });
  }
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

function plainTextToNodes(text) {
  var nodes = text.split('\n').map(function(line) {
    return new Node(line);
  });
  
  var root = new Node("root");
  root.addChildren(nodes);
  root = root.children[0];
  for (var i = 0; i < root.children.length; i++) {
    root.children[i].direction = i <= root.children.length / 2 ? "left" : "right";
  }

  return JSON.parse(JSON.stringify(root));
}

function eraseTopics(root) {
  root.topic = "_______";
  if (root.children) {
    root.children.forEach(function (child) {
      eraseTopics(child);
    });
  }
}

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

var mindmapOriginal = plainTextToNodes(test);
var mindmapBlind = plainTextToNodes(test);
eraseTopics(mindmapBlind);

var mind = {
  "meta": {
    "name": "",
    "author": "",
    "version": ""
  },
  "format": "node_tree",
  "data": mindmapBlind,
  
};

var options = {
  container:'mindmap',
  theme:'custom',
  editable:true,
  view: {
    line_width: 2,
  }
};

var jm = new jsMind(options);
jm.show(mind);
jm.view.relayout();
jm.view.minZoom = 0.1; 
var editTimeout = null;
jm.update_node_handler = function(nodeid, topic, unchanged_or_empty) {
  if (topic === flat[cid - 1].topic) {
    console.log("correct");
  }

  if (unchanged_or_empty) {
    console.log("Left blank!");
  }

  console.log(topic);

  advanceExercise();
};

var flat = flatten(mindmapOriginal);
var cid = 0;

function advanceExercise() {
  if (cid > 0) {
    jm.update_node(flat[cid - 1].id, flat[cid - 1].topic);
  }

  var id = flat[cid].id;

  jm.select_node(id);
  clearTimeout(editTimeout);
  editTimeout = setTimeout(function() {
    jm.begin_edit(id);
  }, 200);
  
  scrollToElement(jm.get_selected_node()._data.view.element);

  cid++;
  if (cid > flat.length) cid = 0;
}

advanceExercise();
advanceExercise();
advanceExercise();
advanceExercise();
