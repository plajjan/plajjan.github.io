var _a = ((8*(Math.PI - 3)) / ((3*Math.PI)*(4 - Math.PI)));

function erfinv( inputX )
{
    var _x = parseFloat(inputX);
    var signX = ((_x < 0) ? -1.0 : 1.0 );

    var oneMinusXsquared = 1.0 - (_x * _x);
    var LNof1minusXsqrd  = Math.log( oneMinusXsquared );
    var PI_times_a       = Math.PI * _a ;

    var firstTerm  = Math.pow(((2.0 / PI_times_a) + (LNof1minusXsqrd / 2.0)), 2);
    var secondTerm = (LNof1minusXsqrd / _a);
    var thirdTerm  = ((2 / PI_times_a) + (LNof1minusXsqrd / 2.0));

    var primaryComp = Math.sqrt( Math.sqrt( firstTerm - secondTerm ) - thirdTerm );

    var scaled_R = signX * primaryComp ;
    return scaled_R ;
}

function erf(x) {
  // save the sign of x
  var sign = (x >= 0) ? 1 : -1;
  x = Math.abs(x);

  // constants
  var a1 =  0.254829592;
  var a2 = -0.284496736;
  var a3 =  1.421413741;
  var a4 = -1.453152027;
  var a5 =  1.061405429;
  var p  =  0.3275911;

  // A&S formula 7.1.26
  var t = 1.0/(1.0 + p*x);
  var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y; // erf(-x) = -erf(x);
}

function calculate () {
    var fec_limit = Number($('#fec_limit').val());
    var trigger = Number($('#trigger').val());
    var revert = Number($('#revert').val());

    // calculate FEC limit in Q2-factor / Q-margin.
    var fec_limit_dbq = 20*Math.log10(Math.sqrt(2) * erfinv(1-(2*fec_limit)));

    var trigger_dbq = fec_limit_dbq + trigger;
    var revert_dbq = fec_limit_dbq + revert;

    // Calculate BER from dbQ values
    var trigger_ber = 1-(1+erf(Math.pow(10, (0.05*trigger_dbq))/Math.sqrt(2)))/2;
    var revert_ber = 1-(1+erf(Math.pow(10, (0.05*revert_dbq))/Math.sqrt(2)))/2;

    // Store the values in the result fields
    $('#fec_limit_dbq').val( fec_limit_dbq.toFixed(3) );
    $('#trigger_ber').val( trigger_ber.toExponential(3) );
    $('#revert_ber').val( revert_ber.toExponential(3) );

    // submit event fucntions must return false,
    // to tell the browser not to load a new page.
    return false;
}

// attach our function to the form's submit event.

$('#fec_limit').keyup(calculate);
$('#trigger').keyup(calculate);
$('#revert').keyup(calculate);
