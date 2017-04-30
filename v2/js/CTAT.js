

function CTATListener(loopy) {

    var self = this;
    PageUI.call(self, document.getElementById("ctat"));

    self.loopy = loopy;

    // how is an SAI graded correct or not? what happens?
    CTATCommShell.commShell.assignGradingHandler(function(aString, aMessage) {
      console.log(aString)
      //console.log(aMessage.getXMLString());
      //console.log(aMessge.getSAI());
      //if(aMessage) console.log(aMessage);
    });

    subscribe("createNode", function(object) {

      log("CTATListener", "Found new node");
      log("CTATListener", object);

      // TODO this should be dependent on object
      CTATCommShell.commShell.gradeSAI("node1", "createNode", "null");
      // Selections must be unique
      // in this case, selections are varying...


    });


    subscribe("createEdge", function(object) {

      log("CTATListener", "Found new edge");
      log("CTATListener", object);

      // TODO this should be dependent on object
      CTATCommShell.commShell.gradeSAI("edge1", "createEdge", "null");
    });


    CTATCommShell.commShell.addGlobalEventListener({
        processCommShellEvent: function(evt, msg)
        {
            if("AssociatedRules" != evt || !msg)
            {
                return;
            }
            window.associatedRules = msg;
            var indicator = msg.getIndicator();
            var sai = msg.getSAI();                               // selection-action-input from tutor engine
            var selection = (sai ? sai.getSelection() : "_noSuchComponent_");
            var comps = CTATShellTools.findComponent(selection);  // array of components with this name
            var component = (comps && comps.length ? comps[0] : null);
            if(component && "incorrect" == indicator.toLowerCase())
            {
                alert("Tutor's answer is "+sai.toString());
            }
        }
    });



}
