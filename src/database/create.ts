import { Prisma, PrismaClient } from "@prisma/client";
import { BrandSchema } from "./get.js";

export const prisma = new PrismaClient();

type ProductBrandSchema = {
  model: string;
  img_url: string;
  price: number;
  description: string;
};

export type productSchema = {
  name: string;
  product_brand: ProductBrandSchema[];
};
export const createProduct = async (
  product: productSchema,
  brand_name: string
) => {
  try {
    const brand = await prisma.brand.findUnique({
      where: { name: brand_name },
    });

    if (!brand) {
      throw new Error("Brand not found");
    }

    const existingProduct = await prisma.product.findUnique({
      where: { name: product.name },
    });

    const productBrandData = {
      description: product.product_brand[0].description,
      img_url: product.product_brand[0].img_url,
      price: product.product_brand[0].price,
      model: product.product_brand[0].model,
    };

    if (existingProduct) {
      return await prisma.product_Brand.create({
        data: {
          product: { connect: { id: existingProduct.id } },
          brand: { connect: { id: brand.id } },
          ...productBrandData,
        },
        include: { product: true, brand: true },
      });
    } else {
      const newProduct = await prisma.product.create({
        data: { name: product.name },
      });

      return await prisma.product_Brand.create({
        data: {
          product: { connect: { id: newProduct.id } },
          brand: { connect: { id: brand.id } },
          ...productBrandData,
        },
        include: { product: true, brand: true },
      });
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const createBrand = async (brand: BrandSchema) => {
  try {
    const newBrand = await prisma.brand.create({
      data: brand,
    });
    return newBrand;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
