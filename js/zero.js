function newton_solve(x0, x1, f0, func, iter) {

    // Solve equation equals zero
    let f1, dfdx;
    for (let j = 0; j < iter; j++) {

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

    return undefined;
}
