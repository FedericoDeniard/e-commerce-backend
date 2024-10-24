import { prisma } from "./create.js";
export const modifyProduct = async ({ originalProduct, modifiedProduct, }) => {
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
    }
    catch (error) {
        console.error("Error updating product:", error);
        throw new Error("Could not update product");
    }
};
//# sourceMappingURL=update.js.map