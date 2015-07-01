/**
 * Created by Brad on 6/30/2015.
 */
sliderGravity.onRedraw = function() {
    gravity = sliderGravity.getValue() * 10000;
};

d3.select("#cart").call(
    d3.behavior.drag()
        .on("drag", function() {
            cart.setCoords([d3.event.x, d3.event.y]);
            poleMass.updateTarget();
        }));