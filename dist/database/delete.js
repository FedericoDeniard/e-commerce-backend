import { prisma } from "./create.js";
export const deleteProduct = async ({ id, brand_id, model, }) => {
    try {
        const deletedProduct = await prisma.product_Brand.delete({
            where: {
                product_id_brand_id_model: {
                    product_id: id,
                    brand_id: brand_id,
                    model: model,
                },
            },
        });
        return deletedProduct;
    }
    catch (error) {
        console.error("Error deleting product:", error);
        throw new Error("Could not delete product");
    }
};
//# sourceMappingURL=delete.js.map