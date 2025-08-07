"use client"

import { useEffect, useState } from 'react';
import { getBranches } from '@/lib/api/api';

const BranchList = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await getBranches();
        setBranches(response.data);
      } catch (err) {
        setError('Failed to fetch branches');
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ul>
      {branches.map((branch: any) => (
        <li key={branch._id}>{branch.name}</li>
      ))}
    </ul>
  );
};

export default BranchList;