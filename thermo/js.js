function calculate() {
    var in_temp_degC = Number(document.getElementById("in_temperature").value);

    // Calculate regression constants
    var in_temp_K = in_temp_degC + 273.15;
    var in_inv_temp_K = 1.0 / in_temp_K;
    var in_temp_K2 = in_temp_K * in_temp_K;
    var in_temp_K3 = in_temp_K2 * in_temp_K;

    // Calculate outputs
    var water_rho = rho_water(in_inv_temp_K, in_temp_K, in_temp_K2, in_temp_K3);
    var water_U = U_water(in_inv_temp_K, in_temp_K, in_temp_K2, in_temp_K3);
    var water_H = H_water(in_inv_temp_K, in_temp_K, in_temp_K2, in_temp_K3);
    var water_S = S_water(in_inv_temp_K, in_temp_K, in_temp_K2, in_temp_K3);
    var water_Cv = Cv_water(in_inv_temp_K, in_temp_K, in_temp_K2, in_temp_K3);
    var water_Cp = Cp_water(in_inv_temp_K, in_temp_K, in_temp_K2, in_temp_K3);
    var water_mew = mew_water(in_inv_temp_K, in_temp_K, in_temp_K2, in_temp_K3);
    var water_k = k_water(in_inv_temp_K, in_temp_K, in_temp_K2, in_temp_K3);

    // Set output values
    document.getElementById("out_water_density").value = water_rho.toPrecision(6);
    document.getElementById("out_water_internal_energy").value = water_U.toPrecision(6);
    document.getElementById("out_water_enthalpy").value = water_H.toPrecision(6);
    document.getElementById("out_water_entropy").value = water_S.toPrecision(6);
    document.getElementById("out_water_cv").value = water_Cv.toPrecision(6);
    document.getElementById("out_water_cp").value = water_Cp.toPrecision(6);
    document.getElementById("out_water_viscosity").value = water_mew.toPrecision(6);
    document.getElementById("out_water_thermal_cond").value = water_k.toPrecision(6);

    // Return no form action
    return false;
}
