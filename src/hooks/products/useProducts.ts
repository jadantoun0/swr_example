import { Product } from "@/types/Product";
import { RequestInfo } from "@/types/RequestInfo";
import { useSWRCustomMutation } from "@/utils/swr/useSWRCustomMutation";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

const key = '/api/products';

export const useGetProducts = () => {
    const { data, isLoading, error, mutate } = useSWR<Product[]>(key);
    return { 
        products: data, 
        isProductsLoading: isLoading, 
        productsError: error, 
        mutateProducts: mutate, 
    };
}

export const useGetProduct = (id: string) => {
    const { data, isLoading, error, mutate } = useSWR<Product>(`${key}?id=${id}`);
    return { 
        product: data, 
        isProductLoading: isLoading, 
        productError: error, 
        mutateProduct: mutate, 
    };
}

export const useCreateProduct = () => {
    const { trigger, isMutating, error } = useSWRCustomMutation<Product, RequestInfo<Product>>(
        key, 
        "POST",
    );
  
    return { 
        createProduct: trigger, 
        isProductCreating: isMutating, 
        createProductError: error 
    };
};

export const useUpdateProduct = () => {
   const {trigger, isMutating, error}  = useSWRMutation(
    key,
    async (url: string, {arg}: {arg: {body: Product, queryParams: Record<string, string>}}) => {
        const { body, queryParams } = arg;
        const queryString = queryParams
        ? '?' + new URLSearchParams(queryParams).toString() 
        : '';
        const response = await fetch(`${url}${queryString}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error("Failed to update task: ${response.status} ${response.statusText}");
        }
        return await response.json();
    }
    )
    return { 
        updateProduct: trigger, 
        isProductUpdating: isMutating, 
        updateProductError: error 
    };
};

export const useDeleteProduct = () => {
    const {trigger, isMutating, error} = useSWRCustomMutation(key, "DELETE")

    return { 
        deleteProduct: trigger, 
        isProductDeleting: isMutating, 
        deleteProductError: error,
    };
}