"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { AlertCircle, Download, Upload, FolderOpen, Save } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";

export default function DataStorageManagementPage() {
  const [backupStatus, setBackupStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [restoreStatus, setRestoreStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [mainStoragePath, setMainStoragePath] = useState<string>("");
  const [backupStoragePath, setBackupStoragePath] = useState<string>("");
  const [initialMainStoragePath, setInitialMainStoragePath] =
    useState<string>("");
  const [initialBackupStoragePath, setInitialBackupStoragePath] =
    useState<string>("");
  const [isLocationChanged, setIsLocationChanged] = useState<boolean>(false);

  useEffect(() => {
    // Simulating initial load of storage paths
    setMainStoragePath("/initial/main/storage.sqlite");
    setBackupStoragePath("/initial/backup/storage.sqlite");
    setInitialMainStoragePath("/initial/main/storage.sqlite");
    setInitialBackupStoragePath("/initial/backup/storage.sqlite");
  }, []);

  useEffect(() => {
    setIsLocationChanged(
      mainStoragePath !== initialMainStoragePath ||
        backupStoragePath !== initialBackupStoragePath
    );
  }, [
    mainStoragePath,
    backupStoragePath,
    initialMainStoragePath,
    initialBackupStoragePath,
  ]);

  const handleSaveLocations = () => {
    // Here you would typically save the new paths to your backend or configuration
    console.log("Saving new data storage locations:", {
      mainStoragePath,
      backupStoragePath,
    });
    setInitialMainStoragePath(mainStoragePath);
    setInitialBackupStoragePath(backupStoragePath);
    setIsLocationChanged(false);
    setSaveStatus("success");
    // Reset the success message after 3 seconds
    setTimeout(() => setSaveStatus("idle"), 3000);
  };

  const handleBackup = async () => {
    if (!mainStoragePath || !backupStoragePath) {
      alert("Please provide both main and backup data storage paths");
      return;
    }

    try {
      setBackupStatus("idle");
      // Simulating a data backup
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real application, you would perform the actual backup here
      console.log(`Backing up from ${mainStoragePath} to ${backupStoragePath}`);

      setBackupStatus("success");
    } catch (error) {
      console.error("Backup failed:", error);
      setBackupStatus("error");
    }
  };

  const handleRestore = async () => {
    if (!mainStoragePath || !backupStoragePath) {
      alert("Please provide both main and backup data storage paths");
      return;
    }

    try {
      setRestoreStatus("idle");
      // Simulating a data restore
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real application, you would perform the actual restore here
      console.log(`Restoring from ${backupStoragePath} to ${mainStoragePath}`);

      setRestoreStatus("success");
    } catch (error) {
      console.error("Restore failed:", error);
      setRestoreStatus("error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Data Storage Management</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Data Storage Locations</CardTitle>
          <CardDescription>
            Specify the paths for your main and backup data storage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="main-storage-path">Main Data Storage Path</Label>
              <div className="flex">
                <Input
                  id="main-storage-path"
                  value={mainStoragePath}
                  onChange={(e) => setMainStoragePath(e.target.value)}
                  placeholder="/path/to/main/storage.sqlite"
                  className="flex-grow"
                />
                <Button
                  onClick={() => alert("Select main data storage file")}
                  className="ml-2"
                  variant="outline"
                >
                  <FolderOpen className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="backup-storage-path">
                Backup Data Storage Path
              </Label>
              <div className="flex">
                <Input
                  id="backup-storage-path"
                  value={backupStoragePath}
                  onChange={(e) => setBackupStoragePath(e.target.value)}
                  placeholder="/path/to/backup/storage.sqlite"
                  className="flex-grow"
                />
                <Button
                  onClick={() => alert("Select backup data storage file")}
                  className="ml-2"
                  variant="outline"
                >
                  <FolderOpen className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={!isLocationChanged}>
                <Save className="mr-2 h-4 w-4" />
                Save Locations
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to save the new data storage locations?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action will update the data storage locations used by the
                  application. Make sure the paths are correct before
                  proceeding.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSaveLocations}>
                  Confirm Save
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
        {saveStatus === "success" && (
          <Alert className="mt-4 mx-6 mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Data storage locations have been updated successfully.
            </AlertDescription>
          </Alert>
        )}
      </Card>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Backup Data</CardTitle>
            <CardDescription>
              Create a backup of your current data
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            <p className="text-sm text-gray-500 mb-4">
              Backing up your data will create a copy of your current
              information in the specified backup location.
            </p>
            <div className="flex-grow">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={!mainStoragePath || !backupStoragePath}>
                    <Download className="mr-2 h-4 w-4" />
                    Backup Now
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to backup the data?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will create a new backup file at the specified
                      location. Any existing file with the same name will be
                      overwritten.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBackup}>
                      Confirm Backup
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            {backupStatus === "success" && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Data backup has been created successfully.
                </AlertDescription>
              </Alert>
            )}
            {backupStatus === "error" && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  An error occurred while creating the data backup. Please try
                  again.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Restore Data</CardTitle>
            <CardDescription>
              Restore your data from a backup file
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            <p className="text-sm text-gray-500 mb-4">
              Warning: Restoring data will overwrite your current information.
              Make sure you have a backup before proceeding.
            </p>
            <div className="flex-grow">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={!mainStoragePath || !backupStoragePath}>
                    <Upload className="mr-2 h-4 w-4" />
                    Restore Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to restore the data?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will overwrite your current data with the
                      backup. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRestore}>
                      Confirm Restore
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            {restoreStatus === "success" && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Data has been restored successfully from the backup file.
                </AlertDescription>
              </Alert>
            )}
            {restoreStatus === "error" && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  An error occurred while restoring the data. Please check your
                  backup file and try again.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
