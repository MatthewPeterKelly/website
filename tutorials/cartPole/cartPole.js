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

};

var cart = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
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
    timeStep: function(dt) {    },
    redraw: function() {
        d3.select("#cart")
            .attr("x", this.x - document.getElementById("cart").getAttribute("width")/2)
            .attr("y", this.y - document.getElementById("cart").getAttribute("height")/2);
    },
    motionType: "off",
    motionTime: 0,
    reset: function () {
        this.x = panelPtMass.width / 2 - 1 ;
        this.y = 3 * panelPtMass.height / 5;
        this.dx = 0;
        this.dy = 0;
        poleMass.updateCartPos();
    }
};


var poleMass = {
    x: 0,
    y: 0,
    xTarget: 0,
    yTarget: 0,
    dx: 0,
    dy: 0,
    ddx: 0,
    ddy: 0,
    kd: 1,
    theta:0,
    systematicThetaError:0,
    useRandomError: false,
    useSystematicError: false,
    poleLength: panelPtMass.height/4,
    redraw: function() {
        d3.select("#poleMass")
            .attr("cx", this.x)
            .attr("cy", this.y)
        d3.select("#pole")
            .attr("x1", this.x)
            .attr("y1", this.y)
            .attr("x2", this.xTarget)
            .attr("y2", this.yTarget)
        this.onRedraw();
    },
    onRedraw: function() {},
    timeStep: function(dt) {



        var newState = RungeKutta4Step([this.x, this.y, this.dx, this.dy], dt, this.dynamics.bind(this));

        this.x = newState[0];
        this.y = newState[1];
        this.dx = newState[2];
        this.dy = newState[3];

        //console.log(this.useRandomError);
        var error = (Math.random() - .5) * .03 * this.useRandomError + this.systematicThetaError * this.useSystematicError;
        this.theta = Math.atan2(poleMass.xTarget - poleMass.x, poleMass.yTarget - poleMass.y) + error;

    },
    updateCartPos: function(){
        this.xTarget = cart.getX();
        this.yTarget = cart.getY();
    },
    updateParams: function(kd) {
        this.kd = kd;
    },
    dynamics: function(state) {

        var x = state[0] - this.xTarget;
        var y = state[1] - this.yTarget;
        var dx = state[2];
        var dy = state[3];
        var r = this.distFromTarget();
        var poleDamping = 100;

        var dr_x = x*(x*dx + y*dy)/(r*r);
        var dr_y = y*(x*dx + y*dy)/(r*r);
        var dtheta_x = dx - dr_x;
        var dtheta_y = dy - dr_y;

        var ddx = 100*x * (this.poleLength - r) - poleDamping*dr_x - this.kd * dtheta_x;
        var ddy = 100*y * (this.poleLength - r) - poleDamping*dr_y - this.kd * dtheta_y + gravity;


        return [dx, dy, ddx, ddy];
    },

    distFromTarget: function() {
        return Math.sqrt((this.yTarget - this.y)*(this.yTarget - this.y) + (this.xTarget - this.x)*(this.xTarget - this.x));
    },

    reset: function () {
        this.x = panelPtMass.width / 2;
        this.y = (3 / 5 - 1 / 4) * panelPtMass.height;
        this.xTarget = cart.getX();
        this.yTarget = cart.getY();
        this.dx = 0;
        this.dy = 0;
        this.ddx = 0;
        this.ddy = 0;
        this.theta = 0;
        this.systematicThetaError = (Math.random()-0.5) * 0.003;
    }

};


var formatLabelString = d3.format(".2f");


function doOtherUpdates(){}

cart.reset();
poleMass.reset();



//ANIMATION LOOP:
var tLast = 0,
    dt = 0;
d3.timer(function(t) {
    /* When the page is not on the active tab in firefox, it suspends
     animation. When the page is viewed again, it will cause an
     extremely large time-step to occur. This is a simple fix. */
    dt = Math.min(t - tLast, 50)/1000;
    tLast = t;

    var nSubStep = 5;
    for (i = 0; i < nSubStep; i++) {
        poleMass.timeStep(dt / nSubStep);
        cart.timeStep(dt/nSubStep);
    }

    poleMass.updateCartPos();
    poleMass.redraw();
    cart.redraw();
    doOtherUpdates();

});

