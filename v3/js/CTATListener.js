
function CTATListener(zone) {

  var self = this;
  PageUI.call(self, document.getElementById("listener"));

  self.zone = zone;

  self.lastFormatted = null;

  subscribe("click/button", function(object) {
    console.log("CTATListener found object " + object.id);
    // do some CTAT stuff here

    buttonId = "button" + object.id;
    CTATCommShell.commShell.gradeSAI(buttonId, "clickButton", "null");

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
      if(sai.getAction() == "clickButton") {
        button = document.getElementById(sai.getSelection());

        button.style.color = "green";

        self.lastFormatted = sai;
      }
  }

  function processIncorrect(sai) {
      if(sai.getAction() == "clickButton") {
        button = document.getElementById(sai.getSelection());

        button.style.color = "red";

        self.lastFormatted = sai;
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
