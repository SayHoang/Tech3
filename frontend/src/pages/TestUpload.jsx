import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { UPLOAD_FILE } from "../graphql/upload.js";
import { getServerUrl } from "../lib/imageUtils.js";

function TestUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);

  const [uploadFile, { loading: uploading }] = useMutation(UPLOAD_FILE, {
    onCompleted: (data) => {
      const uploadedFileName = data.upload;
      const imageUrl = `${getServerUrl()}/img/${uploadedFileName}`;
      setUploadResult({
        filename: uploadedFileName,
        url: imageUrl,
      });
      setError(null);
      console.log("Upload successful:", data);
    },
    onError: (error) => {
      console.error("Upload error:", error);
      setError(error.message);
      setUploadResult(null);
    },
  });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError("Chỉ chấp nhận file hình ảnh (JPG, PNG, GIF)!");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File không được lớn hơn 5MB!");
        return;
      }

      setSelectedFile(file);
      setError(null);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Vui lòng chọn file!");
      return;
    }

    try {
      console.log("Starting upload for file:", selectedFile.name);
      await uploadFile({
        variables: {
          file: selectedFile,
        },
      });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setError(null);
    setUploadResult(null);
    document.getElementById("file-input").value = "";
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Test Upload Functionality
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Selection */}
          <div className="space-y-2">
            <label htmlFor="file-input" className="block text-sm font-medium">
              Chọn file hình ảnh
            </label>
            <Input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
            />
            {selectedFile && (
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                <strong>File được chọn:</strong> {selectedFile.name}
                <br />
                <strong>Kích thước:</strong>{" "}
                {(selectedFile.size / 1024).toFixed(1)} KB
                <br />
                <strong>Loại:</strong> {selectedFile.type}
              </div>
            )}
          </div>

          {/* Upload Button */}
          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {uploading ? "Đang upload..." : "Upload"}
            </Button>
            {selectedFile && (
              <Button variant="outline" onClick={clearSelection}>
                Clear
              </Button>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <XCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Display */}
          {uploadResult && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span>Upload thành công!</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm">
                  <strong>Filename:</strong> {uploadResult.filename}
                </p>
                <p className="text-sm">
                  <strong>URL:</strong> {uploadResult.url}
                </p>
              </div>

              {/* Image Preview */}
              <div className="border rounded-lg p-2">
                <img
                  src={uploadResult.url}
                  alt="Uploaded"
                  className="w-full max-w-md h-auto object-cover rounded"
                  onError={(e) => {
                    console.error("Failed to load image:", uploadResult.url);
                    e.target.src = "/placeholder-product.png";
                  }}
                />
              </div>
            </div>
          )}

          {/* Debug Info */}
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Debug Info:</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>
                <strong>Server URL:</strong> {getServerUrl()}
              </p>
              <p>
                <strong>Upload Endpoint:</strong> {getServerUrl()}/
              </p>
              <p>
                <strong>Image Folder:</strong> {getServerUrl()}/img/
              </p>
              <p>
                <strong>Selected File:</strong>{" "}
                {selectedFile ? selectedFile.name : "None"}
              </p>
              <p>
                <strong>Upload Status:</strong>{" "}
                {uploading ? "Uploading..." : "Ready"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TestUpload;
