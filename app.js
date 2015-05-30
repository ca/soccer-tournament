Stripe.setPublishableKey('pk_test_JjWUYIGvKy8XfpDmu0iwbbwh');
Parse.initialize("nuT9HUvp3foyQprppmA9h5vAKNK6yc7lZO4SKpGI", "TgqoS8MFSJ4YGYBtofwvDpRHBWZxxaAaMHF992DG");

function stripeResponseHandler(status, response) {
  var $form = $('#charge-form');
  if (response.error) {
    $form.find('.payment-errors').text(response.error.message);
    $form.find('button').prop('disabled', false);
  } else {
    var token = response.id;
    Parse.Cloud.run('chargeRegistrant', { stripeToken: token }, {
      success: function(result) { console.log(result); },
      error: function(error) { console.log(error); }
    });
  }
};

$("#charge-form").submit(function(e){
  var $form = $(this);
  var $parseData = $('#tournament-registration');
  $form.find('button').prop('disabled', true);
  e.preventDefault();
  Stripe.card.createToken($form, stripeResponseHandler);
  
  var Team = Parse.Object.extend("Team");
  var team = new Team();
  team.save({
    name: "",
    captain: {}, // object contains captain's phone number
    players: [] // array of player objects
  }, {
    success: function(object) { $(".alert-success").show(); },
    error: function(model, error) { $(".alert-danger").show(); }
  });
});
