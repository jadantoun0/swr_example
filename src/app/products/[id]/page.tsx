"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetProduct, useUpdateProduct } from '@/hooks/products/useProducts';
import { Product } from '@/types/Product';
import React, { useEffect, useState } from 'react';

interface Params {
    params: {
        id: string;
    }
}

export default function ProductDetails({ params }: Params) {
    const { product, isProductLoading, mutateProduct } = useGetProduct(params.id);
    const { updateProduct, isProductUpdating, updateProductError } = useUpdateProduct();

    // Local state for managing form inputs
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState<number | ''>(''); 

    useEffect(() => {
        if (product) {
            // Populate the state with the product details when fetched
            setName(product.name);
            setDescription(product.description);
            setPrice(product.price);
        }
    }, [product]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
    
        try {
            const newProduct: Product = {
                id: typeof product?.id === 'number' ? product.id : 0,
                name,
                description,
                price: typeof price === 'number' ? price : 0,
            };
    
            // Invoke the updateProduct function with correct args
            await updateProduct({
                body: newProduct, 
                queryParams: {id: typeof product?.id === 'number' ? product.id.toString() : ''}
            });
            await mutateProduct();

            alert('Product updated successfully!');
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    };
    

    if (isProductLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <form
                className="flex flex-col items-center w-96 gap-y-4 mx-auto my-4"
                onSubmit={handleSubmit} // Attach the submit handler
            >
                <div className="flex flex-col w-full">
                    <label htmlFor="id">Id</label>
                    <Input
                        id="id"
                        placeholder="Enter id"
                        type="number"
                        value={product?.id}
                        required
                        readOnly // Optional: make it read-only if you don't want to edit the ID
                    />
                </div>
                <div className="flex flex-col w-full">
                    <label htmlFor="name">Name</label>
                    <Input
                        id="name"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)} // Update state on change
                        required
                    />
                </div>
                <div className="flex flex-col w-full">
                    <label htmlFor="description">Description</label>
                    <Input
                        id="description"
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} // Update state on change
                        required
                    />
                </div>
                <div className="flex flex-col w-full">
                    <label htmlFor="price">Price</label>
                    <Input
                        id="price"
                        placeholder="Enter price"
                        value={price || ''} // Handle empty state
                        type="number"
                        onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                        required
                    />
                </div>
                <Button type="submit" disabled={isProductUpdating}>
                    {isProductUpdating ? 'Updating...' : 'Edit Product'}
                </Button>
                {updateProductError && <p className="text-red-500">{updateProductError.message}</p>} {/* Error handling */}
            </form>     
        </div>
    );
}
