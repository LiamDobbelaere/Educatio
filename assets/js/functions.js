var branchColors = ["#9fd114", "#ee9144", "#70c2a7", "#d874ac", "#ffe26e", "#4dabe6", "#ff8a6e", "#e4cc37"];

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
  //if (this.level >= 1) this["foreground-color"] = "#e4cc37";

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

  colorTopBranches(root);

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

function colorTopBranches(root) {
  var currentColor = 0;
  root.children.forEach(function (child) {
    colorChildren(child, currentColor);

    if (++currentColor >= branchColors.length) currentColor = 0;
  });
}

function colorChildren(child, color) {
  child["foreground-color"] = branchColors[color];
  child.children.forEach(function (subchild) {  
    colorChildren(subchild, color);
  });
}

function playSound(sound) {
  var snd = new Audio(sound); // buffers automatically when created
  snd.play();
}