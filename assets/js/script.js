var test = 
`Test
  A
    A1
    A2
    A3
  B
    B1
    B2
    B3
  C
    C1
    C2`;

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
var nextNodeTimeout = null;
jm.update_node_handler = function(nodeid, topic, unchanged_or_empty) {
  var wasCorrect = false;

  if (topic === reviseQueue[cid - 1].topic) {
    console.log("correct");
    wasCorrect = true;
  } else if (unchanged_or_empty) {
    console.log("Left blank!");
  } else {
    console.log("Wrong answer!");  
  }

  console.log(topic);

  advanceExercise(wasCorrect);
};

var flat = flatten(mindmapOriginal);
var reviseQueue = flatten(mindmapOriginal);
var cid = 0;

function advanceExercise(wasCorrect) {
  if (cid > 0) {
    jm.update_node(reviseQueue[cid - 1].id, reviseQueue[cid - 1].topic);
    jm.update_node(reviseQueue[cid].id, "_______");
    
    //Clear all nodes below this node
    /*var flatIndex = flat.findIndex(function (node) {
      return node.topic === reviseQueue[cid].topic;
    });

    for (var i = flatIndex; i < flat.length; i++) {
      jm.update_node(flat[i].id, "_______");
    }*/
  }

  if (cid  < reviseQueue.length) {
    var id = reviseQueue[cid].id;
    
    if (wasCorrect) {
      playSound("assets/media/correct.wav");

      jm.select_node(id);
      clearTimeout(editTimeout);
      editTimeout = setTimeout(function() {
        jm.begin_edit(id);
        scrollToElement(jm.get_selected_node()._data.view.element);
      }, 200);  
    } else {
      playSound("assets/media/wrong.wav");

      //Add to revise queue
      reviseQueue.splice(cid + Math.floor(Math.random() * 3) + 3, 0, reviseQueue[cid - 1]);

      clearTimeout(nextNodeTimeout);
      nextNodeTimeout = setTimeout(function () {
        jm.select_node(id);
        clearTimeout(editTimeout);
        editTimeout = setTimeout(function() {
          jm.begin_edit(id);
          scrollToElement(jm.get_selected_node()._data.view.element);
        }, 200);    
      }, 1000);
    }

    cid++;  
  } else {
    playSound("assets/media/complete.wav");
  }
}

advanceExercise(true);
advanceExercise(true);