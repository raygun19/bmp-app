import React, { useEffect, useState } from 'react';
import Client from 'shopify-buy';
import ImageCarousel from './ImageCarousel';
import './Instruments.css';

/*

Component: ShopifyStore

API call to Shopify to get the shopify store.   

Props: 

Parents: AdminInstruments
Children: ImageCarousel

*/

function ShopifyStore() {
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const client = Client.buildClient({
      domain: '32a229.myshopify.com',
      storefrontAccessToken: '17d46c11e2c78df960358a1cbaa7c29c'
    });

    client.collection
      .fetchAllWithProducts()
      .then((collections) => {
        setCollections(collections);
        setProducts(collections[0].products);
      })
      .catch((error) => {
        console.error('Error fetching collections and products:', error);
      });
  }, []);

  return (
    <div className='instrument-list-main'>
      <div className='instrument-list-container'>
        {products.map((product) => (
          <div key={product.id} className='instrument-card'>
            <ImageCarousel images={product.images} />
            <div className='header3'>{product.title}</div>
            <div className='instruments-flex-col'>
              <div className='instrument-description-container' dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
              <div>{product.availableForSale}</div>
              <div className='instruments-button'>
                <a href="mailto:bravo.music.portal@gmail.com?subject=Instrument Rental Inquiry">
                  <div className='instruments-button-text'>Request Info</div>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShopifyStore;
