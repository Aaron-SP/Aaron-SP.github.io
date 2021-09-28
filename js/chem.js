let MAX_K = 1000000.0;
let MIN_K = 1.0 / MAX_K;

class stream {
    constructor(z) {
        let size = z.length;
        this.z = z.slice();
        this.x = new Array(size);
        this.y = new Array(size);
        this.K = new Array(size);
        this.V = 0.5;
    }

    get size() {
        return this.z.length;
    }
    get vapor_frac() {
        return this.V;
    }
    set vapor_frac(V) {
        this.V = V;
    }
}

function antoine_water_bar(T) {
    let A, B, C;
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

function flash_update(s, F) {

    // Calculate vapor/liquid mol fractions
    let size = s.size;
    F[0] = 0.0, F[1] = 0.0;
    let x_sum = 0.0, y_sum = 0.0;
    for (let i = 0; i < size; i++) {

        let km1 = s.K[i] - 1.0;
        let denom = s.vapor_frac * km1 + 1.0;

        s.x[i] = Math.min(s.z[i] / denom, 1.0);
        x_sum += s.x[i];
        s.y[i] = Math.min(s.K[i] * s.x[i], 1.0);
        y_sum += s.y[i];

        // F(V) == 0
        F[0] += s.x[i] * km1;

        // dF(V)/dV
        F[1] += (s.z[i] * (km1 * km1) * -1.0) / (denom * denom);
    }

    // Normalize x and y values
    for (let i = 0; i < size; i++) {
        s.x[i] /= x_sum;
        s.y[i] /= y_sum;
    }
}
function flash(s, iter, tol, func) {

    // Get the number of components
    let size = s.size;

    let low_V = tol, high_V = 1.0 - tol;
    let F = [0.0, 0.0];
    for (let i = 0; i < iter; i++) {

        // Custom update function if supplied
        if (!func != true) {
            func(s);
        }

        // Solve mol fractions
        flash_update(s, F);

        // Test for convergence
        if (Math.abs(F[0]) < tol) {
            break;
        }

        // Step vapor fraction
        let step = (F[0] / F[1]);
        let V = s.vapor_frac - step;

        // Backtrack solution if overflow
        let count = 0;
        while (V <= low_V || V >= high_V) {

            // Increment step
            count++;

            // Adjust step to avoid overflow
            step *= 0.5;
            V = s.vapor_frac - step;

            // Bail out
            if (count == iter) {
                break;
            }
        }

        // Assign new vapor fraction
        s.vapor_frac = V;

        // Bound vapor fraction
        if (s.vapor_frac <= low_V) {
            s.vapor_frac = 0.0;
            flash_update(s, F);
            s.y.fill(0.0);
            break;
        }
        else if (s.vapor_frac >= high_V) {
            s.vapor_frac = 1.0;
            flash_update(s, F);
            s.x.fill(0.0);
            break;
        }
    }

    return F[0];
}

// Ai = sum(xj * Aij) / A
// Bi = bi / b
function fugacity(Z, A, B, ai, bi) {
    let r2 = Math.sqrt(2.0);
    let ln_fug_coeff = (bi * (Z - 1.0)) - Math.log(Z - B) - ((A / (2.0 * r2 * B)) * ((2.0 * ai) - bi) * Math.log((Z + (1.0 + r2) * B) / (Z + (1.0 - r2) * B)));
    return Math.exp(ln_fug_coeff);
}

function molar_volume(Z, P, T) {
    // Calculate inputs (units: m3 Pa K mol)
    let R = 8.3144598;
    let V = (Z * R * T) / P;

    // return the molar volume
    return V;
}

function sat_fugacity_coeff(Z, fL, P, Psat, T) {

    // Calculate inputs (units: m3 Pa K mol)
    let R = 8.3144598;
    let V = (Z * R * T) / P;
    let poynting_correction = Math.exp(V * (P - Psat) / (R * T));
    return fL / (Psat * poynting_correction);
}

function peng_robinson_solve(A, B, a_v, a_l, bi) {
    let out = [1.0, 1.0, 0.0, 0.0, false];

    // Solve polynomial equation, Z^3 + (B-1)*Z^2 + (A-3B^2-2B)*Z + (B^3+B^2-AB) = 0
    // Z^3 + C2*Z^2 + C1*Z + C0 = 0;
    let C2 = B - 1.0;
    let C1 = A - (3.0 * B * B) - (2.0 * B);
    let C0 = (B * B * B) + (B * B) - (A * B);
    let Q1 = (C2 * C1 / 6.0) - (C0 / 2.0) - (C2 * C2 * C2 / 27.0);
    let P1 = (C2 * C2 / 9.0) - (C1 / 3.0);
    let D = (Q1 * Q1) - (P1 * P1 * P1);

    // Check for various solutions
    if (D >= 0) {
        out[0] = Math.cbrt(Q1 + Math.sqrt(D)) + Math.cbrt(Q1 - Math.sqrt(D)) - (C2 / 3.0);

        // Flag one solution
        out[4] = false;
    }
    else {
        let t1 = (Q1 * Q1) / (P1 * P1 * P1);
        let t2 = Math.sqrt(1.0 - t1) / (Math.sqrt(t1) * (Q1 / Math.abs(Q1)));
        let theta = Math.atan(t2);

        // Three solutions vapor, liquid, other need to sort
        let Z0 = 2.0 * Math.sqrt(P1) * Math.cos(theta / 3) - (C2 / 3.0);
        let Z1 = 2.0 * Math.sqrt(P1) * Math.cos((theta + 2.0 * Math.PI) / 3.0) - (C2 / 3.0);
        let Z2 = 2.0 * Math.sqrt(P1) * Math.cos((theta + 4.0 * Math.PI) / 3.0) - (C2 / 3.0);

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
    let R = 8.3144598;
    let Tr = T / Tc;

    // Calculate peng robinson constants
    let kappa = 0.37464 + (1.54226 * w) - (0.26992 * w * w);
    let a_sqrt = 1.0 + (kappa * (1.0 - Math.sqrt(Tr)));
    let alpha = a_sqrt * a_sqrt;
    let a = (0.45724 * R * R * Tc * Tc * alpha) / Pc;
    let b = (0.07780 * R * Tc) / Pc;
    let A = a * P / (R * R * T * T);
    let B = b * P / (R * T);

    // Return pure eos calculations
    let out = peng_robinson_solve(A, B, 1.0, 1.0, 1.0);

    // Calculate vapor and liquid fractions
    out.push(out[3] / out[1]);
    out.push(1.0 - out[5]);

    // Return calculations
    return out;
}

function peng_robinson_mix(T, P, Tc, Pc, w, z) {

    // Calculate inputs (units: m3 Pa K mol)
    let R = 8.3144598;

    let size = Tc.length;
    let Tr = new Array(size);
    let kappa = new Array(size);
    let alpha = new Array(size);
    let a = new Array(size);
    let b = new Array(size);

    // Create a stream for flashing
    let s = new stream(z);

    for (let i = 0; i < size; i++) {

        // Calculate reduced temperature
        Tr[i] = T / Tc[i];

        // Calculate peng robinson constants
        kappa[i] = 0.37464 + (1.54226 * w[i]) - (0.26992 * w[i] * w[i]);
        let a_sqrt = 1.0 + (kappa[i] * (1.0 - Math.sqrt(Tr[i])));
        alpha[i] = a_sqrt * a_sqrt;
        a[i] = (0.45724 * R * R * Tc[i] * Tc[i] * alpha[i]) / Pc[i];
        b[i] = (0.07780 * R * Tc[i]) / Pc[i];

        // Calculate pure component K value
        let Ai = a[i] * P / (R * R * T * T);
        let Bi = b[i] * P / (R * T);

        // Pure component K values, Fug_L / Fug_V
        let arr = peng_robinson_solve(Ai, Bi, 1.0, 1.0, 1.0);
        if (arr[4]) {
            s.K[i] = Math.max(Math.min(arr[3] / arr[1], MAX_K), MIN_K);
        }
        else {
            s.K[i] = MAX_K;
        }
    }

    // Calculate mixing rules
    let a_sum = 0.0, b_sum = 0.0;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {

            // Binary interaction parameter, 0 for no interaction
            let kij = 0.0;

            // Calculate a mixing
            a_sum += z[i] * z[j] * (1.0 - kij) * Math.sqrt(a[i] * a[j]);
        }

        // Calculate b mixing
        b_sum += z[i] * b[i];
    }

    // Calculate mixture properties
    let A = a_sum * P / (R * R * T * T);
    let B = b_sum * P / (R * T);

    // Calculate if in two phase region
    let out = peng_robinson_solve(A, B, 1.0, 1.0, 1.0);
    let tol = 1E-10;
    let low_V = tol;
    let high_V = 1.0 - tol;
    let iter = 100;

    // Converge Vapor fraction with pure component K values
    s.vapor_frac = 0.5;
    let error = flash(s, iter, tol, null);

    // Custom update function for mixture fugacities
    let func = function (s) {

        // Update the K values
        let size = s.size;
        for (let i = 0; i < size; i++) {

            // Return pure eos calculations
            let a_v = 0.0, a_l = 0.0;
            for (let j = 0; j < size; j++) {

                // Binary interaction parameter, 0 for no interaction
                let kij = 0.0;

                // Calculate a mixing for vapor and liquid
                a_v += s.y[i] * s.y[j] * (1.0 - kij) * Math.sqrt(a[i] * a[j]);
                a_l += s.x[i] * s.x[j] * (1.0 - kij) * Math.sqrt(a[i] * a[j]);
            }

            a_v = a_v / a_sum;
            a_l = a_l / a_sum;

            // Update the K values
            out = peng_robinson_solve(A, B, a_v, a_l, b[i] / b_sum);
            if (out[4]) {
                s.K[i] = Math.max(Math.min(out[3] / out[1], MAX_K), MIN_K);
            }
            else {
                s.K[i] = MAX_K;
            }
        }
    };

    // Converge Vapor fraction with mixed component K values
    error = flash(s, iter, tol, func);

    // Alert that error is above tolerance
    if (Math.abs(error) > tol) {
        alert("Two phase solution failed with error: " + format(error));
    }

    // Return two phase calculation results
    out.push(s.vapor_frac);
    out.push(1.0 - s.vapor_frac);
    out.push(s.y);
    out.push(s.x);

    // Return calculations
    return out;
}
