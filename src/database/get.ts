import { prisma } from "./create.js";

export const getProducts = async () => {
  try {
    const products = await prisma.product.findMany({
      include: { product_brand: { include: { brand: true } } },
    });
    const transformedProducts = products.flatMap((product) =>
      product.product_brand.map((pb) => ({
        id: product.id,
        name: product.name,
        product_id: pb.product_id,
        brand_id: pb.brand_id,
        img_url: pb.img_url,
        price: pb.price,
        description: pb.description,
        brand: {
          id: pb.brand.id,
          name: pb.brand.name,
          logo_url: pb.brand.logo_url,
        },
      }))
    );
    return transformedProducts;
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
          brand || description
            ? {
                product_brand: {
                  some: {
                    AND: [
                      brand ? { brand: { name: { in: brand } } } : {},
                      description
                        ? {
                            description: {
                              contains: description,
                            },
                          }
                        : {},
                    ],
                  },
                },
              }
            : {},
        ],
      },
      include: {
        product_brand: {
          where: {
            AND: [
              brand ? { brand: { name: { in: brand } } } : {},
              description
                ? {
                    description: { contains: description },
                  }
                : {},
            ],
          },
          include: {
            brand: true,
          },
        },
      },
    });

    const transformedProducts = products.flatMap((product) =>
      product.product_brand.map((pb) => ({
        id: product.id,
        name: product.name,
        product_id: pb.product_id,
        brand_id: pb.brand_id,
        img_url: pb.img_url,
        price: pb.price,
        description: pb.description,
        brand: {
          id: pb.brand.id,
          name: pb.brand.name,
          logo_url: pb.brand.logo_url,
        },
      }))
    );

    return transformedProducts;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export type BrandSchema = {
  name: string;
  logo_url: string;
};
