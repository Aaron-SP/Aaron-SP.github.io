function calculate() {
    // Get inputs
    var in_ppt_g_kg = Number(document.getElementById("in_ppt_g_kg").value);
    var in_temp_K = Number(document.getElementById("in_temperature").value) + 273.15;
    var in_vol_gal = Number(document.getElementById("in_vol_gal").value);
    var in_vol_m3 = in_vol_gal / 264.172;
    var in_salt_g_mL = Number(document.getElementById("in_salt_g_mL").value);

    // Calculate regression constants
    var in_inv_temp_K = 1.0 / in_temp_K;
    var in_temp_K2 = in_temp_K * in_temp_K;
    var in_temp_K3 = in_temp_K2 * in_temp_K;

    // Calculate weight of solution
    var water_density_kg_m3 = rho_water(in_inv_temp_K, in_temp_K, in_temp_K2, in_temp_K3);
    var water_kg = water_density_kg_m3 * in_vol_m3;
    var salt_g = in_ppt_g_kg * water_kg / (1.0 - in_ppt_g_kg / 1000.0);
    var salt_ml = salt_g / in_salt_g_mL; // g / (cm^3=ml)
    var salt_tbsp = salt_ml * 0.067628;
    var salt_cup = salt_tbsp * 0.0625;

    // Set output values
    document.getElementById("out_salt_g").value = salt_g.toFixed(2);
    document.getElementById("out_salt_ml").value = salt_ml.toFixed(2);
    document.getElementById("out_salt_tbsp").value = salt_tbsp.toFixed(2);
    document.getElementById("out_salt_cup").value = salt_cup.toFixed(2);

    // Return no form action
    return false;
}
