import { PrismaClient } from "@prisma/client";
import { capitalize } from "../utils/string.js";

const prisma = new PrismaClient();

type ProductBrandSchema = {
  product_id: number;
  brand_id: number;
};
export type productSchema = {
  name: string;
  description: string;
  img_url: string;
  product_brand: ProductBrandSchema[];
};

export const getProducts = async () => {
  try {
    const products = await prisma.product.findMany();
    return products;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getProductByBrand = async (brandName: string) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        Product_Brand: {
          some: {
            brand: {
              name: brandName,
            },
          },
        },
      },
      include: { Product_Brand: true },
    });
    return products;
  } catch (e) {
    console.error(e);
    throw e;
  }
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
    const newProduct = await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        img_url: product.img_url,
        Product_Brand: {
          create: [
            {
              brand: { connect: { id: brand.id } },
            },
          ],
        },
      },
      include: { Product_Brand: true },
    });
    return newProduct;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export type BrandSchema = {
  name: string;
  logo_url: string;
};

export const getBrands = async () => {
  try {
    const brands = await prisma.brand.findMany();
    return brands;
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
