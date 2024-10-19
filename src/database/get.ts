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
        model: pb.model,
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
export const filterProducts = async ({
  name,
  brand,
  description,
  model,
  id,
}: {
  name?: string;
  brand?: string[];
  description?: string;
  model?: string;
  id?: number;
}) => {
  try {
    console.log(name, brand, description, model, id);
    const products = await prisma.product.findMany({
      where: {
        AND: [
          name ? { name: { contains: name } } : {},
          id ? { id } : {},
          brand || description || model
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
                      model ? { model: { contains: model } } : {},
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
              model ? { model: { contains: model } } : {},
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
        model: pb.model,
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
export const findProducts = async (
  name?: string,
  brand?: string[],
  description?: string
) => {
  const products = await prisma.product.findMany({
    where: {
      AND: [
        name ? { name: { contains: name } } : {},
        brand && brand.length > 0
          ? {
              product_brand: {
                some: {
                  brand: {
                    name: {
                      in: brand,
                    },
                  },
                },
              },
            }
          : {},
        description
          ? {
              product_brand: {
                some: {
                  description: { contains: description },
                },
              },
            }
          : {},
      ],
    },
    include: {
      product_brand: {
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
      model: pb.model,
      brand: {
        id: pb.brand.id,
        name: pb.brand.name,
        logo_url: pb.brand.logo_url,
      },
    }))
  );

  return transformedProducts;
};
