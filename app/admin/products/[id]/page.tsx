'use client'

import ProductForm from "../ProductForm";

interface IEditProductPage {
    params: {
        id: string;
    };
}

export default function EditProductPage({ params }: IEditProductPage) {
    return <ProductForm productId={Number(params.id)} />;
}
