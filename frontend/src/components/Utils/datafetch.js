import collectionsData from '../HomePage/collections.json';
import nftsData from '../HomePage/nfts.json';

// export const fetchAllCollections = async() => {
  
//   console.log(collectionsData.collections);
//   return collectionsData.collections;



// };

// export const fetchAllNFTs = async() => {
//   return nftsData.nfts;
// };



import axios from 'axios';

const baseURL = 'http://localhost:5500';

export const fetchAllCollections = async () => {
  try {
    const response = await axios.get(`${baseURL}/get_all_collections`);
    //   console.log("collection data expected", collectionsData.collections);
    // console.log("Collection data.collections: ",response.data.collections);
    return response.data.collections;
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
};

export const fetchAllNFTs = async () => {
  try {
    const response = await axios.get(`${baseURL}/get_all_nfts`);
    console.log("NFT data: ",response.data);
    return response.data.nfts;
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    throw error;
  }
};








export const fetchMyData = (address) => {
  const myCollections = collectionsData.collections.filter(
    collection => collection.creator === address
  );
  const myNFTs = nftsData.nfts.filter(
    nft => nft.owner === address
  );
  
  return { myCollections, myNFTs };
};

export const collection_nft = (collection_address) => {
    // const myCollections = collectionsData.collections.filter(
    //     collection => collection.creator === collection_address
    // );
    const myNFTs = nftsData.nfts.filter(
        nft => nft.collectionaddress === collection_address
    );
    
    return { myNFTs };
    };
export const collection_from_id = (collection_id) => {
    const myCollections = collectionsData.collections.filter(
        collection => collection.id === collection_id
    );
    return { myCollections };
    }

    export const particular_nft = (nftid,collection_address) => {
        const myNFTs = nftsData.nfts.filter(
            nft => nft.id === nftid && nft.collectionaddress === collection_address
        );
        
        return { myNFTs };
        };
  

// datafetch.js
export const fetchData = async(type, param1 = null, param2 = null)  => {
  switch (type) {
    case 'allCollections':
      return await fetchAllCollections();
    case 'allNFTs':
      return await fetchAllNFTs();
    case 'myData':
      if (!param1) throw new Error('Address is required for myData fetch');
      return fetchMyData(param1);
    case 'collection_nft':
      if (!param1) throw new Error('Collection address is required for collection_nft fetch');
      return collection_nft(param1);
    case 'collection_from_id':
      if (!param1) throw new Error('Collection ID is required for collection_from_id fetch');
      return collection_from_id(param1);
    case 'particular_nft':
      if (!param1 || !param2) throw new Error('NFT ID and Collection Address are required for particular_nft fetch');
      return particular_nft(param1, param2);
    default:
      throw new Error('Invalid fetch type');
  }
};
