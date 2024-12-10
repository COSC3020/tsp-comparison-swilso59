const fs = require('fs');

// Add timing and logging
function tsp_hk_with_runtime(distance_matrix) {
    const startTime = performance.now();
    const minTourLength = tsp_hk(distance_matrix);
    const endTime = performance.now();
    const runtime = endTime - startTime;

    console.log(`Held-Karp: Tour Length = ${minTourLength}, Runtime = ${runtime.toFixed(2)} ms`);
    return { tourLength: minTourLength, runtime };
}

function tsp_ls_with_runtime(distance_matrix) {
    const startTime = performance.now();
    const bestDistance = tsp_ls(distance_matrix);
    const endTime = performance.now();
    const runtime = endTime - startTime;

    console.log(`Local Search: Tour Length = ${bestDistance}, Runtime = ${runtime.toFixed(2)} ms`);
    return { tourLength: bestDistance, runtime };
}

function generateDistanceMatrix(size) {
    const matrix = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1)
    );
    for (let i = 0; i < size; i++) {
        for (let j = i; j < size; j++) {
            if (i === j) {
                matrix[i][j] = 0; // No self-loops
            } else {
                matrix[j][i] = matrix[i][j]; // Symmetric
            }
        }
    }
    return matrix;
}

// Main execution
const results = [];

for (let size = 1; size <= 19; size++) {
    console.log(`Generating matrix for size ${size}...`);
    const matrix = generateDistanceMatrix(size);

    console.log(`Running Held-Karp on ${size}x${size} matrix...`);
    const hkResult = tsp_hk_with_runtime(matrix);

    console.log(`Running Local Search on ${size}x${size} matrix...`);
    const lsResult = tsp_ls_with_runtime(matrix);

    results.push({
        size,
        heldKarp: hkResult,
        localSearch: lsResult
    });
}

console.table(results);

// Save results to CSV
const csvContent = [
    'Size,Held-Karp Runtime (ms),Held-Karp Tour Length,Local Search Runtime (ms),Local Search Tour Length',
    ...results.map(({ size, heldKarp, localSearch }) =>
        `${size},${heldKarp.runtime},${heldKarp.tourLength},${localSearch.runtime},${localSearch.tourLength}`
    )
].join('\n');

fs.writeFileSync('results.csv', csvContent);
console.log('Results saved to results.csv');

// Held-Karp Implementation
function tsp_hk(distance_matrix) {
    // Find the shortest path visiting all cities using Held-Karp algorithm.

    // If there are no cities or just one, return 0.
    if (distance_matrix.length <= 1) {
        return 0;
    }

    // Store results of subproblems.
    let cache = {};

    // List of city indices.
    let cities = [];
    for (let i = 0; i < distance_matrix.length; i++) {
        cities.push(i); // Add each city index to the list.
    }

    // Start with the largest possible value.
    let minTourLength = Infinity;

    // Try starting the tour from each city.
    for (let start = 0; start < cities.length; start++) {
        // Compute the shortest path starting from the current city.
        let tourLength = heldKarp(distance_matrix, start, cities, cache);

        // Update shortest path.
        minTourLength = Math.min(minTourLength, tourLength);
    }

    // Return the shortest tour length found.
    return minTourLength === Infinity ? 0 : minTourLength;
}

function heldKarp(distance_matrix, start, cities, cache) {
    // Create a unique key for memoization.
    let key = `${start}-[${cities.sort().join(",")}]`;

    // Return cached result if already computed.
    if (key in cache) {
        return cache[key];
    }

    // Base case: Only two cities remain.
    if (cities.length === 2) {
        // Find the remaining city.
        let otherCity = cities[0] === start ? cities[1] : cities[0];
        // Cache the direct distance.
        cache[key] = distance_matrix[start][otherCity];
        return cache[key];
    }

    // Start with the largest possible value.
    let shortestPath = Infinity;

    // Try all possible next cities.
    for (let nextCity of cities) {
        // Skip the current city.
        if (nextCity !== start) {
            // Exclude the current city from the list.
            let remainingCities = cities.filter(city => city !== start);

            // Add distance to next city and compute the shortest path recursively.
            let candidatePath = heldKarp(distance_matrix, nextCity, remainingCities, cache) 
                                + distance_matrix[start][nextCity];

            // Update the shortest path.
            shortestPath = Math.min(shortestPath, candidatePath);
        }
    }

    // Cache the result for reuse.
    cache[key] = shortestPath;
    return shortestPath;
}

// Local Search Implementation
function tsp_ls(distance_matrix) {
    // Handle edge cases
    if (!distance_matrix || distance_matrix.length === 0) {
        return 0; 
    }
    if (distance_matrix.length === 1) {
        return 0; 
    }
    if (distance_matrix.every(row => row.every(val => val === 0))) {
        return 0; 
    }

    // Create the initial ordered route
    const n = distance_matrix.length;
    let route = generateRandomRoute(n); 

    // Optimize the route using 2-opt
    const maxIterations = n * n; 
    const maxStagnation = Math.floor(maxIterations / 4); 
    const maxStagnationResets = 2; 

    let bestDistance = calculateDistance(route, distance_matrix);
    let stagnationCount = 0;
    let stagnationResetCount = 0;
    let iterations = 0;

    while (iterations < maxIterations && stagnationResetCount < maxStagnationResets) {
        let improvement = false;

        for (let i = 1; i < n - 1; i++) {
            for (let k = i + 1; k < n; k++) {
                const newRoute = twoOptSwap(route, i, k);
                const newDistance = calculateDistance(newRoute, distance_matrix);

                if (newDistance < bestDistance) {
                    route = newRoute;
                    bestDistance = newDistance;
                    improvement = true;
                }
            }
        }

        if (!improvement) {
            stagnationCount++;
            if (stagnationCount >= maxStagnation) {
                stagnationCount = 0;
                stagnationResetCount++;
                route = generateRandomRoute(n);
                bestDistance = calculateDistance(route, distance_matrix);
            }
        } else {
            stagnationCount = 0; 
        }

        iterations++;
    }

    return bestDistance;
}

function calculateDistance(route, distance_matrix) {
    let totalDistance = 0;

    for (let i = 0; i < route.length - 1; i++) {
        const fromCity = route[i];
        const toCity = route[i + 1];
        totalDistance += distance_matrix[fromCity][toCity];
    }
    return totalDistance; 
}

function twoOptSwap(route, i, k) {
    const newRoute = [
        ...route.slice(0, i),
        ...route.slice(i, k + 1).reverse(),
        ...route.slice(k + 1)
    ];
    return newRoute;
}

// Generates a random initial route for the given number of cities
function generateRandomRoute(n) {
    let route = [...Array(n).keys()]; // Create an array of city indices [0, 1, ..., n-1]
    for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); 
        [route[i], route[j]] = [route[j], route[i]]; 
    }
    return route;
}
