/**
 * Created by bsaund on 6/9/15.
 */



function onMotionSettingChange(checked) {
    document.getElementById("motionDiv").style.display = checked ? "" : "none";
    if(!checked) {
        updateTargetMotion("off");
    } else {
        onMotionSettingSelected();
    }
}

function onMotionSettingSelected(){
    var checkedRadioButton = document.querySelector('input[name="MotionType"]:checked');
    if(checkedRadioButton) {
        updateTargetMotion(checkedRadioButton.value);
    }
}

function targetMotion(target) {
    var w = panelPtMass.width;
    var h = panelPtMass.height;
    var t = target.motionTime;
    var coords;
    switch (target.motionType) {
        case "off":
            return;
        case "sinusoid":
            target.setCoords([w / 2 + w / 4 * Math.sin(t), h / 2]);
            break;
        case "circle":
            target.setCoords([w / 2 + h / 4 * Math.sin(t),
                h / 2 + h / 4 * Math.cos(t)]);
            break;
        case "jump":
            target.setCoords([w/4 + w/2 * Math.floor(t%2), h/2]);
            break;
    }
    target.motionTime = target.motionTime + .03;
}


function onGravityChange(checked) {
    gravity = 10000 * checked
}


sliderDamp.onRedraw = function() {
    var dampingDisplay = document.getElementById("dampingLevelDescription");
    if (!dampingDisplay) {
        return;
    }
    var dampingDescriptionName = this.value < .95 ? "underDampedDescription" :
        this.value > 1.05 ? "overDampedDescription" : "criticallyDampedDescription";

    dampingDisplay.innerHTML = document.getElementById(dampingDescriptionName).innerHTML;


    setAll("kdValue", chaser.kd);
    setAll("xiValue", sliderDamp.getValue());

};

sliderFreq.onRedraw = function() {
    //document.getElementsByClassName("kpValue")[0].innerHTML = chaser.kp.toFixed(2);
    setAll("kpValue", chaser.kp);
    setAll("wnValue", sliderFreq.getValue());
    setAll("kdValue", chaser.kd)
};

function setAll(classname, value) {
    var elements = document.getElementsByClassName(classname)
    for(var i in elements){
        elements[i].innerHTML = value.toFixed(2);
    }

}








//onMotionSettingSelected();
