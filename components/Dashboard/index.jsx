"use client"

import React, { useState, useEffect } from "react"
import { DataTableDemo } from "@/components/Dashboard/DataTableDemo";

export default function Dashboard() {

    const PAGE_SIZE = 20;
    const convertVariantToTableFormat = (product) => {
      // Assuming only one variant per product for simplicity
      const variant = product.variants.edges[0].node;
    
      return {
        id: variant.id.replace('gid://shopify/ProductVariant/', ''),
        sku: variant.sku,
        title: product.title,
        vendor: product.vendor,
        price: parseFloat(variant.price),
        com_price: parseFloat(variant.compareAtPrice || '0'), // if compareAtPrice is null or undefined, default to '0'
        discount: null, // Placeholder value, set as required
        raise: null // Placeholder value, set as required
      };
    };
    
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  // Inside the Home component
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchData(page) {
      setLoading(true);
      try {
        const response = await fetch(`/api/products/?page=${page}&pageSize=${PAGE_SIZE}`);
        const data = await response.json();
        const transformedData = data.products.map(convertVariantToTableFormat);
        setData(transformedData); // Assuming the API returns an array of data
      } catch (error) {
        console.error('An error occurred while fetching table data:', error);
      }
      setLoading(false);
    }

    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


    return (
        <div className="flex min-h-screen flex-col items-center justify-between p-24">  
            <DataTableDemo
                data={data}
                onPageChange={handlePageChange}
                loading={loading}
                currentPage={currentPage}
            />   
        </div>
    )
}