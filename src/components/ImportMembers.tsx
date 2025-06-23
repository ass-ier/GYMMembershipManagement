
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { membersAPI } from '@/api/members';
import { useApi } from '@/hooks/useApi';

const ImportMembers = () => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResults, setImportResults] = useState<{
    success: number;
    errors: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { execute } = useApi();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || selectedFile.name.endsWith('.xlsx'))) {
      setFile(selectedFile);
      setImportResults(null);
    } else {
      toast({
        title: "Error",
        description: "Please select a valid Excel file (.xlsx)",
        variant: "destructive"
      });
    }
  };

  const processExcelFile = async (file: File): Promise<any[]> => {
    // In a real implementation, you would use a library like xlsx or exceljs
    // For now, we'll simulate processing and return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { 
            name: 'John Smith', 
            email: 'john.smith@email.com', 
            phone: '+251-911-111111', 
            emergencyContactName: 'Jane Smith',
            emergencyContactPhone: '+251-911-111112',
            plan: '3 Months' 
          },
          { 
            name: 'Jane Doe', 
            email: 'jane.doe@email.com', 
            phone: '+251-911-222222', 
            emergencyContactName: 'John Doe',
            emergencyContactPhone: '+251-911-222223',
            plan: '1 Year' 
          },
          { 
            name: 'Mike Johnson', 
            email: 'mike.johnson@email.com', 
            phone: '+251-911-333333',
            emergencyContactName: 'Sarah Johnson',
            emergencyContactPhone: '+251-911-333334',
            plan: '6 Months' 
          },
        ]);
      }, 1000);
    });
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Process the Excel file
      const memberData = await processExcelFile(file);
      
      // Import members via API
      const importedMembers = await execute(() => membersAPI.importMembers(memberData));
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setImportResults({
        success: importedMembers.length,
        errors: [] // In real implementation, handle validation errors
      });

      toast({
        title: "Import Complete",
        description: `${importedMembers.length} members imported successfully`
      });

    } catch (error) {
      setImportResults({
        success: 0,
        errors: ['Import failed: ' + (error instanceof Error ? error.message : 'Unknown error')]
      });
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    // Create a comprehensive CSV template with all required fields
    const csvContent = "name,email,phone,emergencyContactName,emergencyContactPhone,plan\nJohn Doe,john@example.com,+251-911-123456,Jane Doe,+251-911-123457,3 Months\nJane Smith,jane@example.com,+251-911-789012,John Smith,+251-911-789013,1 Year";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'member-import-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded with all required fields including emergency contacts. Convert to Excel format for import."
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Import Members</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Excel Import
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
            <div>
              <h3 className="font-semibold">Download Template First</h3>
              <p className="text-sm text-gray-600">Use our Excel template with all required fields including emergency contacts</p>
            </div>
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Required Fields:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Name (Full name of the member)</li>
              <li>• Email (Valid email address)</li>
              <li>• Phone (Phone number with country code)</li>
              <li>• Emergency Contact Name (Full name)</li>
              <li>• Emergency Contact Phone (Phone number with country code)</li>
              <li>• Plan (1 Month, 3 Months, 6 Months, 1 Year)</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Excel File</label>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />
            </div>

            {file && (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <FileText className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">{file.name}</span>
                <span className="text-sm text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}

            {importing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Importing members...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            {importResults && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">{importResults.success} members imported successfully</span>
                </div>
                
                {importResults.errors.length > 0 && (
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-red-600">Errors encountered:</span>
                    </div>
                    <ul className="text-sm text-red-600 space-y-1">
                      {importResults.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <Button 
              onClick={handleImport} 
              disabled={!file || importing}
              className="w-full"
            >
              {importing ? 'Importing...' : 'Import Members'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportMembers;
