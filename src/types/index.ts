export type ProductBrandSchema = {
  model: string;
  img_url: string;
  price: number;
  description: string;
};

export type ProductSchema = {
  name: string;
  brand_name: string;
  product_brand: ProductBrandSchema;
};

export type BrandSchema = {
  name: string;
  logo_url: string;
};
