// Constants from http://www-naweb.iaea.org/napc/ih/documents/global_cycle/vol%20I/cht_i_09.pdf
function calc_k0(in_temp) {
    return Math.pow(10.0, ((-2622.38 / in_temp) - (0.0178471 * in_temp) + 15.5873) * -1.0);
}

function calc_k1(in_temp) {
    return Math.pow(10.0, ((3404.71 / in_temp) + (0.032786 * in_temp) - 14.8435) * -1.0);
}

function calc_k2(in_temp) {
    return Math.pow(10.0, ((2902.39 / in_temp) + (0.02379 * in_temp) - 6.4980) * -1.0);
}

function calc_h(in_ph) {
    // Calculate [H+] concentration in mol/L
    return Math.pow(10, in_ph * -1.0);
}

function format(out) {
    if (out >= 0.1 && out <= 1000000.0) {
        return out.toFixed(3);
    }

    return out.toExponential(3);
}

function calculate() {
    // Get inputs
    var in_ph = Number(document.getElementById("in_ph").value);
    var in_temp_K = Number(document.getElementById("in_temperature").value) + 273.15;
    var in_co2_molar = Number(document.getElementById("in_co2_molar").value) / 100.0;

    // Calculate equilibrium constants
    var k0 = calc_k0(in_temp_K);
    var k1 = calc_k1(in_temp_K);
    var k2 = calc_k2(in_temp_K);

    // Calculate Henry's Law
    var h = calc_h(in_ph);
    var pp_co2_atm = in_co2_molar * 1.0;
    var conc_h2co3_mol_L = k0 * pp_co2_atm;
    var conc_hco3_mol_L = k1 * conc_h2co3_mol_L / h;
    var conc_co3_mol_L = k2 * conc_hco3_mol_L / h;

    // Calculate output concentrations
    var conc_h2co3_mg_L = conc_h2co3_mol_L * (1000.0 * 62.024);
    var conc_hco3_mg_L = conc_hco3_mol_L * (1000.0 * 61.0168);
    var conc_co3_mg_L = conc_co3_mol_L * (1000.0 * 60.008);

    // Calculate alkalinity and water hardness
    var alkalinity_mmol_L = (conc_hco3_mol_L + conc_co3_mol_L * 2.0) * 1000.0;
    var kh_mg_L = (conc_hco3_mol_L * 0.5 + conc_co3_mol_L) * 100.0869 * 1000.0;
    var dkh = kh_mg_L / 17.848;

    // Set output values
    document.getElementById("out_k0").value = format(k0);
    document.getElementById("out_k1").value = format(k1);
    document.getElementById("out_k2").value = format(k2);
    document.getElementById("out_h2co3_mg_L").value = format(conc_h2co3_mg_L);
    document.getElementById("out_hco3_mg_L").value = format(conc_hco3_mg_L);
    document.getElementById("out_co3_mg_L").value = format(conc_co3_mg_L);
    document.getElementById("out_alkalinity_mmol_L").value = format(alkalinity_mmol_L);
    document.getElementById("out_kh_mg_L").value = format(kh_mg_L);
    document.getElementById("out_dkh").value = format(dkh);

    // Return no form action
    return false;
}
