-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "img_url" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "logo_url" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Product_Brand" (
    "product_id" INTEGER NOT NULL,
    "brand_id" INTEGER NOT NULL,

    PRIMARY KEY ("product_id", "brand_id"),
    CONSTRAINT "Product_Brand_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_Brand_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_BrandToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_BrandToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Brand" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BrandToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_BrandToProduct_AB_unique" ON "_BrandToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_BrandToProduct_B_index" ON "_BrandToProduct"("B");
