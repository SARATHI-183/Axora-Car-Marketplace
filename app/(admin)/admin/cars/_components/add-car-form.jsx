"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"];
const transmissions = ["Automatic", "Manual", "Semi-Automatic"];
const bodyTypes = [
  "SUV",
  "Sedan",
  "Hatchback",
  "Convertible",
  "Coupe",
  "Wagon",
  "Pickup",
];
const carStatuses = ["AVAILABLE", "UNAVAILABLE", "SOLD"];

const AddCarForm = () => {
  const [activeTabs, setActiveTabs] = useState("ai");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageError, setImageError] = useState("");

  const carFormSchema = z.object({
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    year: z.string().refine((val) => {
      const year = parseInt(val);
      return (!isNaN(year) && year >= 1990 && year <= new Date().getFullYear() + 1);
    }, { message: "Valid year must be required" }),
    color: z.string().min(1, "Color is required"),
    price: z.string().min(1, "Price is required"),
    mileage: z.string().min(1, "Mileage is required"),
    fuelType: z.string().min(1, "Fuel type is required"),
    transmission: z.string().min(1, "Transmission is required"),
    bodyType: z.string().min(1, "Body type is required"),
    status: z.enum("AVAILABLE", "UNAVAILABLE", "SOLD"),
    seats: z.string().optional(),
    description: z.string().min(10, "Description must be at least 10 characters"),
    featured: z.boolean().default(false),
  });

  const {
    register,
    setValue,
    getValues,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      make: "",
      model: "",
      year: "",
      color: "",
      price: "",
      mileage: "",
      fuelType: "",
      bodyType: "",
      transmission: "",
      description: "",
      seats: "",
      status: "AVAILABLE",
      featured: false,
    },
  });

  const onSubmit = async (data) => {
    if (uploadedImages.length === 0) {
      setImageError("Please Upload at least one image");
      return;
    }
  };


  const onMultiImageDrop = (acceptedFiles) => {
    const validFiles = acceptedFiles.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds the 5MB limit and will be skipped`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;
    const newImages = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        newImages.push(e.target.result);

        if (newImages.length === validFiles.length) {
          setUploadedImages((prev) => [...prev, ...newImages]);
          setImageError("");
        }
        toast.success(`Successfully uploaded ${validFiles.length} images`);
      };

      reader.readAsDataURL(file);
    })

  }

  const {
    getRootProps: getMultipleImageRootProps,
    getInputProps: getMultipleImageInputProps
  } = useDropzone({
    onDrop: onMultiImageDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
  });

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div>
      <Tabs
        defaultValue="ai"
        className="mt-6"
        value={activeTabs}
        onValueChange={setActiveTabs}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="ai">AI Upload</TabsTrigger>
        </TabsList>
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Car details</CardTitle>
              <CardDescription>Enter the details of the car you want to add</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className='space-y-6'
              >
                <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>

                  {/* make */}
                  <div className='space-y-2'>
                    <Label htmlFor="make">Make</Label>
                    <Input
                      id="make"
                      {...register("make")}
                      placeholder="e.g., Toyota"
                      className={errors.make ? "border-red-500" : ""}
                    />
                    {errors.make && (
                      <p className="text-xs text-red-500">{errors.make.message}</p>
                    )}
                  </div>

                  {/* model */}
                  <div className='space-y-2'>
                    <Label htmlFor="model">model</Label>
                    <Input
                      id="model"
                      {...register("model")}
                      placeholder="e.g., Camry"
                      className={errors.model ? "border-red-500" : ""}
                    />
                    {errors.model && (
                      <p className="text-xs text-red-500">{errors.model.message}</p>
                    )}
                  </div>

                  {/* year */}
                  <div className='space-y-2'>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      {...register("year")}
                      placeholder="e.g., 2020"
                      className={errors.year ? "border-red-500" : ""}
                    />
                    {errors.year && (
                      <p className="text-xs text-red-500">{errors.year.message}</p>
                    )}
                  </div>

                  {/* price */}
                  <div className='space-y-2'>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      {...register("price")}
                      placeholder="e.g., 20000"
                      className={errors.price ? "border-red-500" : ""}
                    />
                    {errors.price && (
                      <p className="text-xs text-red-500">{errors.price.message}</p>
                    )}
                  </div>

                  {/* mileage */}
                  <div className='space-y-2'>
                    <Label htmlFor="mileage">Mileage</Label>
                    <Input
                      id="mileage"
                      {...register("mileage")}
                      placeholder="e.g., 20000"
                      className={errors.mileage ? "border-red-500" : ""}
                    />
                    {errors.mileage && (
                      <p className="text-xs text-red-500">{errors.mileage.message}</p>
                    )}
                  </div>

                  {/* color */}
                  <div className='space-y-2'>
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      {...register("color")}
                      placeholder="e.g., Red"
                      className={errors.color ? "border-red-500" : ""}
                    />
                    {errors.color && (
                      <p className="text-xs text-red-500">{errors.color.message}</p>
                    )}
                  </div>

                  {/* fuel type */}
                  <div className='space-y-2'>
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Select
                      onValueChange={(value) => setValue("fuelType", value)}
                      defaultValue={getValues("fuelTypes")}>
                      <SelectTrigger className={errors.fuelType ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          transmissions.map((type) => {
                            return (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            )
                          })
                        }
                      </SelectContent>
                    </Select>
                    {errors.transmission && (
                      <p className="text-xs text-red-500">{errors.transmission.message}</p>
                    )}
                  </div>

                  {/* transmission */}
                  <div className='space-y-2'>
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select
                      onValueChange={(value) => setValue("transmission", value)}
                      defaultValue={getValues("transmission")}>
                      <SelectTrigger className={errors.transmission ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          fuelTypes.map((type) => {
                            return (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            )
                          })
                        }
                      </SelectContent>
                    </Select>
                    {errors.fuelType && (
                      <p className="text-xs text-red-500">{errors.fuelType.message}</p>
                    )}
                  </div>

                  {/* body type */}
                  <div className='space-y-2'>
                    <Label htmlFor="bodyType">Body Type</Label>
                    <Select
                      onValueChange={(value) => setValue("bodyType", value)}
                      defaultValue={getValues("bodyType")}>
                      <SelectTrigger className={errors.bodyType ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select body type" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          bodyTypes.map((type) => {
                            return (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            )
                          })
                        }
                      </SelectContent>
                    </Select>
                    {errors.bodyType && (
                      <p className="text-xs text-red-500">{errors.bodyType.message}</p>
                    )}
                  </div>

                  {/* seats */}
                  <div className='space-y-2'>
                    <Label htmlFor="seats">
                      Number of Seats{" "}
                      <span className='text-sm text-gray-500'>(Optional)</span>
                    </Label>
                    <Input
                      id="seats"
                      {...register("seats")}
                      placeholder="e.g., 5"
                    />
                    {errors.seats && (
                      <p className="text-xs text-red-500">{errors.seats.message}</p>
                    )}
                  </div>

                  {/* status */}
                  <div className='space-y-2'>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      onValueChange={(value) => setValue("status", value)}
                      defaultValue={getValues("status")}>
                      <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          carStatuses.map((status) => {
                            return (
                              <SelectItem key={status} value={status}>
                                {status.charAt(0) + status.slice(1).toLowerCase()}
                              </SelectItem>
                            )
                          })
                        }
                      </SelectContent>
                    </Select>
                    {errors.fuelType && (
                      <p className="text-xs text-red-500">{errors.fuelType.message}</p>
                    )}
                  </div>

                </div>

                {/* description */}
                <div className='space-y-2'>
                  <Label htmlFor="description">Description</Label >
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Enter detailed description of the car..."
                    className={`min-h-32 ${errors.description ? "border-red-500" : ""
                      }`}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500">{errors.description.message}</p>
                  )}
                </div>

                <div className='flex items-start space-x-3 space-y-0 rounded-md border p-4'>
                  <Checkbox
                    id="featured"
                    checked={watch("featured")}
                    onCheckedChange={(checked) => {
                      setValue("featured", checked)
                    }}
                  />
                  <div className='space-y-1 leading-none'>
                    <Label>Feature this Car</Label>
                    <p className='text-sm text-gray-500'>Featured cars appear on the homepage</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="images"
                    className={imageError ? "text-red-500" : ""}
                  >
                    Images{" "}
                    {imageError && <span className='text-red-500'>*</span>}
                  </Label>
                  <div {...getMultipleImageRootProps()} className={`border-2 border-dashed rounded-md p-6 cursor-pointer hover:bg-gray-50 transition mt-2
                  ${imageError ? "border-red-500" : "border-gray-300"}`}>
                    <input {...getMultipleImageInputProps()} />
                    <div className='flex flex-col items-center justify-center'>
                      <Upload className='h-12 w-12 text-gray-400 mb-3' />
                      <p className='text-gray-600 text-sm'>
                        Drag & drop or click to upload multiple images
                      </p>
                      <p className='text-gray-500 text-xs mt-1'>(JPG, PNG, WebP, max 5MB each)</p>
                    </div>
                  </div>
                  {imageError && (
                    <p className="text-xs text-red-500 mt-1">{imageError}</p>
                  )}
                </div>

                {uploadedImages.length > 0 && (
                  <div className='mt-4'>
                    <h3 className='font-medium text-sm mb-2'>Uploaded Images ({uploadedImages.length})</h3>
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={image}
                            alt={`Uploaded car image ${index + 1}`}
                            height={50}
                            width={50}
                            className="h-28 w-full object-cover rounded-md"
                            priority
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onclick={() => removeImage(index)}
                          >
                            <X className='h-3 w-3' />
                          </Button>
                        </div>
                      ))
                      }
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ai">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}

export default AddCarForm;