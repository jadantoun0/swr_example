"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateProduct, useDeleteProduct, useGetProducts } from "@/hooks/products/useProducts";
import { Product } from "@/types/Product";
import { FormEvent, useState } from "react";
import { useRouter } from 'next/navigation';
import { RequestInfo } from "@/types/RequestInfo";


export default function Home() {
  const [id, setId] = useState<number | ''>('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');

  const router = useRouter();

  const { products, mutateProducts } = useGetProducts();
  const { createProduct } = useCreateProduct();
  const { deleteProduct } = useDeleteProduct();

  const handleAddProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newProduct: Product = {
      id: typeof id === 'number' ? id : 0,
      name,
      description,
      price: typeof price === 'number' ? price : 0,
    };

    const requestInfo: RequestInfo<Product> = {
      body: newProduct,
    }

    await createProduct(requestInfo);
    await mutateProducts();
    // Reset form inputs
    setId('');
    setName('');
    setDescription('');
    setPrice('');
  };

  const handleDelete = async (id: number) => {
    const requestInfo: RequestInfo = {
      queryParams: {id: id.toString()}
    }
    await deleteProduct(requestInfo);
    await mutateProducts();
  };

  return (
    <div>
      <form
        className="flex flex-col items-center w-96 gap-y-4 mx-auto my-4"
        onSubmit={handleAddProduct}
      >
        <div className="flex flex-col w-full">
          <label htmlFor="id">Id</label>
          <Input
            id="id"
            placeholder="Enter id"
            value={id}
            type="number"
            onChange={(e) => setId(e.target.value === '' ? '' : parseFloat(e.target.value))}
            required
          />
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="name">Name</label>
          <Input
            id="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="description">Description</label>
          <Input
            id="description"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="price">Price</label>
          <Input
            id="price"
            placeholder="Enter price"
            value={price}
            type="number"
            onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
            required
          />
        </div>
        <Button type="submit">Add Product</Button>
      </form>

      <div>
        {products?.map((product, index) => (
          <div
            onClick={() => router.push(`/products/${product?.id}`)}
            key={index}
            className="border border-slate-20 mx-auto px-3 py-2 rounded flex justify-between items-center max-w-80 my-9"
          >
            <div>
              <p className="text-xs">#{product.id}</p>
              <p className="font-bold">{product.name}</p>
              <p className="text-sm">{product.description}</p>
              <p className="text-md">{product.price}</p>
            </div>
            <Button variant={"outline"} onClick={() => handleDelete(product.id)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
