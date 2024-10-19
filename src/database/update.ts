import { prisma } from "./create.js";

type ModifyProduct = {
  id: number;
  brand_id: number;
  model: string;
  img_url: string;
  price: number;
  description: string;
};

export const modifyProduct = async ({
  originalProduct,
  modifiedProduct,
}: {
  originalProduct: ModifyProduct;
  modifiedProduct: ModifyProduct;
}) => {
  try {
    const updatedProduct = await prisma.product_Brand.update({
      where: {
        product_id_brand_id_model: {
          product_id: originalProduct.id,
          brand_id: originalProduct.brand_id,
          model: originalProduct.model,
        },
      },
      data: {
        img_url: modifiedProduct.img_url,
        price: modifiedProduct.price,
        description: modifiedProduct.description,
      },
    });
    return updatedProduct;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Could not update product");
  }
};
