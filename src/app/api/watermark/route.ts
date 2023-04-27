export async function GET() {
  return new Response(
    JSON.stringify({
      code: 0,
      data: {
        url: "",
      },
    })
  );
}
