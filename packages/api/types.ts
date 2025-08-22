export type TuneResponse = {
  id: number;
  title: string;
  name: string;
  is_api: boolean;
  token: string | null;
  eta: string | Date;
  callback: string | null;
  trained_at: string | Date;
  started_training_at: string | Date;
  expires_at: string | Date;
  created_at: string | Date;
  model_type: string;
  updated_at: string | Date;
  base_tune_id: number;
  branch: string;
  args: string | null;
  steps: string | null;
  face_crop: boolean;
  ckpt_url: string | null;
  ckpt_urls: string[];
  url: string;
  orig_images: string[];
};

export type PromptResponse = {
  id: number;
  callback: string;
  created_at: string;
  updated_at: string;
  tune_id: string;
  text: string;
  negative_prompt: string;
  cfg_scale: string;
  steps: number;
  super_resolution: boolean;
  num_images: number;
  controlnet_txt2img: boolean;
  url: string;
  images: string[];
};

// tune:
// {
//   data: {
//     id: 1350102,
//     title: 'Face Gen',
//     name: 'male',
//     is_api: true,
//     token: null,
//     eta: '2024-06-03T04:22:36.936Z',
//     callback: null,
//     trained_at: '2024-06-03T04:20:10.556Z',
//     started_training_at: '2024-06-03T04:20:10.556Z',
//     expires_at: '2024-07-03T04:20:10.556Z',
//     created_at: '2024-06-03T04:20:11.151Z',
//     model_type: 'faceid',
//     updated_at: '2024-06-03T04:20:11.160Z',
//     base_tune_id: 690204,
//     branch: 'sd15',
//     args: null,
//     steps: null,
//     face_crop: false,
//     ckpt_url: null,
//     ckpt_urls: [],
//     url: 'https://api.astria.ai/tunes/1350102.json',
//     orig_images: [
//       'https://sdbooth2-production.s3.amazonaws.com/73rl5pgwgsctj5sm54gnwm4m9a5f'
//     ]
//   }
// }

// prompt:
// {
//   "id": 17028371,
//     "callback": "https://webhook.botpress.cloud/17d26d1f-703a-4278-a334-8fd612fa13bc?requestId=m_hN_Dhl34sjCHUHK-jQIjxQE10SO_ayxRhcDlYoOgFEtbZDL-2LPkw4ynSsXILDCIoHBlaUmnUcMPKiTGgit2BA&text=callback_from_astria&type=text&userId=user_01HZQ865KTBX1QZW8RDAMXY37F&botId=f7ac8920-41f0-4459-955e-1452969aa430&branch=fast&callback_type=prompt",
//       "trained_at": null,
//         "started_training_at": null,
//           "created_at": "2024-06-12T12:03:32.610Z",
//             "updated_at": "2024-06-12T12:03:32.623Z",
//               "tune_id": 690204,
//                 "text": "<faceid:1360484:1.0> A 20 year-old gen z eurasian man in a leather jacket and black shirt. Looking at camera, happy, smiling, enjoying. He is facing towards the camera smiling. Inside a neon cool hip convenience store. Green shadows and highlights. Lighting: sharp, dark ambient lighting from abstract neon signs to create a sophisticated edgy grunge atmosphere. Colors: A rich palette of neon, green, yellow and cyan to signify youth. Composition: Ultra wide shot. Shot with Kodak Superia 400, Resolution 20.1 megapixels, ISO sensitivity: 102,400, Shutter speed 1/2000 second. V6 --ar 9:16 --v 6.0 image form png",
//                   "negative_prompt": "nsfw, nipples, breast, chest, nudity, elongated body (deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers",
//                     "cfg_scale": "3.0",
//                       "steps": 30,
//                         "super_resolution": true,
//                           "ar": "1:1",
//                             "num_images": 1,
//                               "seed": null,
//                                 "controlnet_conditioning_scale": null,
//                                   "controlnet_txt2img": false,
//                                     "denoising_strength": null,
//                                       "url": "https://api.astria.ai/tunes/690204/prompts/17028371.json",
//                                         "images": []
// }
