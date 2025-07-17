import { RequestStatusSchema, RequestTypeSchema, db } from "database";
import { DEFAULT_NEGATIVE_PROMPT, FEMALE, GUIDE_TEXT_PROMPTS, MALE, createFineTune } from "utils";
import { v4 } from "uuid";
import { z } from "zod";
import { protectedProcedure } from "../../../trpc/base";
import type { PromptResponse, TuneResponse } from "../../../types";


export const faceGen = protectedProcedure
  .input(z.object({
    imageUrls: z.array(z.string().url())
  }))
  .output(z.object({
    requestId: z.string().nullable()
  }))
  .mutation(async ({ input: { imageUrls }, ctx: { user, req } }) => {

    console.log({ user })

    let baseUrl = `${req?.url?.split("://")[0]}://${req?.headers.get("host")}`;

    if (baseUrl.includes("http://localhost")) {
      baseUrl = process.env.BASE_URL ?? ""
    }

    if (!user) {
      throw new Error("Unauthenticated user");
    }

    const requestId = v4();

    console.log({ requestId })

    const {
      gender,
    } = user;

    await db.userFaceGenRequests.upsert({
      where: {
        id: requestId
      },
      update: {
        // Fields to update if the record exists
        imageUrls: imageUrls,
        requestType: RequestTypeSchema.Values.KIOSK,
        requestStatus: RequestStatusSchema.Values.PENDING,
        // Assuming you want to update imageUrls and other fields as needed
      },
      create: {
        // Fields to update if the record exists
        id: requestId,
        userId: user.id,
        imageUrls: imageUrls,
        requestType: RequestTypeSchema.Values.KIOSK,
        requestStatus: RequestStatusSchema.Values.PENDING,
        // Assuming you want to update imageUrls and other fields as needed
      }
    });

    console.log("request created")

    // astria
    const DOMAIN = process.env.ASTRIA_API_DOMAIN;
    const headers = {
      Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
      "Content-Type": "application/json"
    };

    const newGender = gender ?? MALE;

    const genderToTuneName = {
      [MALE]: "man",
      [FEMALE]: "woman"
    }

    const TUNE_CYBER_4_2 = 1167805 // (great overall)
    // const TUNE_EPIC_REALISM = 849166 // (best overall)
    const TUNE_EPIC_REALISM = TUNE_CYBER_4_2

    const TUNE_REALISTIC_VISION_5 = 690204 // ( default, average details, great faceid)

    const faceIdTuenResponse = await createFineTune(headers, {
      tune: {
        name: genderToTuneName[newGender],
        title: `KIOSK FaceID - ${user.id}`,
        base_tune_id: TUNE_REALISTIC_VISION_5,
        model_type: "faceid",
        image_urls: imageUrls
      }
    });

    const {
      id: faceIdTuneId
    } = faceIdTuenResponse as unknown as TuneResponse;

    // const loraTuneResponse = await createFineTune(headers, {
    //   tune: {
    //     name: genderToTuneName[newGender],
    //     title: `KIOSK LORA - ${user.id}`,
    //     base_tune_id: BASE_TUNE_ID,
    //     model_type: "lora",
    //     image_urls: imageUrls
    //   }
    // });

    // const {
    //   id: loraTuneId
    // } = loraTuneResponse as unknown as TuneResponse;

    const arrayOfPrompt: {
      response: PromptResponse,
      payload: object
    }[] = [];

    await Promise.all(GUIDE_TEXT_PROMPTS[newGender].map(async (guideTextPrompt, indexGuideTextPrompt) => {

      const randomPromptIndex = Math.floor(Math.random() * guideTextPrompt.prompts.length);
      const prompt = guideTextPrompt.prompts[randomPromptIndex]

      const guideImages = prompt.images ?? [];
      const randomImageIndex = Math.floor(Math.random() * guideImages.length);
      const guideImage = guideImages[randomImageIndex]

      const promptPayload: object = {
        commit: "Create Image",
        prompt: {
          text:
            newGender === MALE ? `<faceid:${faceIdTuneId}:1.0> ${prompt.text}` : `<faceid:${faceIdTuneId}:1.0> epic ${prompt.text}`,
          negative_prompt: DEFAULT_NEGATIVE_PROMPT,
          seed: "",
          steps: 30,
          cfg_scale: 3.0,
          controlnet: "reference",
          input_image_url: guideImage,
          mask_image_url: "",
          denoising_strength: 0.8,
          controlnet_conditioning_scale: "",
          controlnet_txt2img: false,
          super_resolution: true,
          // inpaint_faces: true,
          inpaint_faces: false,
          // face_correct: true,
          face_correct: false,
          film_grain: true,
          face_swap: true,
          hires_fix: false,
          backend_version: 1,
          ar: "1:1",
          scheduler: "dpm++2m_karras",
          num_images: 1,
          color_grading: "",
          use_lpw: true,
          w: "",
          h: "",
          callback: `${baseUrl}/api/webhooks/facegen?requestId=${requestId}&apiKey=${process.env.API_KEY}&setNo=${indexGuideTextPrompt}`
        },
      }

      console.log("promptPayload: ", promptPayload)

      const promptOptions = {
        method: "POST",
        headers,
        body: JSON.stringify(promptPayload),
      }
      const baseTunegenderBased = newGender === MALE ? TUNE_CYBER_4_2 : TUNE_EPIC_REALISM
      const promptResponse = await fetch(`${DOMAIN}/tunes/${baseTunegenderBased}/prompts`, promptOptions);

      console.log({ promptResponse })
      const promptJson = await promptResponse.json() as PromptResponse;

      arrayOfPrompt.push({
        "response": promptJson,
        "payload": promptPayload
      })

      if (![200, 201].includes(promptResponse.status)) {
        throw new Error("Something went wrong!")
      }
    })).catch(() => {
      throw new Error("Something went wrong!")
    })

    await db.userFaceGenRequests.update({
      where: {
        id: requestId
      },
      data: {
        prompt: JSON.stringify(arrayOfPrompt),
        tune: JSON.stringify({
          faceIdTuenResponse,
          loraTuneResponse: ""
        })
      },
    });

    // end astria
    return { requestId };
  });
