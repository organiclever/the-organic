"use client";

import { useState, useEffect } from "react";
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

export default function DatabaseManagementPage() {
  const [backupStatus, setBackupStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [restoreStatus, setRestoreStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [mainDbPath, setMainDbPath] = useState<string>("");
  const [backupDbPath, setBackupDbPath] = useState<string>("");
  const [initialMainDbPath, setInitialMainDbPath] = useState<string>("");
  const [initialBackupDbPath, setInitialBackupDbPath] = useState<string>("");
  const [isLocationChanged, setIsLocationChanged] = useState<boolean>(false);

  useEffect(() => {
    // Simulating initial load of database paths
    setMainDbPath("/initial/main/database.sqlite");
    setBackupDbPath("/initial/backup/database.sqlite");
    setInitialMainDbPath("/initial/main/database.sqlite");
    setInitialBackupDbPath("/initial/backup/database.sqlite");
  }, []);

  useEffect(() => {
    setIsLocationChanged(
      mainDbPath !== initialMainDbPath || backupDbPath !== initialBackupDbPath
    );
  }, [mainDbPath, backupDbPath, initialMainDbPath, initialBackupDbPath]);

  const handleSaveLocations = () => {
    // Here you would typically save the new paths to your backend or configuration
    console.log("Saving new database locations:", { mainDbPath, backupDbPath });
    setInitialMainDbPath(mainDbPath);
    setInitialBackupDbPath(backupDbPath);
    setIsLocationChanged(false);
    setSaveStatus("success");
    // Reset the success message after 3 seconds
    setTimeout(() => setSaveStatus("idle"), 3000);
  };

  const handleBackup = async () => {
    if (!mainDbPath || !backupDbPath) {
      alert("Please provide both main and backup database paths");
      return;
    }

    try {
      setBackupStatus("idle");
      // Simulating a database backup
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real application, you would perform the actual backup here
      console.log(`Backing up from ${mainDbPath} to ${backupDbPath}`);

      setBackupStatus("success");
    } catch (error) {
      console.error("Backup failed:", error);
      setBackupStatus("error");
    }
  };

  const handleRestore = async () => {
    if (!mainDbPath || !backupDbPath) {
      alert("Please provide both main and backup database paths");
      return;
    }

    try {
      setRestoreStatus("idle");
      // Simulating a database restore
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real application, you would perform the actual restore here
      console.log(`Restoring from ${backupDbPath} to ${mainDbPath}`);

      setRestoreStatus("success");
    } catch (error) {
      console.error("Restore failed:", error);
      setRestoreStatus("error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Database Management</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Database Locations</CardTitle>
          <CardDescription>
            Specify the paths for your main and backup databases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="main-db-path">Main Database Path</Label>
              <div className="flex">
                <Input
                  id="main-db-path"
                  value={mainDbPath}
                  onChange={(e) => setMainDbPath(e.target.value)}
                  placeholder="/path/to/main/database.sqlite"
                  className="flex-grow"
                />
                <Button
                  onClick={() => alert("Select main database file")}
                  className="ml-2"
                  variant="outline"
                >
                  <FolderOpen className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="backup-db-path">Backup Database Path</Label>
              <div className="flex">
                <Input
                  id="backup-db-path"
                  value={backupDbPath}
                  onChange={(e) => setBackupDbPath(e.target.value)}
                  placeholder="/path/to/backup/database.sqlite"
                  className="flex-grow"
                />
                <Button
                  onClick={() => alert("Select backup database file")}
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
                  Are you sure you want to save the new database locations?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action will update the database locations used by the
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
              Database locations have been updated successfully.
            </AlertDescription>
          </Alert>
        )}
      </Card>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Backup Database</CardTitle>
            <CardDescription>
              Create a backup of your current database
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            <p className="text-sm text-gray-500 mb-4">
              Backing up your database will create a copy of your current data
              in the specified backup location.
            </p>
            <div className="flex-grow">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={!mainDbPath || !backupDbPath}>
                    <Download className="mr-2 h-4 w-4" />
                    Backup Now
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to backup the database?
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
                  Database backup has been created successfully.
                </AlertDescription>
              </Alert>
            )}
            {backupStatus === "error" && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  An error occurred while creating the database backup. Please
                  try again.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Restore Database</CardTitle>
            <CardDescription>
              Restore your database from a backup file
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            <p className="text-sm text-gray-500 mb-4">
              Warning: Restoring a database will overwrite your current data.
              Make sure you have a backup before proceeding.
            </p>
            <div className="flex-grow">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={!mainDbPath || !backupDbPath}>
                    <Upload className="mr-2 h-4 w-4" />
                    Restore Database
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to restore the database?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will overwrite your current database with the
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
                  Database has been restored successfully from the backup file.
                </AlertDescription>
              </Alert>
            )}
            {restoreStatus === "error" && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  An error occurred while restoring the database. Please check
                  your backup file and try again.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
