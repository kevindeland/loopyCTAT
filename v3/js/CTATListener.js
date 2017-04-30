
function CTATListener(zone) {

  var self = this;
  PageUI.call(self, document.getElementById("listener"));

  self.zone = zone;

  subscribe("click/button", function(object) {
    console.log("CTATListener found object " + object.id);

  });
}
