import "@shopify/shopify-api/adapters/node";
import { shopifyApi, Session } from "@shopify/shopify-api";

export async function GET(req) {
    const adminAccessToken = process.env.APP_PASSWORD
    const shop = process.env.SHOPIFY_STORE
    const API_VERSION = process.env.API_VERSION
    const api_key = process.env.APP_KEY
    const api_secret_key = process.env.API_SECRET
    
    const shopify = shopifyApi({
        apiKey: api_key,
        apiSecretKey: api_secret_key,
        apiVersion: API_VERSION,
        isPrivateApp: true,
        scopes: ['read_products', 'write_products'],
        isEmbeddedApp: false,
        // hostName: debug ? '127.0.0.1:5001' : 'shop.myshopify.com',
        hostName: shop
    });

    // Create an instance of `Session`
    const sessionId = shopify.session.getOfflineId(shop)
    const session = new Session({id: sessionId, shop, accessToken: adminAccessToken});
    const client = new shopify.clients.Graphql({session: session})

    const url = req.nextUrl;
    let page = parseInt(url.searchParams.get('page'), 10) || 1;
    const pageSize = parseInt(url.searchParams.get('pageSize'), 10) || 100;
    if (!url.searchParams.get('page') && !url.searchParams.get('pageSize')) page = 1000;
    // console.log('Query parameters:', page, pageSize);

    let pageInfo = null;
    let products = [];
    let cursor = null; // No cursor initially, as we'll be requesting the first page

    try {
        // Retrieve products up to the specified page
        for (let i = 0; i < page; i++) {
            const productsQueryString = `
                query GetProducts($first: Int!, $after: String) {
                    products(first: $first, after: $after, query: "status:active") {
                        edges {
                            cursor
                            node {
                                id
                                title
                                vendor
                                metafields(first: 5) {
                                    edges {
                                        node {
                                            id 
                                            namespace
                                            key
                                            value
                                        }
                                    }
                                }
                                variants(first: 1) {
                                    edges {
                                        node {
                                            id
                                            sku
                                            price
                                            compareAtPrice
                                        }
                                    }
                                }
                            }
                        }
                        pageInfo {
                            hasNextPage
                        }
                    }
                }
            `;

            const variables = {
                first: pageSize,
                after: cursor,
            };

            const data = await client.request(productsQueryString, {
                    variables: variables,
                    headers: {myHeader: '1'},
                    retries: 2
                });

            let original_products = data.data.products.edges;
            // console.log('GraphQL Response:', data, original_products);

            products = [...products, ...original_products.map(p => p.node)];

            pageInfo = data.data.products.pageInfo;
            if (pageInfo.hasNextPage && products.length >= pageSize) {
                cursor = original_products[original_products.length - 1].cursor;
            } else {
                break;
            }
        }

        // // Trim the products array to only include the items on the requested page
        let paginatedProducts = [];
        if (!url.searchParams.get('page') && !url.searchParams.get('pageSize')) {
            paginatedProducts = products;
        } else {
            const start = (page - 1) * pageSize;
            paginatedProducts = products.slice(start, start + pageSize);
        }

        return new Response(JSON.stringify({products: paginatedProducts}), { status: 200 })
    } catch (error) {
        console.error('Error fetching products:', error);
        return new Response(JSON.stringify('Error fetching products: ' + error.toString()), { status: 500 });
    }

}