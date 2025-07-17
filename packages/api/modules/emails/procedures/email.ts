import { db } from "database";
import { sendBrevo } from "mail/provider";
import { z } from "zod";
import { protectedProcedure } from "../../../trpc/base";


export const sendEmail = protectedProcedure
  .input(z.object({
    imageUrl: z.string().url(),
    email: z.string().email(),
    imageBase64: z.string()
  }))
  .output(z.object({
    status: z.string()
  }))
  .mutation(async ({ input: { imageUrl, email, imageBase64 }, ctx: { user } }) => {
    if (!user) {
      throw new Error("Unauthenticated user");
    }

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        email
      }
    })

    let imageBase64Data;

    if (!imageBase64) {

      const imageUrlResponse = await fetch(imageUrl);
      const arrayBuffer = await imageUrlResponse.arrayBuffer();

      imageBase64Data = Buffer.from(arrayBuffer).toString("base64");
    } else {
      imageBase64Data = imageBase64.split("data:image/png;base64,")[1];
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
              }
      
              .email-container {
                  background-color: #ffffff;
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  border: 1px solid #ddd;
                  border-radius: 8px;
              }
      
              .header {
                  text-align: center;
                  padding: 20px 0;
              }
      
              .header img {
                  width: 200px;
              }
      
              .content {
                  text-align: center;
                  padding: 20px 0;
              }
      
              .content h1 {
                  color: #333333;
              }
      
              .content p {
                  color: #555555;
              }
      
              .photo {
                  display: block;
                  margin: 20px auto;
                  max-width: 100%;
                  height: auto;
                  border: 1px solid #ddd;
                  border-radius: 8px;
              }
      
              .instructions {
                  text-align: left;
                  margin: 20px 0;
              }
      
              .instructions p {
                color: #555555 !important;
              }
          </style>
      </head>
      
      <body>
          <div class="email-container">
              <div class="header">
                  Hello
              </div>
              <div class="content">
                  <h1>Congratulations, Dude!</h1>
              </div>
              <div class="instructions">
                test
              </div>
          </div>
      </body>
      
      </html>
    `;

    await sendBrevo({
      to: email,
      toName: user.name ?? "",
      text: "Download the face generated photo below.",
      html: htmlContent,
      attachments: [
        {
          "content": imageBase64Data,
          "name": "selfie.jpeg",
        }
      ]
    });

    // await sendSendgrid({
    //   to: email,
    //   toName: user.name ?? "",
    //   text: "Download the face generated photo below.",
    //   attachments: [
    //     {
    //       "content": imageBase64Data,
    //       "type": sendgridAttachmentTypes["image/jpeg"],
    //       "filename": "selfie.jpeg",
    //       "disposition": "inline",
    //       "content_ID": "image-inline"
    //     }
    //   ]
    // });

    return { status: "SUCCESS" };
  });
