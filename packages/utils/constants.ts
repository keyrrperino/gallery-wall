export const MALE = 'MALE';
export const FEMALE = 'FEMALE';

export const KIOSK = 'KIOSK';
export const MESSENGER = 'MESSENGER';

export const REQUEST_STATUS_PENDING = 'PENDING';

export const DEFAULT_NEGATIVE_PROMPT =
  'nsfw, hands, unhuman fingers, nipples, breast, chest, nudity, elongated body (deformed iris, deformed pupils, semi - realistic, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, deformed fingers, deformed soda can, gore, violence, or anything killing-related, alien, mutated, horror, gruesome, disembodied, headphones, earphones';

const MAN_IMAGES = [
  'https://jbjnmoaeawbxglkpswft.supabase.co/storage/v1/object/sign/mtd-files/guides/newguides/Screenshot_2024-06-20_at_10.16.00_PM.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtdGQtZmlsZXMvZ3VpZGVzL25ld2d1aWRlcy9TY3JlZW5zaG90XzIwMjQtMDYtMjBfYXRfMTAuMTYuMDBfUE0ucG5nIiwiaWF0IjoxNzE5MjczNTA3LCJleHAiOjE4NzY5NTM1MDd9.pqUe3DitEPQa1E9722XN0ntjA4xfU01Du4HGbYEXjnE&t=2024-06-24T23%3A58%3A28.006Z',
];

const MAN_HOLDING_A_CAN_IMAGES = [
  'https://jbjnmoaeawbxglkpswft.supabase.co/storage/v1/object/sign/mtd-files/guides/newguides2/image-asset-1.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtdGQtZmlsZXMvZ3VpZGVzL25ld2d1aWRlczIvaW1hZ2UtYXNzZXQtMS5qcGciLCJpYXQiOjE3MTkyODUwMDgsImV4cCI6MTg3Njk2NTAwOH0.82pB_1nwveG3n_coJsO26yS9NW8ba35hfL96mNDEq3A&t=2024-06-25T03%3A10%3A08.121Z',
  'https://jbjnmoaeawbxglkpswft.supabase.co/storage/v1/object/sign/mtd-files/guides/newguides2/image-asset-4.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtdGQtZmlsZXMvZ3VpZGVzL25ld2d1aWRlczIvaW1hZ2UtYXNzZXQtNC5qcGciLCJpYXQiOjE3MTkyODUwNTcsImV4cCI6MTg3Njk2NTA1N30.5fYLaumYDW8qrdrqMbSsaqHntgjfcbbVghgH14bUKHU&t=2024-06-25T03%3A10%3A57.684Z',
];

const MAN_POLARIOD_IMAGES = [
  'https://jbjnmoaeawbxglkpswft.supabase.co/storage/v1/object/sign/mtd-files/guides/newguides3/polariod/Image-Asset-10.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtdGQtZmlsZXMvZ3VpZGVzL25ld2d1aWRlczMvcG9sYXJpb2QvSW1hZ2UtQXNzZXQtMTAucG5nIiwiaWF0IjoxNzE5NTQyNzg5LCJleHAiOjE4NzcyMjI3ODl9.P7S9DGVgHpSPI5b1z4so3Dz14Gq_Y1t1zzpQJlWWDBI&t=2024-06-28T02%3A46%3A29.524Z',
];

const WOMAN_IMAGES = [
  'https://jbjnmoaeawbxglkpswft.supabase.co/storage/v1/object/sign/mtd-files/guides/newguides/Screenshot_2024-06-20_at_10.16.20_PM.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtdGQtZmlsZXMvZ3VpZGVzL25ld2d1aWRlcy9TY3JlZW5zaG90XzIwMjQtMDYtMjBfYXRfMTAuMTYuMjBfUE0ucG5nIiwiaWF0IjoxNzE5MjczNTYzLCJleHAiOjE4NzY5NTM1NjN9.rXbZzzTFRMmPKtPCMOH0rV0mqxOad4u2h48vG5kt90E&t=2024-06-24T23%3A59%3A23.060Z',
  'https://jbjnmoaeawbxglkpswft.supabase.co/storage/v1/object/sign/mtd-files/guides/newguides/Screenshot_2024-06-20_at_10.16.45_PM.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtdGQtZmlsZXMvZ3VpZGVzL25ld2d1aWRlcy9TY3JlZW5zaG90XzIwMjQtMDYtMjBfYXRfMTAuMTYuNDVfUE0ucG5nIiwiaWF0IjoxNzE5MjczOTA5LCJleHAiOjE4NzY5NTM5MDl9.1g2Xpfs2_Thut3DoHKH_vteh1G4k75NwQmOKs0J98RY&t=2024-06-25T00%3A05%3A09.636Z',
  'https://jbjnmoaeawbxglkpswft.supabase.co/storage/v1/object/sign/mtd-files/guides/newguides/Screenshot_2024-06-20_at_10.16.38_PM.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtdGQtZmlsZXMvZ3VpZGVzL25ld2d1aWRlcy9TY3JlZW5zaG90XzIwMjQtMDYtMjBfYXRfMTAuMTYuMzhfUE0ucG5nIiwiaWF0IjoxNzE5NTQyNjE5LCJleHAiOjE4NzcyMjI2MTl9.Kzrox-aBlhdA7INsuYKdxQhwX3Qpu27HtmD47t2dbU4&t=2024-06-28T02%3A43%3A39.217Z',
  'https://jbjnmoaeawbxglkpswft.supabase.co/storage/v1/object/sign/mtd-files/guides/newguides/Screenshot_2024-06-20_at_10.16.26_PM.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtdGQtZmlsZXMvZ3VpZGVzL25ld2d1aWRlcy9TY3JlZW5zaG90XzIwMjQtMDYtMjBfYXRfMTAuMTYuMjZfUE0ucG5nIiwiaWF0IjoxNzE5NTQyNjUxLCJleHAiOjE4NzcyMjI2NTF9.jwKdHcpsS1cjE7XUj4Q4oWqFCekYy3jvWmUOr1csw80&t=2024-06-28T02%3A44%3A11.434Z',
];

const WOMAN_HOLDING_CAN_IMAGES = [
  'https://jbjnmoaeawbxglkpswft.supabase.co/storage/v1/object/sign/mtd-files/guides/newguides2/image-asset-2.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtdGQtZmlsZXMvZ3VpZGVzL25ld2d1aWRlczIvaW1hZ2UtYXNzZXQtMi5qcGciLCJpYXQiOjE3MTkyODUwMjksImV4cCI6MTg3Njk2NTAyOX0.xLXzrVY1_xlOCPLarFpDTjmayCyOpY6kY5cmiUKMoMg&t=2024-06-25T03%3A10%3A29.138Z',
  'https://jbjnmoaeawbxglkpswft.supabase.co/storage/v1/object/sign/mtd-files/guides/newguides2/image-asset-3.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtdGQtZmlsZXMvZ3VpZGVzL25ld2d1aWRlczIvaW1hZ2UtYXNzZXQtMy5qcGciLCJpYXQiOjE3MTkyODUwNDMsImV4cCI6MTg3Njk2NTA0M30.G0TmTiHGiHUBxOiCH0hJdvQYw4-iTHGwf9rzTp121ss&t=2024-06-25T03%3A10%3A43.674Z',
];

const WOMAN_POLARIOD_IMAGES = [
  'https://jbjnmoaeawbxglkpswft.supabase.co/storage/v1/object/sign/mtd-files/guides/newguides/Screenshot_2024-06-20_at_10.17.03_PM.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtdGQtZmlsZXMvZ3VpZGVzL25ld2d1aWRlcy9TY3JlZW5zaG90XzIwMjQtMDYtMjBfYXRfMTAuMTcuMDNfUE0ucG5nIiwiaWF0IjoxNzE5NTQyNDk4LCJleHAiOjE4NzcyMjI0OTh9.VPXwoy1jOgjL050oTcmmu2NkOI2Ir4Wk3uPI_OKhlBE&t=2024-06-28T02%3A41%3A37.823Z',
  'https://jbjnmoaeawbxglkpswft.supabase.co/storage/v1/object/sign/mtd-files/guides/newguides/Screenshot_2024-06-20_at_10.16.57_PM.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtdGQtZmlsZXMvZ3VpZGVzL25ld2d1aWRlcy9TY3JlZW5zaG90XzIwMjQtMDYtMjBfYXRfMTAuMTYuNTdfUE0ucG5nIiwiaWF0IjoxNzE5NTQyNTI3LCJleHAiOjE4NzcyMjI1Mjd9.48tC7dn_GO177fCgOw9b14e6T8FD1hprYB-jtoVRjhk&t=2024-06-28T02%3A42%3A07.622Z',
  'https://jbjnmoaeawbxglkpswft.supabase.co/storage/v1/object/sign/mtd-files/guides/newguides/Screenshot_2024-06-20_at_10.17.10_PM.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtdGQtZmlsZXMvZ3VpZGVzL25ld2d1aWRlcy9TY3JlZW5zaG90XzIwMjQtMDYtMjBfYXRfMTAuMTcuMTBfUE0ucG5nIiwiaWF0IjoxNzE5NTQyNTYxLCJleHAiOjE4NzcyMjI1NjF9.2EZMta8GXVRIFqsKWb4oLHi0EluNgkFb0zJceSLIph8&t=2024-06-28T02%3A42%3A41.356Z',
];

export const GUIDE_TEXT_PROMPTS = {
  MALE: [
    {
      prompts: [
        {
          text: 'age accurate, gen z looking, eurasian in a leather jacket and black shirt. Looking at camera, happy, smiling, enjoying. He is facing towards the camera smiling. Inside a green neon cool hip night club bar. Green shadows and highlights. Lighting: sharp, dark ambient lighting from abstract neon signs to create a sophisticated edgy grunge and vintage atmosphere. Colors: A rich palette of neon, green, yellow and cyan to signify youth. Composition: Ultra wide shot. Shot with Kodak Superia 400, Resolution 20.1 megapixels, ISO sensitivity: 102,400, Shutter speed 1/2000 second. V6 --ar 9:16 --v 6.0',
          images: MAN_IMAGES,
        },
        {
          text: 'age accurate, gen z looking, eurasian in a leather jacket and black shirt. Looking at camera, happy, smiling, enjoying. He is facing towards the camera smiling. Inside a green neon cool hip night club bar. Green shadows and highlights. Lighting: sharp, dark ambient lighting from abstract neon signs to create a sophisticated edgy grunge and vintage atmosphere. Colors: A rich palette of neon, green, yellow and cyan to signify youth. Composition: Ultra wide shot. Shot with Kodak Superia 400, Resolution 20.1 megapixels, ISO sensitivity: 102,400, Shutter speed 1/2000 second. V6 --ar 9:16 --v 6.0',
          images: MAN_IMAGES,
        },
      ],
    },
    {
      prompts: [
        {
          text: 'age accurate, gen z looking, eurasian in a leather jacket and black shirt. Looking at camera, happy, smiling, enjoying. He is facing towards the camera smiling. Flash photography. Green shadows. Inside a green neon cool hip night club bar. Lighting: sharp, dark ambient lighting from geometric neon signs to create a sophisticated edgy grunge and vintage atmosphere. Colors: A rich palette of neon green, yellow and cyan to signify youth. High contrast, extremely sharp. Composition: Ultra wide shot. Shot with Kodak Superia 400, Resolution 20.1 megapixels, ISO sensitivity: 102,400, Shutter speed 1/2000 second. V6 --ar 9:16 --v 6.0',
          images: MAN_HOLDING_A_CAN_IMAGES,
        },
        {
          text: 'age accurate, gen z looking, eurasian in a leather jacket and black shirt. Looking at camera, happy, smiling, enjoying. He is facing towards the camera smiling. Flash photography. Green shadows. Inside a green neon cool hip night club bar. Lighting: sharp, dark ambient lighting from geometric neon signs to create a sophisticated edgy grunge and vintage atmosphere. Colors: A rich palette of neon green, yellow and cyan to signify youth. High contrast, extremely sharp. Composition: Ultra wide shot. Shot with Kodak Superia 400, Resolution 20.1 megapixels, ISO sensitivity: 102,400, Shutter speed 1/2000 second. V6 --ar 9:16 --v 6.0',
          images: MAN_HOLDING_A_CAN_IMAGES,
        },
      ],
    },
    {
      prompts: [
        {
          text: 'A polaroid photography with DIRECT FLASH of a age accurate, gen z looking, eurasian in a leather jacket and black shirt. Looking at camera, happy, smiling, enjoying. He is facing towards the camera smiling. Green shadows. Inside a green neon cool hip night club bar. TEXTURES: film textures, film grains and light leaks. Lighting: sharp, dark ambient to create a sophisticated edgy grunge and vintage atmosphere. Colors: A rich palette of neon green, yellow and cyan to signify youth. High contrast, extremely sharp. Composition: Ultra wide shot. Shot with Kodak Superia 400, Resolution 20.1 megapixels, ISO sensitivity: 102,400, Shutter speed 1/2000 second. V6 --ar 9:16 --v 6.0',
          images: MAN_POLARIOD_IMAGES,
        },
        {
          text: 'A polaroid photography with DIRECT FLASH of a age accurate, gen z looking, eurasian in a leather jacket and black shirt. Looking at camera, happy, smiling, enjoying. He is facing towards the camera smiling. Green shadows. Inside a green neon cool hip night club bar. TEXTURES: film textures, film grains and light leaks. Lighting: sharp, dark ambient to create a sophisticated edgy grunge and vintage atmosphere. Colors: A rich palette of neon green, yellow and cyan to signify youth. High contrast, extremely sharp. Composition: Ultra wide shot. Shot with Kodak Superia 400, Resolution 20.1 megapixels, ISO sensitivity: 102,400, Shutter speed 1/2000 second. V6 --ar 9:16 --v 6.0',
          images: MAN_POLARIOD_IMAGES,
        },
      ],
    },
  ],
  FEMALE: [
    {
      prompts: [
        {
          text: 'age accurate, gen z looking, eurasian in a leather jacket and black shirt. Looking at camera, happy, smiling, enjoying. She is facing towards the camera smiling. Inside a green neon cool hip night club bar. Green shadows and highlights. Lighting: sharp, dark ambient lighting from abstract neon signs to create a sophisticated edgy grunge and vintage atmosphere. Colors: A rich palette of neon, green, yellow and cyan to signify youth. Composition: Ultra wide shot. Shot with Kodak Superia 400, Resolution 20.1 megapixels, ISO sensitivity: 102,400, Shutter speed 1/2000 second. V6 --ar 9:16 --v 6.0',
          images: WOMAN_IMAGES,
        },
        {
          text: 'age accurate, gen z looking, eurasian in a leather jacket and black shirt. Looking at camera, happy, smiling, enjoying. She is facing towards the camera smiling. Inside a green neon cool hip night club bar. Green shadows and highlights. Lighting: sharp, dark ambient lighting from abstract neon signs to create a sophisticated edgy grunge and vintage atmosphere. Colors: A rich palette of neon, green, yellow and cyan to signify youth. Composition: Ultra wide shot. Shot with Kodak Superia 400, Resolution 20.1 megapixels, ISO sensitivity: 102,400, Shutter speed 1/2000 second. V6 --ar 9:16 --v 6.0',
          images: WOMAN_IMAGES,
        },
      ],
    },
    {
      prompts: [
        {
          text: 'age accurate, gen z looking, eurasian in a leather jacket and black shirt. Looking at camera, happy, smiling, enjoying. She is facing towards the camera smiling. Flash photography. Green shadows. Inside a green neon cool hip night club bar. Lighting: sharp, dark ambient lighting from geometric neon signs to create a sophisticated edgy grunge and vintage atmosphere. Colors: A rich palette of neon green, yellow and cyan to signify youth. High contrast, extremely sharp. Composition: Ultra wide shot. Shot with Kodak Superia 400, Resolution 20.1 megapixels, ISO sensitivity: 102,400, Shutter speed 1/2000 second. V6 --ar 9:16 --v 6.0',
          images: WOMAN_HOLDING_CAN_IMAGES,
        },
        {
          text: 'age accurate, gen z looking, eurasian in a leather jacket and black shirt. Looking at camera, happy, smiling, enjoying. She is facing towards the camera smiling. Flash photography. Green shadows. Inside a green neon cool hip night club bar. Lighting: sharp, dark ambient lighting from geometric neon signs to create a sophisticated edgy grunge and vintage atmosphere. Colors: A rich palette of neon green, yellow and cyan to signify youth. High contrast, extremely sharp. Composition: Ultra wide shot. Shot with Kodak Superia 400, Resolution 20.1 megapixels, ISO sensitivity: 102,400, Shutter speed 1/2000 second. V6 --ar 9:16 --v 6.0',
          images: WOMAN_HOLDING_CAN_IMAGES,
        },
      ],
    },
    {
      prompts: [
        {
          text: 'A polaroid photography with DIRECT FLASH of a age accurate, gen z looking, eurasian in a leather jacket and black shirt. Looking at camera, happy, smiling, enjoying. She is facing towards the camera smiling. Green shadows. Inside a green neon cool hip night club bar. TEXTURES: film textures, film grains and light leaks. Lighting: sharp, dark ambient to create a sophisticated edgy grunge and vintage atmosphere. Colors: A rich palette of neon green, yellow and cyan to signify youth. High contrast, extremely sharp. Composition: Ultra wide shot. Shot with Kodak Superia 400, Resolution 20.1 megapixels, ISO sensitivity: 102,400, Shutter speed 1/2000 second. V6 --ar 9:16 --v 6.0',
          images: WOMAN_POLARIOD_IMAGES,
        },
        {
          text: 'A polaroid photography with DIRECT FLASH of a age accurate, gen z looking, eurasian in a leather jacket and black shirt. Looking at camera, happy, smiling, enjoying. She is facing towards the camera smiling. Green shadows. Inside a green neon cool hip night club bar. TEXTURES: film textures, film grains and light leaks. Lighting: sharp, dark ambient to create a sophisticated edgy grunge and vintage atmosphere. Colors: A rich palette of neon green, yellow and cyan to signify youth. High contrast, extremely sharp. Composition: Ultra wide shot. Shot with Kodak Superia 400, Resolution 20.1 megapixels, ISO sensitivity: 102,400, Shutter speed 1/2000 second. V6 --ar 9:16 --v 6.0',
          images: WOMAN_POLARIOD_IMAGES,
        },
      ],
    },
  ],
};

export const FACE_GEN_BUCKET_NAME = 'mtd-cool-club-dev';
