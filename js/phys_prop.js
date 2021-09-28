// Data from https://webbook.nist.gov/chemistry/fluid/

let water_mw = 18.01528;
let n2_mw = 28.0134;
let o2_mw = 31.998;

// Water
function rho_water(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (-2.5450902371E-05 * temp_K3) + (3.4194880147E-02 * temp_K2) + (-1.8709594965E+01 * temp_K) + (-4.3122264716E+05 * inv_temp_K) + 5.6564879932E+03;
}
function vm_water(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (5.4198881736E-13 * temp_K3) + (-7.0207477566E-10 * temp_K2) + (3.7004682674E-07 * temp_K) + (8.1164633425E-03 * inv_temp_K) - 7.1438566439E-05;
}
function u_water(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (-1.0222394272E-07 * temp_K3) + (1.5661774765E-04 * temp_K2) + (-1.1564609350E-02 * temp_K) + (-1.8466611218E+03 * inv_temp_K) + 3.1713505744E-01;
}
function h_water(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (-1.0017708670E-07 * temp_K3) + (1.5389160791E-04 * temp_K2) + (-1.0205246672E-02 * temp_K) + (-1.8218750440E+03 * inv_temp_K) + 1.8607659632E-02;
}
function s_water(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (-3.2305303380E-07 * temp_K3) + (3.7001789176E-04 * temp_K2) + (-3.6883379790E-02 * temp_K) + (-1.3785874313E+04 * inv_temp_K) + 3.9520149342E+01;
}
function cv_water(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (-3.2146920677E-08 * temp_K3) + (6.6499466456E-04 * temp_K2) + (-7.8326370226E-01 * temp_K) + (-2.8816514277E+04 * inv_temp_K) + 3.4645981936E+02;
}
function cp_water(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (1.3657860932E-05 * temp_K3) + (-1.8158164974E-02 * temp_K2) + (9.0948286512E+00 * temp_K) + (1.7045120461E+05 * inv_temp_K) - 1.9558362360E+03;
}
function mew_water(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (7.7034298871E-09 * temp_K3) + (-1.0537876064E-05 * temp_K2) + (5.4176759298E-03 * temp_K) + (1.0747292604E+02 * inv_temp_K) - 1.2422792740E+00;
}
function k_water(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (1.9743358882E-07 * temp_K3) + (-2.6581525823E-04 * temp_K2) + (1.3164426134E-01 * temp_K) + (2.1414764226E+03 * inv_temp_K) - 2.7428565255E+01;
}
function pr_water(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (cp_water(inv_temp_K, temp_K, temp_K2, temp_K3) * (1000.0 / water_mw)) * mew_water(inv_temp_K, temp_K, temp_K2, temp_K3) / k_water(inv_temp_K, temp_K, temp_K2, temp_K3);
}
function gr_water(inv_temp_K, temp_K, temp_K2, temp_K3, temp_inf_K, temp_surf_K, L_m) {
    let c = (213085.677083424 * temp_K3) + (-245124986.458458 * temp_K2) + (108135567574.543 * temp_K) + (1647165460113411 * inv_temp_K) - 21619581798247;
    return c * Math.abs(temp_surf_K - temp_inf_K) * L_m * L_m * L_m;
}
function ra_water(inv_temp_K, temp_K, temp_K2, temp_K3, temp_inf_K, temp_surf_K, L_m) {
    return pr_water(inv_temp_K, temp_K, temp_K2, temp_K3) * gr_water(inv_temp_K, temp_K, temp_K2, temp_K3, temp_inf_K, temp_surf_K, L_m);
}
function re_water(inv_temp_K, temp_K, temp_K2, temp_K3, v, L_m) {
    return (rho_water(inv_temp_K, temp_K, temp_K2, temp_K3) * v * L_m) / mew_water(inv_temp_K, temp_K, temp_K2, temp_K3);
}

// N2
function rho_n2(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (1.6035938382E-09 * temp_K3) + (-2.1379248978E-06 * temp_K2) + (1.0795026148E-03 * temp_K) + (3.6296798296E+02 * inv_temp_K) - 2.4646668994E-01;
}
function vm_n2(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (4.9711342566E-12 * temp_K3) + (-5.7598179625E-09 * temp_K2) + (8.4493457694E-05 * temp_K) + (1.1721886634E-02 * inv_temp_K) - 3.9009169818E-04;
}
function u_n2(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (9.6584618358E-10 * temp_K3) + (-1.2865462517E-07 * temp_K2) + (2.0470687694E-02 * temp_K) + (-1.6516806562E+01 * inv_temp_K) + 1.2306989173E-01;
}
function h_n2(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (8.7502520221E-09 * temp_K3) + (-1.0037907873E-05 * temp_K2) + (3.3495342515E-02 * temp_K) + (5.9650639561E+01 * inv_temp_K) - 8.6267005092E-01;
}
function s_n2(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (-7.4437847331E-08 * temp_K3) + (6.1920376548E-05 * temp_K2) + (3.2245908550E-02 * temp_K) + (-4.3138360942E+03 * inv_temp_K) + 1.9280470973E+02;
}
function cv_n2(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (6.7803336802E-09 * temp_K3) + (5.8083868973E-06 * temp_K2) + (-6.8278035563E-03 * temp_K) + (-1.7445421523E+02 * inv_temp_K) + 2.2742767455E+01;
}
function cp_n2(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (6.0856672682E-10 * temp_K3) + (1.3416632004E-05 * temp_K2) + (-1.0135076924E-02 * temp_K) + (-1.8311158781E+02 * inv_temp_K) + 3.1599099963E+01;
}
function mew_n2(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (-2.9114147214E-15 * temp_K3) + (-1.5019373287E-11 * temp_K2) + (5.1505732328E-08 * temp_K) + (-3.9071125444E-04 * inv_temp_K) + 5.1783185980E-06;
}
function k_n2(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (1.0423415761E-10 * temp_K3) + (-1.4473901069E-07 * temp_K2) + (1.2829018026E-04 * temp_K) + (2.4545687111E-01 * inv_temp_K) - 3.2346130144E-03;
}
function pr_n2(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (cp_n2(inv_temp_K, temp_K, temp_K2, temp_K3) * (1000.0 / n2_mw)) * mew_n2(inv_temp_K, temp_K, temp_K2, temp_K3) / k_n2(inv_temp_K, temp_K, temp_K2, temp_K3);
}
function gr_n2(inv_temp_K, temp_K, temp_K2, temp_K3, temp_inf_K, temp_surf_K, L_m) {
    let c = (34.3278048780506 * temp_K3) + (-58977.3832752641 * temp_K2) + (38318070.5574928 * temp_K) + (1282787560975.64 * inv_temp_K) - 11257362317.0736;
    return c * Math.abs(temp_surf_K - temp_inf_K) * L_m * L_m * L_m;
}
function ra_n2(inv_temp_K, temp_K, temp_K2, temp_K3, temp_inf_K, temp_surf_K, L_m) {
    return pr_n2(inv_temp_K, temp_K, temp_K2, temp_K3) * gr_n2(inv_temp_K, temp_K, temp_K2, temp_K3, temp_inf_K, temp_surf_K, L_m);
}
function re_n2(inv_temp_K, temp_K, temp_K2, temp_K3, v, L_m) {
    return (rho_n2(inv_temp_K, temp_K, temp_K2, temp_K3) * v * L_m) / mew_n2(inv_temp_K, temp_K, temp_K2, temp_K3);
}

// O2
function rho_o2(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (5.7818328670E-10 * temp_K3) + (-8.4874092456E-07 * temp_K2) + (4.7917883435E-04 * temp_K) + (4.0277526057E+02 * inv_temp_K) - 1.2490626466E-01;
}
function vm_o2(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (-5.5766657968E-12 * temp_K3) + (7.3052974880E-09 * temp_K2) + (7.8440923431E-05 * temp_K) + (-8.5169944807E-02 * inv_temp_K) + 8.4612945421E-04;
}
function u_o2(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (5.4914431559E-09 * temp_K3) + (-1.4714889230E-06 * temp_K2) + (2.0167002213E-02 * temp_K) + (-2.9963819744E+01 * inv_temp_K) + 2.6765307932E-01;
}
function h_o2(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (3.2905721268E-09 * temp_K3) + (1.2924728340E-06 * temp_K2) + (2.7180902779E-02 * temp_K) + (-5.3122867564E+01 * inv_temp_K) + 5.4407812391E-01;
}
function s_o2(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (4.5127668727E-07 * temp_K3) + (-6.2537722914E-04 * temp_K2) + (3.7139172394E-01 * temp_K) + (1.7855404810E+03 * inv_temp_K) + 1.3193247102E+02;
}
function cv_o2(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (-8.1995546922E-08 * temp_K3) + (1.1922778384E-04 * temp_K2) + (-5.0259439570E-02 * temp_K) + (-5.1743426429E+02 * inv_temp_K) + 2.9364507534E+01;
}
function cp_o2(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (-8.4218699763E-08 * temp_K3) + (1.2103688948E-04 * temp_K2) + (-5.0423641242E-02 * temp_K) + (-4.5832330324E+02 * inv_temp_K) + 3.7470613430E+01;
}
function mew_o2(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (2.0820919616E-15 * temp_K3) + (-2.4231911991E-11 * temp_K2) + (6.5020415665E-08 * temp_K) + (-3.6484708113E-04 * inv_temp_K) + 4.3960124771E-06;
}
function k_o2(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (-2.6788179453E-11 * temp_K3) + (5.1688206540E-08 * temp_K2) + (4.5921830656E-05 * temp_K) + (-9.7565864867E-01 * inv_temp_K) + 1.2204167268E-02;
}
function pr_o2(inv_temp_K, temp_K, temp_K2, temp_K3) {
    return (cp_o2(inv_temp_K, temp_K, temp_K2, temp_K3) * (1000.0 / o2_mw)) * mew_o2(inv_temp_K, temp_K, temp_K2, temp_K3) / k_o2(inv_temp_K, temp_K, temp_K2, temp_K3);
}
function gr_o2(inv_temp_K, temp_K, temp_K2, temp_K3, temp_inf_K, temp_surf_K, L_m) {
    let c = (34.2508943089449 * temp_K3) + (-58834.5052264837 * temp_K2) + (38213516.4924523 * temp_K) + (1276779512195.16 * inv_temp_K) - 11219691463.415;
    return c * Math.abs(temp_surf_K - temp_inf_K) * L_m * L_m * L_m;
}
function ra_o2(inv_temp_K, temp_K, temp_K2, temp_K3, temp_inf_K, temp_surf_K, L_m) {
    return pr_o2(inv_temp_K, temp_K, temp_K2, temp_K3) * gr_o2(inv_temp_K, temp_K, temp_K2, temp_K3, temp_inf_K, temp_surf_K, L_m);
}
function re_o2(inv_temp_K, temp_K, temp_K2, temp_K3, v, L_m) {
    return (rho_o2(inv_temp_K, temp_K, temp_K2, temp_K3) * v * L_m) / mew_o2(inv_temp_K, temp_K, temp_K2, temp_K3);
}

function nu_free_vertical_plate(Ra, Pr) {

    let nu = 0.0;

    // Calculate natural convection of vertical plate
    if (Ra < Math.pow(10, 9)) {
        let num = 0.670 * Math.pow(Ra, 0.25);
        let denom = Math.pow(1.0 + Math.pow(0.492 / Pr, 9.0 / 16.0), 4.0 / 9.0);
        nu = 0.68 + (num / denom);
    }
    else {
        let num = 0.387 * Math.pow(Ra, 1.0 / 6.0);
        let denom = Math.pow(1.0 + Math.pow(0.492 / Pr, 9.0 / 16.0), 8.0 / 27.0);
        let nu_sqrt = 0.825 + (num / denom);
        nu = nu_sqrt * nu_sqrt;
    }

    // Return the nusselt number, accurate for laminar and turbulent flow
    return nu;
}

function nu_forced_flat_plate(Re, Pr) {
    return 0.664 * Math.pow(Pr, 1.0 / 3.0) * Math.pow(Re, 0.5);
}
