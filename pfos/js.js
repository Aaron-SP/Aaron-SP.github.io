function calculate() {

    // Get inputs
    var in_exposure_ug_L = Number(document.getElementById("in_exp_ug_L").value);
    var in_bcf_L_kg = Number(document.getElementById("in_bcf_L_kg").value);
    var in_bmf = Number(document.getElementById("in_bmf").value);

    // Calculate exposure in mg/L
    var exposure_mg_L = in_exposure_ug_L / 1000.0;

    // Calculate blood serum concentration in mg/kg
    var blood_mg_kg = (in_bcf_L_kg * in_bmf) * exposure_mg_L;

    // Convert to ppb (ug/kg)
    var blood_ppb = blood_mg_kg * 1000.0;

    // Set output values
    document.getElementById("out_ppb").value = blood_ppb.toFixed(1);

    // Return no form action
    return false;
}
