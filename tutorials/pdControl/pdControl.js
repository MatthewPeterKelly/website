//This page is for variable and function definitions

/*
 Returns the input clipped my min and max values
 */
function bound(value, min, max) {
	return Math.max(Math.min(value,max),min);
}

var panelPtMass = {
	width: parseInt(document.getElementById("panelPtMass").style.width),
	height: parseInt(document.getElementById("panelPtMass").style.height),
	svg: d3.select("#panelPtMass"),
//		init: function() {
//		d3.select("#panelPtMass").append("circle")
//		.attr("id","chaser")
//		.attr("class","circle")
//		.arrt("r,6");
//		d3.select("#panelPtMass").append("circle")
//		.attr("id","target")
//		.attr("class","handle")
//		.arrt("r,14");
//		}
};
//panelPtMass.init();

var target = {
	x: 300,
	y: 125,
	getX: function() {
		return this.x;
	},
	getY: function() {
		return this.y;
	},
	setX: function(x) {
		this.x = bound(x,0,panelPtMass.width);
	},
	setY: function(y) {
		this.y = bound(y,0,panelPtMass.height);
	},
	setCoords: function(x, y) {
		this.setX(x);
		this.setY(y);
	},
	redraw: function() {
		d3.select("#target")
			.attr("cx", this.x)
			.attr("cy", this.y)
	},
};

var chaser = {
	x: 400,
	y: 300,
	xTarget: 300,
	yTarget: 125,
	dx: -450,
	dy: -150,
	ddx: 0,
	ddy: 0,
	kp: 5,
	kd: 1,
	redraw: function() {
		d3.select("#chaser")
			.attr("cx", this.x)
			.attr("cy", this.y)
	},
	timeStep: function(dt) {

		/* When the page is not on the active tab in firefox, it suspends
		 animation. When the page is viewed again, it will cause an
		 extremely large time-step to occur. This is a simple fix. */
		if (dt > 50) {
			dt = 50;
		}

		dt = dt / 1000;
		var s1 = [this.x, this.y, this.dx, this.dy];
		var k1 = this.dynamics(s1);
		var s2 = [
			s1[0] + 0.5 * dt * k1[0],
			s1[1] + 0.5 * dt * k1[1],
			s1[2] + 0.5 * dt * k1[2],
			s1[3] + 0.5 * dt * k1[3]
		];
		var k2 = this.dynamics(s2);
		var s3 = [
			s1[0] + 0.5 * dt * k2[0],
			s1[1] + 0.5 * dt * k2[1],
			s1[2] + 0.5 * dt * k2[2],
			s1[3] + 0.5 * dt * k2[3]
		];
		var k3 = this.dynamics(s3);
		var s4 = [
			s1[0] + dt * k3[0],
			s1[1] + dt * k3[1],
			s1[2] + dt * k3[2],
			s1[3] + dt * k3[3]
		];
		var k4 = this.dynamics(s4);

		this.x = s1[0] + (dt / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
		this.y = s1[1] + (dt / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
		this.dx = s1[2] + (dt / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]);
		this.dy = s1[3] + (dt / 6) * (k1[3] + 2 * k2[3] + 2 * k3[3] + k4[3]);
	},
	updateTarget: function() {
		this.xTarget = target.getX();
		this.yTarget = target.getY();
		var wn = 2 * Math.PI * sliderFreq.getValue();
		var xi = sliderDamp.getValue();
		this.kp = wn * wn;
		this.kd = 2 * wn * xi;
	},
	dynamics: function(state) {
		var x = state[0];
		var y = state[1];
		var dx = state[2];
		var dy = state[3];
		var ddx = this.kp * (this.xTarget - x) - this.kd * dx;
		var ddy = this.kp * (this.yTarget - y) - this.kd * dy;
		return [dx, dy, ddx, ddy];
	}
};

var formatLabelString = d3.format(".2f");

/*
 Define a slider class
 */
function Slider(domain, range, sliderName, circleName, labelName, initialValue) {
	this.x = 0;
	this.y = document.getElementById(sliderName).getAttribute("y2");
	this.value = initialValue ? initialValue : 1;

	this.xRange = domain;
	this.valueRange = range;

	this.scaleXToValue = d3.scale.linear()
		.domain(this.xRange)
		.range(this.valueRange);
	this.scaleValueToX = d3.scale.linear()
		.domain(this.valueRange)
		.range(this.xRange);


	this.getValue = function() {return this.value};
	this.setValue = function(value) {
		this.setX(this.scaleValueToX(value));
	}
	this.setX = function(x) {
		this.x = bound(x, this.xRange[0], this.xRange[1]);
		this.value = this.scaleXToValue(this.x);
	}
	this.redraw = function() {
		d3.select(circleName)
			.attr("cx", this.x)
			.attr("cy", this.y);
		d3.select(labelName)
			.text(formatLabelString(this.value))
			.attr("x", this.x);
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

var sliderFreq = new Slider([160, 300], [1, 5], "frequencyRail", "#frequencyCircle", "#frequencyLabel", 3);
//sliderFreq.scaleXToValue



d3.select("#target").call(
	d3.behavior.drag()
		.on("drag", function() {
			target.setCoords(d3.event.x, d3.event.y);
			chaser.updateTarget();
		}));

d3.select("#panelPtMass").on("click", function() {
	var clickPos = d3.mouse(this);
	target.setCoords(clickPos[0], clickPos[1]);
	target.redraw();
})

var lineSmooth = d3.svg.line()
	.interpolate("monotone")
	.x(function(d) {
		return x(d[0]);
	})
	.y(function(d) {
		return y(d[1]);
	});


var stepResponse = {
	tLow: 0,
	tUpp: 4.0,
	data: new Array(100),

	xi: 0.1,
	wn: 2.0,
	x0: 1.0,
	v0: 0.0,

	xScale: d3.scale.linear()
		.domain([0, 4.0])
		.range([350, 800]),

	yScale: d3.scale.linear()
		.domain([-1.0, 1.0])
		.range([140, 10]),

	myDataCurve: function(t) {

		if (this.xi < 1.0) { // Underdamped

			var sigma = this.wn * this.xi;
			var wd = this.wn * Math.sqrt(1 - this.xi * this.xi);
			var alpha = this.x0 / 2;
			var beta = -(this.v0 + sigma * this.x0) / (2 * wd);
			var x = 2 * Math.exp(-sigma * t) * (alpha * Math.cos(wd * t) - beta * Math.sin(wd * t));
			return this.yScale(x);
		}

		if (this.xi == 1.0) { // Critically damped
			var c1 = this.x0;
			var c2 = this.v0 + this.wn * this.x0;
			var x = c1 * Math.exp(-this.wn * t) + c2 * t * Math.exp(-this.wn * t);
			return this.yScale(x);
		}

		if (this.xi > 1.0) { // Overdamped
			var s1 = -(this.xi - Math.sqrt(this.xi * this.xi - 1)) * this.wn;
			var s2 = -(this.xi + Math.sqrt(this.xi * this.xi - 1)) * this.wn;
			var c1 = (this.v0 + this.x0 * s2) / (s2 - s1);
			var c2 = -(this.v0 + this.x0 * s1) / (s2 - s1);
			var x = c1 * Math.exp(s1 * t) + c2 * Math.exp(s2 * t);
			return this.yScale(x);
		}

	},

	buildData: function() {
		var nData = this.data.length;
		var shift = this.tLow;
		var slope = (this.tUpp - this.tLow) / (nData - 1);
		for (var i = 0; i < nData; i++) {
			var t = shift + i * slope;
			this.data[i] = [this.xScale(t), this.myDataCurve(t)];
		}
	},

	redraw: function() {
		this.wn = sliderFreq.getValue();
		this.xi = sliderDamp.getValue();
		this.buildData();
		d3.select("#panelTwo").select(".curve")
			.attr("d", smoothCurve(this.data));
	}
}

var smoothCurve = d3.svg.line()
	.x(function(d) {
		return d[0];
	})
	.y(function(d) {
		return d[1];
	})
	.interpolate("monotone");

//Initialize the step response curve
d3.select("#panelTwo").append("path")
	.attr("class", "curve");

stepResponse.buildData();


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

	chaser.updateTarget();
	chaser.redraw();
	target.redraw();
	sliderDamp.redraw();
	sliderFreq.redraw();
	stepResponse.redraw();
});