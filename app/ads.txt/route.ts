export const dynamic = "force-static";

export async function GET() {
  return new Response(
    "google.com, pub-6930529333819978, DIRECT, f08c47fec0942fa0\n",
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    }
  );
}