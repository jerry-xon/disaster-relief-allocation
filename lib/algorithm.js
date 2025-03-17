// lib/algorithm.js

// Greedy Allocation - prioritizes highest value first
export function greedyAllocation(resources, demands, capacity) {
  const sortedDemands = [...demands].sort((a, b) => b.value - a.value);
  const allocations = [];
  let totalCapacityLeft = capacity;

  sortedDemands.forEach((demand) => {
    const resource = resources.find(
      (res) =>
        res.name.toLowerCase() === demand.name.toLowerCase() && res.quantity > 0
    );

    if (resource && totalCapacityLeft > 0) {
      const allocatable = Math.min(
        demand.value,
        resource.quantity,
        totalCapacityLeft
      );
      allocations.push({
        demand: demand.name,
        resource: resource.name,
        allocated: allocatable,
      });

      resource.quantity -= allocatable;
      totalCapacityLeft -= allocatable;
    } else {
      allocations.push({
        demand: demand.name,
        resource: resource ? resource.name : "N/A",
        allocated: 0,
      });
    }
  });

  return allocations;
}





















// Knapsack Allocation (0/1 Knapsack adjusted for resource quantities)
export function knapsackAllocation(resources, demands, capacity) {
  const items = [];

  resources.forEach((res) => {
    for (let i = 0; i < res.quantity; i++) {
      items.push({
        name: res.name,
        value: res.value,
        weight: res.weight,
      });
    }
  });

  const n = items.length;
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
  const take = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(false));

  for (let i = 1; i <= n; i++) {
    const { value, weight } = items[i - 1];
    for (let w = 0; w <= capacity; w++) {
      if (weight <= w && dp[i - 1][w - weight] + value > dp[i - 1][w]) {
        dp[i][w] = dp[i - 1][w - weight] + value;
        take[i][w] = true;
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // Trace back selected items
  let w = capacity;
  const selected = [];
  for (let i = n; i > 0; i--) {
    if (take[i][w]) {
      selected.push(items[i - 1]);
      w -= items[i - 1].weight;
    }
  }

  const allocationMap = {};
  selected.forEach((item) => {
    const name = item.name.toLowerCase();
    allocationMap[name] = (allocationMap[name] || 0) + 1;
  });

  const finalAllocation = Object.entries(allocationMap).map(([name, qty]) => {
    const demandEntry = demands.find((d) => d.name.toLowerCase() === name);
    return {
      demand: demandEntry ? demandEntry.name : name,
      resource: name,
      allocated: qty,
    };
  });

  return finalAllocation;
}