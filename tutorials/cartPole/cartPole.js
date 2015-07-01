//This page is for variable and function definitions

/*
 Returns the input clipped my min and max values
 */
function bound(value, min, max) {
    return Math.max(Math.min(value, max), min);
}

var gravity = 0;


var panelPtMass = {
    width: parseInt(document.getElementById("panelPtMass").style.width),
    height: parseInt(document.getElementById("panelPtMass").style.height),
    svg: d3.select("#panelPtMass"),
    //      init: function() {
    //      d3.select("#panelPtMass").append("circle")
    //      .attr("id","chaser")
    //      .attr("class","circle")
    //      .arrt("r,6");
    //      d3.select("#panelPtMass").append("circle")
    //      .attr("id","target")
    //      .attr("class","handle")
    //      .arrt("r,14");
    //      }
};
//panelPtMass.init();

var target = {
    x: panelPtMass.width/2,
    y: 3*panelPtMass.height/5,
    getX: function() {
        return this.x;
    },
    getY: function() {
        return this.y;
    },
    setX: function(x) {
        this.x = bound(x, 0, panelPtMass.width);
    },
    setY: function(y) {
        this.y = bound(y, 0, panelPtMass.height);
        this.y = 3*panelPtMass.height/5;
    },
    setCoords: function(coords) {
        this.setX(coords[0]);
        this.setY(coords[1]);
    },
    redraw: function() {
        d3.select("#target")
            .attr("cx", this.x)
            .attr("cy", this.y)
    },
    updateTarget: function() {
        if (typeof targetMotion === "function") {
            targetMotion(this);
        }
    },
    motionType: "off",
    motionTime: 0
};




var chaser = {
    x: panelPtMass.width/2,
    y: (3/5 - 1/4)*panelPtMass.height,
    xTarget: target.getX()+5,
    yTarget: target.getY(),
    dx: 0,
    dy: 0,
    ddx: 0,
    ddy: 0,
    kp: 5,
    kd: 1,
    poleLength: panelPtMass.height/4,
    redraw: function() {
        d3.select("#chaser")
            .attr("cx", this.x)
            .attr("cy", this.y)
        d3.select("#pole")
            .attr("x1", this.x)
            .attr("y1", this.y)
            .attr("x2", this.xTarget)
            .attr("y2", this.yTarget)
    },
    timeStep: function(dt) {

        /* When the page is not on the active tab in firefox, it suspends
         animation. When the page is viewed again, it will cause an
         extremely large time-step to occur. This is a simple fix. */
        if (dt > 10) {
            dt = 10;
        }

        dt = dt / 1000;

        var newState = RungeKutta4Step([this.x, this.y, this.dx, this.dy], dt, this.dynamics.bind(this));

        this.x = newState[0];
        this.y = newState[1];
        this.dx = newState[2];
        this.dy = newState[3];

    },
    updateTarget: function() {
        this.xTarget = target.getX();
        this.yTarget = target.getY();
        var wn = 2 * Math.PI * sliderGravity.getValue();
        var xi = sliderDamp.getValue();
        this.kp = wn * wn;
        this.kd = xi;
        gravity = sliderGravity.getValue() * 10000;
    },
    dynamics: function(state) {

        var x = state[0] - this.xTarget;
        var y = state[1] - this.yTarget;
        var dx = state[2];
        var dy = state[3];
        var r = this.distFromTarget();

        var dr_x = x*(x*dx + y*dy)/(r*r);
        var dr_y = y*(x*dx + y*dy)/(r*r);
        var dtheta_x = dx - dr_x;
        var dtheta_y = dy - dr_y;

        var ddx = 100*x * (this.poleLength - r) - 100*dr_x - this.kd * dtheta_x;
        var ddy = 100*y * (this.poleLength - r) - 100*dr_y - this.kd * dtheta_y + gravity;


        return [dx, dy, ddx, ddy];
    },

    distFromTarget: function() {
        return Math.sqrt((this.yTarget - this.y)*(this.yTarget - this.y) + (this.xTarget - this.x)*(this.xTarget - this.x));
    },
    polarVelocities: function(state) {
        var Vel_r = Math.sqrt()
    }
};

var formatLabelString = d3.format(".2f");

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

var sliderDamp = new Slider([160, 300], [.001, 2], "dampingRail", "#dampingCircle", "#dampingLabel");

var sliderGravity = new Slider([160, 300], [0, 1], "gravityRail", "#gravityCircle", "#gravityLabel",0.1);
//sliderGravity.scaleXToValue



d3.select("#target").call(
    d3.behavior.drag()
    .on("drag", function() {
        target.setCoords([d3.event.x, d3.event.y]);
        chaser.updateTarget();
    }));

//d3.select("#panelPtMass").on("click", function() {
//    var clickPos = d3.mouse(this);
//    target.setCoords(clickPos);
//    target.redraw();
//    // onMotionSettingChange(false);     // HACK: Should be done by directly changing the event!
//    // document.getElementById("MotionCheckboxId").checked = false;   // FAIL. This should work, but doesn't
//})





//ANIMATION LOOP:
var tLast = 0,
    dt = 0;
d3.timer(function(t) {
    dt = t - tLast;
    tLast = t;

    var nSubStep = 5;
    for (i = 0; i < nSubStep; i++) {
        chaser.timeStep(dt / nSubStep);
    }

    target.updateTarget();
    chaser.updateTarget();
    chaser.redraw();
    target.redraw();
    sliderDamp.redraw();
    sliderGravity.redraw();

});

function updateTargetMotion(value) {
    target.motionType = value;
}