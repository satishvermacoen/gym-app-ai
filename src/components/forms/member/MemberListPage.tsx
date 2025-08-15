"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getMembersList } from "@/lib/api/Member-Respone";
import { useUser } from "@/context/UserContext";
import { Member } from "@/lib/types/Member";

export default function MemberListPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const [members, setMembers] = useState<Member[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);

  const branchId = user?.ownedBranches?.[0]; // Use the first branch for this example

  useEffect(() => {
    const fetchMembers = async (pageNum: number) => {
      if (!branchId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await getMembersList(branchId, {
          page: pageNum,
          limit: 10,
        });

        const { data } = response;
        if (data && data.success) {
          setMembers(data.data.docs || []);
          setTotalPages(data.data.totalPages);
          setPage(data.data.page);
          setHasPrevPage(data.data.hasPrevPage);
          setHasNextPage(data.data.hasNextPage);
        } else {
            console.error("Invalid data format:", data);
            setMembers([]);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    if (!isUserLoading) {
        fetchMembers(page);
    }
  }, [page, branchId, isUserLoading]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Member List</h1>

      <div className="overflow-x-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Membership Type</TableHead>
              <TableHead>Membership Fees</TableHead>
              <TableHead>Total Received</TableHead>
              <TableHead>Total Dues</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading || isUserLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : members.length > 0 ? (
              members.map((member) => {
                const fullName = `${member.personalInfo.firstName} ${member.personalInfo.lastName}`;
                return (
                  <TableRow key={member._id}>
                    <TableCell>{fullName}</TableCell>
                    <TableCell>{member.personalInfo.mobileNumberMain}</TableCell>
                    <TableCell>
                      {member.membershipInfo.membershiptype}
                    </TableCell>
                    <TableCell>
                      {member.membershipInfo.membershipFees || "-"}
                    </TableCell>
                    <TableCell>
                      {member.membershipInfo.totalReceived || "-"}
                    </TableCell>
                    <TableCell>
                      {member.membershipInfo.totalDues || "-"}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No members found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <Button
          variant="outline"
          disabled={!hasPrevPage}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={!hasNextPage}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
