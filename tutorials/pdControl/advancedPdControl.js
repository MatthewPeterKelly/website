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
                h / 2 + h / 4 * Math.cos(t)])
            break;
        case "jump":
            target.setCoords([w/4 + w/2 * Math.floor(t%2), h/2]);
            break;
    };
    target.motionTime = target.motionTime + .03;
}


function onGravityChange(checked) {
    gravity = 10000 * checked
}




//onMotionSettingSelected();
