import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
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

export type BrandSchema = {
  name: string;
  logo_url: string;
};

export const getBrands = async (cursor?: number) => {
  try {
    const brands = await prisma.brand.findMany({
      take: PAGE_SIZE,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: { id: "asc" },
    });
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
export const getProductsByFilters = async (
  all?: string,
  product_name?: string,
  brand_name?: string[],
  description?: string
) => {
  try {
    const filterName: Prisma.ProductWhereInput = {
      OR: [],
    };

    if (all) {
      filterName.OR.push({
        name: {
          contains: all,
        },
      });
    }

    if (product_name) {
      filterName.OR.push({
        name: {
          contains: product_name,
        },
      });
    }

    const products = await prisma.product.findMany({
      where: filterName,
      include: {
        product_brand: {
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

export const getProductByString = async (filter: string) => {
  try {
    const productsByName = await prisma.product.findMany({
      where: {
        name: {
          contains: filter,
        },
      },
      include: {
        product_brand: {
          include: {
            brand: true,
          },
        },
      },
    });

    const productsByDescriptionOrBrand = await prisma.product.findMany({
      where: {
        OR: [
          {
            product_brand: {
              some: {
                brand: {
                  name: {
                    contains: filter,
                  },
                },
              },
            },
          },
          {
            product_brand: {
              some: {
                description: {
                  contains: filter,
                },
              },
            },
          },
        ],
      },
      include: {
        product_brand: {
          include: {
            brand: true,
          },
          where: {
            OR: [
              {
                brand: {
                  name: {
                    contains: filter,
                  },
                },
              },
              {
                description: {
                  contains: filter,
                },
              },
            ],
          },
        },
      },
    });

    const combinedResults = [
      ...productsByName,
      ...productsByDescriptionOrBrand,
    ];

    const uniqueProducts = Array.from(
      new Set(combinedResults.map((product) => product.id))
    ).map((id) => combinedResults.find((product) => product.id === id));

    return uniqueProducts;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
