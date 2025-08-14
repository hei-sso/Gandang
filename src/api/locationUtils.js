export async function getCoordsFromAddress(address) {
  const REST_API_KEY = process.env.REACT_APP_Kakao_API_KEY;
  const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: REST_API_KEY,
      },
    });

    const data = await response.json();
    if (!data.documents || data.documents.length === 0) {
      throw new Error('No coordinate found');
    }

    const { x, y } = data.documents[0];
    return { latitude: parseFloat(y), longitude: parseFloat(x) };
  } catch (error) {
    console.error('[Coordinate Fetch Error]', error); 
    return null;
  }
}
