"use client"

import React, { useState, useEffect } from "react"
import { DataTableDemo } from "@/components/Dashboard/DataTableDemo";
import axios from 'axios';

export default function Dashboard() {

  const PAGE_SIZE = 100;

  const [allProducts, setAllProducts] = useState([]);
  const [allVendors, setAllVendors] = useState([]);
  const [allColectia, setAllColectia] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingFlag, setUpdatingFlag] = useState(false);

  const convertVariantToTableFormat = (product) => {
    // Assuming only one variant per product for simplicity
    const metafields = product.metafields.edges.map((edge) =>{ return {key: edge.node.key, value: edge.node.value, namespace: edge.node.namespace}});
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

  async function fetchAllProducts() {
    setLoading(true);
    try {
      const response = await fetch(`/api/products`);
      const data = await response.json();
      const transformedData = data.products.map(convertVariantToTableFormat);
      // console.log('transformData', transformedData);
      setAllProducts(transformedData); // Assuming the API returns an array of data      
      setData([...transformedData.map(v => ({...v}))]);
      //get all vendors:3}, {a:1, b:5}];
      const uniqueVendorValues = [...new Set(transformedData.map(item => item.vendor))];
      setAllVendors(uniqueVendorValues)
      const uniqueColectiaValues = [...new Set(transformedData.filter(item => item.custom_colectia.trim().length > 0).map(item => item.custom_colectia ))];
      setAllColectia(uniqueColectiaValues)
      console.log('vendors, colectia', uniqueVendorValues, uniqueColectiaValues)
    } catch (err) {
      console.error('An error occurred while fetching table data:', err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchAllProducts();
  }, [])

  async function updateVariantsPrice(variantsArray) {
    try {
      setUpdatingFlag(true);
      setData([...allProducts.map(v => {
        let index = variantsArray.findIndex(value => value.id == v.id);
        if (index >= 0) return {...v, price: variantsArray[index].price, com_price: variantsArray[index].com_price}
        else return {...v}
      })]);
      setAllProducts([...allProducts.map(v => {
        let index = variantsArray.findIndex(value => value.id == v.id);
        if (index >= 0) return {...v, price: variantsArray[index].price, com_price: variantsArray[index].com_price}
        else return {...v}
      })]);
      const res = await axios.post(`/api/variants`, {
        variants: variantsArray
      });
      if (res.data.status == 'success') {
        // alert('saved successfully.');
        console.log('saved successfully.');
      }
    } catch(err) {
      console.error('Updating error', err);
    }
  }

  useEffect(() => {
    // console.log('data, updating flag', data, updatingFlag)
    if (data.length > 0) setUpdatingFlag(false);
  }, [data])

  
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <DataTableDemo
        data={data}
        allProducts={allProducts}
        vendors={allVendors}
        allColectia={allColectia}
        loading={loading}
        pageSize={PAGE_SIZE}
        updateVariantsPrice={updateVariantsPrice}
        updatingFlag={updatingFlag}
      />
    </div>
  )
}