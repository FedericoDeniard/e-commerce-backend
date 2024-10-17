import { Prisma, PrismaClient } from "@prisma/client";
import { BrandSchema } from "./get.js";

export const prisma = new PrismaClient();
const PAGE_SIZE = 10;

type ProductBrandSchema = {
  product_id: number;
  brand_id: number;
};
export type productSchema = {
  name: string;
  description: string;
  img_url: string;
  price: number;
  product_brand: ProductBrandSchema[];
};

export const createProduct = async (
  product: productSchema,
  brand_name: string
) => {
  let brand;
  try {
    brand = await prisma.brand.findUnique({
      where: { name: brand_name },
    });
    if (!brand) {
      throw new Error("Brand not found");
    }
    let existingProduct = await prisma.product.findUnique({
      where: { name: product.name },
    });
    if (existingProduct) {
      const updatedProduct = await prisma.product_Brand.create({
        data: {
          product: { connect: { id: existingProduct.id } },
          brand: { connect: { id: brand.id } },
          description: product.description,
          img_url: product.img_url,
          price: product.price,
        },
        include: { product: true, brand: true },
      });
      return updatedProduct;
    } else {
      const newProduct = await prisma.product.create({
        data: {
          name: product.name,
          product_brand: {
            create: [
              {
                brand: { connect: { id: brand.id } },
                description: product.description,
                img_url: product.img_url,
                price: product.price,
              },
            ],
          },
        },
        include: { product_brand: true },
      });
      return newProduct;
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
