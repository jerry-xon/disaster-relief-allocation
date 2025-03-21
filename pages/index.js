import React, { useState } from "react";
import Card from "../Component/ui/Card";
import Button from "../Component/ui/Button";
import Input from "../Component/ui/Input";
import { greedyAllocation, knapsackAllocation } from "../lib/algorithm";

export default function Home() {
  const [resources, setResources] = useState([{ name: "", quantity: "" }]);
  const [demands, setDemands] = useState([{ name: "", value: "" }]);
  const [results, setResults] = useState([]);
  const [method, setMethod] = useState("");
  const [capacity, setCapacity] = useState("");

  const handleResourceChange = (index, field, value) => {
    const updated = [...resources];
    updated[index][field] = value;
    setResources(updated);
  };

  const handleDemandChange = (index, field, value) => {
    const updated = [...demands];
    updated[index][field] = value;
    setDemands(updated);
  };

  const addResource = () =>
    setResources([...resources, { name: "", quantity: "" }]);
  const addDemand = () => setDemands([...demands, { name: "", value: "" }]);

  const runCombinedAllocation = () => {
    if (!capacity || isNaN(capacity)) {
      alert("Please enter a valid capacity.");
      return;
    }

    const cap = Number(capacity);

    const resCopy = resources.map((r) => ({
      ...r,
      quantity: Number(r.quantity),
    }));

    const demCopy = demands.map((d) => ({
      ...d,
      value: Number(d.value),
    }));

    // Run Greedy
    const greedyResults = greedyAllocation(
      [...resCopy.map((r) => ({ ...r }))],
      demCopy,
      cap
    );

    // Expand resources for knapsack
    const demandMap = {};
    demCopy.forEach((d) => {
      demandMap[d.name.toLowerCase()] = d.value;
    });

    const expandedResources = [];
    resCopy.forEach((r) => {
      for (let i = 0; i < r.quantity; i++) {
        expandedResources.push({
          name: r.name,
          weight: 1,
          value: demandMap[r.name.toLowerCase()] || 0,
          quantity: 1,
        });
      }
    });

    // Run Knapsack
    const knapsackResults = knapsackAllocation(expandedResources, demCopy, cap);

    // Combine Results
    const combinedMap = {};

    // Add Greedy Allocations
    greedyResults.forEach((res) => {
      const key = `${res.demand.toLowerCase()}-${res.resource.toLowerCase()}`;
      combinedMap[key] = { ...res };
    });

    // Add Knapsack Allocations (merge if same key exists)
    knapsackResults.forEach((res) => {
      const key = `${res.demand.toLowerCase()}-${res.resource.toLowerCase()}`;
      if (combinedMap[key]) {
        combinedMap[key].allocated = Math.max(
          combinedMap[key].allocated,
          res.allocated
        );
      } else {
        combinedMap[key] = { ...res };
      }
    });

    // Final Merged Results
    const finalResult = Object.values(combinedMap);

    setResults(finalResult);
    setMethod("Greedy + Knapsack Combined");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <Card>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Disaster Relief Resource Allocation
        </h1>

        {/* Resources Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Resources
          </h2>
          {resources.map((res, index) => (
            <div key={index} className="flex gap-4 mb-2">
              <Input
                placeholder="Resource Name"
                 className=" text-black border rounded-xl shadow-sm px-4 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={res.name}
                onChange={(e) =>
                  handleResourceChange(index, "name", e.target.value)
                }
              />
              <Input
                type="number"
                placeholder="Quantity"
                 className="text-black border rounded-xl shadow-sm px-4 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={res.quantity}
                onChange={(e) =>
                  handleResourceChange(index, "quantity", e.target.value)
                }
                min="0"
              />
            </div>
          ))}
          <Button className="mt-2" onClick={addResource}>
            Add Resource
          </Button>
        </div>

        {/* Demands Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Demands</h2>
          {demands.map((demand, index) => (
            <div key={index} className="flex gap-4 mb-2">
              <Input
                placeholder="Demand Name"
                className="text-black border rounded-xl shadow-sm px-4 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={demand.name}
                onChange={(e) =>
                  handleDemandChange(index, "name", e.target.value)
                }
              />
              <Input
                type="number"
                placeholder="Value (importance/urgency)"
                className="text-black border rounded-xl shadow-sm px-4 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={demand.value}
                onChange={(e) =>
                  handleDemandChange(index, "value", e.target.value)
                }
                min="0"
              />
            </div>
          ))}
          <Button className="mt-2" onClick={addDemand}>
            Add Demand
          </Button>
        </div>

        {/* Carrier Capacity */}
        <div className="mb-6">
          <label
            htmlFor="capacity"
            className="block text-lg font-semibold text-gray-900 mb-2"
          >
            Carrier Capacity
          </label>
          <Input
            id="capacity"
            className="text-black border rounded-xl shadow-sm px-4 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Enter total capacity (e.g., 100)"
            value={capacity}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") {
                setCapacity("");
                return;
              }
              if (/^(0|[1-9]\d*)$/.test(value)) {
                setCapacity(value);
              }
            }}
          />
        </div>

        {/* Run Combined Button */}
        <div className="flex gap-4">
          <Button onClick={runCombinedAllocation}>
            Run Combined Allocation
          </Button>
        </div>
      </Card>

      {/* Results Section */}
      {results.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Results using {method}:
          </h3>

          <div className="space-y-4">
            {results.map((res, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 ease-in-out"
              >
                <p className="text-lg text-gray-800 font-semibold mb-2">
                  Demand:{" "}
                  <span className="text-gray-600 font-normal">
                    {res.demand}
                  </span>
                </p>
                <p className="text-lg text-gray-800 font-semibold mb-2">
                  Resource:{" "}
                  <span className="text-gray-600 font-normal">
                    {res.resource}
                  </span>
                </p>
                <p className="text-lg text-gray-800 font-semibold">
                  Allocated:{" "}
                  <span className="text-gray-600 font-normal">
                    {res.allocated}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
