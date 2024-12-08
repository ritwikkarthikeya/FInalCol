"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAdminDashboard } from "@/context/AdminDashboardContext";
import useFetchAdminDashboard from "@/context/useFetchAdminDashboard";

export default function ReportedTeams() {
  const dashboardData = useFetchAdminDashboard();
  const [reportedTeams, setReportedTeams] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  // Log the data to console once it's fetched
  useEffect(() => {
    if (dashboardData && dashboardData.reports) {
      console.log("Dashboard Data:", dashboardData);
      console.log(JSON.stringify(dashboardData.reports));
      dashboardData.reports.forEach(report => {
      console.log("Reported By Data:", report.reportedBy);
    });

      // Filter the reports for 'Team' type
      const filteredReports = dashboardData.reports.filter(
        (report) => report.reportType === "Team"
      );

      setReportedTeams(filteredReports);
      console.log("Filtered Reported Teams:", filteredReports);
    }
  }, [dashboardData]); // This effect will run every time dashboardData is updated

  // Handle review report
  const handleReviewReport = (reportId, status) => {
    setReportedTeams((prevReports) =>
      prevReports.map((report) =>
        report._id === reportId ? { ...report, status: status } : report
      )
    );
    setSelectedReport(null);
  };

  if (!dashboardData || !reportedTeams) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Reported Teams</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reported By</TableHead>
              <TableHead>Team Name</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportedTeams.length > 0 ? (
              reportedTeams.map((report) => (
                <TableRow key={report._id}>
                  <TableCell>{report.reportedBy.username}</TableCell>
                  <TableCell>{report.reportedTeam}</TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell>{report.status}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => setSelectedReport(report)}
                      variant="outline"
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No reported teams.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={selectedReport !== null} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Report</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Reported By:</span>
                  <span className="col-span-3">{selectedReport.reportedBy.username}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Team Name:</span>
                  <span className="col-span-3">{selectedReport.reportedTeam}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Reason:</span>
                  <span className="col-span-3">{selectedReport.reason}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Status:</span>
                  <span className="col-span-3">{selectedReport.status}</span>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => handleReviewReport(selectedReport._id, "Reviewed")}
                  variant="default"
                >
                  Mark as Reviewed
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
