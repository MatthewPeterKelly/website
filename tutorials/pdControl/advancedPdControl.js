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





//onMotionSettingSelected();
