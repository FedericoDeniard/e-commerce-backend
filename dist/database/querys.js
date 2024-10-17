import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const newProduct = async (product) => {
    try {
        const newProduct = await prisma.product.create({
            data: product,
        });
        return newProduct;
    }
    catch (e) {
        console.error(e);
        throw e;
    }
};
//# sourceMappingURL=querys.js.map