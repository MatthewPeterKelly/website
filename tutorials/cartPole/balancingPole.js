/**
 * Created by Brad on 6/30/2015.
 */

gravity = 10000;

function resetPendulum(){
    target.reset();
    chaser.reset();
}

chaser.onRedraw = function() {
    document.getElementById("ThetaValue").innerHTML = Math.round(Math.atan2(chaser.xTarget - chaser.x, chaser.yTarget - chaser.y) * 180/Math.PI);
}
