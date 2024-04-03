"use client"

import React, { useState, useEffect } from "react"
import { DataTableDemo } from "@/components/Dashboard/DataTableDemo";

export default function Dashboard() {

  const PAGE_SIZE = 100;
  const convertVariantToTableFormat = (product) => {
    // Assuming only one variant per product for simplicity
    const metafields = product.metafields.edges.map((edge) =>{ return {key: edge.node.key, value: edge.node.value}});
    let index = metafields.findIndex((m) => m.key == 'colectia');
    let colectia = "";
    if (index >= 0) colectia = metafields[index]['value'];

    const variant = product.variants.edges[0].node;

    return {
      id: variant.id.replace('gid://shopify/ProductVariant/', ''),
      sku: variant.sku,
      title: product.title,
      vendor: product.vendor,
      custom_colectia: colectia, 
      price: parseFloat(variant.price),
      com_price: parseFloat(variant.compareAtPrice || '0'), // if compareAtPrice is null or undefined, default to '0'
      discount: null, // Placeholder value, set as required
      raise: null // Placeholder value, set as required
    };
  };

  const [allProducts, setAllProducts] = useState([]);
  const [allVendors, setAllVendors] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchAllProducts() {
    setLoading(true);
    try {
      const response = await fetch(`/api/products`);
      const data = await response.json();
      const transformedData = data.products.map(convertVariantToTableFormat);
      // console.log('transformData', transformedData);
      setAllProducts(transformedData); // Assuming the API returns an array of data      
      setData(transformedData);
      //get all vendors:3}, {a:1, b:5}];
      const uniqueVendorValues = [...new Set(transformedData.map(item => item.vendor))];
      console.log('vendors', uniqueVendorValues)
      setAllVendors(uniqueVendorValues)
    } catch (error) {
      console.error('An error occurred while fetching table data:', error);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchAllProducts();
  }, [])
  
  const handleChangeData = (data) => {
    setData(data);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <DataTableDemo
        data={data}
        vendors={allVendors}
        loading={loading}
        pageSize={PAGE_SIZE}
        onChangeData={handleChangeData}
      />
    </div>
  )
}