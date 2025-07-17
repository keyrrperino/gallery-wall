import type { RequestStatusType, RequestTypeType } from "../../../../../packages/database";
import { db } from "../../../../../packages/database";

export async function GET(req: Request) {
  const url = new URL((req?.url ?? ""));
  const params = new URLSearchParams(url.search);

  const facebookUserId = params.get("facebookUserId");
  const requestType = params.get("requestType") as RequestTypeType;
  const requestStatus = params.get("requestStatus") as RequestStatusType;

  const filters: {
    facebookUserId: string | null;
    requestStatus?: RequestStatusType
    requestType?: RequestTypeType
  } = {
    facebookUserId,
  };

  if (requestStatus) {
    filters.requestStatus = requestStatus;
  }

  if (requestType) {
    filters.requestType = requestType
  }

  const requestCount: number = await db.userFaceGenRequests.count({
    where: {
      ...filters
    }
  });

  return new Response(JSON.stringify({
    data: {
      count: requestCount
    },
    status: 200,
    message: "SUCESS"
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
