/**
 * Created by bsaund on 6/9/15.
 */



function onMotionSettingChange(checked) {
    document.getElementById("motionDiv").style.display = checked ? "" : "none";
    if(!checked) {
        updateTargetMotion("off");
    }
}

function onMotionSettingSelected(){
    updateTargetMotion(document.querySelector('input[name="MotionType"]:checked').value);
}





//onMotionSettingSelected();
