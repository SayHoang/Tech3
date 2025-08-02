import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  GET_PRODUCT_BY_ID,
  GET_ALL_CATEGORIES,
  GET_ALL_MANUFACTURERS,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
} from "../../graphql/admin/products.js";
import { UPLOAD_FILE } from "../../graphql/upload.js";
import { getServerUrl } from "../../lib/imageUtils.js";

function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categoryId: "",
    manufacturerId: "",
    imageUrl: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // GraphQL queries
  const { data: categoriesData, loading: categoriesLoading } = useQuery(
    GET_ALL_CATEGORIES,
    {
      variables: { orderBy: ["NAME_ASC"] },
    }
  );

  const { data: manufacturersData, loading: manufacturersLoading } = useQuery(
    GET_ALL_MANUFACTURERS,
    {
      variables: { orderBy: ["NAME_ASC"] },
    }
  );

  // Load product data for editing
  const {
    data: productData,
    loading: productLoading,
    error: productError,
  } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { _id: id },
    skip: !isEditing,
    onCompleted: (data) => {
      if (data.product) {
        setFormData({
          name: data.product.name || "",
          price: data.product.price?.toString() || "",
          categoryId: data.product.categoryId || "",
          manufacturerId: data.product.manufacturerId || "",
          imageUrl: data.product.imageUrl || "",
        });
      }
    },
  });

  // Mutations
  const [createProduct] = useMutation(CREATE_PRODUCT, {
    onCompleted: () => {
      alert("Tạo sản phẩm thành công!");
      navigate("/admin/products");
    },
    onError: (error) => {
      console.error("Create error:", error);
      alert("Có lỗi xảy ra khi tạo sản phẩm!");
      setIsSubmitting(false);
    },
  });

  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    onCompleted: () => {
      alert("Cập nhật sản phẩm thành công!");
      navigate("/admin/products");
    },
    onError: (error) => {
      console.error("Update error:", error);
      alert("Có lỗi xảy ra khi cập nhật sản phẩm!");
      setIsSubmitting(false);
    },
  });

  // Upload file mutation
  const [uploadFile] = useMutation(UPLOAD_FILE, {
    onCompleted: (data) => {
      console.log("Upload completed successfully:", data);
      const uploadedFileName = data.upload;
      const imageUrl = `${getServerUrl()}/img/${uploadedFileName}`;
      setFormData((prev) => ({ ...prev, imageUrl }));
      setSelectedFile(null);
      setIsUploading(false);
      // Clear file input
      const fileInput = document.getElementById("file-input");
      if (fileInput) fileInput.value = "";
      alert("Upload hình ảnh thành công!");
    },
    onError: (error) => {
      console.error("Upload error details:", error);
      console.error("Error message:", error.message);
      console.error("Error graphQL errors:", error.graphQLErrors);
      console.error("Error network error:", error.networkError);
      alert(`Có lỗi xảy ra khi upload hình ảnh: ${error.message}`);
      setIsUploading(false);
    },
  });

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên sản phẩm không được để trống";
    }

    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price <= 0) {
      newErrors.price = "Giá phải là số lớn hơn 0";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Vui lòng chọn danh mục";
    }

    if (!formData.manufacturerId) {
      newErrors.manufacturerId = "Vui lòng chọn nhà sản xuất";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const productInput = {
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      categoryId: formData.categoryId,
      manufacturerId: formData.manufacturerId,
      imageUrl: formData.imageUrl.trim() || null,
    };

    try {
      if (isEditing) {
        await updateProduct({
          variables: {
            _id: id,
            input: productInput,
          },
        });
      } else {
        await createProduct({
          variables: {
            input: productInput,
          },
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      setIsSubmitting(false);
    }
  };

  // Handle image URL change
  const handleImageUrlChange = (e) => {
    handleInputChange("imageUrl", e.target.value);
  };

  // Handle file selection
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
        alert("Chỉ chấp nhận file hình ảnh (JPG, PNG, GIF)!");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File không được lớn hơn 10MB!");
        return;
      }

      setSelectedFile(file);
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Vui lòng chọn file hình ảnh!");
      return;
    }

    setIsUploading(true);
    try {
      await uploadFile({ variables: { file: selectedFile } });
    } catch (error) {
      console.error("Upload failed:", error);
      setIsUploading(false);
    }
  };

  // Clear selected file
  const clearSelectedFile = () => {
    setSelectedFile(null);
    document.getElementById("file-input").value = "";
  };

  const categories = categoriesData?.categories?.nodes || [];
  const manufacturers = manufacturersData?.manufacturers?.nodes || [];

  // Loading state
  if (isEditing && productLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (isEditing && productError) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Không tìm thấy sản phẩm hoặc có lỗi xảy ra!</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link to="/admin/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? "Chỉnh sửa Sản phẩm" : "Thêm Sản phẩm mới"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing
              ? "Cập nhật thông tin sản phẩm"
              : "Điền thông tin để tạo sản phẩm mới"}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Nhập tên sản phẩm"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Giá (VNĐ) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="Nhập giá sản phẩm"
                    className={errors.price ? "border-red-500" : ""}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500">{errors.price}</p>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Danh mục <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      handleInputChange("categoryId", value)
                    }
                  >
                    <SelectTrigger
                      className={errors.categoryId ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesLoading ? (
                        <div className="flex justify-center py-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && (
                    <p className="text-sm text-red-500">{errors.categoryId}</p>
                  )}
                </div>

                {/* Manufacturer */}
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">
                    Nhà sản xuất <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.manufacturerId}
                    onValueChange={(value) =>
                      handleInputChange("manufacturerId", value)
                    }
                  >
                    <SelectTrigger
                      className={errors.manufacturerId ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Chọn nhà sản xuất" />
                    </SelectTrigger>
                    <SelectContent>
                      {manufacturersLoading ? (
                        <div className="flex justify-center py-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        manufacturers.map((manufacturer) => (
                          <SelectItem
                            key={manufacturer._id}
                            value={manufacturer._id}
                          >
                            {manufacturer.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.manufacturerId && (
                    <p className="text-sm text-red-500">
                      {errors.manufacturerId}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Image Upload */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hình ảnh sản phẩm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Upload Section */}
                <div className="space-y-2">
                  <Label htmlFor="file-input">Upload hình ảnh</Label>
                  <div className="flex gap-2">
                    <Input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleFileUpload}
                      disabled={!selectedFile || isUploading}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      {isUploading ? "Đang upload..." : "Upload"}
                    </Button>
                    {selectedFile && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={clearSelectedFile}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {selectedFile && (
                    <p className="text-sm text-gray-600">
                      File được chọn: {selectedFile.name}
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 border-t"></div>
                  <span className="text-sm text-gray-500">hoặc</span>
                  <div className="flex-1 border-t"></div>
                </div>

                {/* Image URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL Hình ảnh</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={handleImageUrlChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Image Preview */}
                {formData.imageUrl && (
                  <div className="space-y-2">
                    <Label>Xem trước</Label>
                    <div className="border rounded-lg p-2">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded"
                        onError={(e) => {
                          e.target.src = "/placeholder-product.png";
                        }}
                      />
                    </div>
                  </div>
                )}

                <p className="text-sm text-gray-500">
                  Upload file hình ảnh hoặc nhập URL. Hình ảnh sẽ được hiển thị
                  với tỷ lệ 1:1. File hỗ trợ: JPG, PNG, GIF (tối đa 5MB).
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/products")}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isEditing ? "Đang cập nhật..." : "Đang tạo..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? "Cập nhật" : "Tạo sản phẩm"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
