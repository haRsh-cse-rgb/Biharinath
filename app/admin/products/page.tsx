"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Search, ArrowLeft, X, Upload, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
// Cloudinary uploads handled via /api/upload

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    stockQuantity: '',
    sku: '',
    category: '',
    images: [] as string[],
    isFeatured: false,
  });
  const [imageInput, setImageInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();

      // Check if data is an array, if not use empty array
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      setProducts([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({ title: 'Category name is required', variant: 'destructive' });
      return;
    }

    try {
      // Generate slug from name
      const slug = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategoryName,
          slug: slug,
          description: newCategoryDescription,
          image: newCategoryImage,
        }),
      });

      if (res.ok) {
        const newCategory = await res.json();
        setCategories([...categories, newCategory]);
        setFormData({ ...formData, category: newCategory._id });
        setIsCategoryDialogOpen(false);
        setNewCategoryName('');
        setNewCategoryDescription('');
        setNewCategoryImage('');
        toast({ title: 'Category created successfully!' });
      } else {
        const errorData = await res.json();
        toast({ 
          title: 'Failed to create category', 
          description: errorData.error || 'Please try again',
          variant: 'destructive' 
        });
      }
    } catch (error) {
      toast({ title: 'Error creating category', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      stockQuantity: '',
      sku: '',
      category: '',
      images: [],
      isFeatured: false,
    });
    setImageInput('');
    setPreviewImages([]);
    setEditingProduct(null);
  };

   const generateUniqueSlug = async (name: string, existingSlug?: string) => {
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    if (existingSlug && existingSlug === baseSlug) {
      return existingSlug;
    }
    
    let slug = baseSlug;
    let counter = 1;
    
    // Check if slug already exists
    while (true) {
      const response = await fetch(`/api/products?slug=${slug}`);
      const existingProducts = await response.json();
      
      if (existingProducts.length === 0) {
        break;
      }
      
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    return slug;
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Generate unique slug from name if not provided
      const slug = formData.slug || await generateUniqueSlug(formData.name);
      
      const productData = {
        ...formData,
        slug,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        images: formData.images || [], // Ensure images array is included
        // Only include categoryId if it's a valid ObjectId format (24 character hex string)
        categoryId: formData.category && formData.category.length === 24 ? formData.category : undefined,
      };
      
      console.log('Creating product with data:', { ...productData, images: productData.images.length });
      
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        toast({ title: 'Product added successfully!' });
        setIsAddDialogOpen(false);
        resetForm();
        fetchProducts();
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        toast({ 
          title: 'Failed to add product', 
          description: errorData.error || 'Please check all required fields',
          variant: 'destructive' 
        });
      }
    } catch (error) {
      toast({ title: 'Error adding product', variant: 'destructive' });
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        images: formData.images || [], // Ensure images array is included
        // Only include categoryId if it's a valid ObjectId format (24 character hex string)
        categoryId: formData.category && formData.category.length === 24 ? formData.category : undefined,
      };
      
      console.log('Updating product with data:', { ...productData, images: productData.images.length });
      
      const res = await fetch(`/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        toast({ title: 'Product updated successfully!' });
        setIsEditDialogOpen(false);
        resetForm();
        fetchProducts();
      } else {
        toast({ title: 'Failed to update product', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error updating product', variant: 'destructive' });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast({ title: 'Product deleted successfully!' });
        fetchProducts();
      } else {
        toast({ title: 'Failed to delete product', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error deleting product', variant: 'destructive' });
    }
  };

  const openEditDialog = async (product: any) => {
    setEditingProduct(product);
    const existingImages = product.images || [];
    
    // Ensure categories are loaded
    if (categories.length === 0) {
      await fetchCategories();
    }
    
    setFormData({
      name: product.name,
      slug: product.slug || '',
      description: product.description || '',
      price: product.price.toString(),
      stockQuantity: product.stockQuantity.toString(),
      sku: product.sku,
      category: product.categoryId?.toString() || product.category?._id?.toString() || product.category || '',
      images: existingImages,
      isFeatured: product.isFeatured || false,
    });
    setPreviewImages(existingImages);
    setIsEditDialogOpen(true);
  };

  const addImage = () => {
    const url = imageInput.trim();
    if (url) {
      // Validate URL format
      try {
        new URL(url);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, url],
        }));
        setPreviewImages(prev => [...prev, url]);
        setImageInput('');
        toast({ title: 'Image URL added successfully!' });
      } catch (error) {
        toast({ 
          title: 'Invalid URL', 
          description: 'Please enter a valid image URL',
          variant: 'destructive' 
        });
      }
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        try {
          const fd = new FormData();
          fd.append('file', file);
          const res = await fetch('/api/upload', { method: 'POST', body: fd });
          
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Upload failed' }));
            console.error('Upload error:', errorData);
            throw new Error(errorData.error || `Failed to upload ${file.name}`);
          }
          
          const data = await res.json();
          if (!data.url) {
            throw new Error(`No URL returned for ${file.name}`);
          }
          return data.url as string;
        } catch (error: any) {
          console.error(`Error uploading ${file.name}:`, error);
          toast({ 
            title: `Failed to upload ${file.name}`, 
            description: error.message || 'Upload failed',
            variant: 'destructive' 
          });
          return null;
        }
      });
      
      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter((url): url is string => !!url);

      if (validUrls.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...validUrls],
        }));
        setPreviewImages(prev => [...prev, ...validUrls]);
        toast({ 
          title: `${validUrls.length} image(s) uploaded successfully!`,
          description: validUrls.length < files.length 
            ? `${files.length - validUrls.length} image(s) failed to upload`
            : undefined
        });
      } else {
        toast({ 
          title: 'Failed to upload images', 
          description: 'Please check your Cloudinary configuration or try again',
          variant: 'destructive' 
        });
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({ 
        title: 'Error uploading images', 
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive' 
      });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const filteredProducts = Array.isArray(products) ? products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center flex-wrap gap-2">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Manage Products</h1>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug (URL) *</Label>
                  <Input
                    id="slug"
                    placeholder="Leave empty to auto-generate from name"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      id="stock"
                      type="number"
                      required
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      required
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category (Optional)</Label>
                    <div className="flex gap-2">
                      <Select value={formData.category || undefined} onValueChange={(value) => setFormData({ ...formData, category: value === 'none' ? '' : value })}>
                        <SelectTrigger id="category" className="flex-1">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat._id} value={cat._id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCategoryDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                  />
                  <Label htmlFor="isFeatured" className="cursor-pointer">
                    Mark as Featured Product
                  </Label>
                </div>
                <div>
                  <Label>Product Images</Label>
                  <div className="mt-2 space-y-3">
                    <div className="flex gap-2">
                      <label className="flex-1">
                        <div className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                          {uploading ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-5 w-5 animate-spin" />
                              <span>Uploading...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Upload className="h-5 w-5" />
                              <span>Upload Images</span>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    </div>
                    {/* <div className="text-sm text-gray-500">Or enter image URL:</div> */}
                    {/* <div className="flex gap-2">
                      <Input
                        placeholder="Image URL"
                        value={imageInput}
                        onChange={(e) => setImageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                      />
                      <Button type="button" onClick={addImage} size="sm" variant="outline">
                        Add
                      </Button>
                    </div> */}
                    {previewImages.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-3">
                        {previewImages.map((img, index) => (
                          <div key={index} className="relative group">
                            <img src={img} alt="Product" className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200" />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Add Product
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product._id}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative h-20 w-20 flex-shrink-0">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover rounded"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.sku}</p>
                    <p className="text-sm">
                      <span className="font-semibold text-green-600">₹{product.price}</span>
                      <span className="text-gray-500 ml-2">Stock: {product.stockQuantity}</span>
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditProduct} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Product Name *</Label>
                <Input
                  id="edit-name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-slug">Slug (URL)</Label>
                <Input
                  id="edit-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-price">Price (₹) *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-stock">Stock Quantity *</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    required
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-sku">SKU *</Label>
                  <Input
                    id="edit-sku"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category">Category (Optional)</Label>
                  <div className="flex gap-2">
                    <Select value={formData.category || undefined} onValueChange={(value) => setFormData({ ...formData, category: value === 'none' ? '' : value })}>
                      <SelectTrigger id="edit-category" className="flex-1">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCategoryDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                />
                <Label htmlFor="edit-isFeatured" className="cursor-pointer">
                  Mark as Featured Product
                </Label>
              </div>
              <div>
                <Label>Product Images</Label>
                <div className="mt-2 space-y-3">
                  <div className="flex gap-2">
                    <label className="flex-1">
                      <div className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                        {uploading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Uploading...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Upload className="h-5 w-5" />
                            <span>Upload Images</span>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  {/* <div className="text-sm text-gray-500">Or enter image URL:</div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Image URL"
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                    />
                    <Button type="button" onClick={addImage} size="sm" variant="outline">
                      Add
                    </Button>
                  </div> */}
                  {previewImages.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-3">
                      {previewImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <img src={img} alt="Product" className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => { setIsEditDialogOpen(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Update Product
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Category Creation Dialog */}
        <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-category-name">Category Name *</Label>
                <Input
                  id="new-category-name"
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g., Organic Fruits"
                />
              </div>
              <div>
                <Label htmlFor="new-category-description">Description</Label>
                <Textarea
                  id="new-category-description"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  placeholder="Category description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="new-category-image">Image URL</Label>
                <Input
                  id="new-category-image"
                  value={newCategoryImage}
                  onChange={(e) => setNewCategoryImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => {
                  setIsCategoryDialogOpen(false);
                  setNewCategoryName('');
                  setNewCategoryDescription('');
                  setNewCategoryImage('');
                }}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleCreateCategory} className="bg-green-600 hover:bg-green-700">
                  Create Category
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
