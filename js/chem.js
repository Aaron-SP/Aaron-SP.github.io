function antoine_water_bar(T) {
    var A, B, C;
    if (T > 344.0) {
        A = 5.08354;
        B = 1663.125;
        C = -45.622;
    }
    else if (T > 334.0) {
        A = 5.0768;
        B = 1659.793;
        C = -45.854;
    }
    else if (T > 304.0) {
        A = 5.20389;
        B = 1733.926;
        C = -39.485;
    }
    else {
        A = 5.40221;
        B = 1838.675;
        C = -31.737;
    }

    return Math.pow(10, A - (B / (T + C)));
}

function density_g_m3(Vm, mw) {
    return mw / Vm;
}

function density_kg_m3(Vm, mw) {
    return (mw / Vm) / 1000.0;
}

// Ai = sum(xj * Aij) / A
// Bi = bi / b
function fugacity(Z, A, B, ai, bi) {
    var r2 = Math.sqrt(2.0);
    var ln_fug_coeff = (bi * (Z - 1.0)) - Math.log(Z - B) - ((A / (2.0 * r2 * B)) * ((2.0 * ai) - bi) * Math.log((Z + (1.0 + r2) * B) / (Z + (1.0 - r2) * B)));
    return Math.exp(ln_fug_coeff);
}

function molar_volume(Z, P, T) {
    // Calculate inputs (units: m3 Pa K mol)
    var R = 8.3144598;
    var V = (Z * R * T) / P;

    // return the molar volume
    return V;
}

function newton_solve(x0, x1, f0, func) {

    // Solve equation equals zero
    var f1, dfdx;
    for (var j = 0; j < 100; j++) {

        // Calculate new F value
        try {
            f1 = func(x1);
        }
        catch (err) {
            return undefined;
        }

        // Calculate derivative
        dfdx = (f1 - f0) / (x1 - x0);

        // Tolerance reached, return boiling point
        if (Math.abs(f1) < 0.001) {
            return x1;
        }

        // Step next x value
        x0 = x1;
        f0 = f1;
        x1 = x1 - (f1 / dfdx);
    }
}

function sat_fugacity_coeff(Z, fL, P, Psat, T) {

    // Calculate inputs (units: m3 Pa K mol)
    var R = 8.3144598;
    var V = (Z * R * T) / P;
    var poynting_correction = Math.exp(V * (P - Psat) / (R * T));
    return fL / (Psat * poynting_correction);
}

function peng_robinson_solve(A, B, a_v, a_l, bi) {
    var out = [1.0, 1.0, 0.0, 0.0, false];

    // Solve polynomial equation, Z^3 + (B-1)*Z^2 + (A-3B^2-2B)*Z + (B^3+B^2-AB) = 0
    // Z^3 + C2*Z^2 + C1*Z + C0 = 0;
    var C2 = B - 1.0;
    var C1 = A - (3.0 * B * B) - (2.0 * B);
    var C0 = (B * B * B) + (B * B) - (A * B);
    var Q1 = (C2 * C1 / 6.0) - (C0 / 2.0) - (C2 * C2 * C2 / 27.0);
    var P1 = (C2 * C2 / 9.0) - (C1 / 3.0);
    var D = (Q1 * Q1) - (P1 * P1 * P1);

    // Check for various solutions
    if (D >= 0) {
        out[0] = Math.cbrt(Q1 + Math.sqrt(D)) + Math.cbrt(Q1 - Math.sqrt(D)) - (C2 / 3.0);

        // Flag one solution
        out[4] = false;
    }
    else {
        var t1 = (Q1 * Q1) / (P1 * P1 * P1);
        var t2 = Math.sqrt(1.0 - t1) / (Math.sqrt(t1) * (Q1 / Math.abs(Q1)));
        var theta = Math.atan(t2);

        // Three solutions vapor, liquid, other need to sort
        var Z0 = 2.0 * Math.sqrt(P1) * Math.cos(theta / 3) - (C2 / 3.0);
        var Z1 = 2.0 * Math.sqrt(P1) * Math.cos((theta + 2.0 * Math.PI) / 3.0) - (C2 / 3.0);
        var Z2 = 2.0 * Math.sqrt(P1) * Math.cos((theta + 4.0 * Math.PI) / 3.0) - (C2 / 3.0);

        // Assign largest root to vapor and lowest to liquid
        out[0] = Math.max(Math.max(Z0, Z1), Z2);
        out[2] = Math.min(Math.min(Z0, Z1), Z2);

        // Flag two solutions
        out[4] = true;
    }

    // Calculate pure fugacity coefficent for each phase
    out[1] = fugacity(out[0], A, B, a_v, bi);
    out[3] = fugacity(out[2], A, B, a_l, bi);

    // Return calculations
    return out;
}

function peng_robinson_pure(T, P, Tc, Pc, w) {

    // Calculate inputs (units: m3 Pa K mol)
    var R = 8.3144598;
    var Tr = T / Tc;

    // Calculate peng robinson constants
    var kappa = 0.37464 + (1.54226 * w) - (0.26992 * w * w);
    var a_sqrt = 1.0 + (kappa * (1.0 - Math.sqrt(Tr)));
    var alpha = a_sqrt * a_sqrt;
    var a = (0.45724 * R * R * Tc * Tc * alpha) / Pc;
    var b = (0.07780 * R * Tc) / Pc;
    var A = a * P / (R * R * T * T);
    var B = b * P / (R * T);

    // Return pure eos calculations
    var out = peng_robinson_solve(A, B, 1.0, 1.0, 1.0);

    // Calculate vapor and liquid fractions
    out.push(out[3] / out[1]);
    out.push(1.0 - out[5]);

    // Return calculations
    return out;
}

function peng_robinson_mix(T, P, Tc, Pc, w, z) {

    // Calculate inputs (units: m3 Pa K mol)
    var R = 8.3144598;

    var size = Tc.length;
    var Tr = new Array(size);
    var kappa = new Array(size);
    var alpha = new Array(size);
    var a = new Array(size);
    var b = new Array(size);
    var K = new Array(size);
    for (var i = 0; i < size; i++) {

        // Calculate reduced temperature
        Tr[i] = T / Tc[i];

        // Calculate peng robinson constants
        kappa[i] = 0.37464 + (1.54226 * w[i]) - (0.26992 * w[i] * w[i]);
        var a_sqrt = 1.0 + (kappa[i] * (1.0 - Math.sqrt(Tr[i])));
        alpha[i] = a_sqrt * a_sqrt;
        a[i] = (0.45724 * R * R * Tc[i] * Tc[i] * alpha[i]) / Pc[i];
        b[i] = (0.07780 * R * Tc[i]) / Pc[i];

        // Calculate pure component K value
        var Ai = a[i] * P / (R * R * T * T);
        var Bi = b[i] * P / (R * T);

        // Pure component K values, Fug_L / Fug_V
        var arr = peng_robinson_solve(Ai, Bi, 1.0, 1.0, 1.0);
        if (arr[4]) {
            K[i] = arr[3] / arr[1];
        }
        else {
            K[i] = 1000.0;
        }
    }

    // Calculate mixing rules
    var a_sum = 0.0, b_sum = 0.0;
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {

            // Binary interaction parameter, 0 for no interaction
            var kij = 0.0;

            // Calculate a mixing
            a_sum += z[i] * z[j] * (1.0 - kij) * Math.sqrt(a[i] * a[j]);
        }

        // Calculate b mixing
        b_sum += z[i] * b[i];
    }

    // Calculate mixture properties
    var A = a_sum * P / (R * R * T * T);
    var B = b_sum * P / (R * T);

    // Assume feed mol fraction is all vapor
    var x = new Array(size).fill(0.0);
    var y = z.slice();

    // Calculate if in two phase region
    var out = peng_robinson_solve(A, B, 1.0, 1.0, 1.0);
    var failed = true;
    var low_V = 0.0001;
    var high_V = 0.9999;
    if (out[4] && size > 1) {

        // Assume vapor fraction
        var V0 = 0.5, V1 = 0.5;

        // For k iterations
        for (var k = 0; k < 100; k++) {

            // Solve mol fractions
            var F_V = 0.0, dF_V = 0.0;
            for (var i = 0; i < size; i++) {

                var km1 = K[i] - 1.0;
                var denom = V1 * km1 + 1.0;

                x[i] = z[i] / denom;
                y[i] = K[i] * x[i];
                F_V += x[i] * km1;
                dF_V += (z[i] * (km1 * km1) * -1.0) / (denom * denom);
            }

            // Update the K values
            // for (var i = 0; i < size; i++) {

            //     // Return pure eos calculations
            //     var a_v = 0.0, a_l = 0.0;
            //     for (var j = 0; j < size; j++) {

            //         // Binary interaction parameter, 0 for no interaction
            //         var kij = 0.0;

            //         // Calculate a mixing for vapor and liquid
            //         a_v += y[i] * y[j] * (1.0 - kij) * Math.sqrt(a[i] * a[j]);
            //         a_l += x[i] * x[j] * (1.0 - kij) * Math.sqrt(a[i] * a[j]);
            //     }

            //     a_v = a_v / a_sum;
            //     a_l = a_l / a_sum;

            //     // Update the K values
            //     var arr = peng_robinson_solve(A, B, a_v, a_l, b[i] / b_sum);
            //     if (arr[4]) {
            //         K[i] = arr[3] / arr[1];
            //     }
            //     else {
            //         K[i] = 1000.0;
            //     }
            // }

            // Tolerance reached, return boiling point
            if (Math.abs(F_V) < 1E-6) {
                out.push(V1);
                out.push(1.0 - V1);
                out.push(y);
                out.push(x);
                failed = false;
                break;
            }
            else if (V1 <= low_V) {
                out.push(0.0);
                out.push(1.0);
                out.push(new Array(size).fill(0.0));
                out.push(z.slice());
                failed = false;
                break;
            }
            else if (V1 >= high_V) {
                out.push(1.0);
                out.push(0.0);
                out.push(z.slice());
                out.push(new Array(size).fill(0.0));
                failed = false;
                break;
            }

            // Step vapor fraction
            V0 = V1;
            V1 = V1 - F_V / dF_V;

            // Bound vapor fraction
            if (V1 <= low_V) {
                V1 = 0.0;
            }
            else if (V1 >= high_V) {
                V1 = 1.0;
            }
        }
    }

    // Fallback feed is all vapor
    if (failed) {
        out.push(1.0);
        out.push(0.0);
        out.push(z.slice());
        out.push(new Array(size).fill(0.0));
    }

    // Return calculations
    return out;
}
