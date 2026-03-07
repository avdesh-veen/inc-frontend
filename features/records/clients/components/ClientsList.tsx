import React, { useState, useEffect } from "react";

// Mock data
const mockClients = [
  {
    id: 1,
    name: "Acme Corporation",
    tier: "Platinum",
    providers: 15,
    estimatedRevenue: "$2.5M",
    avgTAT: "2.3 days",
    portalStatus: "Enabled",
    health: "Good",
    type: "Large Group",
  },
  {
    id: 2,
    name: "Beta Health",
    tier: "Gold",
    providers: 8,
    estimatedRevenue: "$1.2M",
    avgTAT: "3.1 days",
    portalStatus: "Disabled",
    health: "Fair",
    type: "Mid-size Group",
  },
  {
    id: 3,
    name: "Gamma Services",
    tier: "Silver",
    providers: 22,
    estimatedRevenue: "$3.8M",
    avgTAT: "1.8 days",
    portalStatus: "Enabled",
    health: "Excellent",
    type: "Large Group",
  },
];

// Mock filter options
const mockTypes = ["Large Group", "Mid-size Group", "Small Group"];
const mockTiers = ["Platinum", "Diamond", "Gold", "Silver", "Bronze"];
const mockPortalStatuses = ["All", "Enabled", "Disabled"];

interface Client {
  id: number;
  name: string;
  tier: string;
  providers: number;
  estimatedRevenue: string;
  avgTAT: string;
  portalStatus: string;
  health: string;
  type: string;
}

const ClientsList: React.FC = () => {
  const [clients] = useState<Client[]>(mockClients);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [tierFilter, setTierFilter] = useState("All");
  const [portalFilter, setPortalFilter] = useState("All");

  // Simple debounce implementation
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter clients based on search and filters
  const filteredClients = React.useMemo(() => {
    let results = [...clients];

    // Search filter
    if (debouncedSearchTerm) {
      results = results.filter(
        (client) =>
          client.name
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          client.id.toString().includes(debouncedSearchTerm),
      );
    }

    // Type filter
    if (typeFilter !== "All") {
      results = results.filter((client) => client.type === typeFilter);
    }

    // Tier filter
    if (tierFilter !== "All") {
      results = results.filter((client) => client.tier === tierFilter);
    }

    // Portal filter
    if (portalFilter !== "All") {
      results = results.filter(
        (client) => client.portalStatus === portalFilter,
      );
    }

    return results;
  }, [clients, debouncedSearchTerm, typeFilter, tierFilter, portalFilter]);

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange =
    (setter: (value: string) => void) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setter(e.target.value);
    };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setTypeFilter("All");
    setTierFilter("All");
    setPortalFilter("All");
  };

  // Mock add client handler
  const handleAddClient = () => {
    alert("Add Client clicked - modal would open here");
  };

  // Mock edit client handler
  const handleEditClient = (id: number) => {
    alert(`Edit client ${id} clicked - edit form would open here`);
  };

  // Mock data loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Clients</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handleAddClient}
          >
            + Add Client
          </button>
        </div>

        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-lg p-4 animate-pulse"
            >
              <div className="grid grid-cols-8 gap-4">
                {[...Array(8)].map((_, col) => (
                  <div key={col} className="h-4 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={handleAddClient}
        >
          + Add Client
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search by name, Tax ID..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={handleFilterChange(setTypeFilter)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">Type (All)</option>
              {mockTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Tier Filter */}
          <div>
            <select
              value={tierFilter}
              onChange={handleFilterChange(setTierFilter)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">Tier (All)</option>
              {mockTiers.map((tier) => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </select>
          </div>

          {/* Portal Filter */}
          <div>
            <select
              value={portalFilter}
              onChange={handleFilterChange(setPortalFilter)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">Portal Status (All)</option>
              {mockPortalStatuses.slice(1).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset Filters Button */}
        <div className="mt-4">
          <button
            onClick={handleResetFilters}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Clients Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Providers
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Est. Revenue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg TAT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Portal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Health
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClients.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No clients found for the selected criteria.
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {client.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.tier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.providers}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.estimatedRevenue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.avgTAT}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.portalStatus}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.health}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditClient(client.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* No Results State */}
      {filteredClients.length === 0 && !loading && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">
            No clients found for the selected criteria. Try adjusting your
            search or filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientsList;

const ciRepairTest = 1;;
