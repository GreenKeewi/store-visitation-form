"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Loader2, Lock } from "lucide-react";
import { useEffect, useState } from "react";

interface Submission {
  _id?: string;
  [key: string]: any;
  metadata?: {
    createdAt?: string;
    submittedBy?: string;
  };
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/get-submissions");
      const result = await response.json();

      if (result.success) {
        setSubmissions(result.data || []);
      } else {
        setError(result.error || "Failed to fetch submissions");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch submissions",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - "secure" is the password
    if (passwordInput === "secure") {
      setIsAuthenticated(true);
      setPasswordInput("");
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password");
      setPasswordInput("");
    }
  };

  const downloadCSV = () => {
    if (submissions.length === 0) {
      setError("No submissions to download");
      return;
    }

    setIsDownloading(true);

    try {
      // Flatten and prepare data for CSV
      const headers = getCSVHeaders();
      const rows = submissions.map((submission) =>
        getCSVRow(submission, headers),
      );

      // Create CSV content
      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
        ),
      ].join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `form-responses-${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download CSV");
    } finally {
      setIsDownloading(false);
    }
  };

  const getCSVHeaders = (): string[] => {
    // Define headers in the exact order the form is filled out
    return [
      "Visit Date",
      "Territory Manager",
      "Store Name",
      "Service Provider",
      "MOD/Store Manager Name",
      "Store Associates Names",
      "Purpose of Visit",
      "Time Spent in Store",
      "Total Leads",
      "Closing Ratio",
      "Sales",
      "Pipeline",
      "Cleanliness",
      "Pamphlets and Business Cards",
      "Units in Good Condition",
      "Units Clear and Visible",
      "Display in Good Condition",
      "Display Cleaned",
      "Promo Displayed",
      "Promo Setup",
      "Comments",
      "Submitted At",
    ];
  };

  const getCSVRow = (
    submission: Submission,
    headers: string[],
  ): (string | any)[] => {
    // Map submission data to match the header order
    const getValue = (key: string): string => {
      switch (key) {
        case "Visit Date":
          return submission.visitDate || "";
        case "Territory Manager":
          return submission.territoryManager || "";
        case "Store Name":
          return submission.storeName || "";
        case "Service Provider":
          return submission.serviceProvider || "";
        case "MOD/Store Manager Name":
          return submission.storeEngagement?.modName || "";
        case "Store Associates Names":
          return submission.storeEngagement?.associateNames || "";
        case "Purpose of Visit":
          return submission.storeEngagement?.visitPurpose || "";
        case "Time Spent in Store":
          return submission.storeEngagement?.timeSpent || "";
        case "Total Leads":
          return submission.hvacSales?.totalLeads || "";
        case "Closing Ratio":
          return submission.hvacSales?.closingRatio || "";
        case "Sales":
          return submission.hvacSales?.sales || "";
        case "Pipeline":
          return submission.hvacSales?.pipeline || "";
        case "Cleanliness":
          return submission.storeDisplay?.cleanliness || "";
        case "Pamphlets and Business Cards":
          return submission.storeDisplay?.pamphlets || "";
        case "Units in Good Condition":
          return submission.storeDisplay?.unitsCondition || "";
        case "Units Clear and Visible":
          return submission.storeDisplay?.unitsVisible || "";
        case "Display in Good Condition":
          return submission.storeDisplay?.displayCondition || "";
        case "Display Cleaned":
          return submission.storeDisplay?.cleanedDisplay || "";
        case "Promo Displayed":
          return submission.promoExecution?.promoDisplayed || "";
        case "Promo Setup":
          return submission.promoExecution?.promoSetup || "";
        case "Comments":
          return submission.comments || "";
        case "Submitted At":
          return submission.submittedAt || submission.metadata?.createdAt || "";
        default:
          return "";
      }
    };

    return headers.map((header) => getValue(header));
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {!isAuthenticated ? (
        // Login Form
        <div className="flex min-h-screen items-center justify-center p-6">
          <Card className="w-full max-w-sm">
            <div className="p-8">
              <div className="mb-6 flex justify-center">
                <div className="rounded-lg bg-blue-100 p-3">
                  <Lock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <h1 className="mb-2 text-center text-2xl font-bold">
                Admin Access
              </h1>
              <p className="mb-6 text-center text-sm text-gray-600">
                Enter password to access the dashboard
              </p>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setPasswordError("");
                    }}
                    className="mt-1"
                  />
                </div>

                {passwordError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                    {passwordError}
                  </div>
                )}

                <Button type="submit" className="w-full">
                  Unlock Dashboard
                </Button>
              </form>
            </div>
          </Card>
        </div>
      ) : (
        // Dashboard
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Manage and download form responses
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Controls Card */}
          <Card className="mb-6 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Form Responses</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Total submissions:{" "}
                  <span className="font-medium">{submissions.length}</span>
                </p>
              </div>
              <Button
                onClick={downloadCSV}
                disabled={isDownloading || submissions.length === 0}
                size="lg"
                className="gap-2"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download CSV
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Submissions Table */}
          {isLoading ? (
            <Card className="p-12 text-center">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading submissions...</span>
              </div>
            </Card>
          ) : submissions.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-gray-600">No submissions found</p>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Submitted By
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {submissions.map((submission, index) => (
                      <tr
                        key={submission._id || index}
                        className="hover:bg-gray-50"
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          {submission._id
                            ? String(submission._id).slice(-8)
                            : `#${index + 1}`}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                          {submission.metadata?.createdAt
                            ? new Date(
                                submission.metadata.createdAt,
                              ).toLocaleDateString()
                            : submission.submittedAt
                              ? new Date(
                                  submission.submittedAt,
                                ).toLocaleDateString()
                              : submission.visitDate
                                ? new Date(
                                    submission.visitDate,
                                  ).toLocaleDateString()
                                : "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                          {submission.metadata?.submittedBy ||
                            submission.territoryManager ||
                            submission.submittedBy ||
                            "Anonymous"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => setSelectedSubmission(submission)}
                            className="p-0"
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Refresh Button */}
          {!isLoading && (
            <div className="mt-6 text-center">
              <Button variant="outline" onClick={fetchSubmissions}>
                Refresh
              </Button>
            </div>
          )}

          {/* Details Dialog */}
          <Dialog
            open={!!selectedSubmission}
            onOpenChange={(open) => !open && setSelectedSubmission(null)}
          >
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Submission Details</DialogTitle>
              </DialogHeader>
              {selectedSubmission && (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900 mb-3">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Territory Manager</p>
                        <p className="font-medium">
                          {formatValue(selectedSubmission.territoryManager)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Store Name</p>
                        <p className="font-medium">
                          {formatValue(selectedSubmission.storeName)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Service Provider</p>
                        <p className="font-medium">
                          {formatValue(selectedSubmission.serviceProvider)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Visit Date</p>
                        <p className="font-medium">
                          {formatValue(selectedSubmission.visitDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Store Engagement */}
                  {selectedSubmission.storeEngagement && (
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900 mb-3">
                        Store Engagement
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Manager Name</p>
                          <p className="font-medium">
                            {formatValue(
                              selectedSubmission.storeEngagement.modName,
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Associate Names</p>
                          <p className="font-medium">
                            {formatValue(
                              selectedSubmission.storeEngagement.associateNames,
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Visit Purpose</p>
                          <p className="font-medium">
                            {formatValue(
                              selectedSubmission.storeEngagement.visitPurpose,
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Time Spent</p>
                          <p className="font-medium">
                            {formatValue(
                              selectedSubmission.storeEngagement.timeSpent,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* HVAC Sales */}
                  {selectedSubmission.hvacSales && (
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900 mb-3">
                        HVAC Sales
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Total Leads</p>
                          <p className="font-medium">
                            {formatValue(
                              selectedSubmission.hvacSales.totalLeads,
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Closing Ratio</p>
                          <p className="font-medium">
                            {formatValue(
                              selectedSubmission.hvacSales.closingRatio,
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Sales</p>
                          <p className="font-medium">
                            {formatValue(selectedSubmission.hvacSales.sales)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Pipeline</p>
                          <p className="font-medium">
                            {formatValue(selectedSubmission.hvacSales.pipeline)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Store Display */}
                  {selectedSubmission.storeDisplay && (
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900 mb-3">
                        Store Display
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Cleanliness</p>
                          <p className="font-medium">
                            {formatValue(
                              selectedSubmission.storeDisplay.cleanliness,
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Pamphlets</p>
                          <p className="font-medium">
                            {formatValue(
                              selectedSubmission.storeDisplay.pamphlets,
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Units Condition</p>
                          <p className="font-medium">
                            {formatValue(
                              selectedSubmission.storeDisplay.unitsCondition,
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Units Visible</p>
                          <p className="font-medium">
                            {formatValue(
                              selectedSubmission.storeDisplay.unitsVisible,
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Display Condition</p>
                          <p className="font-medium">
                            {formatValue(
                              selectedSubmission.storeDisplay.displayCondition,
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Cleaned Display</p>
                          <p className="font-medium">
                            {formatValue(
                              selectedSubmission.storeDisplay.cleanedDisplay,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Promo Execution */}
                  {selectedSubmission.promoExecution && (
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900 mb-3">
                        Promo Execution
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Promo Displayed</p>
                          <p className="font-medium">
                            {formatValue(
                              selectedSubmission.promoExecution.promoDisplayed,
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Promo Setup</p>
                          <p className="font-medium">
                            {formatValue(
                              selectedSubmission.promoExecution.promoSetup,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Comments */}
                  {selectedSubmission.comments && (
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900 mb-3">
                        Comments
                      </h3>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {selectedSubmission.comments}
                      </p>
                    </div>
                  )}

                  {/* Metadata */}
                  {selectedSubmission.submittedAt && (
                    <div className="border-t pt-4">
                      <p className="text-xs text-gray-500">
                        Submitted:{" "}
                        {new Date(
                          selectedSubmission.submittedAt,
                        ).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
