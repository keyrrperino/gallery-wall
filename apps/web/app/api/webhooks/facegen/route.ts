export async function GET() {
  return new Response("hello", {
    status: 200
  })
}

export async function POST() {
  return new Response("success 2", {

    status: 200,
  });
}
