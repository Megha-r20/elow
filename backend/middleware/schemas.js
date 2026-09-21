import { z } from "zod";

// Auth Validation Schemas
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Invalid email address format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address format"),
    password: z.string().min(1, "Password is required"),
  }),
});

// Product Validation Schemas
export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Product name must be at least 2 characters long"),
    category: z.string().min(1, "Category is required"),
    subcategory: z.string().optional(),
    price: z.number({ invalid_type_error: "Price must be a number" }).positive("Price must be a positive number"),
    originalPrice: z.number().positive().optional().nullable(),
    description: z.string().optional(),
    images: z.array(z.string()).optional(),
    inStock: z.boolean().optional(),
    isNew: z.boolean().optional(),
    isBestseller: z.boolean().optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    category: z.string().min(1).optional(),
    subcategory: z.string().optional(),
    price: z.number().positive().optional(),
    originalPrice: z.number().positive().optional().nullable(),
    description: z.string().optional(),
    images: z.array(z.string()).optional(),
    inStock: z.boolean().optional(),
    isNew: z.boolean().optional(),
    isBestseller: z.boolean().optional(),
  }),
});

// Order Validation Schema
export const createOrderSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          product: z.object({
            id: z.string().min(1, "Product ID is required"),
          }).passthrough().optional(),
          productId: z.string().optional(),
          qty: z.number().int("Quantity must be a positive integer").positive("Quantity must be greater than 0").optional(),
          quantity: z.number().int("Quantity must be a positive integer").positive("Quantity must be greater than 0").optional(),
        })
      )
      .min(1, "Cart must contain at least one item"),
    deliveryAddress: z.object({
      firstName: z.string().min(1, "First name is required"),
      lastName: z.string().min(1, "Last name is required"),
      email: z.string().email("Valid delivery email is required"),
      phone: z.string().min(1, "Phone number is required"),
      address: z.string().min(1, "Delivery address is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().optional(),
      pincode: z.string().min(1, "Pincode is required"),
    }),
    payMethod: z.string().optional(),
    promoCode: z.string().optional(),
    giftWrap: z.boolean().optional(),
    stripePaymentIntentId: z.string().optional(),
  }),
});

// Review Validation Schemas
export const submitReviewSchema = z.object({
  body: z.object({
    rating: z.number().min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5"),
    title: z.string().min(1, "Review title is required"),
    comment: z.string().min(1, "Review comment is required"),
    userName: z.string().optional(),
    userEmail: z.string().email("Invalid user email").optional(),
    orderId: z.string().optional(),
  }),
});

export const updateReviewStatusSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "approved", "rejected"], {
      errorMap: () => ({ message: "Status must be pending, approved, or rejected" }),
    }),
  }),
});
