export async function POST() {
  return new Response(
    JSON.stringify({
      code: 0,
      data: {
        url: "",
      },
    })
  );
}
