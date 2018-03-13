function calc_h(ph) {
    // Calculate [H+] concentration in mol/L
    return Math.pow(10, ph * -1.0);
}

function calc_ka(ph, temp) {
    // Calculate acid dissociation constant for ammonium ion
    var temp2 = temp * temp;
    var temp3 = temp2 * temp;
    return Math.pow(10, (7.3038073E-09 * temp3 + 1.0482751E-04 * temp2 - 3.6111593E-02 * temp + 1.0081515E+01) * -1.0);
}

function fish_status(nh3_ppm) {
    // Calculate the fish status message based on nh3 ppm level
    if (nh3_ppm > 0.5) {
        return "Immediate water change required. Fish are dead.";
    }
    else if (nh3_ppm > 0.2) {
        return "Immediate water change required. Fish will die soon.";
    }
    else if (nh3_ppm > 0.05) {
        return "Immediate water change required. Fish will die in a few days.";
    }
    else if (nh3_ppm > 0.02) {
        return "Immediate water change required. Fish have compromised immune systems!";
    }
    else if (nh3_ppm > 0.01) {
        return "Water change soon. Fish will begin to be highly stressed out!";
    }
    else {
        return "No action needed.";
    }
}

function water_change(nh3_ppm) {
    // Calculate percentage of water needed to change out
    if (nh3_ppm > 0.01) {

        // Calculate water change percent
        var percent = (1.0 - 0.01 / nh3_ppm) * 100.0;

        // Return message
        return "At least a " + percent.toPrecision(3) + "% water changes is required.";
    }

    // Return message
    return "No water changed required.";
}

function calculate() {
    // Get inputs
    var in_nh3 = Number(document.getElementById("in_nh3").value);
    var ph = Number(document.getElementById("in_ph").value);
    var temp = Number(document.getElementById("in_temperature").value);

    // Calculate outputs
    var ka = calc_ka(ph, temp);
    var h_molL = calc_h(ph);
    var in_nh3_molL = in_nh3 / 17031;
    var nh4_molL = in_nh3_molL * h_molL / (ka + h_molL);
    var nh3_molL = in_nh3_molL - nh4_molL;
    var nh3_ppm = nh3_molL * 17031;
    var status = fish_status(nh3_ppm);
    var percent_change = water_change(nh3_ppm);

    // Set output values
    document.getElementById("out_ka").value = ka.toExponential(5);
    document.getElementById("out_h_molL").value = h_molL.toExponential(5);
    document.getElementById("out_nh4_molL").value = nh4_molL.toExponential(5);
    document.getElementById("out_nh3_molL").value = nh3_molL.toExponential(5);
    document.getElementById("out_nh3_ppm").value = nh3_ppm.toPrecision(5);
    document.getElementById("out_fish_status").innerHTML = status;
    document.getElementById("out_water_change").innerHTML = percent_change;

    // Return no form action
    return false;
}
