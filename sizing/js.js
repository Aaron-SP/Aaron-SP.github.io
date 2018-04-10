function calculate() {
    var in_temp_1_degC = Number(document.getElementById("in_temperature1").value);
    var in_temp_2_degC = Number(document.getElementById("in_temperature2").value);
    var in_volume_gal = Number(document.getElementById("in_volume_gal").value);
    var in_volume_m3 = in_volume_gal / 264.172;
    var in_heat_W = Number(document.getElementById("in_heat_W").value);

    // Calculate regression constants
    var in_temp_1_K = in_temp_1_degC + 273.15;
    var in_inv_temp_1_K = 1.0 / in_temp_1_K;
    var in_temp_1_K2 = in_temp_1_K * in_temp_1_K;
    var in_temp_1_K3 = in_temp_1_K2 * in_temp_1_K;

    // Calculate regression constants
    var in_temp_2_K = in_temp_2_degC + 273.15;
    var in_inv_temp_2_K = 1.0 / in_temp_2_K;
    var in_temp_2_K2 = in_temp_2_K * in_temp_2_K;
    var in_temp_2_K3 = in_temp_2_K2 * in_temp_2_K;

    // Calculate outputs
    var water_density_kg_m3 = rho_water(in_inv_temp_1_K, in_temp_1_K, in_temp_1_K2, in_temp_1_K3);
    var water_mass_g = water_density_kg_m3 * in_volume_m3 * 1000.0;
    var water_mol = water_mass_g / 18.01528;
    var water_dU_kJ = (u_water(in_inv_temp_2_K, in_temp_2_K, in_temp_2_K2, in_temp_2_K3) - u_water(in_inv_temp_1_K, in_temp_1_K, in_temp_1_K2, in_temp_1_K3)) * water_mol;
    var water_dU_kWh = water_dU_kJ * 0.000277778;
    var time_s = (water_dU_kJ * 1000.0) / in_heat_W;
    var time_h = time_s / 3600.0;

    // Set output values
    document.getElementById("out_water_energy_change_kJ").value = water_dU_kJ.toFixed(2);
    document.getElementById("out_water_energy_change_kWh").value = water_dU_kWh.toFixed(2);
    document.getElementById("out_time_h").value = time_h.toFixed(2);

    // Return no form action
    return false;
}
