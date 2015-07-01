/**
 * Created by Brad on 6/30/2015.
 */
/*
 Define a slider class
 */
function Slider(domain, range, sliderName, circleName, labelName, initialValue) {
    this.x = 0;
    this.y = document.getElementById(sliderName).getAttribute("y2");
    this.value = initialValue !== undefined ? initialValue : 1;
    this.needsRedraw = true;

    this.xRange = domain;
    this.valueRange = range;

    this.scaleXToValue = d3.scale.linear()
        .domain(this.xRange)
        .range(this.valueRange);
    this.scaleValueToX = d3.scale.linear()
        .domain(this.valueRange)
        .range(this.xRange);


    this.getValue = function() {
        return this.value
    };
    this.setValue = function(value) {
        this.setX(this.scaleValueToX(value));
    }
    this.setX = function(x) {
        this.x = bound(x, this.xRange[0], this.xRange[1]);
        this.value = this.scaleXToValue(this.x);
        this.needsRedraw = true;
    }
    this.redraw = function() {
        if (!this.needsRedraw) {
            return;
        }
        this.needsRedraw = false;
        d3.select(circleName)
            .attr("cx", this.x)
            .attr("cy", this.y);
        d3.select(labelName)
            .text(formatLabelString(this.value))
            .attr("x", this.x);
        this.onRedraw();
    }

    this.onRedraw = function() {}

    this.initialize = function() {
        this.setValue(this.value);
        var sliderReference = this;

        d3.select(circleName).call(
            d3.behavior.drag()
                .on("drag", function() {
                    sliderReference.setX(d3.event.x);
                }));

        d3.select("#" + sliderName).on("click", function() {
            var clickPos = d3.mouse(this);
            sliderReference.setX(clickPos[0]);
        })
    }

    this.initialize();
}