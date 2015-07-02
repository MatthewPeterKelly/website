/**
 * Created by Brad on 6/30/2015.
 */

var sliderGravity = new Slider([160, 300], [0, 1], "gravityRail", "#gravityCircle", "#gravityLabel",0.1);
sliderGravity.onRedraw = function() {
    gravity = sliderGravity.getValue() * 10000;
};

var sliderDamp = new Slider([160, 300], [.001, 2], "dampingRail", "#dampingCircle", "#dampingLabel");
sliderDamp.onRedraw = function() {
    poleMass.updateParams(sliderDamp.getValue());
}

function doOtherUpdates(){
    sliderGravity.redraw();
    sliderDamp.redraw();
}

d3.select("#cart").call(
    d3.behavior.drag()
        .on("drag", function() {
            cart.setCoords([d3.event.x, d3.event.y]);
            poleMass.updateCartPos();
        }));

