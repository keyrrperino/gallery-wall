export type TuneResponse = {
  // Define the expected properties here
  data: unknown;
  status: string;
  // Add more fields based on the actual response structure
}

export type RequestBody = {
  prompt: {
    id: string | number;
    images: string[];
  };
}