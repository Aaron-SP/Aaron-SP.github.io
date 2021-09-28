let species = ["Argon", "Bromine", "Chlorine", "Fluorine", "Helium-4", "Hydrogen", "Iodine", "Krypton", "Neon", "Nitrogen", "Oxygen", "Xenon", "Acetylene", "Benzene", "n-Butane", "1-Butene", "Cyclobutane", "Cyclohexane", "Cyclopropane", "Ethane", "Ethylene", "n-Heptane", "n-Hexane", "Isobutane", "Isobutylene", "Isopentane", "Methane", "Naphthalene", "n-Octane", "n-Pentane", "Propadiene", "Propane", "Propylene", "Toluene", "m-Xylene", "o-Xylene", "p-Xylene", "Ammonia", "Carbon dioxide", "Carbon disulfide", "Carbon monoxide", "Carbon tetrachloride", "Carbon tetrafluoride", "Chloroform", "Hydrazine", "Hydrogen chloride", "Hydrogen fluoride", "Hydrogen sulfide", "Nitric oxide", "Nitrous oxide", "Sulfur dioxide", "Sulfur trioxide", "Water", "Acetaldehyde", "Acetic acid", "Acetone", "Acetonitrile", "Aniline", "n-Butanol", "Chlorobenzene", "Dichlorodifluoromethane", "Diethyl ether", "Dimethyl ether", "Ethanol", "Ethylene oxide", "Isobutanol", "Isopropyl alcohol", "Methanol", "Methyl chloride", "Methyl ethyl ketone", "Phenol", "1-Propanol", "Pyridine", "Trichlorotrifluoroethane", "Trichlorofluoromethane", "Trimethylamine"];
let pc_bar = [48.7, 103, 79.8, 52.2, 2.27, 12.9, 116.5, 55, 27.6, 33.9, 50.4, 58.4, 61.4, 48.9, 38, 40.2, 49.9, 40.7, 54.9, 48.8, 50.4, 27.4, 30.1, 36.5, 40, 33.9, 46, 40.5, 24.9, 33.7, 54.7, 42.5, 46, 41, 35.4, 37.3, 35.1, 113.5, 73.8, 79, 35, 45.6, 37.4, 53.7, 147, 83.1, 64.8, 89.4, 64.8, 72.4, 78.8, 82.1, 221.2, 55.7, 57.9, 47, 48.3, 53.1, 44.2, 45.2, 41.4, 36.4, 52.4, 61.4, 71.9, 43, 47.6, 80.9, 67, 42.1, 61.3, 51.7, 56.3, 34.1, 44.1, 40.9];
let tc_K = [150.8, 588, 416.9, 144.3, 5.19, 33, 819, 209.4, 44.4, 126.2, 154.6, 289.7, 308.3, 562.1, 425.2, 419.6, 460, 553.8, 397.8, 305.4, 282.4, 540.3, 507.5, 408.2, 417.9, 460.4, 190.4, 748.4, 568.8, 469.7, 393, 369.8, 364.9, 591.8, 617.1, 630.3, 616.2, 405.5, 304.1, 552, 132.9, 556.4, 227.6, 536.4, 653, 324.7, 461, 373.2, 180, 309.6, 430.8, 491, 647.3, 461, 592.7, 508.1, 545.5, 699, 563.1, 632.4, 385, 466.7, 400, 513.9, 469, 547.8, 508.3, 512.6, 416.3, 536.8, 694.2, 536.8, 620, 487.3, 471.2, 433.3];
let w = [0.001, 0.108, 0.09, 0.054, -0.365, -0.216, 0.229, 0.005, -0.029, 0.039, 0.025, 0.008, 0.19, 0.212, 0.199, 0.191, 0.181, 0.212, 0.13, 0.099, 0.089, 0.349, 0.299, 0.183, 0.194, 0.227, 0.011, 0.302, 0.398, 0.251, 0.313, 0.153, 0.144, 0.263, 0.325, 0.31, 0.32, 0.25, 0.239, 0.109, 0.066, 0.193, 0.177, 0.218, 0.316, 0.133, 0.329, 0.081, 0.588, 0.165, 0.256, 0.481, 0.344, 0.303, 0.447, 0.304, 0.278, 0.384, 0.593, 0.249, 0.204, 0.281, 0.2, 0.644, 0.202, 0.592, 0.665, 0.556, 0.153, 0.32, 0.438, 0.623, 0.243, 0.256, 0.189, 0.205];
let mol_weight = [39.948, 159.808, 70.9, 37.997, 4.003, 2.016, 253.809, 83.798, 20.18, 28.014, 31.998, 131.293, 26.038, 78.114, 58.124, 56.108, 56.108, 84.162, 42.081, 30.07, 28.054, 100.205, 86.178, 58.124, 56.108, 72.151, 16.043, 128.174, 114.232, 72.151, 40.065, 44.097, 42.081, 92.141, 106.168, 106.168, 106.168, 17.031, 44.009, 76.131, 28.01, 153.811, 88.005, 119.369, 32.046, 36.458, 20.006, 34.076, 30.006, 44.013, 64.058, 80.057, 18.015, 44.053, 60.052, 58.08, 41.053, 93.129, 74.123, 112.556, 120.908, 74.123, 46.069, 46.069, 44.053, 74.123, 60.096, 32.042, 50.485, 72.107, 94.113, 60.096, 79.102, 187.367, 137.359, 59.112];

function add_rows(tbody, rows, count) {

    // Create a document fragment
    let fragment = document.createDocumentFragment();

    // Get last row in table to clone
    let row_clone = tbody.rows[tbody.rows.length - 1];

    // For each row clone last row
    for (let i = rows; i < rows + count; i++) {

        // Create clone of row
        let clone = row_clone.cloneNode(true);

        // Set the row attribute
        clone.setAttribute("id", "row" + i.toString());

        // Set the mol% to 0.0
        clone.getElementsByClassName("in_mol_percent")[0].value = 0.0;

        // Set selected species
        let select_index = row_clone.getElementsByClassName("in_id")[0].selectedIndex;

        // Set the critical properties
        clone.getElementsByClassName("in_id")[0].selectedIndex = select_index;
        clone.getElementsByClassName("in_pc_bar")[0].value = pc_bar[select_index];
        clone.getElementsByClassName("in_tc_K")[0].value = tc_K[select_index];
        clone.getElementsByClassName("in_w")[0].value = w[select_index];

        // Add clone to the fragment
        fragment.appendChild(clone);
    }

    // Add rows to the table
    tbody.appendChild(fragment);
}

function delete_rows(tbody, count) {

    // Delete all rows from back
    for (let i = 0, row = tbody.getElementsByTagName("tr").length - 1; i < count; i++ , row--) {
        tbody.deleteRow(row);
    }
}

function select_species(select) {

    // Get the row id
    let row_id = select.parentElement.parentElement.getAttribute("id");

    // Parse row index from id
    let split = row_id.split("row");
    if (split.length != 2) {
        throw "select_species: row_id is not splittable";
    }

    // Get the row index
    let row_index = split[1];

    // Get the table
    let table = document.getElementById("pr_table");

    // Get the table body
    let tbody = table.getElementsByTagName("tbody")[0];

    // Get the table row
    let row = tbody.rows[row_index];

    // Get the species id
    let species_id = Number(select.value);

    // Set the critical properties
    row.getElementsByClassName("in_pc_bar")[0].value = pc_bar[species_id];
    row.getElementsByClassName("in_tc_K")[0].value = tc_K[species_id];
    row.getElementsByClassName("in_w")[0].value = w[species_id];
}

function set_rows() {

    // Get the table
    let table = document.getElementById("pr_table");

    // Get the table body
    let tbody = table.getElementsByTagName("tbody")[0];

    // Get number of rows
    let rows = tbody.getElementsByTagName("tr").length;

    // Create new rows
    let in_count = Number(document.getElementById("in_count").value);
    if (in_count > rows) {

        // Number of rows to add
        let count = in_count - rows;

        // Add rows
        add_rows(tbody, rows, count);
    }
    else if (in_count < rows) {

        // Number of rows to delete
        let count = rows - in_count;

        // Delete rows
        delete_rows(tbody, count);
    }
}

function format(out) {
    if (out == undefined) {
        return out;
    }
    if (out >= 0.1 && out <= 1000000.0) {
        return out.toFixed(3);
    }

    return out.toExponential(3);
}

function calculate_eos_pure(eos_pure, in_temp_K, in_press_Pa, mw, set) {

    // Solve the eos func
    let arr = eos_pure(in_temp_K);
    let v_mol_vol = molar_volume(arr[0], in_press_Pa, in_temp_K);
    let l_mol_vol = molar_volume(arr[2], in_press_Pa, in_temp_K);

    // Set vapor properties
    set.getElementsByClassName("out_vm_v")[0].value = format(v_mol_vol);
    set.getElementsByClassName("out_rho_v")[0].value = format(density_kg_m3(v_mol_vol, mw));

    // Set liquid properties and solve equation
    if (arr[4]) {
        set.getElementsByClassName("out_vm_l")[0].value = format(l_mol_vol);
        set.getElementsByClassName("out_rho_l")[0].value = format(density_kg_m3(l_mol_vol, mw));

        // Newton func zero
        let f0 = (arr[1] / arr[3]) - 1.0;
        let f_zero = function (T_K) {

            // Test for bad input   
            if (T_K < 0.0) {
                throw "BP zero failed";
            }

            // Solve zero function
            let arr = eos_pure(T_K);

            // No two phase so set bp to NaN
            if (!arr[4]) {
                throw "BP zero failed";
            }

            return (arr[1] / arr[3]) - 1.0;
        }
        set.getElementsByClassName("out_bp_K")[0].value = format(newton_solve(in_temp_K, in_temp_K + 0.001, f0, f_zero, 100));
    }
    else {
        set.getElementsByClassName("out_vm_l")[0].value = undefined;
        set.getElementsByClassName("out_rho_l")[0].value = undefined;
        set.getElementsByClassName("out_bp_K")[0].value = undefined;
    }
}

function calculate_eos_mix(eos_mix, in_temp_K, in_press_Pa, z, mw, tbody, tfoot) {

    // Solve the eos func 
    let arr = eos_mix(in_temp_K);
    let v_mol_vol = molar_volume(arr[0], in_press_Pa, in_temp_K);
    let l_mol_vol = molar_volume(arr[2], in_press_Pa, in_temp_K);

    // Calculate liquid and vapor mw
    let y = arr[7], x = arr[8];
    let mw_v = 0.0, mw_l = 0.0;
    let size = z.length;
    for (let i = 0; i < size; i++) {
        mw_v += y[i] * mw[i];
        mw_l += x[i] * mw[i];
    }

    // Set vapor/liquid mol fractions
    let rows = tbody.rows.length;
    for (let i = 0; i < rows; i++) {

        // Get the table row
        let row = tbody.rows[i];
        row.getElementsByClassName("out_y")[0].value = format(arr[7][i] * 100.0);
        row.getElementsByClassName("out_x")[0].value = format(arr[8][i] * 100.0);
    }

    // Set vapor and liquid fractions
    tfoot.getElementsByClassName("out_y")[0].value = format(arr[5] * 100.0);
    tfoot.getElementsByClassName("out_x")[0].value = format(arr[6] * 100.0);

    // Set vapor properties
    tfoot.getElementsByClassName("out_vm_v")[0].value = format(v_mol_vol);
    tfoot.getElementsByClassName("out_rho_v")[0].value = format(density_kg_m3(v_mol_vol, mw_v));

    // Set liquid properties
    if (arr[4]) {
        tfoot.getElementsByClassName("out_vm_l")[0].value = format(l_mol_vol);
        tfoot.getElementsByClassName("out_rho_l")[0].value = format(density_kg_m3(l_mol_vol, mw_l));
        tfoot.getElementsByClassName("out_bp_K")[0].value = undefined;
    }
    else {
        tfoot.getElementsByClassName("out_vm_l")[0].value = undefined;
        tfoot.getElementsByClassName("out_rho_l")[0].value = undefined;
        tfoot.getElementsByClassName("out_bp_K")[0].value = undefined;
    }
}

function calculate() {

    // Get inputs
    let in_temp_K = Number(document.getElementById("in_temperature").value) + 273.15;
    let in_press_atm = Number(document.getElementById("in_pressure").value);
    let in_press_Pa = in_press_atm * 101325.0;

    // Get the table
    let table = document.getElementById("pr_table");

    // Get the table body
    let tbody = table.getElementsByTagName("tbody")[0];

    // Get number of rows
    let rows = tbody.getElementsByTagName("tr").length;

    let pc = new Array(rows);
    let tc = new Array(rows);
    let w = new Array(rows);
    let mw = new Array(rows);
    let z = new Array(rows);

    // Calculate for each row
    let z_sum = 0.0;
    for (let i = 0; i < rows; i++) {

        // Get the table row
        let row = tbody.rows[i];

        // Get the critical properties
        pc[i] = Number(row.getElementsByClassName("in_pc_bar")[0].value) * 100000.0;
        tc[i] = Number(row.getElementsByClassName("in_tc_K")[0].value);
        w[i] = Number(row.getElementsByClassName("in_w")[0].value);
        mw[i] = mol_weight[Number(row.getElementsByClassName("in_id")[0].value)];
        z[i] = Number(row.getElementsByClassName("in_mol_percent")[0].value) / 100.0;
        z_sum += z[i];

        // Lambda
        let pure_func = function (T_K) {
            return peng_robinson_pure(T_K, in_press_Pa, tc[i], pc[i], w[i]);
        };

        // Solve the pure fluid
        calculate_eos_pure(pure_func, in_temp_K, in_press_Pa, mw[i], row);
    }

    // Normalize z inputs
    for (let i = 0; i < rows; i++) {

        // Get the table row
        let row = tbody.rows[i];

        // Normalize mol fraction and update form
        z[i] /= z_sum;
        row.getElementsByClassName("in_mol_percent")[0].value = (z[i] * 100.0).toFixed(4);
    }

    // Get the table footer
    let tfoot = table.getElementsByTagName("tfoot")[0];

    // Lambda
    let mix_func = function (T_K) {
        return peng_robinson_mix(T_K, in_press_Pa, tc, pc, w, z);
    };

    // Solve the mixed fluid
    calculate_eos_mix(mix_func, in_temp_K, in_press_Pa, z, mw, tbody, tfoot);

    // Return no form action
    return false;
}
