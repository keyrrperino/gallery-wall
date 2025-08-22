import type { RequestStatusType } from '../../../../../packages/database';
import { db } from '../../../../../packages/database';

export async function GET(req: Request) {
  const url = new URL(req?.url ?? '');
  const params = new URLSearchParams(url.search);

  const requestStatus = params.get('requestStatus') as RequestStatusType;

  const filters: {
    requestStatus?: RequestStatusType;
  } = {
    requestStatus,
  };

  if (requestStatus) {
    filters.requestStatus = requestStatus;
  }

  const requestCount: number = await db.userGifRequest.count({
    where: {
      ...filters,
    },
  });

  return new Response(
    JSON.stringify({
      data: {
        count: requestCount,
      },
      status: 200,
      message: 'SUCESS',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
