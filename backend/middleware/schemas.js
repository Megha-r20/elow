import { z } from "zod";

// Auth Validation Schemas
export const registerSchema = z.object({
  body: z
    .object({
      name: z.string().min(2, "Name must be at least 2 characters long").max(100, "Name cannot exceed 100 characters"),
      email: z.string().email("Invalid email address format").max(255, "Email cannot exceed 255 characters"),
      password: z.string().min(6, "Password must be at least 6 characters long").max(128, "Password cannot exceed 128 characters"),
    })
    .strict(),
});

export const loginSchema = z.object({
  body: z
    .object({
      email: z.string().email("Invalid email address format").max(255, "Email cannot exceed 255 characters"),
      password: z.string().min(1, "Password is required").max(128, "Password cannot exceed 128 characters"),
    })
    .strict(),
});

export const updateProfileSchema = z.object({
  body: z
    .object({
      name: z.string().min(2, "Name must be at least 2 characters long").max(100, "Name cannot exceed 100 characters").optional(),
      email: z.string().email("Invalid email address format").max(255, "Email cannot exceed 255 characters").optional(),
      phone: z.string().max(20, "Phone number cannot exceed 20 characters").optional(),
      bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
      avatar: z.string().max(1000, "Avatar URL cannot exceed 1000 characters").optional(),
      address: z.string().max(500, "Address cannot exceed 500 characters").optional(),
      currentPassword: z.string().max(128, "Password cannot exceed 128 characters").optional(),
      newPassword: z.string().min(6, "New password must be at least 6 characters long").max(128, "Password cannot exceed 128 characters").optional(),
    })
    .strict(),
});

// Product Validation Schemas
export const createProductSchema = z.object({
  body: z
    .object({
      name: z.string().min(2, "Product name must be at least 2 characters long").max(200, "Product name cannot exceed 200 characters"),
      category: z.string().min(1, "Category is required").max(100, "Category cannot exceed 100 characters"),
      subcategory: z.string().max(100, "Subcategory cannot exceed 100 characters").optional(),
      price: z.number().positive("Price must be a positive number"),
      originalPrice: z.number().positive().optional().nullable(),
      description: z.string().max(2000, "Description cannot exceed 2000 characters").optional(),
      images: z.array(z.string().max(1000)).optional(),
      inStock: z.boolean().optional(),
      stockCount: z.number().int("Stock count must be an integer").min(0, "Stock count cannot be negative").optional(),
      isNew: z.boolean().optional(),
      isBestseller: z.boolean().optional(),
    })
    .strict(),
});

export const updateProductSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).max(200).optional(),
      category: z.string().min(1).max(100).optional(),
      subcategory: z.string().max(100).optional(),
      price: z.number().positive().optional(),
      originalPrice: z.number().positive().optional().nullable(),
      description: z.string().max(2000).optional(),
      images: z.array(z.string().max(1000)).optional(),
      inStock: z.boolean().optional(),
      stockCount: z.number().int("Stock count must be an integer").min(0, "Stock count cannot be negative").optional(),
      isNew: z.boolean().optional(),
      isBestseller: z.boolean().optional(),
    })
    .strict(),
});

// Order Validation Schema
export const createOrderSchema = z.object({
  body: z
    .object({
      id: z.string().max(100).optional(),
      items: z
        .array(
          z
            .object({
              product: z
                .object({
                  id: z.string().min(1, "Product ID is required").max(100),
                })
                .passthrough()
                .optional(),
              productId: z.string().max(100).optional(),
              id: z.string().max(100).optional(),
              qty: z.number().int("Quantity must be a positive integer").positive("Quantity must be greater than 0").optional(),
              quantity: z.number().int("Quantity must be a positive integer").positive("Quantity must be greater than 0").optional(),
            })
            .passthrough()
        )
        .min(1, "Cart must contain at least one item"),
      deliveryAddress: z.object({
        firstName: z.string().min(1, "First name is required").max(100),
        lastName: z.string().min(1, "Last name is required").max(100),
        email: z.string().email("Valid delivery email is required").max(255),
        phone: z.string().min(1, "Phone number is required").max(20),
        address: z.string().min(1, "Delivery address is required").max(500),
        city: z.string().min(1, "City is required").max(100),
        state: z.string().max(100).optional(),
        pincode: z.string().min(1, "Pincode is required").max(20),
      }),
      payMethod: z.string().max(50).optional(),
      promoCode: z.string().max(50).optional(),
      giftWrap: z.boolean().optional(),
      stripePaymentIntentId: z.string().max(255).optional(),
    })
    .strict(),
});

// Review Validation Schemas
export const submitReviewSchema = z.object({
  body: z
    .object({
      rating: z.number().min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5"),
      title: z.string().min(1, "Review title is required").max(200, "Review title cannot exceed 200 characters"),
      comment: z.string().min(1, "Review comment is required").max(2000, "Review comment cannot exceed 2000 characters"),
      userName: z.string().max(100).optional(),
      userEmail: z.string().email("Invalid user email").max(255).optional(),
      orderId: z.string().max(100).optional(),
    })
    .strict(),
});

export const updateReviewStatusSchema = z.object({
  body: z
    .object({
      status: z.enum(["pending", "approved", "rejected"]),
    })
    .strict(),
});
