
export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export async function createFineTune(headers: HeadersInit, payload: object) {

  const res = await fetch(process.env.ASTRIA_API_DOMAIN + "/tunes", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (![200, 201].includes(res.status)) {
    throw new Error("Something went wrong!")
  }

  return await res.json() as object;
}

export const uploadImageUrlToGCP = async (imageUrl: string, signedUploadUrl: string) => {
  if (!imageUrl) {
    return {}
  }

  let file
  try {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const fileResponse = {
      data: arrayBuffer,
      status: response.status,
      statusText: response.statusText
    };


    console.log("axios image url blob response: ", fileResponse.status, fileResponse.statusText)

    // Convert the Buffer into a Stream
    try {
      file = Buffer.from(arrayBuffer)
    } catch (e) {
      console.log("erorr file = Readable.from(fileResponse.data)", e)
    }
  } catch (error) {
    console.log("error fetching file: ", error)
  }

  const responseUploadFile = await fetch(signedUploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/octet-stream",
    },
    body: file,
  });

  console.log({ responseUploadFile })

  return responseUploadFile.url;
}

export const convertImageUrlToBase64 = async (imageUrl: string) => {
  if (!imageUrl) {
    return null;
  }

  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise<string | null>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Extract the Base64 string and resolve the promise with it
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error fetching file: ", error);
    return null;
  }
}