/**
 * Created by Brad on 6/30/2015.
 */

gravity = 10000;

function resetPendulum(){
    cart.reset();
    poleMass.reset();
}

poleMass.onRedraw = function() {
    document.getElementById("ThetaValue").innerHTML = Math.round(Math.atan2(poleMass.xTarget - poleMass.x, poleMass.yTarget - poleMass.y) * 180/Math.PI);
}
