
function CTATListener(loopy) {

  var self = this;
  PageUI.call(self, document.getElementById("listener"));

  self.loopy = loopy;

  self.lastFormatted = null;


  /*
  * Here are all of the subscriptions
  */
  subscribe("click/button", function(object) {

    buttonId = "button" + object.id;
    CTATCommShell.commShell.gradeSAI(buttonId, "clickButton", "null");

  });

  subscribe("create/node", function(object) {

    nodeId = "node" + object.id;
    CTATCommShell.commShell.gradeSAI(nodeId, "createNode", object.label);
  });

  subscribe("name/node", function(object) {
    console.log("CTATListener found name/node");
    console.log(object);
    nodeId = "node" + object.id;
    CTATCommShell.commShell.gradeSAI(nodeId, "nameNode", object.label);
  });

  subscribe("create/edge", function(object) {
    console.log("CTATListener found create/edge");

    edgeId = "edge_" + object.from.id + "_" + object.to.id;
    CTATCommShell.commShell.gradeSAI(edgeId, "createEdge", object.strength);
  });

  subscribe("update/edge", function(object) {
    console.log("CTATListener found update/edge");
    window.edge = object;
    console.log(object.getValue());

    edgeId = "edge_" + object.fromNode + "_" + object.toNode;

    CTATCommShell.commShell.gradeSAI(edgeId, "updateEdge", object.getValue("strength"));
  });

  CTATCommShell.commShell.assignGradingHandler(function(aString, aMessage) {
    console.log("grading handler! " + aString);
    window.grading = aMessage;
  });

  // Series of events
  // 0. InterfaceAction
  // 1. CorrectAction or IncorrectAction
  // 2. AssociatedRules
  // 3. HighlightMsg (optional)
  CTATCommShell.commShell.addGlobalEventListener({
    processCommShellEvent: function(evt, msg) {
      console.log("EVENT");
      console.log(evt);

      if(evt == "InterfaceAction" && self.lastFormatted != null) {
        clearFormatting(self.lastFormatted);
      } else if(evt.toLowerCase() == "correctaction") {
        window.correct = msg;
        processCorrect(msg.getSAI());
      } else if (evt.toLowerCase() == "incorrectaction") {
        window.incorrect = msg;
        processIncorrect(msg.getSAI());
      }



      if("AssociatedRules" != evt || !msg) {
        window.notAssociatedRules = msg;
        return;
      }
      window.associatedRules = msg;


      return;
      if (msg.getIndicator() == "Correct") {
          processCorrect(msg.getSAI());
      } else if (msg.getIndicator() == "InCorrect") {
        console.log("incorrect action", msg.getSAI().getSelection()  );


      }
    }
  });

  function processCorrect(sai) {

    //document.getElementById("toolbar").style.backgroundColor = "green";
    //document.getElementById("sidebar").style.backgroundColor = "green";
    //document.getElementById("playbar").style.backgroundColor = "green";
    //document.getElementById("ctat-hint-widget").style.backgroundColor = "green";

      window.target.hue = 3;

    console.log()

      if(sai.getAction() == "clickButton") {
        button = document.getElementById(sai.getSelection());

        button.style.color = "green";

        self.lastFormatted = sai;
      }

      if(sai.getAction() == "nameNode") {
        console.log("A correctly named node!");
      }
  }

  function processIncorrect(sai) {


      //document.getElementById("toolbar").style.backgroundColor = "red";
      //document.getElementById("sidebar").style.backgroundColor = "red";
      //document.getElementById("playbar").style.backgroundColor = "red";
      //document.getElementById("ctat-hint-widget").style.backgroundColor = "red";
      window.target.hue = 0;

      if(sai.getAction() == "clickButton") {
        button = document.getElementById(sai.getSelection());

        button.style.color = "red";

        self.lastFormatted = sai;
      }

      if(sai.getAction() == "nameNode") {
        console.log("An incorrectly named node!");
      }
  }

  // clearFormatting
  // clears the formatting from a correct or incorrect action
  function clearFormatting(sai) {
      if(sai.getAction() == "clickButton") {
        button = document.getElementById(sai.getSelection());

        button.style.color = "black";
      }
  }

}
