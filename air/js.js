function calc_molar_volume_m3_mol(T, Tc, P, Pc, w) {

    // Calculate inputs (units: m3 Pa K mol)
    var R = 8.3144598;
    var Tr = T / Tc;

    // Calculate intermediaries
    var B0 = 0.083 - (0.422 / Math.pow(Tr, 1.6));
    var B1 = 0.139 - (0.172 / Math.pow(Tr, 4.2));
    var B = (R * Tc / Pc) * (B0 + (B1 * w));

    // Calculate quadratic parameters a=1.0, b, c
    var b = R * T / P;
    var c = B * b;

    // Solve quadratic formula, ax^2 + bx + c = 0
    var disc = Math.sqrt(b * b + 4.0 * c);
    var V = (b + disc) * 0.5;

    // Return solved volume
    return V;
}

function calculate() {

    // Get inputs
    var in_n2 = Number(document.getElementById("in_n2").value) / 100.0;
    var in_o2 = Number(document.getElementById("in_o2").value) / 100.0;
    var in_ar = Number(document.getElementById("in_ar").value) / 100.0;
    var in_co2 = Number(document.getElementById("in_co2").value) / 100.0;
    var in_temp_K = Number(document.getElementById("in_temperature").value) + 273.15;
    var in_press_Pa = Number(document.getElementById("in_pressure").value) * 101325.0;

    // Calculate outputs
    var n2_molar_vol_m3_mol = calc_molar_volume_m3_mol(in_temp_K, 126.19, in_press_Pa, 33.978 * 100000, 0.040);
    var o2_molar_vol_m3_mol = calc_molar_volume_m3_mol(in_temp_K, 154.58, in_press_Pa, 50.43 * 100000, 0.021);
    var ar_molar_vol_m3_mol = calc_molar_volume_m3_mol(in_temp_K, 150.86, in_press_Pa, 48.979 * 100000, -0.004);
    var co2_molar_vol_m3_mol = calc_molar_volume_m3_mol(in_temp_K, 304.18, in_press_Pa, 73.80 * 100000, 0.225);
    var molar_vol_m3_mol = (in_n2 * n2_molar_vol_m3_mol) + (in_o2 * o2_molar_vol_m3_mol) + (in_ar * ar_molar_vol_m3_mol) + (in_co2 * co2_molar_vol_m3_mol);
    var density_kg_m3 = (in_n2 * 28.0134 + in_o2 * 31.9988 + in_ar * 39.948 + in_co2 * 44.01) / (molar_vol_m3_mol * 1000.0);
    var molar_vol_L_mol = molar_vol_m3_mol * 1000.0;

    // Set output values
    document.getElementById("out_molar_volume_L_mol").value = molar_vol_L_mol.toFixed(4);
    document.getElementById("out_density_kg_m3").value = density_kg_m3.toFixed(4);

    // Return no form action
    return false;
}
