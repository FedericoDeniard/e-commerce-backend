import { prisma } from "./querys.js";
import { Prisma, PrismaClient } from "@prisma/client";

const PAGE_SIZE = 10;

export const getProducts = async () => {
  try {
    const products = await prisma.product.findMany({
      include: { product_brand: { include: { brand: true } } },
    });
    return products;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getProductByProductBrand = async ({ product_id, brand_id }) => {
  try {
    const products = await prisma.product_Brand.findFirst({
      where: {
        brand_id: parseInt(brand_id),
        product_id: parseInt(product_id),
      },
    });
    return products;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const filterProducts = async ({ name, brand, description }) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        AND: [
          name ? { name: { contains: name } } : {},
          brand
            ? { product_brand: { some: { brand: { name: { in: brand } } } } }
            : {},
          description
            ? {
                product_brand: {
                  some: { description: { contains: description } },
                },
              }
            : {},
        ],
      },
      include: {
        product_brand: {
          where: {
            description: description ? { contains: description } : undefined,
            brand: brand ? { name: { in: brand } } : undefined,
          },
          include: {
            brand: true,
          },
        },
      },
    });
    return products;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export type BrandSchema = {
  name: string;
  logo_url: string;
};
