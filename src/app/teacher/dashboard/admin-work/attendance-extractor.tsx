import React, { useState, useRef, useEffect } from 'react';
import { Upload, Bot, X, FileImage, Download, CheckCircle, AlertCircle, Sparkles, Eye, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { storage, app } from '../../../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { attendanceExtractionPrompt } from './prompt';
import { calculateAttendanceSummary } from './utils/attendanceCalculation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const auth = getAuth(app);
const db = getFirestore(app);

// Add types for result items
interface AttendanceResult {
  id: number;
  imageName: string;
  imagePreview: string | null;
  rawResponse: string;
  parsedData?: any;
  timestamp: string;
  error?: boolean;
}

const AttendanceExtractor = () => {
  const [results, setResults] = useState<AttendanceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const resultsEndRef = useRef(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const FIREBASE_FUNCTION_URL = 'https://us-central1-role-auth-7bc43.cloudfunctions.net/claudeChat';

  const scrollToBottom = () => {
    if (resultsEndRef.current && typeof resultsEndRef.current.scrollIntoView === 'function') {
      resultsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [results]);

  const handleImageSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && typeof e.target.result === 'string') {
          setImagePreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) handleImageSelect(file);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageSelect(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setProcessingStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sampleImages = [
    {
      url: 'https://firebasestorage.googleapis.com/v0/b/role-auth-7bc43.firebasestorage.app/o/sample%2Fsample%20attedence%20register%20capture.jpeg?alt=media&token=de925fe9-7c26-46fd-9210-1b86f76f7061',
      filename: 'sample_attendance_register_1.jpeg'
    },
    {
      url: 'https://firebasestorage.googleapis.com/v0/b/role-auth-7bc43.firebasestorage.app/o/sample%2FChatGPT%20Image%20Jun%2010%2C%202025%2C%2004_23_23%20PM.png?alt=media&token=5534ccb4-ca75-421a-b2f3-1b915f2cb353',
      filename: 'sample_attendance_register_2.png'
    },
    {
      url: 'https://firebasestorage.googleapis.com/v0/b/role-auth-7bc43.firebasestorage.app/o/sample%2FWhatsApp%20Image%202025-06-10%20at%2013.06.41_bae22a34.jpg?alt=media&token=03e7b57c-46c5-492f-ab8a-1f5a211d3166',
      filename: 'sample_attendance_register_3.jpg'
    },
    {
      url: 'https://firebasestorage.googleapis.com/v0/b/role-auth-7bc43.firebasestorage.app/o/sample%2Fgenerate.jpg?alt=media&token=e8494db1-2466-4065-b893-a3412fdc3bab',
      filename: 'sample_attendance_register_4.jpg'
    }
  ];

  const handleDownloadAllSampleImages = async () => {
    for (const { url, filename } of sampleImages) {
      try {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error downloading ${filename}:`, error);
      }
    }
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to read file as base64 string.'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Utility to attempt to fix common JSON issues
  function cleanAndFixJsonString(jsonString: string): string {
    let cleaned = jsonString
      .replace(/\xA0/g, ' ')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/,\s*([}\]])/g, '$1')
      .replace(/\"\s*:\s*\"/g, '": "')
      .trim();

    const openBraces = (cleaned.match(/\{/g) || []).length;
    const closeBraces = (cleaned.match(/\}/g) || []).length;
    const openBrackets = (cleaned.match(/\[/g) || []).length;
    const closeBrackets = (cleaned.match(/\]/g) || []).length;
    if (openBraces > closeBraces) cleaned += '}'.repeat(openBraces - closeBraces);
    if (openBrackets > closeBrackets) cleaned += ']'.repeat(openBrackets - closeBrackets);

    return cleaned;
  }

  const extractJsonFromString = (text: string) => {
    try {
      let jsonString = text;
      jsonString = jsonString.replace(/```json|```/gi, '');
      const firstCurly = jsonString.indexOf('{');
      const firstSquare = jsonString.indexOf('[');
      let startIdx = -1;
      if (firstCurly !== -1 && (firstCurly < firstSquare || firstSquare === -1)) {
        startIdx = firstCurly;
      } else if (firstSquare !== -1) {
        startIdx = firstSquare;
      }
      if (startIdx > 0) {
        jsonString = jsonString.slice(startIdx);
      }
      let lastCurly = jsonString.lastIndexOf('}');
      let lastSquare = jsonString.lastIndexOf(']');
      let endIdx = Math.max(lastCurly, lastSquare);
      if (endIdx !== -1) {
        jsonString = jsonString.slice(0, endIdx + 1);
      }
      jsonString = jsonString.replace(/,\s*([}\]])/g, '$1');
      const openBraces = (jsonString.match(/\{/g) || []).length;
      const closeBraces = (jsonString.match(/\}/g) || []).length;
      const openBrackets = (jsonString.match(/\[/g) || []).length;
      const closeBrackets = (jsonString.match(/\]/g) || []).length;
      if (openBraces > closeBraces) jsonString += '}'.repeat(openBraces - closeBraces);
      if (openBrackets > closeBrackets) jsonString += ']'.repeat(openBrackets - closeBrackets);
      jsonString = jsonString.replace(/\xA0/g, ' ').replace(/[\u200B-\u200D\uFEFF]/g, '');
      jsonString = jsonString.replace(/\s+/g, ' ');
      let parsed;
      try {
        parsed = JSON.parse(jsonString);
      } catch (e) {
        const curlyStart = jsonString.indexOf('{');
        const curlyEnd = jsonString.lastIndexOf('}');
        const squareStart = jsonString.indexOf('[');
        const squareEnd = jsonString.lastIndexOf(']');
        let fallback = '';
        if (curlyStart !== -1 && curlyEnd !== -1 && curlyEnd > curlyStart) {
          fallback = jsonString.slice(curlyStart, curlyEnd + 1);
        } else if (squareStart !== -1 && squareEnd !== -1 && squareEnd > squareStart) {
          fallback = jsonString.slice(squareStart, squareEnd + 1);
        }
        parsed = JSON.parse(fallback);
      }
      if (!parsed || typeof parsed !== 'object') {
        throw new Error("Invalid JSON structure: not an object");
      }
      const hasValidStructure = 
        (parsed.employees && Array.isArray(parsed.employees)) ||
        (parsed.attendance_data && Array.isArray(parsed.attendance_data)) ||
        (parsed.entries && Array.isArray(parsed.entries)) ||
        (parsed.students && Array.isArray(parsed.students)) ||
        (parsed.attendance && Array.isArray(parsed.attendance));
      if (!hasValidStructure) {
        throw new Error("No recognized attendance data structure found");
      }
      return parsed;
    } catch (e: unknown) {
      console.error("Could not parse JSON from response:", e);
      return null;
    }
  };

  const processImage = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setProcessingStatus('processing');

    try {
      const base64Image = await convertImageToBase64(selectedImage);
      const requestBody = {
        message: attendanceExtractionPrompt,
        image: base64Image,
        imageType: selectedImage.type
      };

      const response = await fetch(FIREBASE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Failed to process image: ${response.statusText}`);
      }

      const data = await response.json();
      const rawResponseText = data.response;
      const parsedJson = extractJsonFromString(rawResponseText);

      setResults(prev => [...prev, {
        id: Date.now(),
        imageName: selectedImage.name,
        imagePreview: imagePreview,
        rawResponse: rawResponseText,
        parsedData: parsedJson,
        timestamp: new Date().toLocaleString(),
      }]);
      
      setProcessingStatus('success');
      setTimeout(() => {
        removeImage();
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      setResults(prev => [...prev, {
        id: Date.now(),
        imageName: selectedImage.name,
        imagePreview: imagePreview,
        rawResponse: `Sorry, I encountered an error processing the image: ${error.message}. Please try again.`,
        timestamp: new Date().toLocaleString(),
        error: true,
      }]);
      setProcessingStatus('error');
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setProcessingStatus('idle');
      }, 3000);
    }
  };

  const downloadJSON = (result: AttendanceResult) => {
    const dataToDownload = result.parsedData || extractJsonFromString(result.rawResponse);
    if (!dataToDownload) {
      return;
    }
    const dataStr = JSON.stringify(dataToDownload, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `attendance_${result.imageName.split('.')[0]}_${Date.now()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  };

  const downloadExcel = async (result: AttendanceResult) => {
    const dataToProcess = result.parsedData || extractJsonFromString(result.rawResponse);
    if (!dataToProcess) {
      return;
    }
    let flattenedData = [];
    let exportFileDefaultName = `attendance_${result.imageName.split('.')[0]}_${Date.now()}.xlsx`;
    let attendanceRecords = null;
    const possibleArrays = [
      dataToProcess.attendance_data,
      dataToProcess.employees,
      dataToProcess.entries,
      dataToProcess.students,
      dataToProcess.attendance
    ];
    attendanceRecords = possibleArrays.find(arr => Array.isArray(arr) && arr.length > 0);
    if (!attendanceRecords) {
      return;
    }
    try {
      if (attendanceRecords[0]?.student_name !== undefined && attendanceRecords[0]?.status !== undefined) {
        flattenedData = attendanceRecords.map((record: any) => ({
          "Name": record.student_name || '',
          "Status": record.status || ''
        }));
      } else if (attendanceRecords[0]?.attendance !== undefined) {
        let allDates = new Set();
        attendanceRecords.forEach((record: any) => {
          if (record.attendance && typeof record.attendance === 'object') {
            Object.keys(record.attendance).forEach(date => allDates.add(date));
          }
        });
        const sortedDates = Array.from(allDates).sort((a, b) => parseInt(a as string) - parseInt(b as string));
        flattenedData = attendanceRecords.map((record: any) => {
          const flattenedRecord: { [key: string]: string } = {
            "Name": record.name || record.student_name || '',
          };
          sortedDates.forEach(date => {
            flattenedRecord[`Day ${date}`] = record.attendance?.[date] || '';
          });
          return flattenedRecord;
        });
      } else if (attendanceRecords[0]?.date !== undefined) {
        flattenedData = attendanceRecords.map((record: any) => ({
          "Date": record.date || '',
          "Name": record.name || record.student_name || '',
          "Status": record.status || ''
        }));
      } else {
        flattenedData = attendanceRecords.map((record: any) => {
          const row: { [key: string]: string | number } = {};
          Object.entries(record).forEach(([key, value]) => {
            if (typeof value === 'string' || typeof value === 'number') {
              row[key.charAt(0).toUpperCase() + key.slice(1)] = value;
            }
          });
          return row;
        });
      }
      const ws = XLSX.utils.json_to_sheet(flattenedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Attendance");

      if (attendanceRecords[0]?.attendance !== undefined) {
        const summary = calculateAttendanceSummary(attendanceRecords);
        const sortedSummary = summary.slice().sort((a, b) => {
          if (a.attendancePercent === '' && b.attendancePercent === '') return 0;
          if (a.attendancePercent === '') return 1;
          if (b.attendancePercent === '') return -1;
          return (a.attendancePercent as number) - (b.attendancePercent as number);
        });
        const sortingData = sortedSummary.map(s => ({
          'Student name': s.studentName,
          'Total Present': s.totalPresent,
          'Total Absent': s.totalAbsent,
          'Attendance %': s.attendancePercent
        }));
        const sortingWs = XLSX.utils.json_to_sheet(sortingData);
        sortingWs['!cols'] = [
          { wch: 20 },
          { wch: 14 },
          { wch: 13 },
          { wch: 15 },
        ];
        XLSX.utils.book_append_sheet(wb, sortingWs, 'attendance sorting');
      }

      if (dataToProcess.legend) {
        const legendData = Object.entries(dataToProcess.legend).map(([code, meaning]) => ({
          "Code": code,
          "Meaning": meaning
        }));
        const legendWs = XLSX.utils.json_to_sheet(legendData);
        XLSX.utils.book_append_sheet(wb, legendWs, "Legend");
      }
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(excelBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = exportFileDefaultName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (storage) {
        try {
          const storageRef = ref(storage, `excel_sheets/${exportFileDefaultName}`);
          const snapshot = await uploadBytes(storageRef, excelBlob);
          const storageLink = await getDownloadURL(snapshot.ref);
          const currentUser = auth.currentUser;
          if (currentUser) {
            await addDoc(collection(db, 'Attendance-records'), {
              userId: currentUser.uid,
              userEmail: currentUser.email,
              storageLink: storageLink,
              fileName: exportFileDefaultName,
              uploadTimestamp: serverTimestamp(),
            });
          }
        } catch (uploadError: any) {
          console.error('Error uploading to Firebase Storage:', uploadError);
        }
      }
    } catch (error: any) {
      console.error('Error creating Excel file:', error);
    }
  };

  const getProcessButtonVariant = () => {
    switch (processingStatus) {
      case 'success':
        return 'success' as const;
      case 'error':
        return 'destructive' as const;
      default:
        return 'gradient' as const;
    }
  };

  const getProcessButtonText = () => {
    switch (processingStatus) {
      case 'processing':
        return 'Extracting Attendance Data...';
      case 'success':
        return 'Data Extracted Successfully!';
      case 'error':
        return 'Extraction Failed - Try Again';
      default:
        return 'Extract Attendance Data';
    }
  };

  const removeResult = (id: number) => {
    setResults(prev => prev.filter(result => result.id !== id));
  };

  return (
    <div className="flex flex-col h-screen max-w-7xl mx-auto bg-neutral-50 dark:bg-neutral-900">
      {/* Main Content */}
      <div className="flex-1 flex gap-6 p-6">
        {/* Upload Section */}
        <div className="w-1/3 space-y-6">
          <Card variant="elevated" className="hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blueberry-100 dark:bg-blueberry-900 rounded-lg flex items-center justify-center">
                  <Upload size={20} className="text-blueberry-600 dark:text-blueberry-400" />
                </div>
                <CardTitle className="text-blueberry-700 dark:text-blueberry-300">Upload Image</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? 'border-blueberry-500 bg-blueberry-25 dark:bg-blueberry-950 scale-[1.02]'
                    : 'border-neutral-300 dark:border-neutral-600 hover:border-blueberry-400 dark:hover:border-blueberry-500 hover:bg-blueberry-25 dark:hover:bg-blueberry-950'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full max-h-48 mx-auto rounded-lg shadow-md"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0"
                    >
                      <X size={16} />
                    </Button>
                    <p className="subtitle text-neutral-700 dark:text-neutral-300 mt-3">{selectedImage?.name}</p>
                    {processingStatus === 'success' && (
                      <Badge variant="success" size="default" className="mt-2">
                        <CheckCircle size={14} className="mr-1" />
                        Ready for Processing
                      </Badge>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-blueberry-100 dark:bg-blueberry-900 rounded-2xl flex items-center justify-center mx-auto">
                      <FileImage size={32} className="text-blueberry-600 dark:text-blueberry-400" />
                    </div>
                    <div className="space-y-2">
                      <p className="body-text text-neutral-700 dark:text-neutral-300">Drag and drop an image here, or</p>
                      <Button
                        variant="outline"
                        size="default"
                        onClick={() => fileInputRef.current?.click()}
                        className="border-blueberry-300 text-blueberry-700 hover:bg-blueberry-50 dark:border-blueberry-600 dark:text-blueberry-400 dark:hover:bg-blueberry-950"
                      >
                        <Upload size={16} className="mr-2" />
                        Choose File
                      </Button>
                    </div>
                    <p className="body-text text-neutral-500 dark:text-neutral-400 text-sm">Supports JPG, PNG, GIF, WebP</p>
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInput}
                accept="image/*"
                className="hidden"
              />

              {/* Process Button */}
              {selectedImage && (
                <Button
                  variant={getProcessButtonVariant()}
                  size="lg"
                  onClick={processImage}
                  disabled={isLoading}
                  loading={isLoading}
                  className="w-full mt-4 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {!isLoading && processingStatus === 'success' && (
                    <CheckCircle size={18} className="mr-2" />
                  )}
                  {!isLoading && processingStatus === 'error' && (
                    <AlertCircle size={18} className="mr-2" />
                  )}
                  {!isLoading && processingStatus === 'idle' && (
                    <Bot size={18} className="mr-2" />
                  )}
                  {getProcessButtonText()}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Sample Images Section */}
          <Card variant="interactive" className="hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warning-100 dark:bg-warning-900 rounded-lg flex items-center justify-center">
                  <Sparkles size={20} className="text-warning-600 dark:text-warning-400" />
                </div>
                <CardTitle className="text-warning-700 dark:text-warning-300">Sample Images</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="body-text text-neutral-600 dark:text-neutral-400 mb-4">
                Download sample attendance registers to test the extraction feature
              </p>
              <Button
                variant="outline"
                size="default"
                onClick={handleDownloadAllSampleImages}
                className="w-full border-warning-300 text-warning-700 hover:bg-warning-50 dark:border-warning-600 dark:text-warning-400 dark:hover:bg-warning-950"
              >
                <Download size={16} className="mr-2" />
                Download All Samples
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="flex-1 flex flex-col">
          <Card variant="elevated" className="flex-1 flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success-100 dark:bg-success-900 rounded-lg flex items-center justify-center">
                    <Eye size={20} className="text-success-600 dark:text-success-400" />
                  </div>
                  <div>
                    <CardTitle className="text-success-700 dark:text-success-300">Extracted Data</CardTitle>
                    <p className="body-text text-neutral-600 dark:text-neutral-400 text-sm">
                      Results will appear here after processing
                    </p>
                  </div>
                </div>
                {results.length > 0 && (
                  <Badge variant="outline-primary" size="default">
                    {results.length} Result{results.length !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto space-y-4" noPadding>
              <div className="p-6">
                {results.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <FileImage size={48} className="text-neutral-400 dark:text-neutral-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="heading-3 text-neutral-900 dark:text-neutral-100">No results yet</h3>
                      <p className="body-text text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                        Upload an attendance register image to get started with AI-powered data extraction
                      </p>
                    </div>
                  </div>
                )}

                {results.map((result) => (
                  <Card 
                    key={result.id} 
                    variant={result.error ? "outlined" : "interactive"} 
                    className={`group hover:shadow-xl transition-all duration-300 ${
                      result.error ? 'border-error-300 dark:border-error-600' : 'hover:-translate-y-1'
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <img
                              src={result.imagePreview}
                              alt="Processed"
                              className="w-16 h-16 object-cover rounded-lg border-2 border-neutral-200 dark:border-neutral-700 shadow-sm"
                            />
                            {result.error ? (
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-error-500 rounded-full flex items-center justify-center">
                                <AlertCircle size={12} className="text-white" />
                              </div>
                            ) : (
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-success-500 rounded-full flex items-center justify-center">
                                <CheckCircle size={12} className="text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="subtitle text-neutral-900 dark:text-neutral-100 mb-1">
                              {result.imageName}
                            </h3>
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant={result.error ? "destructive" : "success"} 
                                size="sm"
                              >
                                {result.error ? 'Processing Failed' : 'Data Extracted'}
                              </Badge>
                              <span className="body-text text-neutral-500 dark:text-neutral-400 text-sm">
                                {result.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {result.parsedData && !result.error && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadJSON(result)}
                                className="border-blueberry-300 text-blueberry-700 hover:bg-blueberry-50 dark:border-blueberry-600 dark:text-blueberry-400 dark:hover:bg-blueberry-950"
                              >
                                <Download size={14} className="mr-1" />
                                JSON
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadExcel(result)}
                                className="border-success-300 text-success-700 hover:bg-success-50 dark:border-success-600 dark:text-success-400 dark:hover:bg-success-950"
                              >
                                <Download size={14} className="mr-1" />
                                Excel
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeResult(result.id)}
                            className="text-error-600 hover:text-error-700 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-950"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {result.parsedData && !result.error && (
                      <CardContent className="pt-0">
                        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                          <h4 className="subtitle text-neutral-900 dark:text-neutral-100 mb-3">
                            Extraction Summary
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Display key metrics from parsed data */}
                            <div className="text-center">
                              <div className="heading-3 text-blueberry-600 dark:text-blueberry-400">
                                {(() => {
                                  const data = result.parsedData;
                                  const records = data.attendance_data || data.employees || data.entries || data.students || data.attendance || [];
                                  return records.length;
                                })()}
                              </div>
                              <div className="body-text text-neutral-600 dark:text-neutral-400 text-sm">Records</div>
                            </div>
                            <div className="text-center">
                              <div className="heading-3 text-success-600 dark:text-success-400">
                                {(() => {
                                  const data = result.parsedData;
                                  const records = data.attendance_data || data.employees || data.entries || data.students || data.attendance || [];
                                  return records.filter((r: any) => 
                                    r.status === 'P' || r.status === 'Present' || 
                                    (r.attendance && Object.values(r.attendance).some((v: any) => v === 'P' || v === 'Present'))
                                  ).length;
                                })()}
                              </div>
                              <div className="body-text text-neutral-600 dark:text-neutral-400 text-sm">Present</div>
                            </div>
                            <div className="text-center">
                              <div className="heading-3 text-error-600 dark:text-error-400">
                                {(() => {
                                  const data = result.parsedData;
                                  const records = data.attendance_data || data.employees || data.entries || data.students || data.attendance || [];
                                  return records.filter((r: any) => 
                                    r.status === 'A' || r.status === 'Absent' || 
                                    (r.attendance && Object.values(r.attendance).some((v: any) => v === 'A' || v === 'Absent'))
                                  ).length;
                                })()}
                              </div>
                              <div className="body-text text-neutral-600 dark:text-neutral-400 text-sm">Absent</div>
                            </div>
                            <div className="text-center">
                              <div className="heading-3 text-warning-600 dark:text-warning-400">
                                {(() => {
                                  const data = result.parsedData;
                                  if (data.legend) {
                                    return Object.keys(data.legend).length;
                                  }
                                  return 'N/A';
                                })()}
                              </div>
                              <div className="body-text text-neutral-600 dark:text-neutral-400 text-sm">Legend Items</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    )}

                    {result.error && (
                      <CardContent className="pt-0">
                        <Card variant="ghost" className="bg-error-25 dark:bg-error-950 border-error-200 dark:border-error-700">
                          <CardContent size="default">
                            <div className="flex items-start gap-3">
                              <AlertCircle size={20} className="text-error-600 dark:text-error-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="subtitle text-error-800 dark:text-error-200 mb-1">Processing Error</h4>
                                <p className="body-text text-error-700 dark:text-error-300 text-sm leading-relaxed">
                                  {result.rawResponse}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </CardContent>
                    )}
                  </Card>
                ))}

                <div ref={resultsEndRef} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AttendanceExtractor;