function calculate() {
    // Get inputs
    var in_cl_conc_mgL = Number(document.getElementById("in_cl_conc_mgL").value);
    var in_mix_vol_gal = Number(document.getElementById("in_mix_vol_gal").value);
    var in_tank_vol_gal = Number(document.getElementById("in_tank_vol_gal").value);
    var in_thio_g = Number(document.getElementById("in_thio_g").value);

    // Calculate outputs
    var thio_conc_g_m3 = in_thio_g / (in_mix_vol_gal / 264.172);
    var cl_conc_g_m3 = in_cl_conc_mgL;
    var cl_g = cl_conc_g_m3 * (in_tank_vol_gal / 264.172);
    var cl_mol = cl_g / 35.453;

    // Best case molar ratio = 0.25
    // Reactions from http://www.vita-d-chlor.com/specs/awwarfdechlorguides.pdf
    // 1.) Na_2S_2O_3 + 4 * HOCl + H2O -> 2 * NaHSO_4 + 4 * HCl
    // 2.) Na_2S_2O_3 + HOCl -> Na_2SO_4 + S + HCl
    // 3.) 2 * Na_2S_2O_3 + HOCl -> Na_2S_4O_6 + NaCl + NaOH

    // Ratio should be between 0.25 and 0.5, implying 2x safety factor
    var mol_ratio = 0.5;
    var thio_mol = cl_mol * mol_ratio;
    var thio_g = thio_mol * 248.172;
    var out_vol_m3 = thio_g / thio_conc_g_m3;
    var out_vol_ml = out_vol_m3 * 1000000.0;

    // Set output values
    document.getElementById("out_cl_mol").value = cl_mol.toPrecision(4);
    document.getElementById("out_cl_g").value = cl_g.toPrecision(4);
    document.getElementById("out_thio_mol").value = thio_mol.toPrecision(4);
    document.getElementById("out_thio_g").value = thio_g.toPrecision(4);
    document.getElementById("out_vol_ml").value = out_vol_ml.toPrecision(4);

    // Return no form action
    return false;
}
